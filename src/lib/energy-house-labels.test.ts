import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  energyStageFromContent,
  flowPath,
  flowRunsTowardHouse,
  houseAriaName,
  labelAnchor,
  labelEdgePoint,
  labelFlowEnabled,
  labelPosition,
} from "./energy-house-labels";

describe("energy stage", () => {
  it("matches the Redmi landscape and portrait boxes", () => {
    const landscape = energyStageFromContent({ contentWidth: 1192, viewportHeight: 800, orientation: "landscape" });
    expect(landscape.houseWidth).toBe(758);
    expect(landscape.houseHeight).toBe(574);
    expect(landscape.houseTop).toBe(64);
    expect(landscape.houseLeft).toBe(217);
    expect(landscape.sentenceTop).toBe(646);
    expect(landscape.bandTop - landscape.sentenceTop).toBe(38);
    expect(landscape.sentenceTop - (landscape.houseTop + landscape.houseHeight)).toBe(8);

    const portrait = energyStageFromContent({ contentWidth: 712, viewportHeight: 1280, orientation: "portrait" });
    expect(portrait.houseWidth).toBe(680);
    expect(portrait.houseHeight).toBe(515);
    expect(portrait.houseTop).toBe(98);
    expect(portrait.houseLeft).toBe(8);
    expect(portrait.sentenceTop).toBe(621);
    expect(portrait.bandTop).toBe(659);
    expect(portrait.houseWidth / portrait.houseHeight).toBeCloseTo(560 / 424, 2);
    expect(landscape.houseWidth / landscape.houseHeight).toBeCloseTo(560 / 424, 2);
  });

  it("places the four labels and reverses export and charge", () => {
    expect(labelPosition("solar", "landscape")).toEqual({ left: 67, top: 6 });
    expect(labelPosition("house", "portrait")).toEqual({ left: 6, top: 22 });
    expect(labelAnchor("grid", "landscape")).toEqual({ x: 37, y: 76 });
    expect(labelAnchor("grid", "portrait")).toEqual({ x: 45, y: 72 });
    expect(labelAnchor("battery", "landscape")).toEqual({ x: 66, y: 57 });
    expect(flowRunsTowardHouse("solar", { gridKw: 0.2, batteryKw: null })).toBe(true);
    expect(flowRunsTowardHouse("solar", { gridKw: -0.2, batteryKw: null })).toBe(true);
    expect(flowRunsTowardHouse("grid", { gridKw: -0.25, batteryKw: null })).toBe(false);
    expect(flowRunsTowardHouse("battery", { gridKw: null, batteryKw: -0.7 })).toBe(false);
    expect(flowRunsTowardHouse("battery", { gridKw: null, batteryKw: 0.5 })).toBe(true);
    expect(flowRunsTowardHouse("house", { gridKw: -1, batteryKw: -1 })).toBe(true);
    const edge = labelEdgePoint({ left: 460.5, top: 400, right: 672, bottom: 450 }, { x: 369.6, y: 228 });
    expect(edge).toEqual({ x: 460.5, y: 400 });
    expect(flowPath(edge, { x: 369.6, y: 228 }, false)).toBe("M369.6 228.0 L460.5 400.0");
    expect(houseAriaName("nl")).toBe("Huis");
    expect(houseAriaName("en")).toBe("House");
    expect(labelAnchor("solar", "landscape", "front")).toEqual({ x: 52, y: 10 });
    expect(labelAnchor("solar", "portrait", "front")).toEqual({ x: 52, y: 10 });
    expect(labelPosition("house", "landscape", "front")).toEqual({ left: 10, top: 24 });
    expect(labelPosition("grid", "portrait", "front")).toEqual({ left: 4, top: 70 });
    expect(labelPosition("battery", "portrait", "front")).toEqual({ left: 78, top: 66 });
    expect(labelPosition("solar", "landscape", "back")).toEqual({ left: 74, top: 8 });
    expect(labelPosition("solar", "portrait", "back")).toEqual({ left: 72, top: 3 });
    expect(labelAnchor("solar", "landscape", "back")).toEqual({ x: 55, y: 20 });
    expect(labelPosition("house", "landscape", "back")).toEqual({ left: 4, top: 18 });
    expect(labelPosition("house", "portrait", "back")).toEqual({ left: 0, top: 14 });
    expect(labelAnchor("house", "portrait", "back")).toEqual({ x: 42, y: 33 });
    expect(labelPosition("grid", "landscape", "back")).toEqual({ left: 2, top: 80 });
    expect(labelPosition("grid", "portrait", "back")).toEqual({ left: 0, top: 80 });
    expect(labelAnchor("grid", "landscape", "back")).toEqual({ x: 16, y: 74 });
    expect(labelPosition("battery", "landscape", "back")).toEqual({ left: 0, top: 44 });
    expect(labelPosition("battery", "portrait", "back")).toEqual({ left: 0, top: 42 });
    expect(labelAnchor("battery", "portrait", "back")).toEqual({ x: 19, y: 54 });
    expect(labelPosition("aircon", "landscape", "back")).toEqual({ left: 69, top: 39 });
    expect(labelPosition("aircon", "portrait", "back")).toEqual({ left: 70, top: 37 });
    expect(labelAnchor("aircon", "landscape", "back")).toEqual({ x: 63.1, y: 42.8 });
    expect(labelAnchor("aircon", "portrait", "back")).toEqual({ x: 63.1, y: 42.8 });
    expect(
      labelFlowEnabled("aircon", { animate: true, solarOn: true, gridOn: true, batteryOn: true, houseKw: 1 })
    ).toBe(false);
    expect(flowRunsTowardHouse("aircon", { gridKw: -1, batteryKw: -1 })).toBe(true);
  });

  it("keeps the solar flow toward the house, including export", () => {
    expect(flowRunsTowardHouse("solar", { gridKw: 1.2, batteryKw: 0.4 })).toBe(true);
    expect(flowRunsTowardHouse("solar", { gridKw: -0.2, batteryKw: null })).toBe(true);
    expect(flowRunsTowardHouse("solar", { gridKw: -1.4, batteryKw: -0.5 })).toBe(true);
    expect(flowRunsTowardHouse("solar", { gridKw: null, batteryKw: null })).toBe(true);
    expect(flowRunsTowardHouse("grid", { gridKw: -0.2, batteryKw: null })).toBe(false);
  });

  it("keeps the flow rules in css, including reduced motion", () => {
    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain("stroke-dasharray: 18 500");
    expect(css).toContain("animation: energy-label-flow 9s linear infinite");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".energy-label-flow");
    expect(css).toContain("blur(18px) saturate(1.3)");
  });
});
