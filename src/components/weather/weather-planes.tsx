"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { PLANE_LABEL_COLORS, createPlanePlanner, parseFlights, planeAllowed, planeContrail, planeContrailLength, planeGeometry, planeLabel, planeLabelAllowed, planePalette, type Flight, type PlanePolicy } from "@/lib/weather-planes";
import type { SkyPhase, SkyTheme } from "@/lib/weather-sky";
import { SKY_CANVAS_MASK } from "./weather-sky-canvas";
import { PlaneBreed } from "./planes/plane-breed";
import { PlaneKlein } from "./planes/plane-klein";
import { PlaneSmal } from "./planes/plane-smal";

type Crossing = { flight: Flight; geometry: ReturnType<typeof planeGeometry>; started: number; fading?: number; fadeDuration?: number; exit?: "pause" };
export type PlaneLabelState = {
  crossing: Crossing; paused: boolean; phase: SkyPhase; theme: SkyTheme;
  width: number; height: number; frozen?: number;
};
type Props = PlanePolicy & { sensorId: string; width: number; height: number; phase: SkyPhase; theme: SkyTheme;
  frozen?: number; onLabel?: (state: PlaneLabelState | null) => void };
const clock = { now: () => Date.now(), setTimeout: (fn: () => void, ms: number) => window.setTimeout(fn, ms), clearTimeout: (id: unknown) => window.clearTimeout(id as number) };

