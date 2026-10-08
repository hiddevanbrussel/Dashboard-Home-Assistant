import { describe, expect, it } from "vitest";
import { toKilowatts } from "./energy-dashboard";
import {
  ENERGY_FLOW_ACTIVE_THRESHOLD_KW,
  ENERGY_FLOW_DEMO,
  balanceBarWidths,
  energyFlowVisibility,
  formatSignedPercent,
  hubActiveKw,
  isFlowActive,
  normalizeSparkBars,
  percentChange,
  readingToKw,
  readingToKwh,
  selfConsumption,
} from "./energy-flow";

describe("energy flow visibility", () => {
  it("treats power above the threshold as active", () => {
    expect(isFlowActive(undefined)).toBe(false);
    expect(isFlowActive(0)).toBe(false);
    expect(isFlowActive(ENERGY_FLOW_ACTIVE_THRESHOLD_KW)).toBe(false);
    expect(isFlowActive(0.05)).toBe(true);
    expect(isFlowActive(-1)).toBe(false);
  });

  it("maps live powers to per-path visibility", () => {
    expect(
      energyFlowVisibility({
        solarKw: 2.1,
        importKw: 0,
        exportKw: 0.8,
        homeKw: 1.2,
      })
    ).toEqual({
      solar: true,
      import: false,
      export: true,
      home: true,
    });
  });

  it("prefers home load for the hub reading", () => {
    expect(hubActiveKw({ homeKw: 1.8, importKw: 0.4, solarKw: 3 })).toBe(1.8);
    expect(hubActiveKw({ importKw: 0.4, solarKw: 3 })).toBe(0.4);
    expect(hubActiveKw({ solarKw: 3 })).toBe(3);
    expect(hubActiveKw({})).toBeUndefined();
  });
});

describe("energy flow unit conversion", () => {
  it("converts W to kW and leaves kW unchanged", () => {
    expect(readingToKw(4840, "W")).toBe(4.84);
    expect(readingToKw(4.84, "kW")).toBe(4.84);
    expect(toKilowatts(3200, "W")).toBe(3.2);
    expect(readingToKw(undefined, "W")).toBeUndefined();
  });

  it("converts Wh to kWh and rejects power units for energy totals", () => {
    expect(readingToKwh(18700, "Wh")).toBe(18.7);
    expect(readingToKwh(18.7, "kWh")).toBe(18.7);
    expect(readingToKwh(3200, "W")).toBeUndefined();
    expect(readingToKwh(3.2, "kW")).toBeUndefined();
  });
});

describe("self-consumption and trends", () => {
  it("computes self-consumption from solar minus export", () => {
    const fromExport = selfConsumption({ solarTodayKwh: 18.7, exportTodayKwh: 5.73 });
    expect(fromExport.pct).toBe(69);
    expect(fromExport.selfConsumedKwh).toBeCloseTo(12.97, 2);
    expect(selfConsumption({ solarTodayKwh: 18.7, consumptionTodayKwh: 13 })).toEqual({
      selfConsumedKwh: 13,
      pct: 70,
    });
    expect(selfConsumption({ solarTodayKwh: 0 })).toEqual({
      selfConsumedKwh: undefined,
      pct: undefined,
    });
  });

  it("formats percent change vs yesterday", () => {
    expect(percentChange(18.7, 15.08)).toBe(24);
    expect(percentChange(9.53, 10.83)).toBe(-12);
    expect(formatSignedPercent(24)).toBe("+24%");
    expect(formatSignedPercent(-18)).toBe("-18%");
  });
});

describe("spark and balance helpers", () => {
  it("normalizes spark bars to 0–1 slots", () => {
    const bars = normalizeSparkBars([0, 2, 4], 3);
    expect(bars).toHaveLength(3);
    expect(bars[0]).toBe(0);
    expect(bars[2]).toBe(1);
  });

  it("scales balance bars against the max series", () => {
    const widths = balanceBarWidths({
      solar: ENERGY_FLOW_DEMO.solarTodayKwh,
      consumption: ENERGY_FLOW_DEMO.consumptionTodayKwh,
      export: ENERGY_FLOW_DEMO.exportTodayKwh,
      import: ENERGY_FLOW_DEMO.importTodayKwh,
    });
    expect(widths.solar).toBeCloseTo(1);
    expect(widths.consumption).toBeLessThan(1);
    expect(widths.import).toBeGreaterThan(0);
  });
});
