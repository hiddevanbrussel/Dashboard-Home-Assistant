"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { PARTICLE_COLOURS, type SkyTheme } from "@/lib/weather-sky";
import { subscribeSkyFrames } from "@/lib/sky/frame-loop";
import { createSkyRandom } from "@/lib/sky/sky-motion";
import {
  FIELD, HAIL, RAIN, SNOW, STRIDE, WIND, createParticles, freezeParticles, resetParticles,
  stepParticles, updateParticlePlan, type ParticlePlan, type ParticleSimulation,
} from "@/lib/sky/particles";

const SKY_CANVAS_MASK =
  "linear-gradient(100deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.35) max(50%, 200px), #000 75%), " +
  "linear-gradient(0deg, rgba(0,0,0,.35) 0, rgba(0,0,0,.35) 50px, #000 78px)";

const STYLES = {
  light: { rain: PARTICLE_COLOURS.light.rain, wind: "rgba(40,62,98,.21)" },
  dark: { rain: PARTICLE_COLOURS.dark.rain, wind: "rgba(210,225,255,.19)" },
} as const;
const sprites: Partial<Record<SkyTheme, HTMLCanvasElement>> = {};
function snowSprite(theme: SkyTheme): HTMLCanvasElement {
  if (sprites[theme]) return sprites[theme];
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    ctx.beginPath();
    ctx.arc(16, 16, 13, 0, Math.PI * 2);
    ctx.fillStyle = PARTICLE_COLOURS[theme].snow;
    ctx.fill();
    if (theme === "light") {
      ctx.strokeStyle = PARTICLE_COLOURS.light.snowEdge;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  sprites[theme] = sprite;
  return sprite;
}

/** Layer 4 owns one fixed simulation buffer; only its backing store resizes. */
export function WeatherSkyCanvas({ plan, theme, dpr, paused, freezeTime, seed, captureOnStop, onSnapshot }: {
  plan: ParticlePlan; theme: SkyTheme; dpr: number; paused: boolean;
  freezeTime?: number; seed?: number; captureOnStop?: () => boolean; onSnapshot?: (image: string) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const simulation = useRef<ParticleSimulation | null>(null);
  const renderer = useRef<{ ctx: CanvasRenderingContext2D | null; theme: SkyTheme; sprite: HTMLCanvasElement | null }>({ ctx: null, theme, sprite: null });
  const initialSeed = useRef<number | null>(null);
  const lastSeek = useRef<number | undefined>(undefined);
  const capture = useRef({ captureOnStop, onSnapshot });
  capture.current = { captureOnStop, onSnapshot };

  const draw = useCallback(() => {
    const sim = simulation.current;
    const { ctx, theme: currentTheme, sprite } = renderer.current;
    if (!sim || !ctx || !sprite) return;
    const b = sim.buffer;
    const p = sim.plan;
    ctx.clearRect(0, 0, p.width, p.height);
    const rainX = Math.sin(p.rainAngle) * p.rainDirection;
    const rainY = Math.cos(p.rainAngle);
    for (let bucket = 0; bucket < 2; bucket++) {
      const depth = bucket === 0 ? 0.65 : 0.9;
      ctx.globalAlpha = depth;
      ctx.strokeStyle = STYLES[currentTheme].rain;
      ctx.lineWidth = p.rainWidth * depth;
      ctx.beginPath();
      for (let i = 0; i < sim.active; i++) {
        const at = i * STRIDE;
        if (b[at + FIELD.kind] !== RAIN || (b[at + FIELD.depth] < 0.78 ? 0 : 1) !== bucket) continue;
        const x = b[at + FIELD.x], y = b[at + FIELD.y];
        const length = b[at + FIELD.size] * b[at + FIELD.depth];
        ctx.moveTo(x, y);
        ctx.lineTo(x - rainX * length, y - rainY * length);
      }
      ctx.stroke();
      ctx.strokeStyle = STYLES[currentTheme].wind;
      ctx.lineWidth = depth;
      ctx.beginPath();
      for (let i = 0; i < sim.active; i++) {
        const at = i * STRIDE;
        if (b[at + FIELD.kind] !== WIND || (b[at + FIELD.depth] < 0.78 ? 0 : 1) !== bucket) continue;
        const x = b[at + FIELD.x], y = b[at + FIELD.y];
        const length = b[at + FIELD.size] * b[at + FIELD.depth] * p.windDirection;
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x - length / 2, y + 1.5 * depth, x - length, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < sim.active; i++) {
      const at = i * STRIDE;
      if (b[at + FIELD.kind] !== SNOW && b[at + FIELD.kind] !== HAIL) continue;
      const depth = b[at + FIELD.depth];
      const radius = b[at + FIELD.size] * (b[at + FIELD.kind] === HAIL ? 1 : depth);
      ctx.globalAlpha = depth;
      ctx.drawImage(sprite, b[at + FIELD.x] - radius, b[at + FIELD.y] - radius, radius * 2, radius * 2);
    }
    ctx.globalAlpha = 1;
  }, []);

  useLayoutEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const width = Math.max(1, Math.round(plan.width * dpr));
    const height = Math.max(1, Math.round(plan.height * dpr));
    if (node.width !== width) node.width = width;
    if (node.height !== height) node.height = height;
    const ctx = node.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderer.current.ctx = ctx;
    renderer.current.theme = theme;
    renderer.current.sprite = snowSprite(theme);
    if (initialSeed.current == null) initialSeed.current = seed ?? Math.floor(Math.random() * 0x100000000);
    const reseed = seed != null && seed !== initialSeed.current;
    if (reseed) initialSeed.current = seed;
    if (!simulation.current) simulation.current = createParticles(plan, createSkyRandom(initialSeed.current));
    else if (freezeTime != null || reseed || lastSeek.current != null) resetParticles(simulation.current, plan, createSkyRandom(initialSeed.current));
    else if (simulation.current.plan !== plan) updateParticlePlan(simulation.current, plan);
    if (freezeTime != null) freezeParticles(simulation.current, freezeTime);
    lastSeek.current = freezeTime;
    draw();
  }, [plan, dpr, theme, seed, freezeTime, draw]);

  useLayoutEffect(() => {
    if (paused || freezeTime != null || !plan.total || !plan.fps || !renderer.current.ctx) return;
    return subscribeSkyFrames({
      fps: plan.fps,
      step: (dt) => { if (simulation.current) stepParticles(simulation.current, dt); },
      draw,
      particles: () => simulation.current?.active ?? 0,
    });
  }, [paused, freezeTime, plan.fps, plan.total, draw]);

  useLayoutEffect(() => {
    const node = canvas.current;
    return () => {
      if (!node || !capture.current.captureOnStop?.()) return;
      // A finite mode cross-fade can retain an image, never a live canvas/loop.
      try { capture.current.onSnapshot?.(node.toDataURL()); } catch { /* Unmount must always finish. */ }
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] h-full w-full"
    style={{ maskImage: SKY_CANVAS_MASK, WebkitMaskImage: SKY_CANVAS_MASK, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
    data-sky-particles={plan.total} data-sky-fps={plan.fps} data-sky-frozen={freezeTime != null} />;
}
