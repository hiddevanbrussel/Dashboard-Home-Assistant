// @vitest-environment happy-dom
import { act, createElement, Profiler } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SKY_CANVAS_MASK } from "@/components/weather/weather-sky-canvas";
import { WeatherCardWidget } from "@/components/widgets/weather-card-widget";
import { WeatherSky } from "@/components/weather/weather-sky";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";

const sensorId = "sensor.flightradar24_current_in_area";
const flight = { id: "fictional-alpha", callsign: "FKE1234", aircraft_code: "B738", altitude: 30000, heading: 90, ground_speed: 420 };
let root: Root, host: HTMLDivElement;
let visible: (value: boolean) => void;
let reduced: boolean;
let mediaListeners: Set<() => void>;
let animations: { node: HTMLElement; frames: Keyframe[]; animation: Animation; options: KeyframeAnimationOptions }[];
beforeEach(() => {
  vi.useFakeTimers(); vi.setSystemTime(0);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  reduced = false; mediaListeners = new Set(); animations = [];
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ forecast: [] }) })));
  vi.stubGlobal("requestAnimationFrame", vi.fn()); vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduced-motion") ? reduced : true,
    addEventListener: (_: string, fn: () => void) => { if (q.includes("reduced-motion")) mediaListeners.add(fn); },
    removeEventListener: (_: string, fn: () => void) => { mediaListeners.delete(fn); } }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: IntersectionObserverCallback) { visible = value => cb([{ isIntersecting: value } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    observe() { visible(true); } disconnect() {}
  });
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 320, height: 300, left: 0, top: 0, right: 320, bottom: 300, x: 0, y: 0, toJSON() {} });
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  vi.spyOn(HTMLElement.prototype, "animate").mockImplementation(function (this: HTMLElement, frames, options) {
    const animation = { currentTime: 0, playState: "running", onfinish: null,
      pause: vi.fn(function () { animation.playState = "paused"; }), play: vi.fn(function () { animation.playState = "running"; }), cancel: vi.fn(function () { animation.playState = "idle"; }) };
    animations.push({ node: this, frames: frames as Keyframe[], options: options as KeyframeAnimationOptions, animation: animation as unknown as Animation });
    return animation as unknown as Animation;
  });
  useThemeStore.setState({ resolved: "light" });
  useEntityStateStore.setState({ optimisticLockUntil: {} });
  useEntityStateStore.getState().setStates([
    { entity_id: "sun.sun", state: "above_horizon", attributes: { elevation: 7, rising: true } },
    { entity_id: "weather.preview", state: "sunny", attributes: { temperature: 12, forecast: [] } },
    { entity_id: sensorId, state: "1", attributes: { flights: [flight] } },
  ]);
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount()); host.remove(); document.documentElement.removeAttribute("data-dashboard-edit");
  for (const node of document.body.querySelectorAll(".fixed.inset-0")) node.remove();
  expect(animations.every(a => a.animation.playState === "idle")).toBe(true);
  vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers();
});
async function render(options: { motion?: string; paused?: boolean; frozen?: number; stacked?: boolean; show?: boolean; height?: number; condition?: string } = {}) {
  await act(async () => root.render(createElement(WeatherSky, { condition: options.condition ?? "sunny", large: true, motion: options.motion ?? "on", skyPaused: options.paused,
    show_planes: options.show ?? true, planes_entity_id: sensorId, inSmartStack: options.stacked, preview: options.frozen != null ? { time: 0, planesAt: options.frozen } : undefined })));
}
const advance = async (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
const nodes = () => host.querySelectorAll("[data-weather-plane]");

describe("weather planes compositor lifecycle", () => {
  it("starts after three seconds, adds no rAF, then removes and cancels on finish", async () => {
    await render(); await advance(2999); expect(nodes()).toHaveLength(0); await advance(1); expect(nodes()).toHaveLength(1);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    const crossing = animations.find(a => a.node.hasAttribute("data-weather-plane"))!;
    expect(crossing.options).toMatchObject({ duration: 16000, easing: "linear", fill: "forwards" });
    await act(async () => { crossing.animation.onfinish?.call(crossing.animation, {} as AnimationPlaybackEvent); });
    expect(nodes()).toHaveLength(0); expect(animations.every(a => a.animation.playState === "idle")).toBe(true);
  });
  it.each(["off", "reduced", "disabled"])("mounts no plane or label for %s", async mode => {
    reduced = mode === "reduced"; await render({ motion: mode === "off" ? "off" : "on", show: mode !== "disabled", frozen: 8 });
    expect(nodes()).toHaveLength(0); expect(host.querySelector("[data-weather-plane-label]")).toBeNull(); expect(animations).toHaveLength(0);
  });
  it.each(["external", "hidden", "offscreen", "edit", "screensaver"])("pauses animations for %s and clears them after five seconds", async reason => {
    await render(); await advance(3000); expect(nodes()).toHaveLength(1);
    await act(async () => {
      if (reason === "hidden") { vi.spyOn(document, "hidden", "get").mockReturnValue(true); document.dispatchEvent(new Event("visibilitychange")); }
      if (reason === "offscreen") visible(false);
      if (reason === "edit") document.documentElement.setAttribute("data-dashboard-edit", "true");
      if (reason === "screensaver") { const overlay = document.createElement("div"); overlay.className = "fixed inset-0 z-[9999]"; document.body.append(overlay); }
      if (reason === "external") root.render(createElement(WeatherSky, { condition: "sunny", large: true, motion: "on", show_planes: true, planes_entity_id: sensorId, skyPaused: true }));
    });
    await advance(0);
    expect(host.querySelector(".weather-sky")?.getAttribute("data-sky-paused")).toBe("true");
    expect(animations.every(a => a.animation.playState === "paused")).toBe(true);
    await advance(5001);
    if (reason === "external" || reason === "edit") {
      expect(nodes()).toHaveLength(1);
      const exits = animations.filter(a => a.options.duration === 300);
      expect(exits.length).toBeGreaterThan(0);
      expect(exits.every(a => a.animation.playState === "running")).toBe(true);
      await act(async () => { for (const a of exits) a.animation.onfinish?.call(a.animation, {} as AnimationPlaybackEvent); });
    }
    expect(nodes()).toHaveLength(0);
  });
  it("resumes a short pause without restarting the crossing", async () => {
    await render(); await advance(3000); const node = nodes()[0]; const first = animations[0].animation;
    first.currentTime = 500; await render({ paused: true }); await advance(1000); await render();
    expect(nodes()[0]).toBe(node); expect(first.currentTime).toBe(500); expect(first.play).toHaveBeenCalled();
  });
  it("fades a crossing over 1.5s when its sensor becomes unavailable", async () => {
    await render(); await advance(3000);
    await act(async () => { useEntityStateStore.getState().updateEntityState(sensorId, { state: "unavailable" }); });
    const fade = animations.find(a => a.options.duration === 1500)!; expect(fade).toBeDefined();
    await act(async () => { fade.animation.onfinish?.call(fade.animation, {} as AnimationPlaybackEvent); });
    expect(nodes()).toHaveLength(0);
  });
  it("cancels a retiring fade too when a pause exceeds five seconds", async () => {
    await render(); await advance(3000);
    await act(async () => { useEntityStateStore.getState().updateEntityState(sensorId, { state: "unavailable" }); });
    await render({ paused: true }); await advance(5001);
    const exit = animations.find(a => a.options.duration === 300)!;
    expect(exit.animation.playState).toBe("running");
    await act(async () => { exit.animation.onfinish?.call(exit.animation, {} as AnimationPlaybackEvent); });
    expect(nodes()).toHaveLength(0); expect(animations.every(a => a.animation.playState === "idle")).toBe(true);
  });
  it.each(["pouring", "fog"])("fades when weather becomes %s", async condition => {
    await render(); await advance(3000); await render({ condition });
    expect(animations.some(a => a.options.duration === 1500)).toBe(true);
  });
  it("renders night lights without contrails, and Calm suppresses strobe", async () => {
    await act(async () => { useEntityStateStore.getState().updateEntityState("sun.sun", { attributes: { elevation: -7, rising: false } }); });
    await render({ frozen: 8, condition: "clear-night" });
    expect(host.querySelector(".weather-plane-beacon")).not.toBeNull(); expect(host.querySelector(".weather-plane-strobe")).not.toBeNull(); expect(host.querySelector(".weather-plane-contrail")).toBeNull();
    await render({ motion: "calm", frozen: 8, condition: "clear-night" }); expect(host.querySelector(".weather-plane-strobe")).toBeNull();
  });
  it.each([false, true])("places the label above the content stacking context; stack=%s", async stacked => {
    await act(async () => root.render(createElement(WeatherCardWidget, { title: "Preview weather", entity_id: "weather.preview", show_planes: true,
      planes_entity_id: sensorId, sky_motion: "on", inSmartStack: stacked, height: 300, skyPreview: { time: 0, planesAt: 8 } })));
    const label = host.querySelector<HTMLElement>("[data-weather-plane-label]");
    if (stacked) expect(label).toBeNull();
    else {
      expect(label?.textContent).toBe("FKE1234 · B738"); expect(label?.classList.contains("z-[11]")).toBe(true);
      expect(label?.parentElement).toBe(host.firstElementChild); expect(label?.closest(".weather-sky")).toBeNull();
      const fade = animations.find(a => a.node === label && a.frames.some(f => f.offset === .45)); expect(fade).toBeDefined();
    }
  });
  it("keeps compact labels absent and does not replay a crossing after Off", async () => {
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({ width: 320, height: 160, left: 0, top: 0, right: 320, bottom: 160, x: 0, y: 0, toJSON() {} });
    await act(async () => root.render(createElement(WeatherCardWidget, { title: "Preview weather", entity_id: "weather.preview", height: 160,
      show_planes: true, planes_entity_id: sensorId, sky_motion: "on", skyPreview: { time: 0, planesAt: 8 } })));
    expect(nodes()).toHaveLength(1); expect(host.querySelector("[data-weather-plane-label]")).toBeNull();
    await render(); await advance(3000); expect(nodes()).toHaveLength(1);
    await render({ motion: "off" }); expect(nodes()).toHaveLength(0);
    await render(); await advance(10000); expect(nodes()).toHaveLength(0);
  });
  it("keeps both 600ms label fades within a short scaled crossing", async () => {
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({ width: 200, height: 300, left: 0, top: 0, right: 200, bottom: 300, x: 0, y: 0, toJSON() {} });
    useEntityStateStore.getState().updateEntityState(sensorId, { attributes: { flights: [{ ...flight, ground_speed: 900 }] } });
    await act(async () => root.render(createElement(WeatherCardWidget, { title: "Preview weather", entity_id: "weather.preview", height: 300,
      show_planes: true, planes_entity_id: sensorId, sky_motion: "on", skyPreview: { time: 0, planesAt: 5 } })));
    const fade = animations.find(a => a.node.hasAttribute("data-weather-plane-label") && a.frames.some(f => f.offset === .45))!;
    const duration = Number(fade.options.duration);
    expect(duration).toBeCloseTo(10000 * Math.sqrt(200 / 320));
    expect((Number(fade.frames[2].offset) - Number(fade.frames[1].offset)) * duration).toBeCloseTo(600);
    expect((Number(fade.frames[4].offset) - Number(fade.frames[3].offset)) * duration).toBeCloseTo(600);
    expect(fade.frames.every(f => Number(f.offset) <= 1)).toBe(true);
  });
  it("holds invisible forwards-filled end states until plane and label unmount", async () => {
    await act(async () => root.render(createElement(WeatherCardWidget, { title: "Preview weather", entity_id: "weather.preview", height: 300,
      show_planes: true, planes_entity_id: sensorId, sky_motion: "on" })));
    await advance(3000);
    const label = host.querySelector<HTMLElement>("[data-weather-plane-label]")!;
    const plane = nodes()[0] as HTMLElement;
    expect(label).not.toBeNull(); expect(plane).toBeDefined();
    await act(async () => {
      for (const node of [label, plane]) {
        const pair = animations.filter(a => a.node === node);
        const motion = pair.find(a => "transform" in a.frames[0])!;
        const opacity = pair.find(a => "opacity" in a.frames[0])!;
        for (const a of pair) { a.animation.currentTime = Number(a.options.duration); Object.assign(a.animation, { playState: "finished" }); }
        motion.animation.onfinish?.call(motion.animation, {} as AnimationPlaybackEvent);
        if (node.isConnected) {
          expect(opacity.frames.at(-1)?.opacity).toBe(0); expect(opacity.options.fill).toBe("forwards");
          expect(opacity.animation.cancel).not.toHaveBeenCalled(); expect(motion.animation.cancel).not.toHaveBeenCalled();
        }
      }
    });
    expect(nodes()).toHaveLength(0); expect(host.querySelector("[data-weather-plane-label]")).toBeNull();
    expect(animations.every(a => a.animation.playState === "idle")).toBe(true);
  });
  it("fades both the visible plane and its label during a long edit pause", async () => {
    await act(async () => root.render(createElement(WeatherCardWidget, { title: "Preview weather", entity_id: "weather.preview", height: 300,
      show_planes: true, planes_entity_id: sensorId, sky_motion: "on" })));
    await advance(3000);
    await act(async () => { document.documentElement.setAttribute("data-dashboard-edit", "true"); }); await advance(5001);
    const exits = animations.filter(a => a.options.duration === 300);
    expect(exits).toHaveLength(2); expect(exits.every(a => a.animation.playState === "running")).toBe(true);
    await act(async () => {
      for (const exit of exits.toReversed()) {
        exit.animation.currentTime = 300; Object.assign(exit.animation, { playState: "finished" });
        exit.animation.onfinish?.call(exit.animation, {} as AnimationPlaybackEvent);
        if (exit.node.isConnected) { expect(exit.animation.cancel).not.toHaveBeenCalled(); expect(exit.frames.at(-1)?.opacity).toBe(0); }
      }
    });
    expect(nodes()).toHaveLength(0); expect(host.querySelector("[data-weather-plane-label]")).toBeNull();
  });
  it.each([300, 160])("shares the particle mask only on the plane layer at height %s", async height => {
    vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({ width: 320, height, left: 0, top: 0, right: 320, bottom: height, x: 0, y: 0, toJSON() {} });
    await act(async () => root.render(createElement(WeatherCardWidget, { title: "Preview weather", entity_id: "weather.preview", height,
      show_planes: true, planes_entity_id: sensorId, sky_motion: "on", skyPreview: { time: 0, planesAt: 8 } })));
    const layer = host.querySelector<HTMLElement>(".weather-planes")!;
    expect(layer.style.maskImage).toBe(SKY_CANVAS_MASK); expect(layer.style.maskComposite).toBe("intersect");
    const label = host.querySelector<HTMLElement>("[data-weather-plane-label]");
    if (label) { expect(label.closest(".weather-planes")).toBeNull(); expect(label.style.maskImage).toBe(""); }
    const trailWidth = parseFloat(host.querySelector<HTMLElement>(".weather-plane-contrail")!.style.width);
    expect(trailWidth).toBeCloseTo(Math.min(.42 * 320, 140) * (1 - 27000 / 33000 * .35));
  });
  it.each([true, false])("does not re-render the widget on unrelated HA changes (auto=%s)", async automatic => {
    const commits = vi.fn();
    await act(async () => root.render(createElement(Profiler, { id: "weather", onRender: commits }, createElement(WeatherCardWidget, {
      title: "Preview weather", entity_id: "weather.preview", height: 300, sky_motion: "on",
      ...(automatic ? {} : { show_planes: true, planes_entity_id: sensorId }), skyPreview: { time: 0, planesAt: 8 },
    }))));
    expect(nodes()).toHaveLength(1); commits.mockClear();
    await act(async () => { useEntityStateStore.getState().updateEntityState("light.fictional", { state: "on", attributes: {} }); });
    expect(commits).not.toHaveBeenCalled();
    if (automatic) {
      await act(async () => { useEntityStateStore.getState().updateEntityState(sensorId + "_2", { state: "0", attributes: { flights: [] } }); });
      expect(commits).toHaveBeenCalled(); expect(nodes()).toHaveLength(0);
    }
  });
  it("assigns unique gradient identifiers to multiple SVG instances", async () => {
    await render({ frozen: 8 });
    const gradient = host.querySelector("linearGradient")!; expect(gradient.id).not.toBe("plane-g");
    expect(host.querySelector('path[fill^="url"]')?.getAttribute("fill")).toBe(`url(#${gradient.id})`);
  });
});
