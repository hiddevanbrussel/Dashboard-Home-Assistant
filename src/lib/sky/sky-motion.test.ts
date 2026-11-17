import { describe, expect, it, vi } from "vitest";
import { driftWindFactor } from "../weather-sky";
import {
  FOG_SPEEDS, TWINKLE, cloudDuration, cloudTravel, createSkyRandom, fogDuration,
  frozenLightningPhase, horizontalWindDirection, isSkyPaused, lightningDelay, nextPerformanceStep,
  resolveSkyMode, scheduleLightning, skyDensity, skyFps, type MotionFlags,
} from "./sky-motion";

describe("sky motion modes and pausing", () => {
  it.each([undefined, "invalid", "on"])("defaults %s to full motion", (motion) => {
    expect(resolveSkyMode({ motion, reducedMotion: false, performanceStep: 0 })).toBe("animated-full");
  });
  it("uses one half-density reduction for Calm and performance step 1", () => {
    expect(resolveSkyMode({ motion: "calm", reducedMotion: false, performanceStep: 0 })).toBe("animated-calm");
    for (const motion of ["on", "calm"]) expect(resolveSkyMode({ motion, reducedMotion: false, performanceStep: 1 })).toBe("animated-calm");
    expect(skyDensity("animated-calm", 1)).toBe(0.5);
    expect(skyFps("animated-calm", 0, false)).toBe(24);
    expect(skyFps("animated-calm", 1, true)).toBe(20);
    expect(skyFps("animated-full", 0, true)).toBe(24);
    expect(skyFps("animated-full", 0, false)).toBe(30);
  });
  it("makes Off, reduced motion and step 2 static", () => {
    expect(resolveSkyMode({ motion: "off", reducedMotion: false, performanceStep: 0 })).toBe("static");
    expect(resolveSkyMode({ motion: "on", reducedMotion: true, performanceStep: 0 })).toBe("static");
    expect(resolveSkyMode({ motion: "on", reducedMotion: false, performanceStep: 2 })).toBe("static");
    expect(skyDensity("static", 0)).toBe(0); expect(skyFps("static", 0, false)).toBe(0);
  });
  const running: MotionFlags = { reducedMotion: false, hidden: false, visible: true, screensaver: false, editMode: false };
  it.each(["reducedMotion", "hidden", "screensaver", "editMode"] as const)("pauses for %s", (key) => {
    expect(isSkyPaused({ ...running, [key]: true })).toBe(true);
  });
  it("pauses for off-screen, floating interaction and entrance flags", () => {
    expect(isSkyPaused(running)).toBe(false);
    expect(isSkyPaused({ ...running, visible: false })).toBe(true);
    expect(isSkyPaused(running, true)).toBe(true);
  });
});

describe("CSS motion timing", () => {
  it("clamps the wind factor and doubles drift for windy states", () => {
    expect([-5, 0, 1].map(driftWindFactor)).toEqual([0.6, 0.6, 0.6]);
    expect(driftWindFactor(10)).toBe(1); expect(driftWindFactor(1000)).toBe(2.2);
    const normal = cloudDuration(0, 1, "cloudy");
    expect(normal).toBeGreaterThanOrEqual(60); expect(normal).toBeLessThanOrEqual(120);
    expect(cloudDuration(0, 1, "windy")).toBe(normal / 2);
    expect(cloudDuration(0, 1, "windy-variant")).toBe(normal / 2);
  });
  it("starts drift at the run B position and wraps fully outside the clip", () => {
    for (const direction of [-1, 1]) {
      const travel = cloudTravel(320, 100, 78, direction);
      expect(travel.from + (travel.to - travel.from) * travel.initialPhase).toBeCloseTo(0);
      expect(320 * 0.78 + travel.from).toBe(direction === 1 ? -50 : 370);
      expect(320 * 0.78 + travel.to).toBe(direction === 1 ? 370 : -50);
    }
    expect(horizontalWindDirection(90)).toBe(-1); expect(horizontalWindDirection(270)).toBe(1);
    expect(horizontalWindDirection(0)).toBe(1); expect(horizontalWindDirection(NaN)).toBe(1);
  });
  it("locks three twinkle groups and the three fog speeds", () => {
    expect(TWINKLE).toEqual({ groups: 3, seconds: 6, minimum: 0.6, maximum: 1, offsets: [0, 2, 4] });
    expect(FOG_SPEEDS).toEqual([8, 11, 14]);
    expect([0, 1, 2].map(fogDuration)).toEqual([64 / 8, 64 / 11, 64 / 14]);
  });
});

describe("lightning scheduler", () => {
  it("keeps seeded delays inside the required intervals", () => {
    const random = createSkyRandom(42);
    for (let i = 0; i < 100; i++) {
      const dry = lightningDelay("lightning", random), rain = lightningDelay("lightning-rainy", random);
      expect(dry).toBeGreaterThanOrEqual(10000); expect(dry).toBeLessThanOrEqual(16000);
      expect(rain).toBeGreaterThanOrEqual(6000); expect(rain).toBeLessThanOrEqual(12000);
    }
  });
  it("self-reschedules once per flash and cancels on pause/stop", () => {
    vi.useFakeTimers();
    try {
      const flash = vi.fn();
      const stop = scheduleLightning({ condition: "lightning-rainy", mode: "animated-full", paused: false, random: () => 0,
        clock: { setTimeout, clearTimeout: (id) => clearTimeout(id as ReturnType<typeof setTimeout>) }, flash });
      vi.advanceTimersByTime(5999); expect(flash).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1); expect(flash).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(1);
      vi.advanceTimersByTime(6000); expect(flash).toHaveBeenCalledTimes(2);
      stop(); expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(16000); expect(flash).toHaveBeenCalledTimes(2);
    } finally { vi.useRealTimers(); }
  });
  it.each([
    ["lightning", "static", false], ["lightning-rainy", "animated-full", true], ["sunny", "animated-full", false],
  ] as const)("does not arm a timer for %s/%s/paused=%s", (condition, mode, paused) => {
    const clock = { setTimeout: vi.fn(), clearTimeout: vi.fn() };
    scheduleLightning({ condition, mode, paused, random: () => 0, clock, flash: vi.fn() })();
    expect(clock.setTimeout).not.toHaveBeenCalled();
  });
  it("can freeze a deterministic flash without scheduling anything", () => {
    const seed = 42;
    const first = lightningDelay("lightning-rainy", createSkyRandom(seed)) / 1000;
    expect(frozenLightningPhase("lightning-rainy", first + 0.045, seed)).toBeCloseTo(0.25);
    expect(frozenLightningPhase("lightning-rainy", 1, seed)).toBe(-1);
    expect(frozenLightningPhase("sunny", 100, seed)).toBe(-1);
  });
});

describe("session performance steps", () => {
  it("requires a full 3s window and a strictly greater than 22ms average", () => {
    expect(nextPerformanceStep(0, 2999, 40)).toBe(0);
    expect(nextPerformanceStep(0, 3000, 22)).toBe(0);
    expect(nextPerformanceStep(0, 3000, 22.01)).toBe(1);
    expect(nextPerformanceStep(1, 3000, 23)).toBe(2);
    expect(nextPerformanceStep(1, 3000, 10)).toBe(1);
    expect(nextPerformanceStep(2, 3000, 10)).toBe(2);
  });
});
