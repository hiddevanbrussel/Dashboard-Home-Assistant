import { describe, expect, it } from "vitest";
import {
  displayUnitForEnergy,
  displayUnitForPower,
  energyAlerts,
  energyImpact,
  entityLabel,
  filterEnergySensors,
  formatEnergyValue,
  hasLinkedEnergyEntities,
  heatmapTones,
  linkedEnergyEntityIds,
  matchesEnergySensorKind,
  mergeDatedSeries,
  mergeHourlySeries,
  parseEnergyEntities,
  parseEntityIdList,
  parseHaNumber,
  seriesStats,
  shouldShowBatteryCard,
  shouldShowHeatmap,
  toKilowatts,
  toKwh,
  formatHourTick,
} from "./energy-dashboard";

describe("energy dashboard entities", () => {
  it("parses stored entity ids and ignores junk", () => {
    expect(parseEnergyEntities(null).solarPowerEntityId).toBe("");
    expect(
      parseEnergyEntities({
        solarPowerEntityId: " sensor.pv_power ",
        extra: "nope",
      }).solarPowerEntityId
    ).toBe("sensor.pv_power");
    expect(parseEntityIdList(["sensor.a", "sensor.a", " sensor.b ", 3])).toEqual([
      "sensor.a",
      "sensor.b",
    ]);
  });

  it("knows when sensors are linked", () => {
    expect(hasLinkedEnergyEntities(parseEnergyEntities({}), [])).toBe(false);
    expect(
      hasLinkedEnergyEntities(parseEnergyEntities({ solarPowerEntityId: "sensor.pv" }), [])
    ).toBe(true);
    expect(linkedEnergyEntityIds(parseEnergyEntities({ solarPowerEntityId: "sensor.pv" }), ["sensor.t"])).toEqual([
      "sensor.pv",
      "sensor.t",
    ]);
  });

  it("converts units and formats values", () => {
    expect(parseHaNumber("unavailable")).toBeUndefined();
    expect(parseHaNumber("7.81")).toBe(7.81);
    expect(toKilowatts(7600, "W")).toBe(7.6);
    expect(toKilowatts(7.6, "kW")).toBe(7.6);
    expect(toKwh(2100, "Wh")).toBe(2.1);
    expect(formatEnergyValue(7.81)).toBe("7.8");
    expect(formatEnergyValue(38)).toBe("38");
    expect(formatEnergyValue(undefined)).toBe("—");
    expect(displayUnitForPower("W")).toBe("kW");
    expect(displayUnitForEnergy("kWh")).toBe("kWh");
    expect(displayUnitForEnergy("W")).toBe("kW");
  });

  it("derives impact and battery alerts", () => {
    const impact = energyImpact(90);
    expect(impact.carbonKg).toBeCloseTo(33.3);
    expect(impact.trees).toBeCloseTo(1.5857);
    expect(impact.homes).toBe(10);
    expect(energyAlerts({ batteryPct: 12, batteryTempC: 55 }).map((a) => a.key)).toEqual([
      "energy.overview.alertBatteryLow",
      "energy.overview.alertBatteryHot",
    ]);
    expect(energyAlerts({ batteryPct: 80, batteryTempC: 32 })).toEqual([]);
  });

  it("filters HA sensors by kind and keeps the selected entity", () => {
    const entities = [
      { entity_id: "light.kitchen", attributes: { friendly_name: "Kitchen" } },
      {
        entity_id: "sensor.pv_energy_today",
        attributes: { friendly_name: "PV today", device_class: "energy", unit_of_measurement: "kWh" },
      },
      {
        entity_id: "sensor.pv_power",
        attributes: { friendly_name: "PV power", device_class: "power", unit_of_measurement: "W" },
      },
      {
        entity_id: "sensor.battery_soc",
        attributes: { friendly_name: "Battery", device_class: "battery", unit_of_measurement: "%" },
      },
    ];
    expect(matchesEnergySensorKind(entities[1], "energy")).toBe(true);
    expect(filterEnergySensors(entities, "power").map((e) => e.entity_id)).toEqual(["sensor.pv_power"]);
    expect(filterEnergySensors(entities, "energy", "light.kitchen")[0].entity_id).toBe("light.kitchen");
    expect(entityLabel(entities[1])).toBe("PV today");
  });

  it("merges hourly history into a 24-hour chart", () => {
    const rows = mergeHourlySeries(
      {
        "sensor.gen": [{ hour: "10:00", value: 4 }, { hour: "11:00", value: 5 }],
        "sensor.use": [{ hour: "10:00", value: 2 }],
      },
      { generation: "sensor.gen", consumption: "sensor.use", export: "sensor.export" }
    );
    expect(rows).toHaveLength(24);
    expect(rows[10]).toEqual({ hour: "10:00", generation: 4, consumption: 2, export: 0 });
    expect(rows[11].generation).toBe(5);
  });

  it("merges daily history and summarizes a series", () => {
    const rows = mergeDatedSeries(
      {
        "sensor.gen": [
          { date: "2026-03-01", consumption: 10 },
          { date: "2026-03-02", consumption: 12 },
        ],
      },
      { generation: "sensor.gen" }
    );
    expect(rows).toEqual([
      { hour: "03-01", generation: 10, consumption: 0, export: 0 },
      { hour: "03-02", generation: 12, consumption: 0, export: 0 },
    ]);
    expect(seriesStats([0, 2.5, 7.9, 5.4])?.min).toBe(2.5);
    expect(seriesStats([0, 2.5, 7.9, 5.4])?.max).toBe(7.9);
    expect(seriesStats([0, 2.5, 7.9, 5.4])?.avg).toBeCloseTo(5.2667, 3);
    expect(seriesStats([0, 0])).toBeUndefined();
    expect(formatHourTick("06:00")).toBe("6am");
    expect(formatHourTick("13:00")).toBe("1pm");
  });

  it("maps panel temperatures onto heatmap tones", () => {
    expect(heatmapTones([22, 35, 55])).toEqual(["idle", "warm", "hot"]);
    expect(heatmapTones([undefined, undefined])).toEqual(["idle", "idle"]);
  });

  it("hides battery and heatmap when there is no reading", () => {
    expect(shouldShowBatteryCard({})).toBe(false);
    expect(shouldShowBatteryCard({ soc: undefined, power: Number.NaN })).toBe(false);
    expect(shouldShowBatteryCard({ soc: 68 })).toBe(true);
    expect(shouldShowBatteryCard({ temp: 21 })).toBe(true);
    expect(shouldShowHeatmap([])).toBe(false);
    expect(shouldShowHeatmap([undefined, undefined])).toBe(false);
    expect(shouldShowHeatmap([undefined, 42])).toBe(true);
  });
});
