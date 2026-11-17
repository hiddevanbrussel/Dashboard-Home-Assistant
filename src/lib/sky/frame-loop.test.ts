import { describe, expect, it, vi } from "vitest";
import { createFrameLoop } from "./frame-loop";

function fakeClock() {
  let time = 0, workTime = 0, id = 0;
  const pending = new Map<number, (time: number) => void>();
  const clock = {
    requestAnimationFrame: vi.fn((callback: (time: number) => void) => { pending.set(++id, callback); return id; }),
    cancelAnimationFrame: vi.fn((handle: number) => { pending.delete(handle); }),
    now: () => workTime,
  };
  return { clock, pending,
    work: (ms: number) => { workTime += ms; },
    advance: (ms: number) => {
      time += ms; workTime = time;
      const callbacks = [...pending.values()]; pending.clear();
      for (const callback of callbacks) callback(time);
    },
  };
}

describe("shared sky frame loop", () => {
  it("does not request frames for stats listeners and cancels the last subscriber", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    loop.subscribeStats(() => {});
    expect(fake.pending.size).toBe(0);
    const step = vi.fn(), draw = vi.fn();
    const stop = loop.subscribe({ fps: 30, step, draw });
    expect(fake.pending.size).toBe(1);
    fake.advance(0); fake.advance(34);
    expect(draw).toHaveBeenCalledTimes(1);
    stop(); stop();
    expect(fake.pending.size).toBe(0);
    fake.advance(1000);
    expect(step).toHaveBeenCalledTimes(1);
    expect(draw).toHaveBeenCalledTimes(1);
    expect(fake.clock.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
  it.each([30, 24, 20])("steps at fixed dt for %s fps", (fps) => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    const step = vi.fn(), draw = vi.fn();
    loop.subscribe({ fps, step, draw }); fake.advance(0);
    for (let i = 0; i < 120; i++) fake.advance(1000 / 120);
    expect(step).toHaveBeenCalledTimes(fps);
    expect(draw).toHaveBeenCalledTimes(fps);
    for (const [dt] of step.mock.calls) expect(dt).toBe(1 / fps);
  });
  it("shares one pending callback across different fps caps", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    const a = vi.fn(), b = vi.fn();
    const stopA = loop.subscribe({ fps: 30, step: a, draw() {} });
    const stopB = loop.subscribe({ fps: 24, step: b, draw() {} });
    expect(fake.pending.size).toBe(1); fake.advance(0);
    for (let i = 0; i < 120; i++) { fake.advance(1000 / 120); expect(fake.pending.size).toBe(1); }
    expect(a).toHaveBeenCalledTimes(30); expect(b).toHaveBeenCalledTimes(24);
    stopA(); expect(fake.pending.size).toBe(1);
    stopB(); expect(fake.pending.size).toBe(0);
  });
  it("drops gaps over 250ms and never performs more than two steps per frame", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    const step = vi.fn(), draw = vi.fn(); loop.subscribe({ fps: 30, step, draw });
    fake.advance(0); fake.advance(200);
    expect(step).toHaveBeenCalledTimes(2); expect(draw).toHaveBeenCalledTimes(1);
    fake.advance(251); expect(step).toHaveBeenCalledTimes(2);
    fake.advance(34); expect(step).toHaveBeenCalledTimes(3);
  });
  it("measures step plus draw work separately from the raw rAF interval", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    loop.subscribe({ fps: 30, step: () => fake.work(1), draw: () => fake.work(2), particles: () => 90 });
    fake.advance(0);
    for (let i = 0; i < 240; i++) fake.advance(1000 / 60);
    expect(loop.getStats().averageWorkMs).toBeCloseTo(3);
    expect(loop.getStats().averageIntervalMs).toBeCloseTo(1000 / 60);
    expect(loop.getStats()).toMatchObject({ fps: 30, activeParticles: 90, performanceStep: 0 });
  });
  it("degrades only after consecutive complete 3s raw-interval windows", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    let stop = loop.subscribe({ fps: 30, step() {}, draw() { fake.work(8); } }); fake.advance(0);
    for (let i = 0; i < 119; i++) fake.advance(25);
    expect(loop.getStats().performanceStep).toBe(0);
    fake.advance(25); expect(loop.getStats().performanceStep).toBe(1);
    for (let i = 0; i < 120; i++) fake.advance(25);
    expect(loop.getStats().performanceStep).toBe(2);
    stop(); expect(fake.pending.size).toBe(0);
    stop = loop.subscribe({ fps: 30, step() {}, draw() {} }); fake.advance(0);
    for (let i = 0; i < 360; i++) fake.advance(1000 / 120);
    expect(loop.getStats().performanceStep).toBe(2); stop();
  });
  it("keeps a rolling window after a healthy window instead of waiting for fixed blocks", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    loop.subscribe({ fps: 30, step() {}, draw() { fake.work(10); } }); fake.advance(0);
    for (let i = 0; i < 120; i++) fake.advance(1000 / 60);
    for (let i = 0; i < 25; i++) fake.advance(40);
    expect(loop.getStats().performanceStep).toBe(0);
    for (let i = 0; i < 25; i++) fake.advance(40);
    expect(loop.getStats().performanceStep).toBe(1);
  });
  it.each([1, 6])("gates fallback on own work at 30Hz (%sms)", (ms) => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    loop.subscribe({ fps: 30, step() {}, draw() { fake.work(ms); } }); fake.advance(0);
    for (let i = 0; i < 184; i++) fake.advance(33);
    expect(loop.getStats().performanceStep).toBe(ms > 4 ? 2 : 0);
  });
  it("does not create a second loop for a subscription added during a draw", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock); let added = false;
    loop.subscribe({ fps: 30, step() {}, draw() {
      if (!added) { added = true; loop.subscribe({ fps: 24, step() {}, draw() {} }); }
    } });
    fake.advance(0); fake.advance(34); expect(fake.pending.size).toBe(1);
  });
  it("does no further work when the last subscriber stops inside its step", () => {
    const fake = fakeClock(); const loop = createFrameLoop(fake.clock);
    let stop = () => {};
    const draw = vi.fn(); const step = vi.fn(() => stop());
    stop = loop.subscribe({ fps: 30, step, draw });
    fake.advance(0); fake.advance(100);
    expect(step).toHaveBeenCalledTimes(1); expect(draw).not.toHaveBeenCalled();
    expect(fake.pending.size).toBe(0);
  });
});
