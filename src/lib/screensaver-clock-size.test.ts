import { describe, expect, it } from "vitest";
import {
  DEFAULT_SCREENSAVER_CLOCK_SIZE,
  clockSizeMetaAboveClass,
  clockSizeMetaBelowClass,
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
    expect(clockSizeTimeClass("sm")).toContain("text-7xl");
    expect(clockSizeTimeClass("md")).toContain("text-9xl");
    expect(clockSizeTimeClass("lg")).toContain("text-[7.5rem]");
    expect(clockSizeTimeClass("xl")).toContain("26vw");
    expect(clockSizeTimeClass("xl")).toContain("17rem");
  });

  it("pulls date and weather closer on larger clocks", () => {
    expect(clockSizeMetaAboveClass("sm")).toContain("-mb-");
    expect(clockSizeMetaBelowClass("sm")).toContain("-mt-");
    expect(clockSizeMetaAboveClass("xl")).toBe("-mb-12");
    expect(clockSizeMetaBelowClass("xl")).toBe("-mt-10");
  });

  it("keeps settings previews in the same size order", () => {
    expect(clockSizePreviewDigitClass("sm")).toContain("text-2xl");
    expect(clockSizePreviewDigitClass("md")).toContain("text-3xl");
    expect(clockSizePreviewDigitClass("lg")).toContain("text-4xl");
    expect(clockSizePreviewDigitClass("xl")).toContain("text-6xl");
  });
});
