/**
 * Live power in kilowatts for the energy overview.
 * Home Assistant signs: grid positive means import, battery positive means discharge.
 * Source 1 is stat_rate / power_config from energy prefs. Source 2 is the manual choice.
 * A measured consumption sensor wins over the calculated house power.
 * Units go through toKilowatts. Each result is the median of the last three polls.
 */

import { toKilowatts } from "./energy-dashboard";
import type {
  EnergyBatterySource,
  EnergyGridSource,
  EnergyModel,
  EnergyPowerConfig,
  EnergySolarSource,
} from "./energy-prefs";

export type LiveReading = { value: number; unit?: string | null };

export type LiveSamples = Readonly<Record<string, LiveReading | undefined>>;

export type ManualLiveEntities = {
  gridPowerEntityId: string;
  gridImportPowerEntityId: string;
  gridExportPowerEntityId: string;
  gridPowerInverted: boolean;
  consumptionEntityId: string;
  solarPowerEntityId: string;
  batteryPowerEntityId: string;
};

/** Median of the last three finite numbers. Two values use their mean. */
export function medianOf(values: readonly number[]): number | null {
  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length === 0) return null;
  const recent = finite.slice(-3);
  const sorted = [...recent].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] ?? null;
  const left = sorted[mid - 1];
  const right = sorted[mid];
  if (left == null || right == null) return null;
  return (left + right) / 2;
}

function readingKw(samples: LiveSamples, id: string | null | undefined): number | null {
  if (!id) return null;
  const sample = samples[id];
  if (!sample || !Number.isFinite(sample.value)) return null;
  return toKilowatts(sample.value, sample.unit);
}

function clampAtLeastZero(value: number): number {
  return value < 0 ? 0 : value;
}

/** Median of this raw sample plus earlier raw samples. Callers must not pass smoothed values. */
function smooth(current: number | null, previous: readonly number[] | undefined): number | null {
  if (current == null || !Number.isFinite(current)) return null;
  return medianOf([...(previous ?? []), current]);
}

function firstGrid(model: EnergyModel | null): EnergyGridSource | null {
  if (!model) return null;
  for (const source of model.energySources) {
    if (source.type === "grid" && (source.powerConfig || source.statRate)) return source;
  }
  return null;
}

function firstSolar(model: EnergyModel | null): EnergySolarSource | null {
  if (!model) return null;
  for (const source of model.energySources) {
    if (source.type === "solar" && source.statRate) return source;
  }
  return null;
}

function firstBattery(model: EnergyModel | null): EnergyBatterySource | null {
  if (!model) return null;
  for (const source of model.energySources) {
    if (source.type === "battery" && (source.powerConfig || source.statRate)) return source;
  }
  return null;
}

/** Signed kilowatts from a power_config. Positive means import or discharge. */
function powerFromConfig(config: EnergyPowerConfig, samples: LiveSamples): number | null {
  if (config.statRate) return readingKw(samples, config.statRate);
  if (config.statRateInverted) {
    const value = readingKw(samples, config.statRateInverted);
    return value == null ? null : -value;
  }
  if (config.statRateFrom || config.statRateTo) {
    const from = readingKw(samples, config.statRateFrom);
    const to = readingKw(samples, config.statRateTo);
    if (from == null && to == null) return null;
    return clampAtLeastZero(from ?? 0) - clampAtLeastZero(to ?? 0);
  }
  return null;
}

function configIsSet(config: EnergyPowerConfig | null): boolean {
  if (!config) return false;
  return Boolean(config.statRate || config.statRateInverted || config.statRateFrom || config.statRateTo);
}

