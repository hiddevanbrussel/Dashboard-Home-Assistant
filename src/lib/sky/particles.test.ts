import { withParticleOverflow } from "./particles";
import { describe, expect, it } from "vitest";
import { FIELD, HAIL, RAIN, SNOW, STRIDE, WIND, createParticles, freezeParticles, planParticles, resetParticles, stepParticles, updateParticlePlan } from "./particles";
import { createSkyRandom } from "./sky-motion";

const input = { condition: "rainy", precipitation: 1, windKmh: 10, bearing: 270,
  width: 320, height: 300, compact: false, mode: "animated-full" as const, performanceStep: 0 as const };

describe("particle planning", () => {
  it.each([
    ["rainy", 0.2, [40, 0, 0, 0], [21, 0, 0, 0]],
    ["rainy", 1, [90, 0, 0, 0], [48, 0, 0, 0]],
    ["rainy", 3, [160, 0, 0, 0], [85, 0, 0, 0]],
    ["pouring", 0, [160, 0, 0, 0], [85, 0, 0, 0]],
    ["lightning-rainy", 0, [160, 0, 0, 0], [85, 0, 0, 0]],
    ["snowy", 0, [0, 30, 0, 0], [0, 16, 0, 0]],
    ["snowy", 1, [0, 60, 0, 0], [0, 32, 0, 0]],
    ["snowy", 3, [0, 100, 0, 0], [0, 53, 0, 0]],
    ["snowy-rainy", 0, [36, 36, 0, 0], [19, 19, 0, 0]],
    ["snowy-rainy", 10, [36, 36, 0, 0], [19, 19, 0, 0]],
    ["hail", 0, [0, 0, 40, 0], [0, 0, 21, 0]],
    ["hail", 1, [0, 0, 40, 0], [0, 0, 21, 0]],
    ["hail", 3, [0, 0, 60, 0], [0, 0, 32, 0]],
  ])("plans %s at %s mm/h", (condition, precipitation, large, compact) => {
    expect(planParticles({ ...input, condition: condition as string, precipitation: precipitation as number }).counts).toEqual(large);
    expect(planParticles({ ...input, condition: condition as string, precipitation: precipitation as number,
      compact: true, height: 160 }).counts).toEqual(compact);
  });
  it.each(["sunny", "cloudy", "fog", "clear-night", "lightning", "exceptional", "unavailable", "unknown", ""])("has no canvas particles for %s", (condition) => {
    expect(planParticles({ ...input, condition }).total).toBe(0);
  });
  it("uses the wind bands and effect-specific fps caps", () => {
    for (const condition of ["windy", "windy-variant"]) {
      expect([19, 20, 35].map((windKmh) => planParticles({ ...input, condition, windKmh }).counts[WIND])).toEqual([4, 6, 8]);
      expect(planParticles({ ...input, condition, windKmh: 35 }).windSpeed).toBe(330);
    }
    for (const condition of ["rainy", "hail", "windy"]) expect(planParticles({ ...input, condition }).fps).toBe(30);
    for (const condition of ["snowy", "snowy-rainy"]) expect(planParticles({ ...input, condition }).fps).toBe(24);
  });
  it("halves after scaling and the shared cap without quartering Calm at step 1", () => {
    expect(planParticles({ ...input, precipitation: 3, mode: "animated-calm" }).total).toBe(80);
    expect(planParticles({ ...input, precipitation: 3, compact: true, height: 160, mode: "animated-calm" }).total).toBe(43);
    expect(planParticles({ ...input, mode: "animated-calm", performanceStep: 1 }).total).toBe(45);
    expect(planParticles({ ...input, performanceStep: 1 }).total).toBe(45);
    expect(planParticles({ ...input, mode: "animated-calm", performanceStep: 1 }).fps).toBe(20);
    expect(planParticles({ ...input, condition: "snowy-rainy", mode: "animated-calm" }).counts).toEqual([18, 18, 0, 0]);
    const max = { ...input, width: 500, height: 420, precipitation: 3 };
    expect(planParticles(max).total).toBe(200);
    expect(planParticles({ ...max, mode: "animated-calm" }).total).toBe(100);
    for (const condition of ["pouring", "rainy", "snowy", "snowy-rainy", "hail", "windy"]) {
      for (const compact of [true, false]) expect(planParticles({ ...max, condition, compact }).total).toBeLessThanOrEqual(200);
    }
    expect(planParticles({ ...input, mode: "static" }).total).toBe(0);
    expect(planParticles({ ...input, performanceStep: 2 }).total).toBe(0);
  });
  it("uses the capped rain angle and downwind sign from the source bearing", () => {
    expect(planParticles({ ...input, windKmh: 100 }).rainAngle).toBeCloseTo(25 * Math.PI / 180);
    expect(planParticles({ ...input, windKmh: 20 }).rainAngle).toBeCloseTo(12 * Math.PI / 180);
    expect(planParticles({ ...input, windKmh: 0 }).rainAngle).toBe(0);
    expect(planParticles({ ...input, bearing: 90 }).rainDirection).toBe(-1);
    expect(planParticles({ ...input, bearing: 270 }).rainDirection).toBe(1);
    expect(planParticles({ ...input, bearing: 0 }).rainDirection).toBe(0);
    expect(planParticles({ ...input, bearing: 90, windKmh: 20 }).snowSideways).toBe(-6);
    expect(planParticles({ ...input, precipitation: 3 })).toMatchObject({ rainSpeed: 1050, rainLength: 22, rainWidth: 1.5 });
  });
});

