import { describe, expect, it } from "vitest";
import {
  DEFAULT_SCREENSAVER_CLOCK_POSITION,
  SCREENSAVER_CLOCK_POSITIONS,
  clockPositionAxis,
  clockPositionOverlayClass,
  getScreensaverClockPositionOrDefault,
  isScreensaverClockPosition,
  screensaverMediaSide,
} from "./screensaver-clock-position";

describe("screensaver clock position", () => {
  it("defaults to center", () => {
    expect(DEFAULT_SCREENSAVER_CLOCK_POSITION).toBe("center");
    expect(getScreensaverClockPositionOrDefault(undefined)).toBe("center");
    expect(getScreensaverClockPositionOrDefault("nope")).toBe("center");
  });

  it("accepts the nine screen positions", () => {
    expect(SCREENSAVER_CLOCK_POSITIONS).toHaveLength(9);
    expect(isScreensaverClockPosition("center")).toBe(true);
    expect(isScreensaverClockPosition("top-left")).toBe(true);
    expect(isScreensaverClockPosition("bottom")).toBe(false);
  });

  it("maps overlay alignment classes", () => {
    expect(clockPositionAxis("top-left")).toEqual({ x: "left", y: "top" });
    expect(clockPositionAxis("center")).toEqual({ x: "center", y: "middle" });
    expect(clockPositionAxis("bottom-right")).toEqual({ x: "right", y: "bottom" });
    expect(clockPositionOverlayClass("top-center")).toContain("items-start");
    expect(clockPositionOverlayClass("top-center")).toContain("justify-center");
    expect(clockPositionOverlayClass("bottom-right")).toContain("items-end");
    expect(clockPositionOverlayClass("bottom-right")).toContain("justify-end");
  });

  it("moves media to the opposite bottom corner when the clock is on the left", () => {
    expect(screensaverMediaSide("bottom-right")).toBe("left");
    expect(screensaverMediaSide("bottom-left")).toBe("right");
    expect(screensaverMediaSide("middle-left")).toBe("right");
    expect(screensaverMediaSide("center")).toBe("left");
  });
});
