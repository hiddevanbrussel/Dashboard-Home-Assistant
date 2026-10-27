import { describe, expect, it } from "vitest";
import { displayedVolume, stepVolume, trackTapVolume } from "./music-volume";

describe("music volume", () => {
  it("limits an upward track tap to +10 and lets a downward tap through", () => {
    expect(trackTapVolume(32, 90)).toBe(42);
    expect(trackTapVolume(32, 10)).toBe(10);
    expect(trackTapVolume(95, 100)).toBe(100);
  });

  it("steps by the given delta and stops at 0 and 100", () => {
    expect(stepVolume(98, 5)).toBe(100);
    expect(stepVolume(3, -5)).toBe(0);
  });

  it("shows 0 while muted and turns NaN into 0", () => {
    expect(displayedVolume(40, true)).toBe(0);
    expect(displayedVolume(40, false)).toBe(40);
    expect(trackTapVolume(Number.NaN, 90)).toBe(0);
    expect(trackTapVolume(32, Number.NaN)).toBe(0);
    expect(stepVolume(Number.NaN, 5)).toBe(0);
    expect(displayedVolume(Number.NaN, false)).toBe(0);
  });
});
