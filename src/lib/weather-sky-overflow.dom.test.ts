// @vitest-environment happy-dom
import { act, createElement, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingWeatherCard } from "@/components/widgets/floating-weather-card";
import { WeatherSky } from "@/components/weather/weather-sky";
import { drawParticles } from "@/components/weather/weather-sky-canvas";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { createParticles, FIELD, planParticles, STRIDE, WIND, withParticleOverflow } from "./sky/particles";
let root: Root, host: HTMLDivElement;
let reduced: boolean, intersect: (visible: boolean) => void;
let pending: Map<number, FrameRequestCallback>;
let contexts: WeakMap<HTMLCanvasElement, ReturnType<typeof context>>;
let resize: { target: Element; callback: ResizeObserverCallback }[];
const context = () => ({ setTransform: vi.fn(), clearRect: vi.fn(), beginPath: vi.fn(), stroke: vi.fn(), arc: vi.fn(), fill: vi.fn(),
  moveTo: vi.fn(), lineTo: vi.fn(), quadraticCurveTo: vi.fn(), drawImage: vi.fn(), save: vi.fn(), restore: vi.fn(), translate: vi.fn(), rect: vi.fn(), clip: vi.fn(), globalAlpha: 1, strokeStyle: "", fillStyle: "", lineWidth: 1 });
