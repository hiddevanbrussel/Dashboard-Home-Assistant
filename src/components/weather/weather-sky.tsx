"use client";

import { flushSync } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import { useSkyMotionFlags, useSkyReducedMotionPreference } from "@/hooks/use-motion-flags";
import { getSkyPerformanceStep, subscribeSkyFrameStats } from "@/lib/sky/frame-loop";
import { overflowEnabled } from "@/lib/sky/overflow";
import { createOverflowTarget, WeatherSkyOverflow, type SkyOverflowPlacement } from "./weather-sky-overflow";
import { planParticles, withParticleOverflow } from "@/lib/sky/particles";
import {
  TWINKLE, cloudDuration, cloudTravel, cloudProgress, retimeCloud, type CloudTimeline, fogDuration, frozenLightningPhase,
  horizontalWindDirection, isSkyPaused, resolveSkyMode, scheduleLightning,
} from "@/lib/sky/sky-motion";
import {
  DEFAULT_SUN_ENTITY_ID, PARTICLE_PARAMETERS, blendSky, deriveSky, driftWindFactor, normalizeSkyMotion, resolveSunPhase,
  overflowMargins, rainAngle, skyClouds, skyFogBands, skyGlow, skyStars, weatherEffects, weatherSkyLook,
  type SkySet, type SkyTheme,
} from "@/lib/weather-sky";
import { WeatherPlanes, type PlaneLabelState } from "./weather-planes";
import { WeatherSkyCanvas } from "./weather-sky-canvas";

const VEIL_MASK = "linear-gradient(100deg, #000 0%, #000 max(50%, 200px), rgba(0,0,0,.86) 60%, rgba(0,0,0,.6) 70%, rgba(0,0,0,.36) 80%, rgba(0,0,0,.2) 90%, rgba(0,0,0,.14) 100%)";
const METRICS_MASK = "linear-gradient(0deg, #000 0, #000 50px, transparent 78px)";
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Preserve the run B export used by the edit panel and floating weather card. */
export function useSkyReducedMotion(): boolean {
  return useSkyReducedMotionPreference();
}

type Scene = {
  key: string; condition: string; theme: SkyTheme; set: SkySet;
  glow: string | null; stars: ReturnType<typeof skyStars>; clouds: ReturnType<typeof skyClouds>;
  fog: string[]; large: boolean; animated: boolean; fixedTime?: number;
  width: number; windKmh: number; bearing: number; cloudTimelines: CloudTimeline[];
};

function Colours({ scene }: { scene: Scene }) {
  const style = {
    "--sky-1": scene.set.stops[0], "--sky-2": scene.set.stops[1], "--sky-3": scene.set.stops[2],
  } as CSSProperties;
  return <div className="weather-sky-gradient absolute inset-0 z-0" style={style} />;
}

function Details({ scene, elapsedAtMount }: { scene: Scene; elapsedAtMount: number }) {
  // Lock the delay at mount, rather than adding elapsed time again on rerenders.
  // Remounted phase layers sample the same root epoch and stay in sync.
  const [elapsed] = useState(() => scene.fixedTime ?? elapsedAtMount);
  return (
    <>
      <div className="absolute inset-0 z-[1]" style={{ backgroundImage: scene.glow ?? undefined }}>
        {scene.stars.map((star, index) => (
          <span key={index} className={scene.animated ? "sky-star-motion sky-motion absolute rounded-full bg-white" : "absolute rounded-full bg-white"} style={{
            left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity: star.alpha,
            ...(scene.animated && { "--sky-star-alpha": star.alpha,
              animationDelay: `${-elapsed - TWINKLE.offsets[index % TWINKLE.groups]}s` }),
          } as CSSProperties} />
        ))}
      </div>
      <div className="absolute inset-0 z-[2]">
        {scene.clouds.map((cloud, index) => (
          <Cloud key={`${index}:${scene.cloudTimelines[index]?.revision ?? 0}`} cloud={cloud}
            track={scene.cloudTimelines[index]} elapsed={scene.fixedTime ?? elapsedAtMount} />
        ))}
      </div>
      <div className="absolute inset-0 z-[3]">
        {scene.fog.map((backgroundImage, index) => {
          if (!scene.animated) return <div key={index} className="absolute inset-0" style={{ backgroundImage }} />;
          const duration = fogDuration(index);
          // Extend the paint area 32px on either side, preserving the original
          // gradient's CSS-pixel radius/centre so its edge never enters the clip.
          const extended = backgroundImage.replace("120% 22%", `${scene.width * 1.2}px 22%`)
            .replace(`at ${30 + index * 25}%`, `at ${32 + scene.width * (30 + index * 25) / 100}px`);
          return <div key={index} className="sky-fog-motion sky-motion absolute inset-y-0" style={{
            left: -32, right: -32, backgroundImage: extended,
            animationDuration: `${duration}s`, animationDelay: `${-duration / 2 - elapsed}s`,
          }} />;
        })}
      </div>
    </>
  );
}

