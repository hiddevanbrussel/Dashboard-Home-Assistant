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
    expect(flowRunsTowardHouse("solar", { gridKw: -0.2, batteryKw: null })).toBe(false);
    expect(flowRunsTowardHouse("grid", { gridKw: -0.25, batteryKw: null })).toBe(false);
    expect(flowRunsTowardHouse("battery", { gridKw: null, batteryKw: -0.7 })).toBe(false);
    expect(flowRunsTowardHouse("battery", { gridKw: null, batteryKw: 0.5 })).toBe(true);
    expect(flowRunsTowardHouse("house", { gridKw: -1, batteryKw: -1 })).toBe(true);
    const edge = labelEdgePoint({ left: 460.5, top: 400, right: 672, bottom: 450 }, { x: 369.6, y: 228 });
    expect(edge).toEqual({ x: 460.5, y: 400 });
    expect(flowPath(edge, { x: 369.6, y: 228 }, false)).toBe("M369.6 228.0 L460.5 400.0");
    expect(houseAriaName("nl")).toBe("Huis");
    expect(houseAriaName("en")).toBe("House");
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
