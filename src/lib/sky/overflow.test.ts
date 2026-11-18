import { describe, expect, it } from "vitest";
import { overflowMargins, rainAngle } from "../weather-sky";
import { overflowEnabled, overflowMask, overflowParticleCount, overflowRect, overflowStrips, touchesOverflow, writeOccluders } from "./overflow";
const base = { mode: "animated-full" as const, performanceStep: 0, condition: "rainy", floating: true, stacked: false, reducedMotion: false, paused: false };
const margins = { left: 8, right: 8, bottom: 40 };
describe("overflow gating", () => {
  it.each(["rainy", "pouring", "lightning-rainy", "snowy", "snowy-rainy", "hail"])("enables full floating precipitation: %s", condition => expect(overflowEnabled({ ...base, condition })).toBe("on"));
  it.each(["fog", "windy", "windy-variant", "lightning", "sunny", "cloudy", "clear-night", "exceptional", "unavailable", "unknown"])("does not spill %s", condition => expect(overflowEnabled({ ...base, condition })).toBe("off"));
  it.each([{ mode: "animated-calm" as const }, { mode: "static" as const }, { performanceStep: 1 }, { performanceStep: 2 }, { floating: false }, { stacked: true }, { reducedMotion: true }, { paused: true }, { hidden: true }, { visible: false }, { screensaver: true }])("disables %j", flags => expect(overflowEnabled({ ...base, ...flags })).toBe("off"));
  it.each(["editMode", "dragging", "resizing", "plotIn", "sheetOpen", "popupOpen"])("fades for %s, clears immediately when hidden", flag => {
    expect(overflowEnabled({ ...base, paused: true, [flag]: true })).toBe("fading-out");
    expect(overflowEnabled({ ...base, paused: true, hidden: true, [flag]: true })).toBe("off");
  });
});
describe("overflow geometry and occlusion", () => {
  it("keeps the existing margin helper and downwind side", () => {
    expect(overflowMargins(0, 90)).toEqual({ top: 0, bottom: 40, left: 8, right: 8, fullStrength: 12, fade: 28 });
    expect(overflowMargins(25, 90).left).toBe(24); expect(overflowMargins(25, 90).right).toBe(8);
    expect(overflowMargins(25, 270).right).toBe(24); expect(overflowMargins(25, 270).left).toBe(8);
    expect(overflowMargins(25, 0).left).toBe(8); expect(overflowMargins(25, NaN).right).toBe(8);
    expect(overflowMargins(rainAngle(10), 90).left).toBe(Math.max(8, Math.round(Math.min(24, Math.tan(6 * Math.PI / 180) * 40 + 6))));
  });
  it.each([300, 160])("builds the U and bottom corner squares for height %s", height => {
    expect(overflowRect({ x: 100, y: 20, width: 320, height }, margins)).toEqual({ x: 92, y: 20, width: 336, height: height + 40 });
    expect(overflowRect({ x: 100, y: 20, width: 320, height }, { ...margins, left: 24 }).width).toBe(352);
    const strips = overflowStrips(320, height, margins);
    expect(strips).toHaveLength(5); expect(strips[0]).toEqual({ x: 0, y: 0, width: 8, height: height + 40 });
    expect(strips[2]).toEqual({ x: 8, y: height, width: 320, height: 40 });
    expect(strips[3]).toEqual({ x: 8, y: height - 28, width: 28, height: 28 });
    expect(strips[4]).toEqual({ x: 300, y: height - 28, width: 28, height: 28 });
  });
  it("clips intersecting neighbours and header to preallocated local rectangles", () => {
    const output = new Float32Array(8);
    expect(writeOccluders({ x: 100, y: 20, width: 336, height: 340 }, [
      { x: 0, y: 0, width: 500, height: 40 }, { x: 400, y: 300, width: 80, height: 100 },
      { x: 110, y: 100, width: 40, height: 40 },
    ], output)).toBe(2);
    expect([...output]).toEqual([0, 0, 336, 20, 300, 280, 36, 60]);
    expect(writeOccluders({ x: 0, y: 0, width: 20, height: 20 }, [{ x: 21, y: 0, width: 8, height: 8 }], output)).toBe(0);
    expect(writeOccluders({ x: 0, y: 0, width: 20, height: 20 }, [{ x: -1, y: -1, width: 30, height: 30 }], output)).toBe(1);
    expect([...output.slice(0, 4)]).toEqual([0, 0, 20, 20]);
  });
  it("filters the interior and wind but retains edge-crossing streaks and bottom corners", () => {
    expect(touchesOverflow(0, 10, 100, 20, 120, 320, 300, margins)).toBe(false);
    expect(touchesOverflow(0, -2, 100, 10, 120, 320, 300, margins)).toBe(true);
    expect(touchesOverflow(1, 5, 280, 10, 285, 320, 300, margins)).toBe(true);
    expect(touchesOverflow(2, 100, 310, 105, 315, 320, 300, margins)).toBe(true);
    expect(touchesOverflow(3, -2, 100, 10, 120, 320, 300, margins)).toBe(false);
    expect(touchesOverflow(0, -2, -30, 10, -1, 320, 300, margins)).toBe(false);
    expect(overflowMask(320, 300, margins)).toContain("312px, transparent 340px");
  });
  it("keeps one count cap, scaled from the original tile area", () => {
    expect(overflowParticleCount(160, 320, 300, margins)).toBe(190);
    expect(overflowParticleCount(160, 320, 300, { ...margins, left: 24 })).toBe(199);
    expect(overflowParticleCount(85, 320, 160, margins)).toBe(112);
    expect(overflowParticleCount(85, 320, 160, { ...margins, right: 24 })).toBe(117);
    expect(overflowParticleCount(200, 500, 420, { ...margins, left: 24 })).toBe(200);
  });
});


it("rounds fractional lee margins on both wind sides", () => {
  expect(overflowMargins(18, 90).left).toBe(19);
  expect(overflowMargins(18, 270).right).toBe(19);
  for (let angle = 0; angle <= 25; angle += .25) {
    expect(Number.isInteger(overflowMargins(angle, 90).left)).toBe(true);
    expect(Number.isInteger(overflowMargins(angle, 270).right)).toBe(true);
  }
});
