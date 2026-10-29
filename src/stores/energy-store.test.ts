/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it } from "vitest";
import { hydrateEnergyStore, useEnergyStore } from "@/stores/energy-store";

const ENTITIES = {
  solarYieldTodayEntityId: "sensor.solar_yield",
  solarPowerEntityId: "sensor.solar_power",
  gridExportEntityId: "sensor.grid_export",
  consumptionEntityId: "sensor.consumption",
  batterySocEntityId: "sensor.battery_soc",
  batteryPowerEntityId: "sensor.battery_power",
  batteryTempEntityId: "sensor.battery_temp",
};

/** Keys the energy page already stored on main, before topDeviceIds existed. */
const MAIN_FIXTURE: Record<string, string> = {
  "dashboard.energy.enabled": "true",
  "dashboard.energy.costPerKwh": "0.27",
  "dashboard.energy.netbeheerkostenPerDag": "0.45",
  "dashboard.energy.vasteLeveringskostenPerMaand": "6.5",
  "dashboard.energy.gasCostPerM3": "1.3",
  "dashboard.energy.gasNetbeheerkostenPerDag": "0.2",
  "dashboard.energy.gasVasteLeveringskostenPerMaand": "4",
  "dashboard.energy.entities": JSON.stringify(ENTITIES),
  "dashboard.energy.panelTempEntityIds": JSON.stringify(["sensor.panel_1", "sensor.panel_2"]),
};

describe("energy store localStorage from main", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads the main fixture and does not invent a device choice", () => {
    for (const [key, value] of Object.entries(MAIN_FIXTURE)) localStorage.setItem(key, value);
    hydrateEnergyStore();
    const state = useEnergyStore.getState();
    expect(state.enabled).toBe(true);
    expect(state.costPerKwh).toBe(0.27);
    expect(state.netbeheerkostenPerDag).toBe(0.45);
    expect(state.vasteLeveringskostenPerMaand).toBe(6.5);
    expect(state.gasCostPerM3).toBe(1.3);
    expect(state.gasNetbeheerkostenPerDag).toBe(0.2);
    expect(state.gasVasteLeveringskostenPerMaand).toBe(4);
    expect(state.entities).toMatchObject(ENTITIES);
    expect(state.entities.gridPowerEntityId).toBe("");
    expect(state.entities.gridImportPowerEntityId).toBe("");
    expect(state.entities.gridExportPowerEntityId).toBe("");
    expect(state.panelTempEntityIds).toEqual(["sensor.panel_1", "sensor.panel_2"]);
    expect(state.tariffMode).toBe("fixed");
    expect(state.gridPowerInverted).toBe(false);
    expect(state).not.toHaveProperty("topDeviceIds");
    expect(localStorage.getItem("dashboard.energy.topDeviceIds")).toBeNull();
    expect(localStorage.getItem("dashboard.energy.tariffMode")).toBeNull();
    expect(localStorage.getItem("dashboard.energy.gridPowerInverted")).toBeNull();
    expect(JSON.stringify(localStorage)).not.toContain("topDeviceIds");
    const storedEntities = JSON.parse(localStorage.getItem("dashboard.energy.entities") ?? "{}") as Record<string, string>;
    expect(storedEntities).toEqual(ENTITIES);
    expect(storedEntities).not.toHaveProperty("gridPowerEntityId");
  });

  it("defaults tariff to fixed and keeps an explicit dynamic choice", () => {
    hydrateEnergyStore();
    expect(useEnergyStore.getState().tariffMode).toBe("fixed");
    localStorage.setItem("dashboard.energy.tariffMode", "dynamic");
    localStorage.setItem("dashboard.energy.gridPowerInverted", "true");
    hydrateEnergyStore();
    expect(useEnergyStore.getState().tariffMode).toBe("dynamic");
    expect(useEnergyStore.getState().gridPowerInverted).toBe(true);
    localStorage.setItem("dashboard.energy.tariffMode", "later");
    hydrateEnergyStore();
    expect(useEnergyStore.getState().tariffMode).toBe("fixed");
  });
});