describe("fixed-storage particle simulation", () => {
  it("prewarms over the full tile with two seeded depth buckets", () => {
    const plan = planParticles({ ...input, precipitation: 3 });
    const a = createParticles(plan, createSkyRandom(42));
    const b = createParticles(plan, createSkyRandom(42));
    expect(a.buffer).toEqual(b.buffer); expect(a.buffer).toHaveLength(200 * STRIDE);
    const ys: number[] = [];
    for (let i = 0; i < a.active; i++) {
      const at = i * STRIDE; ys.push(a.buffer[at + FIELD.y]);
      const z = a.buffer[at + FIELD.depth];
      expect(z).toBeGreaterThanOrEqual(0.55); expect(z).toBeLessThanOrEqual(1);
      expect(z < 0.78).toBe(i % 2 === 0);
      const variation = a.buffer[at + FIELD.speed] / (plan.rainSpeed * z);
      expect(variation).toBeGreaterThanOrEqual(0.8 - 1e-6); expect(variation).toBeLessThanOrEqual(1.2 + 1e-6);
    }
    expect(Math.min(...ys)).toBeLessThan(30); expect(Math.max(...ys)).toBeGreaterThan(270);
  });
  it("keeps buffer identity while resizing, changing counts and seeking", () => {
    const sim = createParticles(planParticles(input)); const buffer = sim.buffer;
    updateParticlePlan(sim, planParticles({ ...input, width: 500, height: 420, precipitation: 3 }));
    expect(sim.buffer).toBe(buffer);
    resetParticles(sim, planParticles({ ...input, height: 160, compact: true }), createSkyRandom(7));
    freezeParticles(sim, 1); expect(sim.buffer).toBe(buffer);
    const other = createParticles(sim.plan, createSkyRandom(7)); freezeParticles(other, 1);
    // Compare live slots; unused storage is deliberately retained across resizes.
    expect(sim.buffer.subarray(0, sim.active * STRIDE)).toEqual(other.buffer.subarray(0, other.active * STRIDE));
  });
  it("ramps intensity counts over 3s and weather counts over 2s", () => {
    const sim = createParticles(planParticles({ ...input, precipitation: 0 }));
    updateParticlePlan(sim, planParticles({ ...input, precipitation: 3 }));
    expect(sim.active).toBe(40); expect(sim.rampSeconds).toBe(3);
    freezeParticles(sim, 1.5); expect(sim.active).toBe(100);
    freezeParticles(sim, 1.5); expect(sim.active).toBe(160);
    updateParticlePlan(sim, planParticles({ ...input, condition: "snowy", precipitation: 1 }));
    expect(sim.rampSeconds).toBe(2);
    freezeParticles(sim, 1); expect(sim.active).toBe(110);
    freezeParticles(sim, 1); expect(sim.active).toBe(60);
  });
  it("moves rain downwind, hail vertically and wind from the upwind edge", () => {
    const rain = createParticles(planParticles({ ...input, bearing: 90 }));
    rain.buffer[FIELD.x] = 160; rain.buffer[FIELD.y] = 100;
    stepParticles(rain, 1 / 30); expect(rain.buffer[FIELD.x]).toBeLessThan(160); expect(rain.buffer[FIELD.y]).toBeGreaterThan(100);
    rain.buffer[FIELD.y] = 324; stepParticles(rain, 1 / 30); expect(rain.buffer[FIELD.y]).toBe(-24);
    const hail = createParticles(planParticles({ ...input, condition: "hail" }));
    const x = hail.buffer[FIELD.x]; hail.buffer[FIELD.y] = 100;
    stepParticles(hail, 1 / 30); expect(hail.buffer[FIELD.x]).toBe(x); expect(hail.buffer[FIELD.y]).toBeGreaterThan(100);
    const wind = createParticles(planParticles({ ...input, condition: "windy", bearing: 90 }));
    wind.buffer[FIELD.x] = -200; stepParticles(wind, 1 / 30); expect(wind.buffer[FIELD.x]).toBeGreaterThan(320);
  });
  it("stores the snow/hail sizes and snow sway timing in the buffer", () => {
    for (const [condition, kind, min, max] of [["snowy", SNOW, 1.4, 3.5], ["hail", HAIL, 2.5, 3.5]] as const) {
      const sim = createParticles(planParticles({ ...input, condition }));
      for (let i = 0; i < sim.active; i++) {
        const at = i * STRIDE;
        expect(sim.buffer[at + FIELD.kind]).toBe(kind);
        expect(sim.buffer[at + FIELD.size]).toBeGreaterThanOrEqual(min);
        expect(sim.buffer[at + FIELD.size]).toBeLessThanOrEqual(max);
        if (kind === SNOW) {
          expect(sim.buffer[at + FIELD.amplitude]).toBeGreaterThanOrEqual(6);
          expect(sim.buffer[at + FIELD.amplitude]).toBeLessThanOrEqual(14);
          expect(sim.buffer[at + FIELD.period]).toBeGreaterThanOrEqual(3);
          expect(sim.buffer[at + FIELD.period]).toBeLessThanOrEqual(5);
        }
      }
    }
    expect(createParticles(planParticles(input)).buffer[FIELD.kind]).toBe(RAIN);
  });
  it("keeps the specified sway amplitude independent of the depth size/speed scale", () => {
    const snow = createParticles(planParticles({ ...input, condition: "snowy", windKmh: 0 }));
    snow.buffer[FIELD.x] = 160; snow.buffer[FIELD.y] = 100;
    snow.buffer[FIELD.phase] = 0; snow.buffer[FIELD.amplitude] = 10; snow.buffer[FIELD.period] = 4;
    stepParticles(snow, 1); expect(snow.buffer[FIELD.x]).toBeCloseTo(170);
    const wind = createParticles(planParticles({ ...input, condition: "windy", windKmh: 0 }));
    wind.buffer[FIELD.x] = 100; wind.buffer[FIELD.y] = 100; wind.buffer[FIELD.phase] = 0;
    stepParticles(wind, 1.5 / 4); expect(wind.buffer[FIELD.y]).toBeCloseTo(103);
  });
});


