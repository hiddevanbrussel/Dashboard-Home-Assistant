"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import {
  DEFAULT_SUN_ENTITY_ID, blendSky, deriveSky, normalizeSkyMotion, resolveSunPhase,
  skyClouds, skyFogBands, skyGlow, skyStars, weatherSkyLook,
  type SkySet, type SkyTheme,
} from "@/lib/weather-sky";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const VEIL_MASK = "linear-gradient(100deg, #000 0%, #000 max(50%, 200px), rgba(0,0,0,.86) 60%, rgba(0,0,0,.6) 70%, rgba(0,0,0,.36) 80%, rgba(0,0,0,.2) 90%, rgba(0,0,0,.14) 100%)";
const METRICS_MASK = "linear-gradient(0deg, #000 0, #000 50px, transparent 78px)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Shared with the edit panel so a live OS preference change updates its hint. */
export function useSkyReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches, () => false);
}

type Scene = {
  key: string;
  condition: string;
  theme: SkyTheme;
  set: SkySet;
  glow: string | null;
  stars: ReturnType<typeof skyStars>;
  clouds: ReturnType<typeof skyClouds>;
  fog: string[];
  large: boolean;
};

function Colours({ scene }: { scene: Scene }) {
  const style = {
    "--sky-1": scene.set.stops[0], "--sky-2": scene.set.stops[1], "--sky-3": scene.set.stops[2],
  } as CSSProperties;
  return <div className="weather-sky-gradient absolute inset-0 z-0" style={style} />;
}

function Details({ scene }: { scene: Scene }) {
  return (
    <>
      <div className="absolute inset-0 z-[1]" style={{ backgroundImage: scene.glow ?? undefined }}>
        {scene.stars.map((star, index) => (
          <span key={index} className="absolute rounded-full bg-white" style={{
            left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity: star.alpha,
          }} />
        ))}
      </div>
      <div className="absolute inset-0 z-[2]">
        {scene.clouds.map((cloud, index) => (
          <span key={index} className="absolute -translate-x-1/2 -translate-y-1/2" style={{
            left: `${cloud.x}%`, top: `${cloud.y}%`, width: cloud.width, height: cloud.height,
            backgroundImage: cloud.background,
          }} />
        ))}
      </div>
      <div className="absolute inset-0 z-[3]">
        {scene.fog.map((backgroundImage, index) => <div key={index} className="absolute inset-0" style={{ backgroundImage }} />)}
      </div>
    </>
  );
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

/** Decorative static sky only. All motion modes deliberately share these layers. */
export function WeatherSky({ condition, large, motion }: { condition: string; large: boolean; motion?: unknown }) {
  const sun = useEntityStateStore((s) => s.getState(DEFAULT_SUN_ENTITY_ID));
  const theme = useThemeStore((s) => s.resolved);
  const reducedMotion = useSkyReducedMotion();
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const { phase, rising, elevation, fallback } = resolveSunPhase(sun, clock);
  const scene = useMemo<Scene>(() => {
    const look = weatherSkyLook(condition, phase);
    const set = fallback || elevation == null ? deriveSky(look, phase, theme) : blendSky(look, elevation, rising, theme);
    return {
      key: [condition, phase, theme, large, elevation, ...set.stops, set.veilAlpha].join(":"),
      condition, theme, set, large,
      glow: skyGlow(look, phase, theme, elevation),
      stars: skyStars(look, phase, large),
      clouds: skyClouds(look, phase, theme, large, condition),
      fog: skyFogBands(look, theme),
    };
  }, [condition, phase, theme, large, fallback, elevation, rising]);
  const lastScene = useRef(scene);
  const [previous, setPrevious] = useState<Scene | null>(null);
  const [change, setChange] = useState<"theme" | "weather" | "phase">("weather");
  // Select the duration and outgoing frame in the same render as the new colours,
  // so CSS does not start with the previous update's timing or flash new details.
  const pendingScene = lastScene.current.key !== scene.key ? lastScene.current : null;
  const outgoing = pendingScene ?? previous;
  const transitionKind = pendingScene
    ? (pendingScene.theme !== scene.theme ? "theme" : pendingScene.condition !== scene.condition ? "weather" : "phase")
    : change;
  useEffect(() => {
    const old = lastScene.current;
    if (old.key === scene.key) {
      // A live motion-preference change must not strand an outgoing snapshot
      // after cleaning up the previous transition's timer.
      const timer = window.setTimeout(() => setPrevious(null), reducedMotion ? 600 : 2000);
      return () => window.clearTimeout(timer);
    }
    lastScene.current = scene;
    const kind = old.theme !== scene.theme ? "theme" : old.condition !== scene.condition ? "weather" : "phase";
    setChange(kind);
    setPrevious(old);
    const duration = reducedMotion ? 600 : kind === "theme" ? 300 : kind === "weather" ? 1200 : 2000;
    const timer = window.setTimeout(() => setPrevious(null), duration);
    return () => window.clearTimeout(timer);
  }, [scene, reducedMotion]);

  return (
    <div aria-hidden="true" className="weather-sky pointer-events-none absolute inset-0"
      data-change={transitionKind} data-motion={normalizeSkyMotion(motion)} data-reduced-motion={reducedMotion}
      data-look={weatherSkyLook(condition, phase)} data-phase={phase} data-theme={theme} data-large={large}>
      <Colours scene={scene} />
      <div key={scene.key} className={outgoing && !reducedMotion ? "weather-sky-incoming absolute inset-0" : "absolute inset-0"}>
        <Details scene={scene} />
      </div>
      <Veil scene={scene} />
      {outgoing && (
        <div key={outgoing.key} className="weather-sky-outgoing absolute inset-0" data-full-scene={reducedMotion}>
          {reducedMotion && <Colours scene={outgoing} />}
          <Details scene={outgoing} />
          {reducedMotion && <Veil scene={outgoing} />}
        </div>
      )}
    </div>
  );
}