/** One timer in the planner; crossings themselves run entirely on the compositor. */
export function WeatherPlanes(props: Props) {
  const sensor = useEntityStateStore(s => s.getState(props.sensorId));
  const latest = useRef(props); latest.current = props;
  const [crossings, setCrossings] = useState<Crossing[]>([]);
  const planner = useRef<ReturnType<typeof createPlanePlanner> | null>(null);
  useEffect(() => {
    if (props.frozen != null) return;
    const instance = createPlanePlanner(clock, {
      start: flight => setCrossings(old => [...old, { flight, started: Date.now(), geometry: planeGeometry(flight,
        latest.current.width, latest.current.height, latest.current.compact) }]),
      remove: (id, fade, fadeDuration, exit) => setCrossings(old => fade ? old.map(c => c.flight.id === id ? { ...c, fading: Date.now(), fadeDuration, exit } : c) : old.filter(c => c.flight.id !== id)),
    });
    planner.current = instance;
    return () => { instance.dispose(); planner.current = null; setCrossings([]); };
  }, [props.sensorId, props.frozen]);
  useEffect(() => { planner.current?.updatePolicy({ calm: props.calm, mode: props.mode, performanceStep: props.performanceStep, paused: props.paused, visible: props.visible, compact: props.compact, stacked: props.stacked, condition: props.condition, precipitation: props.precipitation }); }, [props.calm, props.mode, props.performanceStep, props.paused, props.visible, props.compact, props.stacked, props.condition, props.precipitation, props.sensorId, props.frozen]); // props contains render-only data too
  useEffect(() => { planner.current?.updateSensor(sensor); }, [sensor, props.sensorId, props.frozen]);
  const frozenFlight = props.frozen != null ? parseFlights(sensor).find(f => planeAllowed(f, props.condition, props.precipitation)) : undefined;
  const frozenCrossing = frozenFlight ? { flight: frozenFlight, geometry: planeGeometry(frozenFlight, props.width, props.height, props.compact), started: 0 } : undefined;
  const shown = props.mode === "static" || props.performanceStep >= 2 ? [] : frozenCrossing ? [frozenCrossing] : props.frozen != null ? [] : crossings;
  const first = shown[0];
  useEffect(() => {
    props.onLabel?.(first && planeLabelAllowed(props.height, props.stacked) && planeLabel(first.flight)
      ? { crossing: first, width: props.width, height: props.height, paused: props.paused, phase: props.phase, theme: props.theme, frozen: props.frozen } : null);
    return () => props.onLabel?.(null);
  // Frozen crossing objects are derived each render; depend on stable input fields.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, props.performanceStep, crossings, frozenFlight?.id, props.width, props.height, props.stacked, props.paused, props.phase, props.theme, props.frozen, props.onLabel]);
  const finish = (id: string) => { setCrossings(old => old.filter(c => c.flight.id !== id)); planner.current?.finish(id); };
  if (!shown.length) return null;
  return <div aria-hidden="true" className="weather-planes pointer-events-none absolute inset-0 z-[1]"
    style={{ maskImage: SKY_CANVAS_MASK, WebkitMaskImage: SKY_CANVAS_MASK, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>
    {shown.map(c => <PlaneSprite key={c.flight.id} crossing={c} {...props} finish={finish} />)}
  </div>;
}

function useCrossingAnimation(ref: React.RefObject<HTMLElement | null>, crossing: Crossing, paused: boolean, frozen: number | undefined,
  transforms: Keyframe[] | ((node: HTMLElement) => Keyframe[]), opacity: Keyframe[], finish?: () => void) {
  const animations = useRef<Animation[]>([]);
  const exitAnimation = useRef<Animation | null>(null);
  const finished = useRef(finish); finished.current = finish;
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node?.animate) return;
    const duration = crossing.geometry.duration * 1000;
    const motion = node.animate(typeof transforms === "function" ? transforms(node) : transforms, { duration, easing: "linear", fill: "forwards" });
    const fade = node.animate(opacity, { duration, fill: "forwards" });
    animations.current = [motion, fade];
    const time = frozen != null ? frozen * 1000 : Math.max(0, Date.now() - crossing.started);
    for (const animation of animations.current) { animation.currentTime = time; if (paused || frozen != null) animation.pause(); }
    motion.onfinish = () => { finished.current?.(); };
    return () => { motion.onfinish = null; motion.cancel(); fade.cancel(); animations.current = []; };
  // Delays are sampled only on creation; pause changes retain WAAPI currentTime.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossing.flight.id, crossing.geometry, frozen]);
  useLayoutEffect(() => {
    const terminal = crossing.exit === "pause";
    for (const a of animations.current) { if (paused || frozen != null || terminal) a.pause(); else a.play(); }
    const exit = exitAnimation.current;
    if (exit) { if ((paused || frozen != null) && !terminal) exit.pause(); else exit.play(); }
  }, [paused, frozen, crossing.exit]);
  useLayoutEffect(() => {
    if (crossing.fading == null || !ref.current?.animate) return;
    const opacity = getComputedStyle(ref.current).opacity;
    const duration = crossing.fadeDuration ?? 1500;
    const fade = ref.current.animate([{ opacity }, { opacity: 0 }], { duration, fill: "forwards" });
    exitAnimation.current = fade;
    // A visible long-pause exit must finish even while the crossing stays paused.
    if ((paused || frozen != null) && crossing.exit !== "pause") fade.pause();
    fade.onfinish = () => { finished.current?.(); };
    return () => { fade.onfinish = null; fade.cancel(); if (exitAnimation.current === fade) exitAnimation.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossing.fading, crossing.fadeDuration, ref]);
}
function PlaneSprite({ crossing, finish, ...props }: Props & { crossing: Crossing; finish: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const g = crossing.geometry;
  const palette = planePalette(props.phase, props.theme);
  const transform = (x: number, y: number) => `translate(${x - g.length / 2}px, ${y - g.length * .15}px) rotate(${g.pitch}deg) scaleX(${g.eastbound ? 1 : -1})`;
  const fade = 1.5 / g.duration;
  useCrossingAnimation(ref, crossing, props.paused, props.frozen,
    [{ transform: transform(g.startX, g.startY) }, { transform: transform(g.endX, g.endY) }],
    [{ opacity: 0, offset: 0 }, { opacity: 1, offset: fade }, { opacity: 1, offset: 1 - fade }, { opacity: 0, offset: 1 }], () => finish(crossing.flight.id));
  const lights = { smal: [[52,11.4],[3,3],[36,26.6],[45.5,6.8]], breed: [[50,10.4],[2.5,1.6],[30,29],[42.5,5.4]], klein: [[52,12],[5,4.6],[42,12.2],[66,12.2]] }[g.silhouette];
  const calm = props.mode === "animated-calm";
  return <div ref={ref} aria-hidden="true" data-weather-plane={crossing.flight.id} className="weather-plane pointer-events-none absolute left-0 top-0"
    style={{ width: g.length, height: g.length * .3, "--plane-top": palette.top, "--plane-body": palette.top,
      "--plane-under": palette.under, "--plane-far": palette.under } as CSSProperties}>
    {planeContrail(crossing.flight, props.condition, props.precipitation, props.phase) && <span className="weather-plane-contrail pointer-events-none" style={{ width: planeContrailLength(props.width, g.scale), background: `linear-gradient(to left, ${palette.trail}, transparent)` }} />}
    <span className="weather-plane-silhouette" style={{ opacity: palette.opacity }}>
      {g.silhouette === "breed" ? <PlaneBreed /> : g.silhouette === "klein" ? <PlaneKlein /> : <PlaneSmal />}
    </span>
    {props.phase === "night" && <>
      {lights.map(([x, y], i) => i === 1 ? null : <span key={i} className={i === 0 ? "weather-plane-light weather-plane-beacon sky-motion" : "weather-plane-light"}
        style={{ left: `${x}%`, top: `${y / 30 * 100}%`, backgroundColor: i < 2 ? i === 0 ? "#ff3434" : "white" : (i === 2) === g.eastbound ? "#35e780" : "#ff3434",
          color: i < 2 ? i === 0 ? "#ff3434" : "white" : (i === 2) === g.eastbound ? "#35e780" : "#ff3434",
          opacity: i === 2 ? .95 : i === 3 ? .55 : 1, animationDelay: props.frozen != null ? `${-props.frozen}s` : undefined, "--plane-beacon-peak": calm ? .4 : 1 } as CSSProperties} />)}
      {!calm && props.performanceStep === 0 && [lights[1], lights[2]].map(([x, y], i) => <span key={i} className="weather-plane-light weather-plane-strobe sky-motion" style={{ left: `${x}%`, top: `${y / 30 * 100}%`, animationDelay: props.frozen != null ? `${-props.frozen}s` : undefined }} />)}
    </>}
  </div>;
}

/** Mounted by the widget as a sibling of its z-10 content, never inside the sky. */
export function WeatherPlaneLabel({ state }: { state: PlaneLabelState }) {
  const ref = useRef<HTMLDivElement>(null);
  const { crossing, width, height, paused, frozen } = state;
  const g = crossing.geometry;
  const label = planeLabel(crossing.flight);
  const colors = PLANE_LABEL_COLORS[state.theme === "dark" ? "dark" : "light"];
  const path = (node: HTMLElement): Keyframe[] => {
    const pillWidth = node.offsetWidth || Math.min(label.length * 7 + 18, width * .48 - 24);
    const shell = node.parentElement?.getBoundingClientRect();
    const image = node.parentElement?.querySelector<HTMLImageElement>("img.object-contain")?.getBoundingClientRect();
    const icon = shell && image ? { left: image.left - shell.left, right: image.right - shell.left,
      top: image.top - shell.top, bottom: image.bottom - shell.top } : null;
    const position = (fraction: number) => {
      const px = g.startX + (g.endX - g.startX) * fraction;
      const py = g.startY + (g.endY - g.startY) * fraction;
      const x = Math.max(width * .52, Math.min(width - 12 - pillWidth, px - pillWidth / 2));
      const below = py + g.length * .15 + 6;
      const collides = icon && x < icon.right && x + pillWidth > icon.left && below < icon.bottom && below + 26 > icon.top;
      const y = collides ? py - g.length * .15 - 6 - 26 : below;
      return `translate(${x}px, ${Math.max(12, Math.min(height - 78 - 26, y))}px)`;
    };
    // Piecewise-linear clamping stays on the compositor, with no per-frame reads.
    const fractions = [0, 1, (width * .52 + pillWidth / 2 - g.startX) / (g.endX - g.startX),
      (width - 12 - pillWidth / 2 - g.startX) / (g.endX - g.startX)].filter(t => t >= 0 && t <= 1).sort((a, b) => a - b);
    return fractions.map(t => ({ offset: t, transform: position(t) }));
  };
  const start = .45, on = start + .6 / g.duration, off = Math.min(1 - .6 / g.duration, on + 4 / g.duration), end = Math.min(1, off + .6 / g.duration);
  useCrossingAnimation(ref, crossing, paused, frozen,
    path,
    [{ opacity: 0, offset: 0 }, { opacity: 0, offset: start, easing: "ease-out" }, { opacity: 1, offset: on, easing: "linear" },
      { opacity: 1, offset: off, easing: "ease-in" }, { opacity: 0, offset: end }, { opacity: 0, offset: 1 }]);
  return <div ref={ref} aria-hidden="true" data-weather-plane-label className="weather-plane-label pointer-events-none absolute left-0 top-0 z-[11]"
    style={{ maxWidth: width * .48 - 24, color: colors.text,
      borderColor: colors.border,
      backgroundColor: colors.background }}>{label}</div>;
}
