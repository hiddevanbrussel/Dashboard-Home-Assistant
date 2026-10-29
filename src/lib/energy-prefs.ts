/**
 * Parse Home Assistant energy preferences into one model.
 * Accepts the legacy flow_from/flow_to shape (<=2025.11), grid power (2025.12),
 * power_config (2026.2), and the flat grid object (2026.3+, battery SoC from 2026.6).
 * Unknown fields are ignored. Missing fields become null.
 * `not_found` from energy/get_prefs becomes source "manual".
 */

import type { HaWsCommandResult } from "./ha/ws-commands";

export type EnergyPowerConfig = {
  statRate: string | null;
  statRateInverted: string | null;
  statRateFrom: string | null;
  statRateTo: string | null;
};

export type EnergyGridSource = {
  type: "grid";
  name: string | null;
  statEnergyFrom: string | null;
  statEnergyTo: string | null;
  statCost: string | null;
  entityEnergyPrice: string | null;
  numberEnergyPrice: number | null;
  statCompensation: string | null;
  entityEnergyPriceExport: string | null;
  numberEnergyPriceExport: number | null;
  statRate: string | null;
  powerConfig: EnergyPowerConfig | null;
  costAdjustmentDay: number | null;
};

export type EnergySolarSource = {
  type: "solar";
  name: string | null;
  statEnergyFrom: string | null;
  statRate: string | null;
  configEntrySolarForecast: string[] | null;
};

export type EnergyBatterySource = {
  type: "battery";
  name: string | null;
  statEnergyFrom: string | null;
  statEnergyTo: string | null;
  statRate: string | null;
  powerConfig: EnergyPowerConfig | null;
  statSoc: string | null;
  capacity: number | null;
};

export type EnergyFlowSource = {
  type: "gas" | "water";
  name: string | null;
  statEnergyFrom: string | null;
  statRate: string | null;
  statCost: string | null;
  entityEnergyPrice: string | null;
  numberEnergyPrice: number | null;
};

export type EnergySource = EnergyGridSource | EnergySolarSource | EnergyBatterySource | EnergyFlowSource;

export type EnergyDevice = {
  statConsumption: string | null;
  statRate: string | null;
  name: string | null;
  includedInStat: string | null;
};

