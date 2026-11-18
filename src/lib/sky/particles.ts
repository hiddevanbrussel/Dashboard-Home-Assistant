import {
  PARTICLE_CAP, PARTICLE_PARAMETERS, particleCount, precipitationIntensity, rainAngle, weatherEffects,
} from "../weather-sky";
import { overflowParticleCount, type OverflowMargins } from "./overflow";
import { createSkyRandom, horizontalWindDirection, skyDensity, skyFps, type PerformanceStep, type SkyMode } from "./sky-motion";

export const RAIN = 0;
export const SNOW = 1;
export const HAIL = 2;
export const WIND = 3;
export const STRIDE = 10;
export const FIELD = { kind: 0, x: 1, y: 2, depth: 3, speed: 4, size: 5, phase: 6, amplitude: 7, period: 8, variation: 9 } as const;
type Counts = [number, number, number, number];

export type ParticlePlan = {
  condition: string; intensity: string; width: number; height: number;
  counts: Counts; total: number; fps: number; mode: SkyMode; performanceStep: PerformanceStep;
  rainSpeed: number; snowSpeed: number; hailSpeed: number; windSpeed: number;
  rainAngle: number; rainDirection: number; snowSideways: number; windDirection: number;
  rainLength: number; rainWidth: number;
  overflow?: OverflowMargins;
};

function apportion(counts: Counts, target: number): Counts {
  const sum = counts[0] + counts[1] + counts[2] + counts[3];
  if (!sum) return [0, 0, 0, 0];
  const result = counts.map((count) => Math.floor(count * target / sum)) as Counts;
  let left = target - result[0] - result[1] - result[2] - result[3];
  for (let i = 0; left > 0; i = (i + 1) % 4) {
    if (counts[i] && result[i] < counts[i]) { result[i]++; left--; }
  }
  return result;
}

export function planParticles(input: {
  condition: string; precipitation: number; windKmh: number; bearing: number;
  width: number; height: number; compact: boolean; mode: SkyMode; performanceStep: PerformanceStep;
}): ParticlePlan {
  const condition = input.condition.trim().toLowerCase();
  const effects = weatherEffects(condition, input.precipitation, input.windKmh);
  const intensity = condition === "snowy-rainy" ? "medium" : precipitationIntensity(input.precipitation, condition);
  const band = intensity === "light" ? 0 : intensity === "medium" ? 1 : 2;
  const density = skyDensity(input.mode, input.performanceStep);
  const base: Counts = [
    effects.rain ? PARTICLE_PARAMETERS.rain.counts[band] * effects.rainShare : 0,
    effects.snow ? PARTICLE_PARAMETERS.snow.counts[band] * effects.snowShare : 0,
    effects.hail ? PARTICLE_PARAMETERS.hail.counts[band] : 0,
    effects.windStreaks,
  ];
  let counts = base.map((count) => particleCount(count, input.width * input.height, input.compact)) as Counts;
  let total = counts[0] + counts[1] + counts[2] + counts[3];
  if (total > PARTICLE_CAP) { counts = apportion(counts, PARTICLE_CAP); total = PARTICLE_CAP; }
  counts = apportion(counts, Math.round(total * density));
  total = counts[0] + counts[1] + counts[2] + counts[3];
  const bearing = Number.isFinite(input.bearing) ? input.bearing : 0;
  const horizontal = -Math.sin(bearing * Math.PI / 180);
  return {
    condition, intensity, width: Math.max(1, input.width), height: Math.max(1, input.height),
    counts, total, fps: skyFps(input.mode, input.performanceStep, effects.snow),
    mode: input.mode, performanceStep: input.performanceStep,
    rainSpeed: PARTICLE_PARAMETERS.rain.speeds[band], snowSpeed: PARTICLE_PARAMETERS.snow.speeds[band],
    hailSpeed: PARTICLE_PARAMETERS.hail.speed, windSpeed: effects.windSpeed,
    rainAngle: rainAngle(input.windKmh) * Math.PI / 180,
    rainDirection: Math.abs(horizontal) < 0.000001 ? 0 : Math.sign(horizontal),
    snowSideways: horizontal * Math.max(0, input.windKmh) * PARTICLE_PARAMETERS.snow.sidewaysWindFactor,
    windDirection: horizontalWindDirection(bearing),
    rainLength: PARTICLE_PARAMETERS.rain.strokeLengths[band], rainWidth: PARTICLE_PARAMETERS.rain.lineWidths[band],
  };
}