export function gridPowerNow(input: {
  model: EnergyModel | null;
  manual: Pick<
    ManualLiveEntities,
    "gridPowerEntityId" | "gridImportPowerEntityId" | "gridExportPowerEntityId" | "gridPowerInverted"
  >;
  samples: LiveSamples;
}): number | null {
  const grid = firstGrid(input.model);
  if (grid && configIsSet(grid.powerConfig)) {
    return powerFromConfig(grid.powerConfig as EnergyPowerConfig, input.samples);
  }
  if (grid?.statRate) return readingKw(input.samples, grid.statRate);

  if (input.manual.gridPowerEntityId) {
    const value = readingKw(input.samples, input.manual.gridPowerEntityId);
    if (value == null) return null;
    return input.manual.gridPowerInverted ? -value : value;
  }
  if (input.manual.gridImportPowerEntityId || input.manual.gridExportPowerEntityId) {
    const imported = readingKw(input.samples, input.manual.gridImportPowerEntityId);
    const exported = readingKw(input.samples, input.manual.gridExportPowerEntityId);
    if (imported == null && exported == null) return null;
    const signed = clampAtLeastZero(imported ?? 0) - clampAtLeastZero(exported ?? 0);
    return input.manual.gridPowerInverted ? -signed : signed;
  }
  return null;
}

export function gridPowerKw(
  input: Parameters<typeof gridPowerNow>[0] & { previous?: readonly number[] }
): number | null {
  return smooth(gridPowerNow(input), input.previous);
}

export function batteryPowerNow(input: {
  model: EnergyModel | null;
  manual: Pick<ManualLiveEntities, "batteryPowerEntityId">;
  samples: LiveSamples;
}): number | null {
  const battery = firstBattery(input.model);
  if (battery && configIsSet(battery.powerConfig)) {
    return powerFromConfig(battery.powerConfig as EnergyPowerConfig, input.samples);
  }
  if (battery?.statRate) return readingKw(input.samples, battery.statRate);
  return readingKw(input.samples, input.manual.batteryPowerEntityId);
}

export function batteryKw(
  input: Parameters<typeof batteryPowerNow>[0] & { previous?: readonly number[] }
): number | null {
  return smooth(batteryPowerNow(input), input.previous);
}

export function solarPowerNow(input: {
  model: EnergyModel | null;
  manual: Pick<ManualLiveEntities, "solarPowerEntityId">;
  samples: LiveSamples;
}): number | null {
  const solar = firstSolar(input.model);
  if (solar?.statRate) {
    const value = readingKw(input.samples, solar.statRate);
    return value == null ? null : clampAtLeastZero(value);
  }
  const manual = readingKw(input.samples, input.manual.solarPowerEntityId);
  return manual == null ? null : clampAtLeastZero(manual);
}

export function solarPowerKw(
  input: Parameters<typeof solarPowerNow>[0] & { previous?: readonly number[] }
): number | null {
  return smooth(solarPowerNow(input), input.previous);
}

/**
 * House power. A measured consumptionEntityId wins.
 * Otherwise solar + grid + battery, clamped at zero.
 */
export function housePowerNow(input: {
  model: EnergyModel | null;
  manual: ManualLiveEntities;
  samples: LiveSamples;
}): number | null {
  if (input.manual.consumptionEntityId.trim()) {
    const measured = readingKw(input.samples, input.manual.consumptionEntityId);
    return measured == null ? null : clampAtLeastZero(measured);
  }
  const solar = solarPowerNow(input);
  const grid = gridPowerNow(input);
  const battery = batteryPowerNow(input);
  if (linkedSolar(input) && solar == null) return null;
  if (linkedGrid(input) && grid == null) return null;
  if (linkedBattery(input) && battery == null) return null;
  if (solar == null && grid == null && battery == null) return null;
  return clampAtLeastZero((solar ?? 0) + (grid ?? 0) + (battery ?? 0));
}

function linkedSolar(input: Parameters<typeof solarPowerNow>[0]): boolean {
  if (input.manual.solarPowerEntityId.trim()) return true;
  return firstSolar(input.model)?.statRate != null;
}

function linkedGrid(input: Parameters<typeof gridPowerNow>[0]): boolean {
  if (
    input.manual.gridPowerEntityId.trim() ||
    input.manual.gridImportPowerEntityId.trim() ||
    input.manual.gridExportPowerEntityId.trim()
  ) {
    return true;
  }
  return firstGrid(input.model) != null;
}

function linkedBattery(input: Parameters<typeof batteryPowerNow>[0]): boolean {
  if (input.manual.batteryPowerEntityId.trim()) return true;
  return firstBattery(input.model) != null;
}

export function housePowerKw(
  input: Parameters<typeof housePowerNow>[0] & { previous?: readonly number[] }
): number | null {
  return smooth(housePowerNow(input), input.previous);
}