function Cloud({ cloud, track, elapsed }: {
  cloud: Scene["clouds"][number]; track?: CloudTimeline; elapsed: number;
}) {
  // CSS advances from this delay until a retime remounts this cloud alone.
  const [delay] = useState(() => track ? -cloudProgress(track, elapsed) * track.duration : 0);
  return <span className={track ? "sky-cloud-motion sky-motion absolute -translate-x-1/2 -translate-y-1/2"
    : "absolute -translate-x-1/2 -translate-y-1/2"} style={{
    left: `${cloud.x}%`, top: `${cloud.y}%`, width: cloud.width, height: cloud.height,
    backgroundImage: cloud.background,
    ...(track && { "--sky-cloud-from": `${track.from}px`, "--sky-cloud-to": `${track.to}px`,
      animationDuration: `${track.duration}s`, animationDelay: `${delay}s` }),
  } as CSSProperties} />;
}

function Veil({ scene }: { scene: Scene }) {
  const backgroundColor = scene.theme === "light"
    ? `rgba(247,250,253,${scene.set.veilAlpha})` : `rgba(18,24,38,${scene.set.veilAlpha})`;
  return (
    <div className="absolute inset-0 z-[6]">
      <div className="weather-sky-veil absolute inset-0" style={{ backgroundColor, maskImage: VEIL_MASK, WebkitMaskImage: VEIL_MASK }} />
      {scene.large && <div className="weather-sky-veil absolute inset-0" style={{ backgroundColor, maskImage: METRICS_MASK, WebkitMaskImage: METRICS_MASK }} />}
    </div>
  );
}

