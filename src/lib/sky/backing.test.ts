import { describe, expect, it } from "vitest";
import { canvasBacking } from "./backing";

describe("canvas backing scales", () => {
  it("keeps even CSS dimensions exactly at DPR 1.5", () => {
    expect(canvasBacking(320, 300, 1.5)).toEqual({ width: 480, height: 450, scaleX: 1.5, scaleY: 1.5 });
  });
  it("fits the rounded overflow backing independently on each axis", () => {
    expect(canvasBacking(347, 340, 1.5)).toEqual({ width: 521, height: 510, scaleX: 521 / 347, scaleY: 1.5 });
  });
  it("fits odd tile dimensions", () => {
    expect(canvasBacking(321, 160, 1.5)).toEqual({ width: 482, height: 240, scaleX: 482 / 321, scaleY: 1.5 });
  });
  it("keeps a minimum backing without dividing by zero", () => {
    expect(canvasBacking(0, 0, 1.5)).toEqual({ width: 1, height: 1, scaleX: 1.5, scaleY: 1.5 });
  });
  it("keeps integer CSS dimensions at scale one for DPR one", () => {
    for (let w = 1; w <= 700; w++) expect(canvasBacking(w, 301, 1)).toEqual({ width: w, height: 301, scaleX: 1, scaleY: 1 });
  });
  it("maps many CSS extents to their exact backing bounds", () => {
    for (const dpr of [1, 1.25, 1.5]) for (let w = 1; w <= 700; w++) {
      const b = canvasBacking(w, w + 3, dpr);
      expect(Math.round(w * b.scaleX)).toBe(b.width);
      expect(Math.round((w + 3) * b.scaleY)).toBe(b.height);
    }
  });
});
