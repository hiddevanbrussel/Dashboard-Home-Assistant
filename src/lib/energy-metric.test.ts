import { describe, expect, it } from "vitest";
import {
  clampEnergyMetricHeight,
  clampEnergyMetricWidth,
  formatEnergyMetricDisplay,
  isPrefixUnit,
  resolveEnergyMetricValue,
} from "./energy-metric";

describe("formatEnergyMetricDisplay", () => {
  it("formats kWh with unit suffix", () => {
    expect(formatEnergyMetricDisplay({ value: 13, unit: "kWh" })).toBe("13 kWh");
    expect(formatEnergyMetricDisplay({ value: 8.4, unit: "kWh" })).toBe("8.4 kWh");
    expect(formatEnergyMetricDisplay({ value: 1.8, unit: "kWh" })).toBe("1.8 kWh");
  });

  it("formats euro cost with prefix unit", () => {
    expect(formatEnergyMetricDisplay({ value: 0.76, unit: "€" })).toBe("€0.76");
    expect(formatEnergyMetricDisplay({ value: 1, unit: "€" })).toBe("€1");
  });

  it("appends secondary text (self-sufficiency style)", () => {
    expect(
      formatEnergyMetricDisplay({ value: 8.4, unit: "kWh", secondary: "82%" })
    ).toBe("8.4 kWh 82%");
  });

  it("returns em dash for missing/unavailable", () => {
    expect(formatEnergyMetricDisplay({ value: null })).toBe("—");
    expect(formatEnergyMetricDisplay({ value: "unavailable" })).toBe("—");
    expect(formatEnergyMetricDisplay({ value: "" })).toBe("—");
  });

  it("respects unitAsPrefix for non-currency units", () => {
    expect(
      formatEnergyMetricDisplay({ value: 12, unit: "x", unitAsPrefix: true })
    ).toBe("x12");
  });
});

describe("resolveEnergyMetricValue", () => {
  it("prefers live entity over manual", () => {
    const r = resolveEnergyMetricValue({
      entityState: "13.2",
      entityUnit: "kWh",
      manualValue: "99",
      unitOverride: "",
    });
    expect(r.usingManual).toBe(false);
    expect(r.display).toBe("13.2 kWh");
  });

  it("falls back to manual when entity missing", () => {
    const r = resolveEnergyMetricValue({
      entityState: "unavailable",
      manualValue: "0.76",
      unitOverride: "€",
    });
    expect(r.usingManual).toBe(true);
    expect(r.display).toBe("€0.76");
  });

  it("uses unit override over entity unit", () => {
    const r = resolveEnergyMetricValue({
      entityState: "4.6",
      entityUnit: "Wh",
      unitOverride: "kWh",
    });
    expect(r.display).toBe("4.6 kWh");
  });
});

describe("isPrefixUnit / clamps", () => {
  it("detects currency prefixes", () => {
    expect(isPrefixUnit("€")).toBe(true);
    expect(isPrefixUnit("kWh")).toBe(false);
  });

  it("clamps width/height", () => {
    expect(clampEnergyMetricWidth(10)).toBe(80);
    expect(clampEnergyMetricWidth(9999)).toBe(420);
    expect(clampEnergyMetricHeight(5)).toBe(40);
    expect(clampEnergyMetricHeight(9999)).toBe(120);
    expect(clampEnergyMetricWidth("bad")).toBe(160);
  });
});
