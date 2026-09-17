import { describe, expect, it } from "vitest";
import {
  consumableLabelKey,
  consumablePath,
  consumableRemainingRatio,
  fanPresetLabelKey,
  fanSpeedFromAttributes,
  isConsumableDue,
  parseConsumableProperties,
  parseConsumables,
  parseFanPresets,
  parseSegmentIterationMax,
  clampSegmentIterations,
  segmentIterationOptions,
  sortConsumables,
  sortFanPresets,
  vacuumBasicActionDisabled,
  parseCurrentStatistics,
  formatVacuumAreaM2,
  formatVacuumTimeMin,
  robotDisplayName,
} from "./valetudo-robot";

describe("valetudo-robot", () => {
  it("reads fan speed from robot state attributes", () => {
    expect(
      fanSpeedFromAttributes([
        { __class: "StatusStateAttribute", value: "docked" },
        { __class: "PresetSelectionStateAttribute", type: "fan_speed", value: "turbo" },
      ])
    ).toBe("turbo");
  });

  it("orders fan presets from quiet to max", () => {
    expect(sortFanPresets(["max", "min", "turbo", "off"])).toEqual(["off", "min", "turbo", "max"]);
  });

  it("marks low remaining percent as due", () => {
    const due = { type: "filter", remaining: { value: 12, unit: "percent" as const } };
    const ok = { type: "filter", remaining: { value: 80, unit: "percent" as const } };
    expect(isConsumableDue(due)).toBe(true);
    expect(isConsumableDue(ok)).toBe(false);
    expect(consumableRemainingRatio(due)).toBeCloseTo(0.12);
  });

  it("uses maxValue for minute-based remaining", () => {
    const item = { type: "brush", subType: "main", remaining: { value: 30, unit: "minutes" as const } };
    expect(consumableRemainingRatio(item, { type: "brush", subType: "main", unit: "minutes", maxValue: 300 })).toBeCloseTo(0.1);
    expect(isConsumableDue(item, { type: "brush", subType: "main", unit: "minutes", maxValue: 300 })).toBe(true);
  });

  it("sorts due consumables first", () => {
    const items = [
      { type: "filter", remaining: { value: 90, unit: "percent" as const } },
      { type: "brush", subType: "main", remaining: { value: 5, unit: "percent" as const } },
    ];
    expect(sortConsumables(items).map((item) => item.type)).toEqual(["brush", "filter"]);
  });

  it("builds a reset path with optional subtype", () => {
    expect(consumablePath({ type: "filter" })).toBe(
      "/api/v2/robot/capabilities/ConsumableMonitoringCapability/filter"
    );
    expect(consumablePath({ type: "brush", subType: "main" })).toBe(
      "/api/v2/robot/capabilities/ConsumableMonitoringCapability/brush/main"
    );
  });

  it("maps presets and consumables to i18n keys", () => {
    expect(fanPresetLabelKey("turbo")).toBe("vacuum.fan.turbo");
    expect(consumableLabelKey({ type: "filter" })).toBe("vacuum.consumable.filter");
    expect(consumableLabelKey({ type: "brush", subType: "main" })).toBe("vacuum.consumable.brush.main");
  });

  it("parses Valetudo fan and consumable payloads", () => {
    expect(parseFanPresets(["turbo", "min", "unknown"])).toEqual(["min", "turbo"]);
    expect(
      parseConsumables([
        { type: "filter", remaining: { value: 12, unit: "percent" } },
        { type: "nope" },
      ])
    ).toEqual([{ type: "filter", subType: "none", remaining: { value: 12, unit: "percent" } }]);
    expect(
      parseConsumableProperties({
        availableConsumables: [{ type: "brush", subType: "main", unit: "minutes", maxValue: 300 }],
      })
    ).toEqual([{ type: "brush", subType: "main", unit: "minutes", maxValue: 300 }]);
  });

  it("reads segment iteration max from Valetudo properties", () => {
    expect(parseSegmentIterationMax({ iterationCount: { min: 1, max: 3 } })).toBe(3);
    expect(parseSegmentIterationMax({ iterationCount: { max: 1 } })).toBe(1);
    expect(parseSegmentIterationMax({})).toBe(3);
    expect(segmentIterationOptions(3)).toEqual([1, 2, 3]);
    expect(clampSegmentIterations(8, 3)).toBe(3);
    expect(clampSegmentIterations(0, 3)).toBe(1);
  });

  it("disables pause, stop and dock based on robot status", () => {
    expect(vacuumBasicActionDisabled("pause", "cleaning", false)).toBe(false);
    expect(vacuumBasicActionDisabled("pause", "docked", false)).toBe(true);
    expect(vacuumBasicActionDisabled("stop", "cleaning", false)).toBe(false);
    expect(vacuumBasicActionDisabled("stop", "idle", false)).toBe(true);
    expect(vacuumBasicActionDisabled("home", "cleaning", false)).toBe(false);
    expect(vacuumBasicActionDisabled("home", "returning", false)).toBe(true);
    expect(vacuumBasicActionDisabled("home", "cleaning", true)).toBe(true);
  });

  it("parses current statistics and robot model name", () => {
    expect(
      parseCurrentStatistics([
        { type: "area", value: 550000 },
        { type: "time", value: 3600 },
      ])
    ).toEqual({ areaCm2: 550000, timeSec: 3600 });
    expect(formatVacuumAreaM2(550000)).toBe("55");
    expect(formatVacuumAreaM2(12345)).toBe("1.2");
    expect(formatVacuumTimeMin(3600)).toBe("60");
    expect(formatVacuumTimeMin(null)).toBeNull();
    expect(robotDisplayName({ manufacturer: "Roborock", modelName: "S8+" })).toBe("S8+");
    expect(robotDisplayName({})).toBeNull();
  });
});