export type EnergyModel = {
  source: "prefs" | "manual";
  energySources: EnergySource[];
  deviceConsumption: EnergyDevice[];
  deviceConsumptionWater: EnergyDevice[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function strOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function numOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parsePowerConfig(value: unknown): EnergyPowerConfig | null {
  if (!isRecord(value)) return null;
  const config: EnergyPowerConfig = {
    statRate: strOrNull(value.stat_rate),
    statRateInverted: strOrNull(value.stat_rate_inverted),
    statRateFrom: strOrNull(value.stat_rate_from),
    statRateTo: strOrNull(value.stat_rate_to),
  };
  if (!config.statRate && !config.statRateInverted && !config.statRateFrom && !config.statRateTo) return null;
  return config;
}

function asList(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (isRecord(item) ? item : {}));
}

/**
 * Pair flow_from, flow_to, and power by index, the same way Home Assistant
 * migrates a legacy grid with `_migrate_legacy_grid_to_unified`.
 */
export function migrateLegacyGrid(oldGrid: Record<string, unknown>): EnergyGridSource[] {
  const flowFrom = asList(oldGrid.flow_from);
  const flowTo = asList(oldGrid.flow_to);
  const power = asList(oldGrid.power);
  const costAdjustmentDay = numOrNull(oldGrid.cost_adjustment_day);
  const count = Math.max(flowFrom.length, flowTo.length, power.length);
  const sources: EnergyGridSource[] = [];
  for (let index = 0; index < count; index += 1) {
    const from = flowFrom[index];
    const to = flowTo[index];
    const rate = power[index];
    sources.push({
      type: "grid",
      name: strOrNull(oldGrid.name),
      statEnergyFrom: from ? strOrNull(from.stat_energy_from) : null,
      statEnergyTo: to ? strOrNull(to.stat_energy_to) : null,
      statCost: from ? strOrNull(from.stat_cost) : null,
      entityEnergyPrice: from ? strOrNull(from.entity_energy_price) : null,
      numberEnergyPrice: from ? numOrNull(from.number_energy_price) : null,
      statCompensation: to ? strOrNull(to.stat_compensation) : null,
      entityEnergyPriceExport: to ? strOrNull(to.entity_energy_price) : null,
      numberEnergyPriceExport: to ? numOrNull(to.number_energy_price) : null,
      statRate: rate ? strOrNull(rate.stat_rate) : null,
      powerConfig: rate ? parsePowerConfig(rate.power_config) : null,
      costAdjustmentDay,
    });
  }
  return sources;
}

function parseFlatGrid(source: Record<string, unknown>): EnergyGridSource {
  return {
    type: "grid",
    name: strOrNull(source.name),
    statEnergyFrom: strOrNull(source.stat_energy_from),
    statEnergyTo: strOrNull(source.stat_energy_to),
    statCost: strOrNull(source.stat_cost),
    entityEnergyPrice: strOrNull(source.entity_energy_price),
    numberEnergyPrice: numOrNull(source.number_energy_price),
    statCompensation: strOrNull(source.stat_compensation),
    entityEnergyPriceExport: strOrNull(source.entity_energy_price_export),
    numberEnergyPriceExport: numOrNull(source.number_energy_price_export),
    statRate: strOrNull(source.stat_rate),
    powerConfig: parsePowerConfig(source.power_config),
    costAdjustmentDay: numOrNull(source.cost_adjustment_day),
  };
}

function parseSolar(source: Record<string, unknown>): EnergySolarSource {
  const forecast = Array.isArray(source.config_entry_solar_forecast)
    ? source.config_entry_solar_forecast.filter((item): item is string => typeof item === "string" && item.trim() !== "")
    : null;
  return {
    type: "solar",
    name: strOrNull(source.name),
    statEnergyFrom: strOrNull(source.stat_energy_from),
    statRate: strOrNull(source.stat_rate),
    configEntrySolarForecast: forecast && forecast.length > 0 ? forecast : null,
  };
}

function parseBattery(source: Record<string, unknown>): EnergyBatterySource {
  return {
    type: "battery",
    name: strOrNull(source.name),
    statEnergyFrom: strOrNull(source.stat_energy_from),
    statEnergyTo: strOrNull(source.stat_energy_to),
    statRate: strOrNull(source.stat_rate),
    powerConfig: parsePowerConfig(source.power_config),
    statSoc: strOrNull(source.stat_soc),
    capacity: numOrNull(source.capacity),
  };
}

function parseFlow(type: "gas" | "water", source: Record<string, unknown>): EnergyFlowSource {
  return {
    type,
    name: strOrNull(source.name),
    statEnergyFrom: strOrNull(source.stat_energy_from),
    statRate: strOrNull(source.stat_rate),
    statCost: strOrNull(source.stat_cost),
    entityEnergyPrice: strOrNull(source.entity_energy_price),
    numberEnergyPrice: numOrNull(source.number_energy_price),
  };
}

function parseDevices(value: unknown): EnergyDevice[] {
  if (!Array.isArray(value)) return [];
  const devices: EnergyDevice[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    devices.push({
      statConsumption: strOrNull(item.stat_consumption),
      statRate: strOrNull(item.stat_rate),
      name: strOrNull(item.name),
      includedInStat: strOrNull(item.included_in_stat),
    });
  }
  return devices;
}

function isLegacyGrid(source: Record<string, unknown>): boolean {
  return source.type === "grid" && Object.prototype.hasOwnProperty.call(source, "flow_from");
}

export function emptyManualModel(): EnergyModel {
  return {
    source: "manual",
    energySources: [],
    deviceConsumption: [],
    deviceConsumptionWater: [],
  };
}

/** Parse a prefs document. The result always has source "prefs", even when nothing is configured. */
export function parseEnergyPrefs(raw: unknown): EnergyModel {
  const root = isRecord(raw) ? raw : {};
  const energySources: EnergySource[] = [];
  const list = Array.isArray(root.energy_sources) ? root.energy_sources : [];
  for (const item of list) {
    if (!isRecord(item)) continue;
    if (isLegacyGrid(item)) {
      energySources.push(...migrateLegacyGrid(item));
      continue;
    }
    switch (item.type) {
      case "grid":
        energySources.push(parseFlatGrid(item));
        break;
      case "solar":
        energySources.push(parseSolar(item));
        break;
      case "battery":
        energySources.push(parseBattery(item));
        break;
      case "gas":
        energySources.push(parseFlow("gas", item));
        break;
      case "water":
        energySources.push(parseFlow("water", item));
        break;
      default:
        break;
    }
  }
  return {
    source: "prefs",
    energySources,
    deviceConsumption: parseDevices(root.device_consumption),
    deviceConsumptionWater: parseDevices(root.device_consumption_water),
  };
}

export function energyModelFromCommand(result: HaWsCommandResult): EnergyModel {
  if (!result.success) {
    if (result.error.code === "not_found") return emptyManualModel();
    throw new Error(`Energy prefs unavailable (${result.error.code})`);
  }
  return parseEnergyPrefs(result.result);
}