/** Scale the existing tile plan once; both canvases share this single capped pool. */
export function withParticleOverflow(plan: ParticlePlan, margins: OverflowMargins): ParticlePlan {
  const total = overflowParticleCount(plan.total, plan.width, plan.height, margins);
  const counts = plan.counts.map(count => Math.floor(count * total / Math.max(1, plan.total))) as Counts;
  let remaining = total - counts.reduce((sum, count) => sum + count, 0);
  for (let i = 0; remaining > 0; i = (i + 1) % 4) if (plan.counts[i]) { counts[i]++; remaining--; }
  return { ...plan, counts, total, overflow: margins };
}

export type ParticleSimulation = {
  readonly buffer: Float32Array;
  plan: ParticlePlan;
  random: () => number;
  active: number;
  elapsed: number;
  rampFrom: number;
  rampElapsed: number;
  rampSeconds: number;
};

function kindAt(plan: ParticlePlan, index: number): number {
  let edge = 0;
  for (let kind = 0; kind < 4; kind++) {
    edge += plan.counts[kind];
    if (index < edge) return kind;
  }
  return RAIN;
}

function initialize(sim: ParticleSimulation, index: number, kind: number) {
  const b = sim.buffer;
  const at = index * STRIDE;
  const random = sim.random;
  b[at + FIELD.kind] = kind;
  b[at + FIELD.x] = random() * (sim.plan.width + (sim.plan.overflow?.left ?? 0) + (sim.plan.overflow?.right ?? 0)) - (sim.plan.overflow?.left ?? 0);
  b[at + FIELD.y] = random() * (sim.plan.height + (sim.plan.overflow?.bottom ?? 0));
  b[at + FIELD.depth] = index % 2 === 0 ? 0.55 + random() * 0.2 : 0.8 + random() * 0.2;
  b[at + FIELD.variation] = 1 - PARTICLE_PARAMETERS.rain.speedVariation + random() * PARTICLE_PARAMETERS.rain.speedVariation * 2;
  b[at + FIELD.phase] = random() * Math.PI * 2;
  b[at + FIELD.amplitude] = kind === SNOW ? PARTICLE_PARAMETERS.snow.sway[0] + random() * (PARTICLE_PARAMETERS.snow.sway[1] - PARTICLE_PARAMETERS.snow.sway[0]) : 3;
  b[at + FIELD.period] = kind === SNOW ? 3 + random() * 2 : 1.5;
  b[at + FIELD.size] = kind === SNOW ? PARTICLE_PARAMETERS.snow.radius[0] + random() * (PARTICLE_PARAMETERS.snow.radius[1] - PARTICLE_PARAMETERS.snow.radius[0])
    : kind === HAIL ? PARTICLE_PARAMETERS.hail.radius[0] + random() * (PARTICLE_PARAMETERS.hail.radius[1] - PARTICLE_PARAMETERS.hail.radius[0])
    : kind === WIND ? PARTICLE_PARAMETERS.wind.lengths[0] + random() * (PARTICLE_PARAMETERS.wind.lengths[1] - PARTICLE_PARAMETERS.wind.lengths[0]) : sim.plan.rainLength;
  setSpeed(sim, at, kind);
}

function setSpeed(sim: ParticleSimulation, at: number, kind: number) {
  const p = sim.plan;
  const base = kind === RAIN ? p.rainSpeed * sim.buffer[at + FIELD.variation]
    : kind === SNOW ? p.snowSpeed : kind === HAIL ? p.hailSpeed : p.windSpeed;
  sim.buffer[at + FIELD.speed] = base * sim.buffer[at + FIELD.depth];
  if (kind === RAIN) sim.buffer[at + FIELD.size] = p.rainLength;
}

/** One fixed buffer for the canvas lifetime, including every later resize. */
export function createParticles(plan: ParticlePlan, random: () => number = createSkyRandom(1)): ParticleSimulation {
  const sim: ParticleSimulation = { buffer: new Float32Array(PARTICLE_CAP * STRIDE), plan, random,
    active: plan.total, elapsed: 0, rampFrom: plan.total, rampElapsed: 0, rampSeconds: 0 };
  for (let i = 0; i < plan.total; i++) initialize(sim, i, kindAt(plan, i));
  return sim;
}

/** Dev seeks/reseeding also reuse the allocation owned by this tile. */
export function resetParticles(sim: ParticleSimulation, plan: ParticlePlan, random: () => number): void {
  sim.plan = plan;
  sim.random = random;
  sim.active = sim.rampFrom = plan.total;
  sim.elapsed = sim.rampElapsed = sim.rampSeconds = 0;
  for (let i = 0; i < plan.total; i++) initialize(sim, i, kindAt(plan, i));
}

