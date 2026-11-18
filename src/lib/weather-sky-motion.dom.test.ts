// @vitest-environment happy-dom
import { createElement, act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WeatherSky } from "@/components/weather/weather-sky";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { getSkyFrameStats } from "./sky/frame-loop";

let root: Root;
let host: HTMLDivElement;
let mediaReduced = false;
let mediaListeners: Set<() => void>;
let intersect: (visible: boolean) => void;
let pending: Map<number, FrameRequestCallback>;
let requests: ReturnType<typeof vi.fn>;
let seenMargin: string | undefined;
let resizeSky: (width: number, height: number) => void;

beforeEach(() => {
  vi.useFakeTimers();
  const origin = Date.now();
  vi.spyOn(performance, "now").mockImplementation(() => Date.now() - origin);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  mediaReduced = false; mediaListeners = new Set(); pending = new Map(); let id = 0;
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("prefers-reduced-motion") ? mediaReduced : true,
    addEventListener: (_: string, listener: () => void) => { if (query.includes("prefers-reduced-motion")) mediaListeners.add(listener); },
    removeEventListener: (_: string, listener: () => void) => { mediaListeners.delete(listener); },
  }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
      seenMargin = options.rootMargin;
      intersect = (visible) => callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    observe() { intersect(true); }
    disconnect() {}
  });
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback: ResizeObserverCallback) {
      resizeSky = (width, height) => callback([{ contentRect: { width, height } } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
    observe() {} disconnect() {}
  });
  requests = vi.fn((callback: FrameRequestCallback) => { pending.set(++id, callback); return id; });
  vi.stubGlobal("requestAnimationFrame", requests);
  vi.stubGlobal("cancelAnimationFrame", (handle: number) => pending.delete(handle));
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 320, height: 300, x: 0, y: 0, left: 0, top: 0, right: 320, bottom: 300, toJSON() {} });
  const ctx = { setTransform: vi.fn(), clearRect: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(),
    moveTo: vi.fn(), lineTo: vi.fn(), quadraticCurveTo: vi.fn(), drawImage: vi.fn(),
    globalAlpha: 1, fillStyle: "", strokeStyle: "", lineWidth: 1 };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,");
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  useEntityStateStore.getState().setStates([{ entity_id: "sun.sun", state: "above_horizon", attributes: { elevation: 7, rising: true } }]);
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
});
afterEach(async () => {
  await act(async () => { root.unmount(); });
  host.remove(); document.documentElement.removeAttribute("data-dashboard-edit");
  for (const node of document.body.querySelectorAll(".fixed.inset-0")) node.remove();
  vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers();
});

async function render(motion: string, options: { skyPaused?: boolean; preview?: { time: number; seed: number } } = {}) {
  await act(async () => { root.render(createElement(WeatherSky, { condition: "rainy", large: true, precipitation: 1, motion, ...options })); });
}
const sky = () => host.querySelector<HTMLElement>(".weather-sky")!;

