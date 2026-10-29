import { readFileSync } from "node:fs";
import path from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearEnergyStatisticsCache } from "./energy-cache";
import {
  buildEnergyStats,
  loadEnergyStatistics,
  planStatisticRequests,
  scaleEnergyToKwh,
  selectQueryStatisticIds,
  type EnergyRoles,
  type StatisticPoint,
} from "./energy-stats";
import { isoWithOffset, periodRange, type PeriodRange } from "./energy-time";
import { clearHaTimeZoneCache } from "./ha/ha-config";
import { startMockHa, type MockHaHandle } from "./ha/mock-ha";

const AMSTERDAM = "Europe/Amsterdam";
const TOKEN = "llat-stats-token-do-not-leak";
const FIXTURES = path.join(process.cwd(), "src/lib/ha/__fixtures__/energy");

const ROLES: EnergyRoles = {
  gridImport: ["sensor.grid_import"],
  gridExport: [],
  solar: [],
  batteryIn: [],
  batteryOut: [],
  batterySoc: [],
  gas: [],
  water: [],
};

function hourRange(start: Date, hours: number): PeriodRange {
  return { view: "day", start, end: new Date(start.getTime() + hours * 60 * 60 * 1000), bucket: "hour" };
}

function point(start: string, change: number): StatisticPoint {
  return { start: Date.parse(start), change, mean: null };
}

