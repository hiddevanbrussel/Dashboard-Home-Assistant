import { describe, expect, it } from "vitest";
import {
  ENERGY_HOME_DEMO,
  clampEnergyHomeCardHeight,
  clampEnergyHomeCardWidth,
  computeEnergyHomeMetrics,
  formatEnergyHomeCost,
  formatEnergyHomeKwh,
  formatEnergyHomeSelfSufficiency,
} from "./energy-home-card";

describe("computeEnergyHomeMetrics", () => {
  it("returns demo metrics when no sensors are linked", () => {
    const m = computeEnergyHomeMetrics({});
    expect(m.usingDemo).toBe(true);
    expect(m.generationKwh).toBe(ENERGY_HOME_DEMO.generationKwh);
    expect(m.selfConsumedKwh).toBe(ENERGY_HOME_DEMO.selfConsumedKwh);
    expect(m.selfSufficiencyPct).toBe(ENERGY_HOME_DEMO.selfSufficiencyPct);
    expect(m.gridImportKwh).toBe(ENERGY_HOME_DEMO.gridImportKwh);
    expect(m.costEur).toBe(ENERGY_HOME_DEMO.costEur);
    expect(m.exportKwh).toBe(ENERGY_HOME_DEMO.exportKwh);
  });

  it("matches the mockup arithmetic (13 / 4.6 / 1.8 @ €0.422…)", () => {
    const m = computeEnergyHomeMetrics({
      generationKwh: 13,
      exportKwh: 4.6,
      gridImportKwh: 1.8,
      costPerKwh: 0.76 / 1.8,
    });
    expect(m.usingDemo).toBe(false);
    expect(m.selfConsumedKwh).toBeCloseTo(8.4, 5);
    expect(m.selfSufficiencyPct).toBe(82);
    expect(m.costEur).toBeCloseTo(0.76, 5);
  });

  it("clamps negative readings to zero", () => {
    const m = computeEnergyHomeMetrics({
      generationKwh: -2,
      exportKwh: -1,
      gridImportKwh: -3,
      costPerKwh: 0.3,
    });
    expect(m.generationKwh).toBe(0);
    expect(m.exportKwh).toBe(0);
    expect(m.gridImportKwh).toBe(0);
    expect(m.selfConsumedKwh).toBe(0);
    expect(m.selfSufficiencyPct).toBe(0);
    expect(m.costEur).toBe(0);
  });

  it("treats missing cost rate as zero cost", () => {
    const m = computeEnergyHomeMetrics({
      generationKwh: 10,
      exportKwh: 2,
      gridImportKwh: 3,
    });
    expect(m.costEur).toBe(0);
    expect(m.selfConsumedKwh).toBe(8);
    expect(m.selfSufficiencyPct).toBe(73); // 8 / 11
  });

  it("works with only generation linked", () => {
    const m = computeEnergyHomeMetrics({ generationKwh: 5 });
    expect(m.usingDemo).toBe(false);
    expect(m.generationKwh).toBe(5);
    expect(m.exportKwh).toBe(0);
    expect(m.selfConsumedKwh).toBe(5);
    expect(m.gridImportKwh).toBe(0);
    expect(m.selfSufficiencyPct).toBe(100);
  });
});

describe("formatters", () => {
  it("formats kWh without trailing .0", () => {
    expect(formatEnergyHomeKwh(13)).toBe("13 kWh");
    expect(formatEnergyHomeKwh(8.4)).toBe("8.4 kWh");
  });

  it("formats euro cost with two decimals", () => {
    expect(formatEnergyHomeCost(0.76)).toBe("€0.76");
    expect(formatEnergyHomeCost(1)).toBe("€1.00");
  });

  it("formats self-sufficiency as kWh + percent", () => {
    expect(formatEnergyHomeSelfSufficiency(8.4, 82)).toBe("8.4 kWh 82%");
  });
});

describe("size clamps", () => {
  it("clamps width/height to card bounds", () => {
    expect(clampEnergyHomeCardWidth(100)).toBe(280);
    expect(clampEnergyHomeCardWidth(9999)).toBe(720);
    expect(clampEnergyHomeCardHeight(10)).toBe(220);
    expect(clampEnergyHomeCardHeight(9999)).toBe(560);
    expect(clampEnergyHomeCardWidth("bad")).toBe(420);
  });
});
