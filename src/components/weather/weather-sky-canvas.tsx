"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { PARTICLE_COLOURS, type SkyTheme } from "@/lib/weather-sky";
import { canvasBacking } from "@/lib/sky/backing";
import { subscribeSkyFrames } from "@/lib/sky/frame-loop";
import { touchesOverflow } from "@/lib/sky/overflow";
import { clearOverflow, recordOverflowWork, type OverflowTarget } from "./weather-sky-overflow";
import { createSkyRandom } from "@/lib/sky/sky-motion";
import {
  FIELD, HAIL, RAIN, SNOW, STRIDE, WIND, createParticles, freezeParticles, resetParticles,
  stepParticles, updateParticlePlan, type ParticlePlan, type ParticleSimulation,
} from "@/lib/sky/particles";

export const SKY_CANVAS_MASK =
  "linear-gradient(100deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.25) max(50%, 200px), #000 75%), " +
  "linear-gradient(0deg, rgba(0,0,0,.25) 0, rgba(0,0,0,.25) 50px, #000 78px)";

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


function overflowParticleVisible(sim: ParticleSimulation, at: number, rainX: number, rainY: number): boolean {
  const b = sim.buffer, p = sim.plan;
  if (!p.overflow) return false;
  const x = b[at + FIELD.x], y = b[at + FIELD.y], kind = b[at + FIELD.kind];
  const size = b[at + FIELD.size] * (kind === HAIL ? 1 : b[at + FIELD.depth]);
  const endX = kind === RAIN ? x - rainX * size : x;
  const endY = kind === RAIN ? y - rainY * size : y;
  const radius = kind === RAIN ? p.rainWidth : size;
  return touchesOverflow(kind, Math.min(x, endX) - radius, Math.min(y, endY) - radius,
    Math.max(x, endX) + radius, Math.max(y, endY) + radius, p.width, p.height, p.overflow);
}

export function drawParticles(ctx: CanvasRenderingContext2D, sim: ParticleSimulation, currentTheme: SkyTheme,
  sprite: HTMLCanvasElement, filter = false): void {
    const b = sim.buffer;
    const p = sim.plan;

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
        if ((filter && !overflowParticleVisible(sim, at, rainX, rainY)) || b[at + FIELD.kind] !== RAIN || (b[at + FIELD.depth] < 0.78 ? 0 : 1) !== bucket) continue;
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
        if (filter || b[at + FIELD.kind] !== WIND || (b[at + FIELD.depth] < 0.78 ? 0 : 1) !== bucket) continue;
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
      if (filter && !overflowParticleVisible(sim, at, rainX, rainY)) continue;
      const depth = b[at + FIELD.depth];
      const radius = b[at + FIELD.size] * (b[at + FIELD.kind] === HAIL ? 1 : depth);
      ctx.globalAlpha = depth;
      ctx.drawImage(sprite, b[at + FIELD.x] - radius, b[at + FIELD.y] - radius, radius * 2, radius * 2);
    }
    ctx.globalAlpha = 1;
}

/** Layer 4 owns one fixed simulation buffer; only its backing store resizes. */
export function WeatherSkyCanvas({ plan, theme, dpr, paused, freezeTime, seed, captureOnStop, onSnapshot, overflow }: {
  plan: ParticlePlan; theme: SkyTheme; dpr: number; paused: boolean;
  overflow?: OverflowTarget; freezeTime?: number; seed?: number; captureOnStop?: () => boolean; onSnapshot?: (image: string) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const overflowRef = useRef(overflow); overflowRef.current = overflow;
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
    ctx.clearRect(0, 0, sim.plan.width, sim.plan.height);
    drawParticles(ctx, sim, currentTheme, sprite);
    const target = overflowRef.current;
    if (!target?.active || !target.drawing || !target.canvas || !sim.plan.overflow) return;
    const started = performance.now();
    const outside = target.context;
    if (!outside) return;
    const p = sim.plan, m = target.margins;
    outside.clearRect(0, 0, p.width + m.left + m.right, p.height + m.bottom);
    outside.save(); outside.translate(m.left, 0);
    outside.beginPath();
    outside.rect(-m.left, 0, m.left, p.height + m.bottom);
    outside.rect(p.width, 0, m.right, p.height + m.bottom);
    outside.rect(0, p.height, p.width, m.bottom);
    outside.rect(0, p.height - 28, 28, 28);
    outside.rect(p.width - 28, p.height - 28, 28, 28);
    outside.clip();
    drawParticles(outside, sim, currentTheme, sprite, true);
    outside.restore();
    for (let i = 0; i < target.occluderCount; i++) {
      const at = i * 4, r = target.occluders;
      outside.clearRect(r[at], r[at + 1], r[at + 2], r[at + 3]);
    }
    recordOverflowWork(target, performance.now(), performance.now() - started);
  }, []);

  useLayoutEffect(() => {
    if (!overflow) return;
    overflow.redraw = draw;
    return () => { overflow.redraw = null; };
  }, [overflow, draw]);

  useLayoutEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const { width, height, scaleX, scaleY } = canvasBacking(plan.width, plan.height, dpr);
    if (node.width !== width) node.width = width;
    if (node.height !== height) node.height = height;
    const ctx = node.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
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
    if (paused && freezeTime == null && overflow && !overflow.active) clearOverflow(overflow);
    if (paused || freezeTime != null || !plan.total || !plan.fps || !renderer.current.ctx) return;
    return subscribeSkyFrames({
      fps: plan.fps,
      step: (dt) => { if (simulation.current) stepParticles(simulation.current, dt); },
      draw,
      particles: () => simulation.current?.active ?? 0,
    });
  }, [paused, freezeTime, plan.fps, plan.total, draw, overflow]);

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
