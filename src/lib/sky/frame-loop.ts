import { nextPerformanceStep, type PerformanceStep } from "./sky-motion";

export type FrameSubscriber = {
  fps: number;
  step: (dtSeconds: number) => void;
  draw: () => void;
  particles?: () => number;
};
export type FrameClock = {
  requestAnimationFrame: (callback: (timestamp: number) => void) => number;
  cancelAnimationFrame: (handle: number) => void;
  now: () => number;
};
export type FrameStats = {
  subscribers: number; activeParticles: number; fps: number;
  averageWorkMs: number; averageIntervalMs: number; performanceStep: PerformanceStep;
};
const EMPTY: FrameStats = { subscribers: 0, activeParticles: 0, fps: 0, averageWorkMs: 0, averageIntervalMs: 0, performanceStep: 0 };

/** Fixed storage for the rolling 3s metrics, including multi-tile work samples. */
class Samples {
  private times = new Float64Array(4096);
  private values = new Float64Array(4096);
  private first = 0;
  private count = 0;
  private sum = 0;
  clear() { this.first = this.count = this.sum = 0; }
  prune(time: number) {
    while (this.count && this.times[this.first] <= time - 3000) this.remove();
  }
  private remove() {
    this.sum -= this.values[this.first];
    this.first = (this.first + 1) % this.values.length;
    this.count--;
  }
  add(time: number, value: number) {
    this.prune(time);
    if (this.count === this.values.length) this.remove();
    const index = (this.first + this.count) % this.values.length;
    this.times[index] = time;
    this.values[index] = value;
    this.sum += value;
    this.count++;
  }
  average() { return this.count ? this.sum / this.count : 0; }
}

export function createFrameLoop(clock: FrameClock) {
  const subscribers = new Set<{ subscriber: FrameSubscriber; accumulator: number }>();
  const listeners = new Set<() => void>();
  const work = new Samples();
  const intervals = new Samples();
  let pending: number | null = null;
  let inFrame = false;
  let last: number | null = null;
  let lastPublish = -Infinity;
  let windowMs = 0;
  let performanceStep: PerformanceStep = 0;
  let snapshot: FrameStats = { ...EMPTY };

  const publish = (time: number, force = false) => {
    if (!force && time - lastPublish < 250) return;
    lastPublish = time;
    let particles = 0;
    let fps = 0;
    for (const entry of subscribers) {
      particles += entry.subscriber.particles?.() ?? 0;
      fps = Math.max(fps, entry.subscriber.fps);
    }
    snapshot = { subscribers: subscribers.size, activeParticles: particles, fps,
      averageWorkMs: work.average(), averageIntervalMs: intervals.average(), performanceStep };
    for (const listener of listeners) listener();
  };

  const frame = (time: number) => {
    pending = null;
    if (!subscribers.size) return;
    inFrame = true;
    const elapsedMs = last == null ? 0 : Math.max(0, time - last);
    last = time;
    work.prune(time);
    intervals.prune(time);
    if (elapsedMs > 250) {
      windowMs = 0;
      for (const entry of subscribers) entry.accumulator = 0;
    } else if (elapsedMs > 0) {
      intervals.add(time, elapsedMs);
      windowMs += elapsedMs;
      if (windowMs >= 3000) {
        const next = nextPerformanceStep(performanceStep, windowMs, intervals.average());
        const changed = next !== performanceStep;
        performanceStep = next;
        if (changed) {
          // Step 2 needs a full new window. A healthy step-0 window keeps
          // rolling instead of delaying detection until another fixed block.
          windowMs = 0;
          publish(time, true);
        }
      }
      for (const entry of subscribers) {
        const dt = 1 / entry.subscriber.fps;
        entry.accumulator = Math.min(entry.accumulator + elapsedMs / 1000, dt * 2);
        if (entry.accumulator + 1e-9 < dt) continue;
        const start = clock.now();
        let steps = 0;
        while (steps < 2 && subscribers.has(entry) && entry.accumulator + 1e-9 >= dt) {
          entry.subscriber.step(dt);
          entry.accumulator = Math.max(0, entry.accumulator - dt);
          steps++;
        }
        if (subscribers.has(entry)) {
          entry.subscriber.draw();
          work.add(time, Math.max(0, clock.now() - start));
        }
      }
    }
    publish(time);
    inFrame = false;
    if (subscribers.size && pending == null) pending = clock.requestAnimationFrame(frame);
  };

  return {
    subscribe(subscriber: FrameSubscriber) {
      if (!Number.isFinite(subscriber.fps) || subscriber.fps <= 0) throw new Error("FPS must be positive");
      const entry = { subscriber, accumulator: 0 };
      subscribers.add(entry);
      if (pending == null && !inFrame) pending = clock.requestAnimationFrame(frame);
      publish(clock.now(), true);
      let removed = false;
      return () => {
        if (removed) return;
        removed = true;
        subscribers.delete(entry);
        if (!subscribers.size) {
          if (pending != null) clock.cancelAnimationFrame(pending);
          pending = last = null;
          windowMs = 0;
          work.clear();
          intervals.clear();
        }
        publish(clock.now(), true);
      };
    },
    getStats: () => snapshot,
    subscribeStats(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  };
}

let shared: ReturnType<typeof createFrameLoop> | undefined;
function sharedLoop() {
  return shared ??= createFrameLoop({
    requestAnimationFrame: (callback) => requestAnimationFrame(callback),
    cancelAnimationFrame: (handle) => cancelAnimationFrame(handle),
    now: () => performance.now(),
  });
}
export const subscribeSkyFrames = (subscriber: FrameSubscriber) => sharedLoop().subscribe(subscriber);
export const subscribeSkyFrameStats = (listener: () => void) => sharedLoop().subscribeStats(listener);
export const getSkyFrameStats = () => shared?.getStats() ?? EMPTY;
export const getServerSkyFrameStats = () => EMPTY;
export const getSkyPerformanceStep = () => getSkyFrameStats().performanceStep;