describe("overflow particle extension", () => {
  const margins = { left: 8, right: 8, bottom: 40 };
  it.each([[320, 300, false, 190], [320, 160, true, 112], [500, 420, false, 200]])("shares a single capped pool at %sx%s", (width, height, compact, total) => {
    const base = planParticles({ ...input, width: Number(width), height: Number(height), compact: Boolean(compact), precipitation: 3 });
    const extended = withParticleOverflow(base, margins);
    expect(extended.total).toBe(total); expect(extended.counts.reduce((a, b) => a + b, 0)).toBe(total);
    expect(base.overflow).toBeUndefined(); expect(extended.width).toBe(base.width); expect(extended.height).toBe(base.height);
  });
  it("caps mixed precipitation and prewarms the whole expanded area", () => {
    const plan = withParticleOverflow(planParticles({ ...input, condition: "snowy-rainy", width: 500, height: 420 }), margins);
    expect(plan.total).toBeLessThanOrEqual(200); expect(plan.counts[RAIN]).toBeGreaterThan(0); expect(plan.counts[SNOW]).toBeGreaterThan(0);
    const sim = createParticles(plan, createSkyRandom(42)); let outside = 0;
    for (let i = 0; i < sim.active; i++) {
      const x = sim.buffer[i * STRIDE + FIELD.x], y = sim.buffer[i * STRIDE + FIELD.y];
      expect(x).toBeGreaterThanOrEqual(-8); expect(x).toBeLessThanOrEqual(508);
      expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(460);
      if (x < 0 || x > 500 || y > 420) outside++;
    }
    expect(outside).toBeGreaterThan(0);
  });
  it.each(["rainy", "snowy-rainy"])("retains all existing positions and the buffer when toggling %s", condition => {
    const base = planParticles({ ...input, condition }); const sim = createParticles(base, createSkyRandom(42));
    const buffer = sim.buffer, count = sim.active;
    const positions = Array.from({ length: count }, (_, i) => [buffer[i * STRIDE + FIELD.x], buffer[i * STRIDE + FIELD.y]]);
    updateParticlePlan(sim, withParticleOverflow(base, margins));
    expect(sim.buffer).toBe(buffer); expect(sim.rampSeconds).toBe(2);
    for (let i = 0; i < count; i++) expect([buffer[i * STRIDE + FIELD.x], buffer[i * STRIDE + FIELD.y]]).toEqual(positions[i]);
    updateParticlePlan(sim, base);
    for (let i = 0; i < count; i++) expect([buffer[i * STRIDE + FIELD.x], buffer[i * STRIDE + FIELD.y]]).toEqual(positions[i]);
  });
  it("respawns below the entire bottom extension and wraps at its side edges", () => {
    const sim = createParticles(withParticleOverflow(planParticles(input), margins), createSkyRandom(42));
    const b = sim.buffer; b[FIELD.y] = 340 + b[FIELD.size] - .1; b[FIELD.x] = -9;
    stepParticles(sim, 0); expect(b[FIELD.y]).toBeGreaterThan(340); expect(b[FIELD.x]).toBe(328);
    b[FIELD.y] = 340 + b[FIELD.size] + 1; stepParticles(sim, 0);
    expect(b[FIELD.y]).toBe(-24); expect(b[FIELD.x]).toBeGreaterThanOrEqual(-8); expect(b[FIELD.x]).toBeLessThanOrEqual(328);
  });
});