beforeEach(() => {
  vi.useFakeTimers(); reduced = false; pending = new Map(); contexts = new WeakMap(); resize = []; let id = 0;
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { pending.set(++id, callback); return id; });
  vi.stubGlobal("cancelAnimationFrame", (handle: number) => pending.delete(handle));
  vi.stubGlobal("matchMedia", () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersect = visible => callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    observe() { intersect(true); } disconnect() {}
  });
  vi.stubGlobal("ResizeObserver", class {
    constructor(private callback: ResizeObserverCallback) {}
    observe(target: Element) { resize.push({ target, callback: this.callback }); } disconnect() {}
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    const r = this.classList.contains("weather-sky-overflow") ? { x: 92, y: 100, width: 336, height: 340 }
      : this.hasAttribute("data-app-chrome") ? { x: 0, y: 0, width: 800, height: 120 }
      : this.hasAttribute("data-neighbour") ? { x: 400, y: 360, width: 100, height: 80 }
      : { x: 100, y: 100, width: 320, height: 300 };
    return { ...r, left: r.x, top: r.y, right: r.x + r.width, bottom: r.y + r.height, toJSON() {} };
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
    if (!contexts.has(this)) contexts.set(this, context());
    return contexts.get(this)! as unknown as CanvasRenderingContext2D;
  });
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,");
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  useEntityStateStore.setState({ optimisticLockUntil: {} });
  useEntityStateStore.getState().setStates([{ entity_id: "sun.sun", state: "above_horizon", attributes: { elevation: 7, rising: true } }]);
  host = document.createElement("div"); host.setAttribute("data-dashboard-pager", ""); document.body.append(host); root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove(); document.documentElement.removeAttribute("data-dashboard-edit");
  document.body.querySelectorAll('[role="dialog"], [data-app-chrome]').forEach(n => n.remove());
  expect(pending.size).toBe(0); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers();
});
type Options = { motion?: string; stacked?: boolean; slot?: boolean; edit?: boolean; frozen?: boolean; left?: number; condition?: string; pageHidden?: boolean; wind?: number; bearing?: number };
function Fixture({ motion = "on", stacked = false, slot = true, edit = false, frozen = true, left = 100, condition = "rainy", pageHidden = false, wind = 0, bearing = 90 }: Options) {
  const anchor = useRef<HTMLDivElement>(null);
  return createElement("section", { "data-dashboard-page": true, "aria-hidden": pageHidden },
    slot && createElement("div", { "data-sky-overflow-slot": true, style: { display: "contents" } }),
    createElement("div", { className: "card-plot-in", ref: anchor }, createElement(WeatherSky, {
      condition, large: true, motion, precipitation: 3, windKmh: wind, bearing, inSmartStack: stacked, skyPaused: edit,
      preview: frozen ? { time: 3, seed: 42 } : undefined, overflow: { anchor, left, bottom: 100, editMode: edit },
    })), createElement("div", { className: "card-plot-in glass-card", "data-neighbour": true }));
}
const render = async (options: Options = {}) => act(async () => root.render(createElement(Fixture, options)));
const advance = async (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
const overflow = () => host.querySelector<HTMLCanvasElement>("canvas.weather-sky-overflow");
async function transitionEnd(node: Element, propertyName = "opacity") {
  await act(async () => { const event = new Event("transitionend", { bubbles: true }); Object.defineProperty(event, "propertyName", { value: propertyName }); node.dispatchEvent(event); });
}
describe("weather overflow portal lifecycle", () => {
  it.each(["off", "calm", "reduced", "stack", "no-slot", "wind"])("mounts no overflow for %s", async flag => {
    reduced = flag === "reduced";
    await render({ motion: flag === "off" ? "off" : flag === "calm" ? "calm" : "on", stacked: flag === "stack", slot: flag !== "no-slot", condition: flag === "wind" ? "windy" : "rainy" });
    await advance(500); expect(overflow()).toBeNull(); expect(pending.size).toBe(0);
    if (flag === "off" || flag === "reduced") expect(host.querySelector("canvas")).toBeNull();
  });
  it("draws one pool to two targets, in its page slot, with capped backing resolution", async () => {
    vi.stubGlobal("devicePixelRatio", 3);
    const header = document.createElement("header"); header.setAttribute("data-app-chrome", ""); document.body.append(header);
    await render(); await advance(1);
    const node = overflow()!;
    expect(node).not.toBeNull(); expect(node.parentElement?.hasAttribute("data-sky-overflow-slot")).toBe(true);
    expect(node.style.zIndex).toBe("29"); expect(node.style.pointerEvents).toBe("none");
    expect(node.width).toBe(504); expect(node.height).toBe(510);
    const tile = host.querySelector<HTMLCanvasElement>(".weather-sky canvas")!;
    expect(tile.dataset.skyParticles).toBe("190"); expect(host.querySelectorAll("canvas")).toHaveLength(2); expect(pending.size).toBe(0);
    const ctx = contexts.get(node)!;
    expect(ctx.translate).toHaveBeenCalledWith(8, 0); expect(ctx.clip).toHaveBeenCalled();
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 336, 20);
    expect(ctx.clearRect).toHaveBeenCalledWith(308, 260, 28, 80);
    expect(node.style.maskImage).not.toContain("200px");
  });
  it("uses a single pending rAF and clears hidden/off-screen overflow immediately", async () => {
    await render({ frozen: false }); await advance(1); expect(pending.size).toBe(1);
    const node = overflow()!;
    await act(async () => { intersect(false); }); expect(overflow()).toBeNull(); expect(node.width).toBe(0); expect(node.height).toBe(0); expect(pending.size).toBe(0);
    await act(async () => { intersect(true); }); await advance(401); expect(overflow()).not.toBeNull(); expect(pending.size).toBe(1);
    await act(async () => { vi.spyOn(document, "hidden", "get").mockReturnValue(true); document.dispatchEvent(new Event("visibilitychange")); });
    expect(overflow()).toBeNull(); expect(pending.size).toBe(0);
  });
  it("fades edit/popup exits in 150ms, then waits 400ms before returning", async () => {
    await render(); await advance(1); const node = overflow()!;
    await render({ edit: true }); expect(overflow()).toBe(node); expect(node.style.opacity).toBe("0"); expect(node.style.transitionDuration).toBe("150ms");
    await advance(150); expect(overflow()).toBe(node); await transitionEnd(node); expect(overflow()).toBeNull(); expect(node.width).toBe(0);
    await render(); await advance(399); expect(overflow()).toBeNull(); await advance(2); expect(overflow()).not.toBeNull();
    const dialog = document.createElement("div"); dialog.setAttribute("role", "dialog");
    await act(async () => { document.body.append(dialog); }); await advance(150); await transitionEnd(overflow()!); expect(overflow()).toBeNull();
    await act(async () => dialog.remove()); await advance(401); expect(overflow()).not.toBeNull();
  });
  it("flushes resize geometry before returning and delays overflow repositioning", async () => {
    await render(); await advance(1);
    const skyObserver = resize.find(r => r.target.classList.contains("weather-sky"))!;
    await act(async () => skyObserver.callback([{ contentRect: { width: 500, height: 420 } } as ResizeObserverEntry], {} as ResizeObserver));
    expect(host.querySelector<HTMLCanvasElement>(".weather-sky canvas")!.width).toBe(500);
    expect(overflow()).toBeNull(); await advance(401); expect(overflow()!.width).toBe(516); expect(overflow()!.height).toBe(460);
  });
  it("clears an inactive pager page even inside the visibility observer margin", async () => {
    await render({ frozen: false }); await advance(1); expect(overflow()).not.toBeNull();
    await render({ frozen: false, pageHidden: true }); await advance(0);
    expect(overflow()).toBeNull(); expect(pending.size).toBe(0);
  });
  it("retains the old overflow bitmap while a moved tile fades, then repositions after settling", async () => {
    await render(); await advance(1); const node = overflow()!, ctx = contexts.get(node)!;
    const clears = ctx.clearRect.mock.calls.length;
    await render({ edit: true, left: 200 });
    expect(node.style.left).toBe("92px"); expect(ctx.clearRect.mock.calls).toHaveLength(clears);
    await advance(150); await transitionEnd(node); await render({ left: 200 }); await advance(399); expect(overflow()).toBeNull();
    await advance(2); expect(overflow()!.style.left).toBe("192px");
  });
  it("does not reallocate the backing store when a bearing flip preserves its size", async () => {
    await render({ wind: 40 }); await advance(1); const node = overflow()!;
    const width = vi.spyOn(node, "width", "set"), height = vi.spyOn(node, "height", "set");
    await render({ wind: 40, bearing: 270 }); await advance(1);
    expect(overflow()).toBe(node); expect(width).not.toHaveBeenCalled(); expect(height).not.toHaveBeenCalled();
  });
  it("coalesces scroll measurements and reads only header/canvas layout", async () => {
    const header = document.createElement("header"); header.setAttribute("data-app-chrome", ""); document.body.append(header);
    await render(); await advance(1);
    const neighbour = host.querySelector<HTMLElement>("[data-neighbour]")!;
    const layout = vi.spyOn(neighbour, "getBoundingClientRect");
    const canvasLayout = vi.spyOn(overflow()!, "getBoundingClientRect");
    await act(async () => { host.dispatchEvent(new Event("scroll")); host.dispatchEvent(new Event("scroll")); });
    expect(pending.size).toBe(1);
    await act(async () => { const callbacks = [...pending.values()]; pending.clear(); for (const callback of callbacks) callback(20); });
    expect(layout).not.toHaveBeenCalled(); expect(canvasLayout).not.toHaveBeenCalled(); expect(pending.size).toBe(0);
    await render({ edit: true }); await act(async () => host.dispatchEvent(new Event("scroll")));
    expect(pending.size).toBe(0);
  });
  it("commits opacity zero and reflows before starting a remount fade-in", async () => {
    const samples: string[] = [];
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains("weather-sky-overflow")) samples.push(getComputedStyle(this).opacity);
      return 300;
    });
    await render(); await advance(1); await render({ edit: true });
    await transitionEnd(overflow()!); samples.length = 0;
    await render(); await advance(399); expect(overflow()).toBeNull();
    await advance(1); expect(samples).toContain("0");
    expect(overflow()!.style.opacity).toBe("1"); expect(overflow()!.style.transitionDuration).toBe("300ms");
  });
  it("uses transitionend for removal, ignores unrelated events and has a safety fallback", async () => {
    await render(); await advance(1); const node = overflow()!;
    await render({ edit: true }); await advance(150); expect(overflow()).toBe(node);
    await transitionEnd(node, "transform"); expect(overflow()).toBe(node);
    await transitionEnd(node); expect(overflow()).toBeNull(); expect(node.width).toBe(0);
    await render(); await advance(401); await render({ edit: true });
    await advance(199); expect(overflow()).not.toBeNull(); await advance(1); expect(overflow()).toBeNull();
  });
  it("finishes a fade-out even when editing closes before its transition ends", async () => {
    await render(); await advance(1); const node = overflow()!;
    await render({ edit: true }); await advance(40); await render();
    expect(overflow()).toBe(node); await transitionEnd(node); expect(overflow()).toBeNull();
    await advance(399); expect(overflow()).toBeNull(); await advance(1); expect(overflow()).not.toBeNull();
  });
  it("does not replay the plot-in fallback after the floating tile returns from editing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ forecast: [] }) })));
    useEntityStateStore.getState().updateEntityState("weather.preview", { state: "rainy", attributes: { precipitation: 3 } });
    const floating = async (editMode: boolean) => act(async () => root.render(createElement("section", { "data-dashboard-page": true },
      createElement("div", { "data-sky-overflow-slot": true, style: { display: "contents" } }),
      createElement(FloatingWeatherCard, { title: "Preview weather", entity_id: "weather.preview", sky_motion: "on", width: 320, height: 300, editMode, storageScope: "run-d-fix-test" }))));
    await floating(false); await advance(800); await advance(401); expect(overflow()).not.toBeNull();
    await floating(true); await transitionEnd(overflow()!); expect(overflow()).toBeNull();
    await floating(false); await advance(399); expect(overflow()).toBeNull();
    await advance(1); expect(overflow()).not.toBeNull();
  });
  it("fits a 347px overflow backing at a rounded 19px lee margin", async () => {
    vi.stubGlobal("devicePixelRatio", 1.5);
    await render({ wind: 30, bearing: 90 }); await advance(1);
    const node = overflow()!;
    expect(node.style.width).toBe("347px"); expect(node.width).toBe(521); expect(node.height).toBe(510);
    expect(contexts.get(node)!.setTransform).toHaveBeenLastCalledWith(521 / 347, 0, 0, 1.5, 0, 0);
  });
  it("retains the exact DPR transform at an even overflow width", async () => {
    vi.stubGlobal("devicePixelRatio", 1.5);
    await render({ wind: 0 }); await advance(1);
    const node = overflow()!;
    expect(node.width).toBe(504); expect(node.height).toBe(510);
    expect(contexts.get(node)!.setTransform).toHaveBeenLastCalledWith(1.5, 0, 0, 1.5, 0, 0);
  });
  it("filters fully in-tile particles and never paints wind on the second target", () => {
    const plan = withParticleOverflow(planParticles({ condition: "rainy", precipitation: 3, windKmh: 0, bearing: 0, width: 320, height: 300, compact: false, mode: "animated-full", performanceStep: 0 }), { left: 8, right: 8, bottom: 40 });
    const sim = createParticles(plan); sim.active = 1; sim.buffer[FIELD.x] = 100; sim.buffer[FIELD.y] = 100;
    const ctx = context(), sprite = document.createElement("canvas");
    drawParticles(ctx as unknown as CanvasRenderingContext2D, sim, "light", sprite, true); expect(ctx.lineTo).not.toHaveBeenCalled();
    sim.buffer[FIELD.x] = -1; drawParticles(ctx as unknown as CanvasRenderingContext2D, sim, "light", sprite, true); expect(ctx.lineTo).toHaveBeenCalledTimes(1);
    ctx.lineTo.mockClear(); sim.buffer[FIELD.kind] = WIND;
    drawParticles(ctx as unknown as CanvasRenderingContext2D, sim, "light", sprite, true); expect(ctx.lineTo).not.toHaveBeenCalled(); expect(ctx.quadraticCurveTo).not.toHaveBeenCalled();
    expect(sim.buffer).toHaveLength(200 * STRIDE);
  });
});
