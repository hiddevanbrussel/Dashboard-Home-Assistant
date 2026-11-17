import { PARTICLE_PARAMETERS, normalizeSkyMotion, weatherEffects } from "../weather-sky";

export type SkyMode = "animated-full" | "animated-calm" | "static";
export type PerformanceStep = 0 | 1 | 2;
export type MotionFlags = {
  reducedMotion: boolean;
  hidden: boolean;
  visible: boolean;
  screensaver: boolean;
  editMode: boolean;
};

export function resolveSkyMode({ motion, reducedMotion, performanceStep }: {
  motion?: unknown; reducedMotion: boolean; performanceStep: PerformanceStep;
}): SkyMode {
  const normalized = normalizeSkyMotion(motion);
  if (normalized === "off" || reducedMotion || performanceStep === 2) return "static";
  return normalized === "calm" || performanceStep === 1 ? "animated-calm" : "animated-full";
}

export function skyDensity(mode: SkyMode, performanceStep: PerformanceStep): number {
  if (mode === "static" || performanceStep === 2) return 0;
  return mode === "animated-calm" || performanceStep === 1 ? 0.5 : 1;
}

export function skyFps(mode: SkyMode, performanceStep: PerformanceStep, snow: boolean): number {
  if (mode === "static" || performanceStep === 2) return 0;
  return performanceStep === 1 ? 20 : mode === "animated-calm" || snow ? 24 : 30;
}

export function isSkyPaused(flags: MotionFlags, skyPaused = false): boolean {
  return flags.reducedMotion || flags.hidden || !flags.visible || flags.screensaver || flags.editMode || skyPaused;
}

/** Evaluate a full rolling raw-rAF window; callers gate the next step for 3s. */
export function nextPerformanceStep(step: PerformanceStep, windowMs: number, averageIntervalMs: number): PerformanceStep {
  if (!Number.isFinite(windowMs) || windowMs < 3000 || averageIntervalMs <= 22 || !Number.isFinite(averageIntervalMs)) return step;
  return step === 0 ? 1 : 2;
}

export function createSkyRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** Wind bearings name the source. Missing/north/south defaults to rightward drift. */
export function horizontalWindDirection(bearing: number): number {
  const horizontal = -Math.sin((Number.isFinite(bearing) ? bearing : 0) * Math.PI / 180);
  return Math.abs(horizontal) < 0.000001 ? 1 : Math.sign(horizontal);
}

export const TWINKLE = { groups: 3, seconds: 6, minimum: 0.6, maximum: 1, offsets: [0, 2, 4] } as const;
export const FOG_SPEEDS = [8, 11, 14] as const;

export function fogDuration(index: number): number {
  return 64 / FOG_SPEEDS[index];
}

/** Seeded base duration; stronger wind and windy states shorten the same loop. */
export function cloudDuration(index: number, windFactor: number, state: string): number {
  const seeded = createSkyRandom(101 + index * 7919)();
  return (60 + seeded * 60) / (windFactor * weatherEffects(state).cloudDriftMultiplier);
}

/** Off → On starts at the static centre. New phase layers share the same epoch. */
export function cloudTravel(width: number, cloudWidth: number, centrePercent: number, direction: number) {
  const centre = width * centrePercent / 100;
  const left = -centre - cloudWidth / 2;
  const right = width - centre + cloudWidth / 2;
  const from = direction < 0 ? right : left;
  const to = direction < 0 ? left : right;
  return { from, to, initialPhase: -from / (to - from) };
}

export function lightningDelay(condition: string, random: () => number): number {
  const rainy = condition.trim().toLowerCase() === "lightning-rainy";
  const [minimum, maximum] = rainy ? PARTICLE_PARAMETERS.lightning.rainyIntervalSeconds : PARTICLE_PARAMETERS.lightning.intervalSeconds;
  const sample = random();
  const fraction = Number.isFinite(sample) ? Math.min(1, Math.max(0, sample)) : 0;
  return Math.max(PARTICLE_PARAMETERS.lightning.minimumIntervalSeconds * 1000, (minimum + fraction * (maximum - minimum)) * 1000);
}

export type LightningClock = {
  setTimeout: (callback: () => void, ms: number) => unknown;
  clearTimeout: (handle: unknown) => void;
};

/** DOM-free, injectable scheduler: one timer, measured from flash start to start. */
export function scheduleLightning(options: {
  condition: string; mode: SkyMode; paused: boolean; random: () => number;
  clock: LightningClock; flash: () => void;
}): () => void {
  if (options.mode === "static" || options.paused || !weatherEffects(options.condition).lightning) return () => {};
  let stopped = false;
  let handle: unknown;
  const schedule = () => {
    handle = options.clock.setTimeout(() => {
      if (stopped) return;
      options.flash();
      if (!stopped) schedule();
    }, lightningDelay(options.condition, options.random));
  };
  schedule();
  return () => { stopped = true; options.clock.clearTimeout(handle); };
}

/** -1 means no flash; otherwise a deterministic position within the 180ms pulse. */
export function frozenLightningPhase(condition: string, seconds: number, seed: number): number {
  if (!Number.isFinite(seconds) || !weatherEffects(condition).lightning) return -1;
  const pulse = PARTICLE_PARAMETERS.lightning.pulseMs / 1000;
  const random = createSkyRandom(seed);
  let start = lightningDelay(condition, random) / 1000;
  while (start <= seconds) {
    if (seconds < start + pulse) return (seconds - start) / pulse;
    start += lightningDelay(condition, random) / 1000;
  }
  return -1;
}
