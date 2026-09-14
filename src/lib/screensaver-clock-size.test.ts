import { describe, expect, it } from "vitest";
import {
  DEFAULT_SCREENSAVER_CLOCK_SIZE,
  clockSizeTimeClass,
  getScreensaverClockSizeOrDefault,
  isScreensaverClockSize,
} from "./screensaver-clock-size";

describe("screensaver clock size", () => {
  it("defaults to medium", () => {
    expect(DEFAULT_SCREENSAVER_CLOCK_SIZE).toBe("md");
    expect(getScreensaverClockSizeOrDefault(undefined)).toBe("md");
    expect(getScreensaverClockSizeOrDefault("huge")).toBe("md");
  });

  it("accepts the four sizes", () => {
    expect(isScreensaverClockSize("sm")).toBe(true);
    expect(isScreensaverClockSize("xl")).toBe(true);
    expect(isScreensaverClockSize("xxl")).toBe(false);
  });

  it("maps larger sizes to larger type classes", () => {
    expect(clockSizeTimeClass("sm")).toContain("text-4xl");
    expect(clockSizeTimeClass("md")).toContain("text-5xl");
    expect(clockSizeTimeClass("lg")).toContain("text-7xl");
    expect(clockSizeTimeClass("xl")).toContain("text-8xl");
  });
});
