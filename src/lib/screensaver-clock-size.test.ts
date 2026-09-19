import { describe, expect, it } from "vitest";
import {
  DEFAULT_SCREENSAVER_CLOCK_SIZE,
  clockSizePreviewDigitClass,
  clockSizeTimeClass,
  getScreensaverClockSizeOrDefault,
  isScreensaverClockSize,
} from "./screensaver-clock-size";

describe("screensaver clock size", () => {
  it("defaults to extra large", () => {
    expect(DEFAULT_SCREENSAVER_CLOCK_SIZE).toBe("xl");
    expect(getScreensaverClockSizeOrDefault(undefined)).toBe("xl");
    expect(getScreensaverClockSizeOrDefault("huge")).toBe("xl");
  });

  it("accepts the four sizes", () => {
    expect(isScreensaverClockSize("sm")).toBe(true);
    expect(isScreensaverClockSize("xl")).toBe(true);
    expect(isScreensaverClockSize("xxl")).toBe(false);
  });

  it("maps larger sizes to larger type classes", () => {
    expect(clockSizeTimeClass("sm")).toContain("text-6xl");
    expect(clockSizeTimeClass("md")).toContain("text-8xl");
    expect(clockSizeTimeClass("lg")).toContain("text-[6.5rem]");
    expect(clockSizeTimeClass("xl")).toContain("22vw");
    expect(clockSizeTimeClass("xl")).toContain("15rem");
  });

  it("keeps settings previews in the same size order", () => {
    expect(clockSizePreviewDigitClass("sm")).toContain("text-xl");
    expect(clockSizePreviewDigitClass("md")).toContain("text-2xl");
    expect(clockSizePreviewDigitClass("lg")).toContain("text-3xl");
    expect(clockSizePreviewDigitClass("xl")).toContain("text-5xl");
  });
});
