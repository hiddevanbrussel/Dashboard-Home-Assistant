import { describe, expect, it } from "vitest";
import {
  DEFAULT_SCREENSAVER_CLOCK_WEIGHT,
  clockWeightClass,
  getScreensaverClockWeightOrDefault,
  isScreensaverClockWeight,
} from "./screensaver-clock-weight";

describe("screensaver clock weight", () => {
  it("defaults to extrabold", () => {
    expect(DEFAULT_SCREENSAVER_CLOCK_WEIGHT).toBe("extrabold");
    expect(getScreensaverClockWeightOrDefault(undefined)).toBe("extrabold");
    expect(getScreensaverClockWeightOrDefault("heavy")).toBe("extrabold");
  });

  it("accepts the four weights", () => {
    expect(isScreensaverClockWeight("medium")).toBe(true);
    expect(isScreensaverClockWeight("bold")).toBe(true);
    expect(isScreensaverClockWeight("extrabold")).toBe(true);
    expect(isScreensaverClockWeight("black")).toBe(true);
    expect(isScreensaverClockWeight("light")).toBe(false);
  });

  it("maps weights to font classes", () => {
    expect(clockWeightClass("medium")).toBe("font-medium");
    expect(clockWeightClass("bold")).toBe("font-bold");
    expect(clockWeightClass("extrabold")).toBe("font-extrabold");
    expect(clockWeightClass("black")).toBe("font-black");
  });
});
