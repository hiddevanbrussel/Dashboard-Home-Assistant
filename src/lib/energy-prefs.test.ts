import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { energyModelFromCommand, parseEnergyPrefs, type EnergyBatterySource, type EnergyGridSource } from "./energy-prefs";

const FIXTURES = path.join(process.cwd(), "src/lib/ha/__fixtures__/energy");

function readFixture(name: string): unknown {
  return JSON.parse(readFileSync(path.join(FIXTURES, name), "utf8")) as unknown;
}

function grids(raw: unknown): EnergyGridSource[] {
  return parseEnergyPrefs(raw).energySources.filter((source): source is EnergyGridSource => source.type === "grid");
}

describe("energy prefs", () => {
  it("parses the 2025.11 flow_from/flow_to shape and drops unknown fields", () => {
    const model = parseEnergyPrefs(readFixture("prefs-2025.11.json"));
    expect(model.source).toBe("prefs");
    const grid = model.energySources.filter((source): source is EnergyGridSource => source.type === "grid");
    expect(grid).toHaveLength(2);
    expect(grid[0]).toMatchObject({
      statEnergyFrom: "sensor.grid_import",
      statEnergyTo: "sensor.grid_export",
      statCost: "sensor.grid_cost",
      numberEnergyPriceExport: 0.09,
      statRate: null,
      powerConfig: null,
      costAdjustmentDay: 0.35,
    });
    expect(grid[1]).toMatchObject({
      statEnergyFrom: "sensor.grid_import_2",
      statEnergyTo: null,
      entityEnergyPrice: "sensor.energy_price",
      numberEnergyPrice: null,
      statCompensation: null,
    });
    const battery = model.energySources.find((source) => source.type === "battery") as EnergyBatterySource;
    expect(battery.statSoc).toBeNull();
    expect(battery.capacity).toBeNull();
    expect(model.deviceConsumption[0]).toEqual({
      statConsumption: "sensor.fridge",
      statRate: null,
      name: "Fridge",
      includedInStat: null,
    });
    const encoded = JSON.stringify(model);
    expect(encoded).not.toContain("vendor_extension");
    expect(encoded).not.toContain("fusion");
    expect(encoded).not.toContain("unexpected");
    expect(encoded).not.toContain("future_root");
    expect(encoded).not.toContain("sensor.ignore_me");
  });

  it("pairs the 2025.12 power list by index", () => {
    const grid = grids(readFixture("prefs-2025.12.json"));
    expect(grid.map((source) => source.statRate)).toEqual([
      "sensor.grid_power",
      "sensor.grid_power_2",
      "sensor.grid_power_3",
    ]);
    expect(grid[2]).toMatchObject({
      statEnergyFrom: null,
      statEnergyTo: null,
      powerConfig: null,
      costAdjustmentDay: 0,
    });
    expect(JSON.stringify(grid)).not.toContain("not_a_field");
  });

  it("keeps the 2026.2 power_config next to stat_rate", () => {
    const model = parseEnergyPrefs(readFixture("prefs-2026.2.json"));
    const grid = model.energySources.find((source) => source.type === "grid") as EnergyGridSource;
    expect(grid.statRate).toBe("sensor.grid_power_net");
    expect(grid.powerConfig).toEqual({
      statRate: null,
      statRateInverted: "sensor.grid_power_raw",
      statRateFrom: null,
      statRateTo: null,
    });
    const battery = model.energySources.find((source) => source.type === "battery") as EnergyBatterySource;
    expect(battery.powerConfig?.statRate).toBe("sensor.battery_power");
    expect(battery.statSoc).toBeNull();
    expect(battery.capacity).toBeNull();
    expect(JSON.stringify(model)).not.toContain("unknown_power");
  });

  it("parses the flat 2026.3 grid and the 2026.6 battery fields", () => {
    const model = parseEnergyPrefs(readFixture("prefs-2026.3.json"));
    const grid = model.energySources.find((source) => source.type === "grid") as EnergyGridSource;
    expect(grid).toMatchObject({
      name: "Grid",
      statEnergyFrom: "sensor.grid_import",
      statEnergyTo: "sensor.grid_export",
      statCost: "sensor.grid_cost",
      statCompensation: "sensor.grid_compensation",
      entityEnergyPrice: "sensor.energy_price",
      numberEnergyPrice: null,
      numberEnergyPriceExport: 0.08,
      statRate: "sensor.grid_power",
      costAdjustmentDay: 0.35,
    });
    expect(grid.powerConfig).toEqual({
      statRate: "sensor.grid_power",
      statRateInverted: null,
      statRateFrom: null,
      statRateTo: null,
    });
    const battery = model.energySources.find((source) => source.type === "battery") as EnergyBatterySource;
    expect(battery.statSoc).toBe("sensor.battery_soc");
    expect(battery.capacity).toBe(10.4);
    expect(battery.powerConfig).toMatchObject({
      statRateFrom: "sensor.battery_discharge",
      statRateTo: "sensor.battery_charge",
    });
    const encoded = JSON.stringify(model);
    expect(encoded).not.toContain("vendor_extension");
    expect(encoded).not.toContain("fusion");
    expect(encoded).not.toContain("future_root");
    expect(encoded).not.toContain("ignored");
  });

  it("turns a missing field into null and keeps a zero price", () => {
    const model = parseEnergyPrefs({
      energy_sources: [{ type: "grid", stat_energy_from: "sensor.grid_import", number_energy_price: 0 }],
    });
    const grid = model.energySources[0] as EnergyGridSource;
    expect(grid.statEnergyTo).toBeNull();
    expect(grid.statCost).toBeNull();
    expect(grid.numberEnergyPrice).toBe(0);
    expect(grid.powerConfig).toBeNull();
  });

  it("maps not_found to a manual model and rejects other errors", () => {
    const fixture = readFixture("prefs-not-found.json") as {
      success: false;
      error: { code: string; message: string };
    };
    const model = energyModelFromCommand({ success: false, error: fixture.error });
    expect(model).toEqual({
      source: "manual",
      energySources: [],
      deviceConsumption: [],
      deviceConsumptionWater: [],
    });
    expect(() => energyModelFromCommand({ success: false, error: { code: "unauthorized", message: "no" } })).toThrow(
      /unauthorized/
    );
  });
});