describe("energy statistics", () => {
  let manual: MockHaHandle;
  let prefs: MockHaHandle;

  beforeAll(async () => {
    manual = await startMockHa({ fixtureSet: "no-prefs" });
    prefs = await startMockHa({ fixtureSet: "full" });
  });

  afterEach(() => {
    clearEnergyStatisticsCache();
    clearHaTimeZoneCache();
    manual.calls.length = 0;
    prefs.calls.length = 0;
  });

  afterAll(async () => {
    await manual.close();
    await prefs.close();
  });

  it("converts MWh to kWh and leaves kWh alone", () => {
    expect(scaleEnergyToKwh(1.25, "MWh")).toBe(1250);
    expect(scaleEnergyToKwh(2500, "Wh")).toBe(2.5);
    expect(scaleEnergyToKwh(0.4, "kWh")).toBe(0.4);
    const fixture = JSON.parse(readFileSync(path.join(FIXTURES, "stats-mwh.json"), "utf8")) as {
      statistic_id: string;
      unit: string;
      points: Array<{ start: string; change: number }>;
    };
    const start = new Date(Date.parse(fixture.points[0].start));
    const built = buildEnergyStats({
      view: "day",
      tz: AMSTERDAM,
      range: hourRange(start, 1),
      now: new Date(start.getTime() + 60 * 60 * 1000),
      offset: 1,
      partial: false,
      roles: { ...ROLES, gridImport: [fixture.statistic_id] },
      deviceIds: [],
      includeDevices: false,
      unitById: { [fixture.statistic_id]: fixture.unit },
      periodStats: {},
      hourStats: { [fixture.statistic_id]: [point(fixture.points[0].start, fixture.points[0].change)] },
      dayStats: {},
      fiveStats: {},
      deviceStats: {},
      socStats: {},
    });
    expect(built.series.gridImport).toEqual([1250]);
    expect(built.units).toEqual({ energy: "kWh", volume: "m³" });
  });

  it("fills a missing hour with null and prefers 5-minute data for the open hour", () => {
    const fixture = JSON.parse(readFileSync(path.join(FIXTURES, "stats-gaps.json"), "utf8")) as {
      statistic_id: string;
      points: Array<{ start: string; change: number }>;
    };
    const start = new Date(Date.parse("2026-01-15T00:00:00+01:00"));
    const gapped = buildEnergyStats({
      view: "day",
      tz: AMSTERDAM,
      range: hourRange(start, 3),
      now: new Date("2026-01-15T12:00:00.000Z"),
      offset: 1,
      partial: false,
      roles: ROLES,
      deviceIds: [],
      includeDevices: false,
      periodStats: {},
      hourStats: {
        [fixture.statistic_id]: fixture.points.map((row) => point(row.start, row.change)),
      },
      dayStats: {},
      fiveStats: {},
      deviceStats: {},
      socStats: {},
    });
    expect(gapped.buckets).toHaveLength(3);
    expect(gapped.series.gridImport).toEqual([1.5, null, 0.25]);

    const openStart = new Date(Date.parse("2026-01-15T00:00:00+01:00"));
    const now = new Date(openStart.getTime() + 90 * 60 * 1000);
    const fiveStart = openStart.getTime() + 60 * 60 * 1000;
    const five = Array.from({ length: 6 }, (_, index) => ({
      start: fiveStart + index * 5 * 60 * 1000,
      change: 0.01,
      mean: null,
    }));
    const open = buildEnergyStats({
      view: "day",
      tz: AMSTERDAM,
      range: { view: "day", start: openStart, end: now, bucket: "hour" },
      now,
      offset: 0,
      partial: false,
      roles: ROLES,
      deviceIds: [],
      includeDevices: false,
      periodStats: {},
      hourStats: {
        "sensor.grid_import": [
          { start: openStart.getTime(), change: 0.4, mean: null },
          { start: fiveStart, change: 99, mean: null },
        ],
      },
      dayStats: {},
      fiveStats: { "sensor.grid_import": five },
      deviceStats: {},
      socStats: {},
    });
    expect(open.series.gridImport).toEqual([0.4, 0.06]);
  });

  it("asks for 5-minute statistics only while the period is still running", () => {
    const now = new Date("2026-01-15T12:30:00.000Z");
    const open = planStatisticRequests({
      range: periodRange("day", 0, AMSTERDAM, now),
      now,
      tz: AMSTERDAM,
      roles: ROLES,
      deviceIds: ["sensor.fridge"],
    });
    expect(open.some((plan) => plan.period === "5minute" && plan.types.includes("change"))).toBe(true);
    const closed = planStatisticRequests({
      range: periodRange("day", 1, AMSTERDAM, now),
      now,
      tz: AMSTERDAM,
      roles: ROLES,
      deviceIds: [],
    });
    expect(closed.some((plan) => plan.period === "5minute")).toBe(false);
  });

  it("ignores query ids outside the energy statistic allowlist and keeps at most 12", () => {
    const known = new Set(["sensor.grid_import", "sensor.solar_yield_mwh", ...Array.from({ length: 13 }, (_, index) => `sensor.pad_${index}`)]);
    expect(selectQueryStatisticIds("sensor.grid_import,sensor.temperature,Sensor.Bad,binary_sensor.x", known)).toEqual([
      "sensor.grid_import",
    ]);
    const many = Array.from({ length: 13 }, (_, index) => `sensor.pad_${index}`).join(",");
    expect(selectQueryStatisticIds(many, known)).toHaveLength(12);
  });

  it("returns 25 and 23 buckets for the DST fixtures and converts the MWh sensor", async () => {
    const fall = await loadEnergyStatistics({
      config: { baseUrl: manual.baseUrl, token: TOKEN },
      connectionId: "manual",
      view: "day",
      offset: 1,
      partial: false,
      manual: "sensor.grid_import",
      devices: null,
      now: new Date("2026-10-26T12:00:00.000Z"),
    });
    const fallFixture = JSON.parse(readFileSync(path.join(FIXTURES, "stats-dst-2026-10-25.json"), "utf8")) as {
      starts: string[];
    };
    expect(fall.tz).toBe(AMSTERDAM);
    expect(fall.buckets).toEqual(fallFixture.starts);
    expect(fall.series.gridImport.filter((value) => value == null)).toHaveLength(1);

    const spring = await loadEnergyStatistics({
      config: { baseUrl: manual.baseUrl, token: TOKEN },
      connectionId: "manual",
      view: "day",
      offset: 1,
      partial: false,
      manual: "sensor.grid_import",
      devices: null,
      now: new Date("2027-03-29T12:00:00.000Z"),
    });
    expect(spring.buckets).toHaveLength(23);

    const mwh = await loadEnergyStatistics({
      config: { baseUrl: manual.baseUrl, token: TOKEN },
      connectionId: "manual",
      view: "day",
      offset: 0,
      partial: true,
      manual: "sensor.solar_yield_mwh,sensor.temperature,sensor.NOT_VALID",
      devices: "sensor.fridge,sensor.temperature",
      now: new Date("2026-01-15T00:30:00.000Z"),
    });
    expect(mwh.series.gridImport).toEqual([1250, 625]);
    expect(mwh.partialFrom).toBe("2026-01-14T01:30:00+01:00");
    expect(mwh.devices?.items.map((item) => item.id)).toEqual(["sensor.fridge"]);
    const requested = manual.calls
      .filter((call) => call.type === "recorder/statistics_during_period")
      .flatMap((call) => call.statisticIds ?? []);
    expect(requested).not.toContain("sensor.temperature");
    expect(requested).not.toContain("sensor.NOT_VALID");
    expect(manual.calls.some((call) => call.period === "5minute")).toBe(true);
    expect(manual.calls.find((call) => call.period === "hour")?.units).toEqual({ energy: "kWh", volume: "m³" });
  });

  it("reuses a cached window for the same connection and not for another", async () => {
    const input = {
      config: { baseUrl: prefs.baseUrl, token: TOKEN },
      view: "day" as const,
      offset: 1,
      partial: false,
      manual: null,
      devices: null,
      now: new Date("2026-01-15T12:00:00.000Z"),
    };
    await loadEnergyStatistics({ ...input, connectionId: "alpha" });
    const afterFirst = prefs.calls.filter((call) => call.type === "recorder/statistics_during_period").length;
    expect(afterFirst).toBeGreaterThan(0);
    await loadEnergyStatistics({ ...input, connectionId: "alpha" });
    expect(prefs.calls.filter((call) => call.type === "recorder/statistics_during_period")).toHaveLength(afterFirst);
    await loadEnergyStatistics({ ...input, connectionId: "beta" });
    expect(prefs.calls.filter((call) => call.type === "recorder/statistics_during_period").length).toBeGreaterThan(afterFirst);
    expect(JSON.stringify(prefs.calls)).not.toContain(TOKEN);
  });

  it("reports empty-since from the 5-minute state of charge", () => {
    const start = new Date("2026-01-15T00:00:00.000Z");
    const soc = [10, 0, 0].map((mean, index) => ({
      start: start.getTime() + index * 5 * 60 * 1000,
      change: null,
      mean,
    }));
    const built = buildEnergyStats({
      view: "day",
      tz: "UTC",
      range: hourRange(start, 1),
      now: new Date(start.getTime() + 60 * 60 * 1000),
      offset: 1,
      partial: false,
      roles: { ...ROLES, gridImport: [], batterySoc: ["sensor.battery_soc"] },
      deviceIds: [],
      includeDevices: false,
      periodStats: {},
      hourStats: {},
      dayStats: {},
      fiveStats: {},
      deviceStats: {},
      socStats: { "sensor.battery_soc": soc },
    });
    expect(built.emptySince).toBe(isoWithOffset(new Date(soc[1].start), "UTC"));
    expect(built.series.batterySoc[0]).toBe(meanOf(soc.map((point) => point.mean)));
  });
});

function meanOf(values: number[]): number {
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 1e6) / 1e6;
}