/** All motion remains inside the weather tile. Static is the unchanged run B sky. */
export function WeatherSky({ condition, large, motion, precipitation = 0, windKmh = 0, bearing = 0, skyPaused = false, preview, show_planes, planes_entity_id, inSmartStack = false, onPlaneLabel, overflow }: {
  condition: string; large: boolean; motion?: unknown; precipitation?: number; windKmh?: number;
  bearing?: number; skyPaused?: boolean; preview?: { time?: number; seed?: number; planesAt?: number };
  overflow?: SkyOverflowPlacement;
  show_planes?: boolean; planes_entity_id?: string; inSmartStack?: boolean; onPlaneLabel?: (state: PlaneLabelState | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const sun = useEntityStateStore((s) => s.getState(DEFAULT_SUN_ENTITY_ID));
  const theme = useThemeStore((s) => s.resolved);
  const flags = useSkyMotionFlags(root);
  const reducedMotion = flags.reducedMotion;
  const performanceStep = useSyncExternalStore(subscribeSkyFrameStats, getSkyPerformanceStep, () => 0 as const);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, dpr: 1 });
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    setReady(true);
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const read = (box?: Pick<DOMRectReadOnly, "width" | "height">, synchronous = false) => {
      const rect = node.getBoundingClientRect();
      // Entrance/swipe transforms must not shrink the simulation's CSS area.
      const width = box?.width ?? (node.clientWidth || rect.width);
      const height = box?.height ?? (node.clientHeight || rect.height);
      // A hidden pager page can report 0×0. Retain its last backing store and
      // simulation instead of unmounting/reallocating them during the pause.
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const update = () => setDimensions((old) => old.width === width && old.height === height && old.dpr === dpr ? old : { width, height, dpr });
      if (synchronous) flushSync(update); else update();
    };
    read();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => read(entries[0]?.contentRect, true));
    observer?.observe(node);
    const resize = () => read(undefined, true);
    let resolution: MediaQueryList | null = null;
    const watchResolution = () => {
      resolution?.removeEventListener("change", changedResolution);
      resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      resolution.addEventListener("change", changedResolution);
    };
    const changedResolution = () => { read(undefined, true); watchResolution(); };
    watchResolution();
    window.addEventListener("resize", resize);
    return () => { observer?.disconnect(); resolution?.removeEventListener("change", changedResolution); window.removeEventListener("resize", resize); };
  }, []);
  const mode = ready ? resolveSkyMode({ motion, reducedMotion, performanceStep }) : "static";
  const animated = mode !== "static";
  useEffect(() => { if (!animated || !show_planes || !planes_entity_id) onPlaneLabel?.(null); }, [animated, show_planes, planes_entity_id, onPlaneLabel]);
  const modeRef = useRef(animated);
  modeRef.current = animated;
  const frozenTime = preview?.time;
  const [overflowPageHidden, setOverflowPageHidden] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [overflowActive, setOverflowActive] = useState(false);
  const [overflowTarget] = useState(createOverflowTarget);
  const basePaused = isSkyPaused(flags, skyPaused) || popupOpen || overflowPageHidden;
  const overflowGate = overflowEnabled({ mode, performanceStep, condition, floating: !!overflow, stacked: inSmartStack,
    reducedMotion, paused: basePaused, hidden: flags.hidden, visible: flags.visible && !overflowPageHidden, screensaver: flags.screensaver,
    editMode: flags.editMode || overflow?.editMode, dragging: overflow?.dragging, resizing: overflow?.resizing,
    plotIn: overflow?.plotIn, sheetOpen: overflow?.sheetOpen, popupOpen });
  const margins = useMemo(() => overflowMargins(condition === "hail" ? 0 : rainAngle(windKmh), bearing), [condition, windKmh, bearing]);
  const paused = !animated || basePaused || frozenTime != null;
  const timeline = useRef({ running: false, epoch: 0, pausedAt: null as number | null, elapsed: 0 });
  const now = ready ? performance.now() : 0;
  if (animated) {
    if (!timeline.current.running) {
      timeline.current.running = true;
      timeline.current.epoch = now;
      timeline.current.pausedAt = paused ? now : null;
    } else if (paused && timeline.current.pausedAt == null) timeline.current.pausedAt = now;
    else if (!paused && timeline.current.pausedAt != null) {
      timeline.current.epoch += now - timeline.current.pausedAt;
      timeline.current.pausedAt = null;
    }
    timeline.current.elapsed = Math.max(0, ((timeline.current.pausedAt ?? now) - timeline.current.epoch) / 1000);
  } else if (timeline.current.running) {
    timeline.current.elapsed = Math.max(0, ((timeline.current.pausedAt ?? now) - timeline.current.epoch) / 1000);
    timeline.current.running = false;
  }
  // CSS already stops its own clock on pause. Sample that same logical clock
  // when phase layers remount, including during a long hidden/edit interval.
  const elapsedForLayers = frozenTime ?? timeline.current.elapsed;
  const { phase, rising, elevation, fallback } = resolveSunPhase(sun, clock);
  const cloudTimelines = useRef<CloudTimeline[]>([]);
  const scene = useMemo<Scene>(() => {
    const look = weatherSkyLook(condition, phase);
    const set = fallback || elevation == null ? deriveSky(look, phase, theme) : blendSky(look, elevation, rising, theme);
    const width = dimensions.width || 320;
    const clouds = skyClouds(look, phase, theme, large, condition);
    cloudTimelines.current = animated ? clouds.map((cloud, index) => retimeCloud(cloudTimelines.current[index],
      cloudDuration(index, driftWindFactor(windKmh), condition),
      cloudTravel(width, cloud.width, cloud.x, horizontalWindDirection(bearing)), width * cloud.x / 100,
      elapsedForLayers)) : [];
    return {
      key: [condition, phase, theme, large, elevation, animated,
        animated ? frozenTime : undefined,
        ...set.stops, set.veilAlpha].join(":"),
      condition, theme, set, large, animated, fixedTime: frozenTime,
      width: dimensions.width || 320, windKmh, bearing,
      glow: skyGlow(look, phase, theme, elevation), stars: skyStars(look, phase, large),
      clouds, cloudTimelines: cloudTimelines.current, fog: skyFogBands(look, theme),
    };
  }, [condition, phase, theme, large, fallback, elevation, rising, animated, frozenTime, dimensions.width, windKmh, bearing, elapsedForLayers]);
  const plan = useMemo(() => { const tilePlan = planParticles({ condition, precipitation, windKmh, bearing,
    width: dimensions.width, height: dimensions.height, compact: !large, mode, performanceStep,
  }); return overflowActive && overflowGate !== "off" ? withParticleOverflow(tilePlan, margins) : tilePlan;
  }, [condition, precipitation, windKmh, bearing, dimensions.width, dimensions.height, large, mode, performanceStep, overflowActive, overflowGate, margins]);
  const lastScene = useRef(scene);
  const previousRef = useRef<Scene | null>(null);
  const [previous, setPrevious] = useState<Scene | null>(null);
  const [particleSnapshot, setParticleSnapshot] = useState<string | null>(null);
  const [change, setChange] = useState<"theme" | "weather" | "phase" | "mode">("weather");
  const pendingScene = lastScene.current.key !== scene.key ? lastScene.current : null;
  const outgoing = pendingScene ?? previous;
  const kindOfChange = (old: Scene) => old.animated !== scene.animated ? "mode"
    : old.theme !== scene.theme ? "theme" : old.condition !== scene.condition ? "weather" : "phase";
  const transitionKind = pendingScene ? kindOfChange(pendingScene) : change;
  useEffect(() => {
    const old = lastScene.current;
    if (old.key === scene.key && !previousRef.current) { lastScene.current = scene; return; }
    const kind = old.animated !== scene.animated ? "mode"
      : old.theme !== scene.theme ? "theme" : old.condition !== scene.condition ? "weather" : "phase";
    if (old.key !== scene.key) {
      lastScene.current = scene;
      previousRef.current = old;
      setPrevious(old);
      setChange(kind);
    }
    const duration = reducedMotion || kind === "mode" ? 600 : kind === "theme" ? 300 : kind === "weather" ? 1200 : 2000;
    const timer = window.setTimeout(() => {
      previousRef.current = null; setPrevious(null); setParticleSnapshot(null);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [scene, reducedMotion]);
  const captureOnStop = useCallback(() => !modeRef.current, []);
  const captureSnapshot = useCallback((image: string) => setParticleSnapshot(image), []);
  const flash = useRef<HTMLDivElement>(null);
  const lightning = weatherEffects(condition).lightning;
  useBrowserLayoutEffect(() => {
    const node = flash.current;
    if (!node) return;
    const clear = () => node.classList.remove("sky-flash-active");
    clear();
    if (!animated || basePaused) return;
    if (frozenTime != null) {
      const at = frozenLightningPhase(condition, frozenTime, preview?.seed ?? 1);
      if (at >= 0) { node.style.animationDelay = `${-at * 0.18}s`; node.classList.add("sky-flash-active"); }
      return clear;
    }
    node.style.animationDelay = "0s";
    const cancel = scheduleLightning({ condition, mode, paused, random: Math.random,
      clock: { setTimeout: (callback, ms) => window.setTimeout(callback, ms), clearTimeout: (id) => window.clearTimeout(id as number) },
      flash: () => { clear(); void node.offsetWidth; node.classList.add("sky-flash-active"); },
    });
    node.addEventListener("animationend", clear);
    return () => { cancel(); clear(); node.removeEventListener("animationend", clear); };
  }, [animated, basePaused, paused, condition, mode, frozenTime, preview?.seed, lightning]);
  const fullScene = reducedMotion || (outgoing != null && outgoing.animated !== scene.animated);

  return (
    <div ref={root} aria-hidden="true" className="weather-sky pointer-events-none absolute inset-0"
      data-change={transitionKind} data-motion={normalizeSkyMotion(motion)} data-reduced-motion={reducedMotion}
      data-look={weatherSkyLook(condition, phase)} data-phase={phase} data-theme={theme} data-large={large}
      data-sky-mode={mode} data-sky-paused={paused} data-sky-frozen={frozenTime != null} data-sky-performance-step={performanceStep}>
      {overflow && mode === "animated-full" && performanceStep === 0 && !inSmartStack && (
        <WeatherSkyOverflow placement={overflow} target={overflowTarget} gate={overflowGate} margins={margins}
          width={dimensions.width} height={dimensions.height} dpr={dimensions.dpr} frozen={frozenTime != null}
          onActive={setOverflowActive} onPopup={setPopupOpen} onPageHidden={setOverflowPageHidden} />
      )}
      <Colours scene={scene} />
      <div key={scene.key} className={outgoing && !fullScene ? "weather-sky-incoming absolute inset-0" : "absolute inset-0"}>
        <Details scene={scene} elapsedAtMount={elapsedForLayers} />
      </div>
      {show_planes && planes_entity_id && dimensions.width > 0 && (
        <WeatherPlanes key={planes_entity_id} sensorId={planes_entity_id} calm={normalizeSkyMotion(motion) === "calm"} mode={mode} performanceStep={performanceStep}
          paused={paused} visible={flags.visible && !flags.hidden && !flags.screensaver} compact={dimensions.height < 184} stacked={inSmartStack} condition={condition} precipitation={precipitation}
          width={dimensions.width} height={dimensions.height} phase={phase} theme={theme} frozen={frozenTime != null ? preview?.planesAt ?? frozenTime : undefined}
          onLabel={onPlaneLabel} />
      )}
      {animated && plan.total > 0 && dimensions.width > 0 && dimensions.height > 0 && (
        <WeatherSkyCanvas overflow={overflowTarget} plan={plan} theme={theme} dpr={dimensions.dpr} paused={paused}
          freezeTime={frozenTime} seed={preview?.seed} captureOnStop={captureOnStop} onSnapshot={captureSnapshot} />
      )}
      {animated && lightning && <div ref={flash} aria-hidden="true" className="sky-lightning sky-motion pointer-events-none absolute inset-0 z-[5]"
        style={{ "--sky-flash-peak": PARTICLE_PARAMETERS.lightning.peakOpacity[theme] } as CSSProperties} />}
      <Veil scene={scene} />
      {outgoing && (
        <div key={outgoing.key} className="weather-sky-outgoing absolute inset-0" data-full-scene={fullScene}>
          {fullScene && <Colours scene={outgoing} />}
          <Details scene={outgoing} elapsedAtMount={elapsedForLayers} />
          {fullScene && outgoing.animated && !scene.animated && particleSnapshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={particleSnapshot} alt="" className="pointer-events-none absolute inset-0 z-[4] h-full w-full" />
          )}
          {fullScene && <Veil scene={outgoing} />}
        </div>
      )}
    </div>
  );
}