describe("weather sky motion DOM", () => {
  it("shares one browser callback across multiple animated tiles", async () => {
    await act(async () => { root.render(createElement("div", null,
      createElement(WeatherSky, { condition: "rainy", large: true, precipitation: 1, motion: "on" }),
      createElement(WeatherSky, { condition: "snowy", large: true, precipitation: 1, motion: "on" })) ); });
    expect(host.querySelectorAll("canvas")).toHaveLength(2);
    expect(pending.size).toBe(1);
    expect(getSkyFrameStats().subscribers).toBe(2);
    await act(async () => { vi.spyOn(document, "hidden", "get").mockReturnValue(true); document.dispatchEvent(new Event("visibilitychange")); });
    expect(pending.size).toBe(0); expect(getSkyFrameStats().subscribers).toBe(0);
  });
  it.each(["sunny", "cloudy", "fog", "clear-night", "lightning", "exceptional", "unavailable", "unknown"])("runs no canvas loop for %s", async (condition) => {
    await act(async () => { root.render(createElement(WeatherSky, { condition, large: true, motion: "on" })); });
    expect(host.querySelector("canvas")).toBeNull(); expect(pending.size).toBe(0);
  });
  it("mounts no canvas and schedules no frames/timers beyond the minute clock in Off", async () => {
    await render("off");
    expect(host.querySelector("canvas")).toBeNull(); expect(pending.size).toBe(0);
    expect(requests).not.toHaveBeenCalled(); expect(vi.getTimerCount()).toBe(1);
    expect(host.querySelector(".sky-motion")).toBeNull();
  });
  it("keeps reduced motion static and follows live preference changes", async () => {
    mediaReduced = true; await render("on");
    expect(host.querySelector("canvas")).toBeNull(); expect(pending.size).toBe(0);
    await act(async () => { mediaReduced = false; for (const listener of mediaListeners) listener(); });
    expect(host.querySelector("canvas")).not.toBeNull(); expect(pending.size).toBe(1);
    await act(async () => { mediaReduced = true; for (const listener of mediaListeners) listener(); });
    expect(host.querySelector("canvas")).toBeNull(); expect(pending.size).toBe(0);
    expect(sky().dataset.skyMode).toBe("static");
  });
  it("unsubscribes off-screen and for floating interaction, then resumes", async () => {
    await render("on"); expect(seenMargin).toBe("100px"); expect(pending.size).toBe(1);
    await act(async () => { intersect(false); });
    expect(sky().dataset.skyPaused).toBe("true"); expect(pending.size).toBe(0);
    const before = requests.mock.calls.length;
    await act(async () => { vi.advanceTimersByTime(2000); });
    expect(requests.mock.calls.length).toBe(before);
    await act(async () => { intersect(true); }); expect(pending.size).toBe(1);
    await render("on", { skyPaused: true }); expect(pending.size).toBe(0);
    await render("on", { skyPaused: false }); expect(pending.size).toBe(1);
  });
  it("pauses for hidden documents, the edit attribute and screensaver overlays", async () => {
    await render("on");
    await act(async () => {
      vi.spyOn(document, "hidden", "get").mockReturnValue(true);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(pending.size).toBe(0);
    await act(async () => {
      vi.spyOn(document, "hidden", "get").mockReturnValue(false);
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(pending.size).toBe(1);
    await act(async () => { document.documentElement.setAttribute("data-dashboard-edit", "1"); await vi.advanceTimersByTimeAsync(0); });
    expect(pending.size).toBe(0); expect(sky().dataset.skyPaused).toBe("true");
    await act(async () => { document.documentElement.removeAttribute("data-dashboard-edit"); await vi.advanceTimersByTimeAsync(0); });
    const overlay = document.createElement("div"); overlay.className = "fixed inset-0 z-[9999]";
    await act(async () => { document.body.append(overlay); await vi.advanceTimersByTimeAsync(0); });
    expect(pending.size).toBe(0);
    await act(async () => { overlay.remove(); await vi.advanceTimersByTimeAsync(0); });
    expect(pending.size).toBe(1);
  });
  it("draws deterministic seeks without subscribing and removes the canvas on Off", async () => {
    await render("on", { preview: { time: 1, seed: 42 } });
    expect(host.querySelector("canvas")?.getAttribute("data-sky-particles")).toBe("90");
    expect(pending.size).toBe(0); expect(getSkyFrameStats().subscribers).toBe(0);
    await render("off"); expect(host.querySelector("canvas")).toBeNull();
    await act(async () => { vi.advanceTimersByTime(600); });
    expect(host.querySelector(".weather-sky-outgoing")).toBeNull(); expect(pending.size).toBe(0);
  });
  it("never overlays a stale particle snapshot on a newly animated canvas", async () => {
    await render("on"); await render("off");
    expect(host.querySelector(".weather-sky-outgoing img")).not.toBeNull();
    await render("on");
    expect(host.querySelectorAll("canvas")).toHaveLength(1);
    expect(host.querySelector(".weather-sky-outgoing img")).toBeNull();
    expect(pending.size).toBe(1);
  });
  it("keeps the same canvas through a zero-sized hidden page and later resize", async () => {
    await render("on"); const canvas = host.querySelector("canvas");
    await act(async () => { intersect(false); resizeSky(0, 0); });
    expect(host.querySelector("canvas")).toBe(canvas); expect(pending.size).toBe(0);
    await act(async () => { resizeSky(500, 420); });
    expect(host.querySelector("canvas")).toBe(canvas);
    expect(canvas?.width).toBe(500); expect(canvas?.height).toBe(420);
    await act(async () => { intersect(true); });
    expect(pending.size).toBe(1);
  });
  it("keeps a paused CSS cohort on its logical clock across a sun update", async () => {
    await render("on");
    const initial = parseFloat(host.querySelector<HTMLElement>(".sky-cloud-motion")!.style.animationDelay);
    await act(async () => { vi.advanceTimersByTime(1000); });
    await render("on", { skyPaused: true });
    await act(async () => { vi.advanceTimersByTime(5000); });
    await act(async () => {
      useEntityStateStore.getState().updateEntityState("sun.sun", { attributes: { elevation: 9, rising: true } });
    });
    const incoming = parseFloat(host.querySelector<HTMLElement>(".sky-cloud-motion")!.style.animationDelay);
    expect(incoming).toBeCloseTo(initial - 1, 2);
    expect(pending.size).toBe(0);
  });
  it("retimes wind, direction and width without a scene fade or a cloud position jump", async () => {
    const paint = async (windKmh: number, bearing = 270) => act(async () => {
      root.render(createElement(WeatherSky, { condition: "rainy", large: true, motion: "on", windKmh, bearing,
        preview: { time: 35, seed: 42 } }));
    });
    const positions = () => [...host.querySelectorAll<HTMLElement>(".sky-cloud-motion")].map(node => {
      const from = parseFloat(node.style.getPropertyValue("--sky-cloud-from"));
      const to = parseFloat(node.style.getPropertyValue("--sky-cloud-to"));
      const p = -parseFloat(node.style.animationDelay) / parseFloat(node.style.animationDuration);
      return parseFloat(node.style.left) / 100 * (sky().clientWidth || width) + from + (to - from) * p;
    });
    let width = 320;
    await paint(10); await act(async () => { vi.advanceTimersByTime(600); });
    const before = positions(); expect(before.length).toBeGreaterThan(0);
    for (const [wind, bearing] of [[12, 270], [12, 90], [10, 90]]) {
      await paint(wind, bearing);
      positions().forEach((x, i) => expect(Math.abs(x - before[i])).toBeLessThan(1));
      expect(host.querySelector(".weather-sky-outgoing")).toBeNull();
    }
    width = 400; await act(async () => { resizeSky(width, 300); });
    positions().forEach((x, i) => expect(Math.abs(x - before[i])).toBeLessThan(1));
    expect(host.querySelector(".weather-sky-outgoing")).toBeNull();
  });
  it.each([true, false])("masks animated particles in both layouts (large=%s)", async (large) => {
    await act(async () => { root.render(createElement(WeatherSky, { condition: "hail", precipitation: 3, large,
      motion: "on", preview: { time: 3, seed: 42 } })); });
    const node = host.querySelector("canvas")!;
    expect(node.style.maskImage).toContain("max(50%, 200px)");
    expect(node.style.maskImage).toContain("50px, #000 78px");
    expect(node.style.maskComposite).toBe("intersect");
    const ctx = node.getContext("2d")!;
    const calls = vi.mocked(ctx.drawImage).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    for (const call of calls) {
      expect(call[3]).toBeGreaterThanOrEqual(5);
      expect(call[3]).toBeLessThanOrEqual(7);
    }
  });
  it("fits an odd tile backing without changing its CSS-pixel drawing area", async () => {
    vi.stubGlobal("devicePixelRatio", 1.5);
    await render("on");
    await act(async () => { resizeSky(321, 160); });
    const canvas = host.querySelector<HTMLCanvasElement>(".weather-sky canvas")!;
    expect(canvas.width).toBe(482); expect(canvas.height).toBe(240);
    expect(canvas.getContext("2d")!.setTransform).toHaveBeenLastCalledWith(482 / 321, 0, 0, 1.5, 0, 0);
  });
  it("applies the global performance fallback and never re-enables it in the session", async () => {
    const context = document.createElement("canvas").getContext("2d")!;
    vi.mocked(context.clearRect).mockImplementation(() => { vi.advanceTimersByTime(12); });
    await render("on");
    const tick = async (time: number, advance = 25) => act(async () => {
      vi.advanceTimersByTime(advance);
      const callbacks = [...pending.values()]; pending.clear();
      for (const callback of callbacks) callback(time);
    });
    await tick(0, 0);
    for (let i = 1; i <= 120; i++) await tick(i * 25);
    expect(sky().dataset.skyPerformanceStep).toBe("1");
    expect(host.querySelector("canvas")?.getAttribute("data-sky-fps")).toBe("20");
    expect(host.querySelector("canvas")?.getAttribute("data-sky-particles")).toBe("45");
    for (let i = 121; i <= 245; i++) await tick(i * 25);
    expect(sky().dataset.skyPerformanceStep).toBe("2");
    expect(host.querySelector("canvas")).toBeNull(); expect(pending.size).toBe(0);
    const count = requests.mock.calls.length;
    await render("off"); await render("on");
    expect(sky().dataset.skyMode).toBe("static"); expect(requests.mock.calls.length).toBe(count);
  });
});
