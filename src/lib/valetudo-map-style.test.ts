import { describe, expect, it } from "vitest";
import { mixTowardWhite, sheetSegmentColor } from "./valetudo-map-style";

describe("valetudo map sheet style", () => {
  it("picks a stable pastel per room and darkens the selected room", () => {
    const idle = sheetSegmentColor("kitchen", false);
    const selected = sheetSegmentColor("kitchen", true);
    expect(sheetSegmentColor("kitchen", false)).toEqual(idle);
    expect(selected[0]).toBeLessThan(idle[0]);
    expect(selected[1]).toBeLessThanOrEqual(idle[1]);
  });

  it("mixes a fill toward white for the grid overlay", () => {
    expect(mixTowardWhite(0, 0, 0, 0.2)).toEqual([51, 51, 51]);
    expect(mixTowardWhite(100, 150, 200, 0)).toEqual([100, 150, 200]);
  });
});