export function updateParticlePlan(sim: ParticleSimulation, next: ParticlePlan): void {
  const old = sim.plan;
  const oldCount = sim.active;
  sim.plan = next;
  const count = Math.max(oldCount, next.total);
  for (let i = 0; i < count; i++) {
    const at = i * STRIDE;
    if (i >= oldCount || (i < next.total && sim.buffer[at + FIELD.kind] !== kindAt(next, i))) {
      const x = sim.buffer[at + FIELD.x], y = sim.buffer[at + FIELD.y];
      initialize(sim, i, kindAt(next, i));
      if (i < oldCount && old.condition === next.condition && old.overflow !== next.overflow) {
        sim.buffer[at + FIELD.x] = x; sim.buffer[at + FIELD.y] = y;
      }
    } else {
      sim.buffer[at + FIELD.x] *= next.width / old.width;
      sim.buffer[at + FIELD.y] *= next.height / old.height;
      setSpeed(sim, at, sim.buffer[at + FIELD.kind]);
    }
  }
  sim.rampFrom = oldCount;
  sim.rampElapsed = 0;
  sim.rampSeconds = old.mode !== next.mode || old.performanceStep !== next.performanceStep ? 0
    : old.condition !== next.condition ? 2 : old.intensity !== next.intensity ? 3 : 2;
  if (!sim.rampSeconds) sim.active = next.total;
}

/** No object/array/string allocation in the fixed-dt simulation. */
export function stepParticles(sim: ParticleSimulation, dt: number): void {
  const p = sim.plan;
  const b = sim.buffer;
  sim.elapsed += dt;
  if (sim.rampSeconds) {
    sim.rampElapsed += dt;
    const t = Math.min(1, sim.rampElapsed / sim.rampSeconds);
    sim.active = Math.round(sim.rampFrom + (p.total - sim.rampFrom) * t);
    if (t === 1) sim.rampSeconds = 0;
  }
  const rainX = Math.sin(p.rainAngle) * p.rainDirection;
  const rainY = Math.cos(p.rainAngle);
  for (let i = 0; i < sim.active; i++) {
    const at = i * STRIDE;
    const kind = b[at + FIELD.kind];
    const depth = b[at + FIELD.depth];
    const speed = b[at + FIELD.speed];
    const oldPhase = b[at + FIELD.phase];
    const phase = oldPhase + dt * Math.PI * 2 / b[at + FIELD.period];
    b[at + FIELD.phase] = phase % (Math.PI * 2);
    if (kind === WIND) {
      b[at + FIELD.x] += speed * p.windDirection * dt;
      b[at + FIELD.y] += 3 * (Math.sin(phase) - Math.sin(oldPhase));
      const length = b[at + FIELD.size] * depth;
      if (b[at + FIELD.x] > p.width + length || b[at + FIELD.x] < -length) {
        b[at + FIELD.x] = p.windDirection < 0 ? p.width + length : -length;
        b[at + FIELD.y] = sim.random() * p.height;
      }
    } else {
      b[at + FIELD.y] += speed * (kind === RAIN ? rainY : 1) * dt;
      if (kind === RAIN) b[at + FIELD.x] += speed * rainX * dt;
      if (kind === SNOW) b[at + FIELD.x] += p.snowSideways * depth * dt
        + b[at + FIELD.amplitude] * (Math.sin(phase) - Math.sin(oldPhase));
      const extension = p.overflow ? p.overflow.bottom + b[at + FIELD.size] : 24;
      if (b[at + FIELD.y] > p.height + extension) {
        b[at + FIELD.y] = -24;
        b[at + FIELD.x] = sim.random() * (p.width + (p.overflow?.left ?? 0) + (p.overflow?.right ?? 0)) - (p.overflow?.left ?? 0);
      }
      const left = p.overflow ? -p.overflow.left : -24;
      const right = p.width + (p.overflow ? p.overflow.right : 24);
      if (b[at + FIELD.x] < left) b[at + FIELD.x] = right;
      if (b[at + FIELD.x] > right) b[at + FIELD.x] = left;
    }
  }
}

export function freezeParticles(sim: ParticleSimulation, seconds: number): void {
  const dt = 1 / Math.max(1, sim.plan.fps);
  const steps = Math.floor(Math.max(0, seconds) / dt);
  for (let i = 0; i < steps; i++) stepParticles(sim, dt);
  const remainder = Math.max(0, seconds) - steps * dt;
  if (remainder > 0) stepParticles(sim, remainder);
}
