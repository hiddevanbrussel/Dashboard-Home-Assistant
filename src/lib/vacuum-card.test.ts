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
  VACUUM_CARD_2_DEFAULT_IMAGE,
  VACUUM_CARD_2_DEFAULT_IMAGE_DARK,
  VACUUM_CARD_2_DEFAULT_WIDTH,
  isVacuumCardTap,
  lastCleanAtFromAttributes,
  shouldIgnoreVacuumSheetBackdropClose,
  cleanedAreaM2FromAttributes,
  findRelatedVacuumSensor,
  normalizeVacuumAreaM2,
  resolveVacuumCleanedAreaM2,
  resolveVacuumLastCleanAt,
  vacuumCard2ArtSrc,
  vacuumCard2Density,
  vacuumHeadlineKind,
  vacuumRelativeTimeKind,
  vacuumSessionStatusKey,
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
    expect(VACUUM_CARD_2_DEFAULT_IMAGE).toBe("/vacuum-robot-light.webp");
    expect(VACUUM_CARD_2_DEFAULT_IMAGE_DARK).toBe("/vacuum-robot-dark.webp");
    expect(clampVacuumCard2Width(undefined)).toBe(VACUUM_CARD_2_DEFAULT_WIDTH);
    expect(clampVacuumCard2Width("not-a-number")).toBe(VACUUM_CARD_2_DEFAULT_WIDTH);
    expect(clampVacuumCard2Width(100)).toBe(240);
    expect(clampVacuumCard2Width(800)).toBe(500);
    expect(clampVacuumCard2Width(360)).toBe(360);
    expect(clampVacuumCard2Height(undefined)).toBe(VACUUM_CARD_2_DEFAULT_HEIGHT);
    expect(clampVacuumCard2Height(200)).toBe(240);
    expect(clampVacuumCard2Height(900)).toBe(640);
    expect(clampVacuumCard2Height(400)).toBe(400);
  });

  it("picks density from card height so media-sized cards stay usable", () => {
    expect(vacuumCard2Density(460)).toBe("comfortable");
    expect(vacuumCard2Density(320)).toBe("compact");
    expect(vacuumCard2Density(248)).toBe("dense");
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
    expect(shrunk.height).toBe(250);
    expect(shrunk.left).toBe(88);
    expect(shrunk.bottom).toBe(152);
    const againstViewport = resizeVacuumCard2FromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(340);
  });

  it("picks the themed default robot art unless a custom image is set", () => {
    expect(vacuumCard2ArtSrc({ isDark: false })).toBe(VACUUM_CARD_2_DEFAULT_IMAGE);
    expect(vacuumCard2ArtSrc({ isDark: true })).toBe(VACUUM_CARD_2_DEFAULT_IMAGE_DARK);
    expect(vacuumCard2ArtSrc({ isDark: true, backgroundImage: " /custom.webp " })).toBe("/custom.webp");
  });

  it("reads last clean time and cleaned area from vacuum attributes", () => {
    expect(lastCleanAtFromAttributes({ last_clean_end: "2026-09-18T18:00:00.000Z" })).toBe(
      Date.parse("2026-09-18T18:00:00.000Z")
    );
    expect(lastCleanAtFromAttributes({ last_clean: 1_700_000_000 })).toBe(1_700_000_000_000);
    expect(lastCleanAtFromAttributes({ last_clean_end: "unknown" })).toBeNull();
    expect(lastCleanAtFromAttributes({ last_clean_stop: "2026-09-21 08:15:00" })).toBe(
      Date.parse("2026-09-21T08:15:00")
    );
    expect(
      lastCleanAtFromAttributes({ last_clean_record: { end: "2026-09-18T18:00:00.000Z", area: 28 } })
    ).toBe(Date.parse("2026-09-18T18:00:00.000Z"));
    expect(cleanedAreaM2FromAttributes({ cleaned_area: 32 })).toBe(32);
    expect(cleanedAreaM2FromAttributes({ cleaned_area: "32.4 m2" })).toBe(32.4);
    expect(cleanedAreaM2FromAttributes({ last_clean_area: 18 })).toBe(18);
    expect(cleanedAreaM2FromAttributes({ last_clean_record: { area: 245000 } })).toBe(24.5);
    expect(cleanedAreaM2FromAttributes({})).toBeNull();
    expect(normalizeVacuumAreaM2(245000, "cm2")).toBe(24.5);
    expect(normalizeVacuumAreaM2(32, "m²")).toBe(32);
  });

  it("reads last session and area from related Home Assistant sensors", () => {
    const entities = [
      { entity_id: "vacuum.roborock_s8", state: "docked", attributes: {} },
      {
        entity_id: "sensor.roborock_s8_last_clean_end",
        state: "2026-09-21T07:40:00.000Z",
        attributes: {},
      },
      {
        entity_id: "sensor.roborock_s8_last_clean_area",
        state: "27.5",
        attributes: { unit_of_measurement: "m²" },
      },
      {
        entity_id: "sensor.other_vacuum_last_clean_area",
        state: "99",
        attributes: { unit_of_measurement: "m²" },
      },
    ];
    expect(
      findRelatedVacuumSensor(entities, "vacuum.roborock_s8", ["last_clean_end"])?.entity_id
    ).toBe("sensor.roborock_s8_last_clean_end");
    expect(
      resolveVacuumLastCleanAt({ vacuumEntityId: "vacuum.roborock_s8", entities, attrs: {} })
    ).toBe(Date.parse("2026-09-21T07:40:00.000Z"));
    expect(
      resolveVacuumCleanedAreaM2({ vacuumEntityId: "vacuum.roborock_s8", entities, attrs: {} })
    ).toBe(27.5);
    expect(
      resolveVacuumCleanedAreaM2({
        vacuumEntityId: "vacuum.valetudo_robot",
        entities: [
          {
            entity_id: "sensor.valetudo_robot_current_statistics_area",
            state: "185000",
            attributes: {},
          },
        ],
        attrs: {},
      })
    ).toBe(18.5);
  });

  it("formats a last-session relative time", () => {
    const now = 1_000_000_000_000;
    expect(vacuumRelativeTimeKind(now - 20_000, now)).toEqual({ key: "justNow", n: 0 });
    expect(vacuumRelativeTimeKind(now - 10 * 60_000, now)).toEqual({ key: "minutesAgo", n: 10 });
    expect(vacuumRelativeTimeKind(now - 2 * 60 * 60_000, now)).toEqual({ key: "hoursAgo", n: 2 });
    expect(vacuumRelativeTimeKind(now - 3 * 24 * 60 * 60_000, now)).toEqual({ key: "daysAgo", n: 3 });
  });

  it("uses Gereed when the vacuum is docked or idle", () => {
    expect(vacuumSessionStatusKey("docked")).toBe("ready");
    expect(vacuumSessionStatusKey("idle")).toBe("ready");
    expect(vacuumSessionStatusKey("cleaning")).toBe("cleaning");
    expect(vacuumSessionStatusKey("returning")).toBe("returning");
  });

  it("opens the vacuum sheet only on a short unmoved tap", () => {
    expect(isVacuumCardTap({ longPressFired: false, moved: false })).toBe(true);
    expect(isVacuumCardTap({ longPressFired: true, moved: false })).toBe(false);
    expect(isVacuumCardTap({ longPressFired: false, moved: true })).toBe(false);
  });

  it("ignores a backdrop click from the same tap that opened the sheet", () => {
    expect(shouldIgnoreVacuumSheetBackdropClose(1000, 1100)).toBe(true);
    expect(shouldIgnoreVacuumSheetBackdropClose(1000, 1600)).toBe(false);
  });
});
