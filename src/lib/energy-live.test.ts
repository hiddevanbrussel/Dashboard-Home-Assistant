import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  batteryKw,
  gridPowerKw,
  gridPowerNow,
  housePowerKw,
  housePowerNow,
  medianOf,
  type ManualLiveEntities,
} from "./energy-live";
import { parseEnergyPrefs, type EnergyModel } from "./energy-prefs";

const manualBase: ManualLiveEntities = {
  gridPowerEntityId: "",
  gridImportPowerEntityId: "",
  gridExportPowerEntityId: "",
  gridPowerInverted: false,
  consumptionEntityId: "",
  solarPowerEntityId: "",
  batteryPowerEntityId: "",
};

function model(raw: unknown): EnergyModel {
  return parseEnergyPrefs(raw);
}

describe("energy live power", () => {
  it("uses the median of the last three polls", () => {
    expect(medianOf([])).toBeNull();
    expect(medianOf([4])).toBe(4);
    expect(medianOf([1, 100])).toBe(50.5);
    expect(medianOf([10, 0, 0])).toBe(0);
    expect(medianOf([1, 100, 1])).toBe(1);
  });

  it("keeps a positive grid sensor as import and flips it when inverted", () => {
    const samples = { "sensor.grid_power": { value: 1500, unit: "W" } };
    const manual = { ...manualBase, gridPowerEntityId: "sensor.grid_power" };
    expect(gridPowerNow({ model: null, manual, samples })).toBe(1.5);
    expect(gridPowerNow({ model: null, manual: { ...manual, gridPowerInverted: true }, samples })).toBe(-1.5);
    expect(gridPowerKw({ model: null, manual, samples, previous: [1.5, 9] })).toBe(1.5);
  });

  it("subtracts export from import and clamps each magnitude at zero", () => {
    const samples = {
      "sensor.import_power": { value: 2, unit: "kW" },
      "sensor.export_power": { value: 0.5, unit: "kW" },
    };
    const manual = {
      ...manualBase,
      gridImportPowerEntityId: "sensor.import_power",
      gridExportPowerEntityId: "sensor.export_power",
    };
    expect(gridPowerNow({ model: null, manual, samples })).toBe(1.5);
    expect(
      gridPowerNow({
        model: null,
        manual,
        samples: {
          "sensor.import_power": { value: -3, unit: "kW" },
          "sensor.export_power": { value: 0.4, unit: "kW" },
        },
      })
    ).toBe(-0.4);
  });

  it("prefers prefs power over the manual sensor", () => {
    const prefs = model({
      energy_sources: [
        {
          type: "grid",
          stat_rate: "sensor.from_prefs",
          power_config: { stat_rate: "sensor.from_prefs" },
        },
      ],
    });
    const manual = { ...manualBase, gridPowerEntityId: "sensor.manual" };
    const samples = {
      "sensor.from_prefs": { value: 800, unit: "W" },
      "sensor.manual": { value: 9, unit: "kW" },
    };
    expect(gridPowerKw({ model: prefs, manual, samples })).toBe(0.8);
  });

  it("uses import minus export from a prefs power_config", () => {
    const prefs = model({
      energy_sources: [
        {
          type: "grid",
          power_config: { stat_rate_from: "sensor.grid_in", stat_rate_to: "sensor.grid_out" },
        },
      ],
    });
    expect(
      gridPowerNow({
        model: prefs,
        manual: manualBase,
        samples: {
          "sensor.grid_in": { value: 1200, unit: "W" },
          "sensor.grid_out": { value: 200, unit: "W" },
        },
      })
    ).toBe(1);
  });

  it("treats battery power as discharge when positive and as from minus to", () => {
    const signed = model({
      energy_sources: [{ type: "battery", stat_rate: "sensor.battery_power" }],
    });
    expect(
      batteryKw({
        model: signed,
        manual: manualBase,
        samples: { "sensor.battery_power": { value: -400, unit: "W" } },
      })
    ).toBe(-0.4);
    const split = model({
      energy_sources: [
        {
          type: "battery",
          power_config: { stat_rate_from: "sensor.discharge", stat_rate_to: "sensor.charge" },
        },
      ],
    });
    expect(
      batteryKw({
        model: split,
        manual: { ...manualBase, batteryPowerEntityId: "sensor.ignored" },
        samples: {
          "sensor.discharge": { value: 1.2, unit: "kW" },
          "sensor.charge": { value: 0.2, unit: "kW" },
          "sensor.ignored": { value: 9, unit: "kW" },
        },
      })
    ).toBe(1);
  });

  it("clamps house power at zero and lets the measured consumption sensor win", () => {
    const manual = {
      ...manualBase,
      solarPowerEntityId: "sensor.solar",
      gridPowerEntityId: "sensor.grid",
      batteryPowerEntityId: "sensor.battery",
    };
    const samples = {
      "sensor.solar": { value: 0.2, unit: "kW" },
      "sensor.grid": { value: -3, unit: "kW" },
      "sensor.battery": { value: 0.1, unit: "kW" },
    };
    expect(housePowerNow({ model: null, manual, samples })).toBe(0);
    expect(
      housePowerNow({
        model: null,
        manual,
        samples: {
          "sensor.grid": { value: 1.2, unit: "kW" },
          "sensor.battery": { value: 0.75, unit: "kW" },
        },
      })
    ).toBeNull();
    expect(
      housePowerNow({
        model: null,
        manual,
        samples: {
          "sensor.solar": { value: 1.2, unit: "kW" },
          "sensor.grid": { value: 0.75, unit: "kW" },
        },
      })
    ).toBeNull();
    expect(
      housePowerKw({
        model: null,
        manual: { ...manual, consumptionEntityId: "sensor.house" },
        samples: { ...samples, "sensor.house": { value: 3200, unit: "W" } },
        previous: [1, 9],
      })
    ).toBe(3.2);
  });

  it("reads the 2026.3 fixture power sensor before the manual fallback", () => {
    const prefs = model(
      JSON.parse(readFileSync(path.join(process.cwd(), "src/lib/ha/__fixtures__/energy/prefs-2026.3.json"), "utf8"))
    );
    expect(
      gridPowerNow({
        model: prefs,
        manual: { ...manualBase, gridPowerEntityId: "sensor.manual_grid" },
        samples: {
          "sensor.grid_power": { value: 2.5, unit: "kW" },
          "sensor.manual_grid": { value: 8, unit: "kW" },
        },
      })
    ).toBe(2.5);
  });
});
