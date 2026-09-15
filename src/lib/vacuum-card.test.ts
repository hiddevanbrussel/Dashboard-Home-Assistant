import { describe, expect, it } from "vitest";
import {
  batteryFromAttributes,
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  currentFanSpeedFromAttributes,
  fanModeFromSpeed,
  fanSpeedListFromAttributes,
  isVacuumOn,
  parsePercent,
  progressFromAttributes,
  resizeVacuumCard2FromBottomRight,
  resolveFanSpeedForMode,
  VACUUM_CARD_2_DEFAULT_HEIGHT,
  VACUUM_CARD_2_DEFAULT_WIDTH,
  vacuumHeadlineKind,
} from "./vacuum-card";

describe("vacuum-card helpers", () => {
  it("parses percents from numbers, strings and percent suffixes", () => {
    expect(parsePercent(92)).toBe(92);
    expect(parsePercent("92%")).toBe(92);
    expect(parsePercent(" 8 ")).toBe(8);
    expect(parsePercent("unknown")).toBeNull();
    expect(parsePercent("unavailable")).toBeNull();
    expect(parsePercent(null)).toBeNull();
    expect(parsePercent(140)).toBe(100);
    expect(parsePercent(-4)).toBe(0);
  });

  it("reads battery and progress from vacuum attributes", () => {
    expect(batteryFromAttributes({ battery_level: 100 })).toBe(100);
    expect(batteryFromAttributes({ battery: "54%" })).toBe(54);
    expect(batteryFromAttributes({})).toBeNull();
    expect(progressFromAttributes({ cleaning_progress: 92 })).toBe(92);
    expect(progressFromAttributes({ progress: "12" })).toBe(12);
    expect(progressFromAttributes({ cleaned_percent: 3 })).toBe(3);
  });

  it("maps HA fan speeds onto Eco / Standard / Turbo", () => {
    const valetudo = ["min", "low", "medium", "high", "turbo"];
    expect(resolveFanSpeedForMode("eco", valetudo)).toBe("min");
    expect(resolveFanSpeedForMode("standard", valetudo)).toBe("medium");
    expect(resolveFanSpeedForMode("turbo", valetudo)).toBe("turbo");
    expect(fanModeFromSpeed("turbo", valetudo)).toBe("turbo");
    expect(fanModeFromSpeed("low", valetudo)).toBe("eco");
    expect(fanModeFromSpeed("medium", valetudo)).toBe("standard");
  });

  it("falls back to list position when names are unknown", () => {
    const custom = ["whisper", "everyday", "boost"];
    expect(resolveFanSpeedForMode("eco", custom)).toBe("whisper");
    expect(resolveFanSpeedForMode("standard", custom)).toBe("everyday");
    expect(resolveFanSpeedForMode("turbo", custom)).toBe("boost");
    expect(fanModeFromSpeed("whisper", custom)).toBe("eco");
    expect(fanModeFromSpeed("everyday", custom)).toBe("standard");
    expect(fanModeFromSpeed("boost", custom)).toBe("turbo");
  });

  it("uses mode names when Home Assistant has no fan_speed_list", () => {
    expect(resolveFanSpeedForMode("eco", [])).toBe("eco");
    expect(fanSpeedListFromAttributes({ fan_speed_list: ["eco", 1, "turbo"] })).toEqual(["eco", "turbo"]);
    expect(currentFanSpeedFromAttributes({ fan_speed: "turbo" })).toBe("turbo");
    expect(currentFanSpeedFromAttributes({ fan_speed: 3 })).toBeUndefined();
  });

  it("treats cleaning / paused / returning as on", () => {
    expect(isVacuumOn("cleaning")).toBe(true);
    expect(isVacuumOn("paused")).toBe(true);
    expect(isVacuumOn("returning")).toBe(true);
    expect(isVacuumOn("docked")).toBe(false);
    expect(isVacuumOn("idle")).toBe(false);
  });

  it("picks a headline kind from state and progress", () => {
    expect(vacuumHeadlineKind("cleaning", 92)).toBe("cleaningProgress");
    expect(vacuumHeadlineKind("cleaning", null)).toBe("cleaning");
    expect(vacuumHeadlineKind("docked", 92)).toBe("docked");
    expect(vacuumHeadlineKind("returning", null)).toBe("returning");
    expect(vacuumHeadlineKind("unavailable", null)).toBe("unavailable");
  });

  it("clamps vacuum card 2 width and height", () => {
    expect(clampVacuumCard2Width(undefined)).toBe(VACUUM_CARD_2_DEFAULT_WIDTH);
    expect(clampVacuumCard2Width("not-a-number")).toBe(VACUUM_CARD_2_DEFAULT_WIDTH);
    expect(clampVacuumCard2Width(100)).toBe(240);
    expect(clampVacuumCard2Width(800)).toBe(500);
    expect(clampVacuumCard2Width(360)).toBe(360);
    expect(clampVacuumCard2Height(undefined)).toBe(VACUUM_CARD_2_DEFAULT_HEIGHT);
    expect(clampVacuumCard2Height(200)).toBe(260);
    expect(clampVacuumCard2Height(900)).toBe(520);
    expect(clampVacuumCard2Height(400)).toBe(400);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 300,
      startHeight: 330,
      startLeft: 88,
      startBottom: 72,
      viewportWidth: 1280,
      viewportHeight: 800,
    };
    const grown = resizeVacuumCard2FromBottomRight({ ...start, dx: 80, dy: 50 });
    expect(grown).toEqual({ width: 380, height: 380, left: 88, bottom: 22 });
    const shrunk = resizeVacuumCard2FromBottomRight({ ...start, dx: -80, dy: -80 });
    expect(shrunk.width).toBe(240);
    expect(shrunk.height).toBe(260);
    expect(shrunk.left).toBe(88);
    expect(shrunk.bottom).toBe(142);
    const againstViewport = resizeVacuumCard2FromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(340);
  });
});
