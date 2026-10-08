/**
 * Energy page flow scene helpers: live-power → arrow visibility, unit
 * conversion, demo fallbacks, and self-consumption math used by the mockup layout.
 */

import { formatEnergyValue, toKilowatts, toKwh } from "@/lib/energy-dashboard";

export type EnergyFlowId = "solar" | "import" | "export" | "home";

export type EnergyFlowPowers = {
  /** Live solar production (kW). */
  solarKw?: number;
  /** Live grid import / afname (kW). */
  importKw?: number;
  /** Live grid export / teruglevering (kW). */
  exportKw?: number;
  /** Live household consumption (kW). */
  homeKw?: number;
};

export type EnergyFlowVisibility = Record<EnergyFlowId, boolean>;

/** Power above this (kW) counts as an active animated flow. */
export const ENERGY_FLOW_ACTIVE_THRESHOLD_KW = 0.02;

/** Demo values matching the mockup when no sensors are linked. */
export const ENERGY_FLOW_DEMO = {
  solarTodayKwh: 18.7,
  consumptionTodayKwh: 9.53,
  exportTodayKwh: 5.73,
  importTodayKwh: 4.84,
  selfConsumedKwh: 13.0,
  selfConsumptionPct: 70,
  solarKw: 3.2,
  /** Demo powers keep all three mockup flows animating. */
  importKw: 0.9,
  exportKw: 1.4,
  homeKw: 1.8,
  solarSpark: [0, 0.2, 1.1, 2.4, 3.8, 4.6, 4.9, 4.5, 3.6, 2.2, 0.8, 0.1],
  consumptionSpark: [0.4, 0.6, 1.2, 0.8, 0.7, 0.9, 1.1, 1.8, 2.2, 1.6, 1.0, 0.7],
  exportSpark: [0, 0, 0.4, 1.2, 2.1, 2.8, 3.0, 2.6, 1.8, 0.9, 0.2, 0],
  vsYesterday: {
    solar: 24,
    consumption: -12,
    export: -18,
  },
} as const;

export function isFlowActive(kw: number | undefined, threshold = ENERGY_FLOW_ACTIVE_THRESHOLD_KW): boolean {
  return kw != null && Number.isFinite(kw) && kw > threshold;
}

export function energyFlowVisibility(powers: EnergyFlowPowers): EnergyFlowVisibility {
  return {
    solar: isFlowActive(powers.solarKw),
    import: isFlowActive(powers.importKw),
    export: isFlowActive(powers.exportKw),
    home: isFlowActive(powers.homeKw),
  };
}

/** Prefer house load for the hub; fall back to import, then solar. */
export function hubActiveKw(powers: EnergyFlowPowers): number | undefined {
  if (isFlowActive(powers.homeKw)) return powers.homeKw;
  if (isFlowActive(powers.importKw)) return powers.importKw;
  if (isFlowActive(powers.solarKw)) return powers.solarKw;
  if (powers.homeKw != null && Number.isFinite(powers.homeKw)) return powers.homeKw;
  if (powers.importKw != null && Number.isFinite(powers.importKw)) return powers.importKw;
  if (powers.solarKw != null && Number.isFinite(powers.solarKw)) return powers.solarKw;
  return undefined;
}

export function readingToKw(value: number | undefined, unit?: string | null): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  return toKilowatts(value, unit);
}

export function readingToKwh(value: number | undefined, unit?: string | null): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  const u = (unit ?? "").trim().toLowerCase();
  if (u === "w" || u === "kw") return undefined;
  return toKwh(value, unit);
}

/**
 * Self-consumption: share of solar used on-site.
 * selfConsumed = solar - export (clamped); pct = selfConsumed / solar * 100.
 */
export function selfConsumption(input: {
  solarTodayKwh?: number;
  exportTodayKwh?: number;
  consumptionTodayKwh?: number;
}): { selfConsumedKwh?: number; pct?: number } {
  const solar = input.solarTodayKwh;
  if (solar == null || !Number.isFinite(solar) || solar <= 0) {
    return { selfConsumedKwh: undefined, pct: undefined };
  }
  let selfConsumed: number;
  if (input.exportTodayKwh != null && Number.isFinite(input.exportTodayKwh)) {
    selfConsumed = Math.max(0, Math.min(solar, solar - Math.max(0, input.exportTodayKwh)));
  } else if (input.consumptionTodayKwh != null && Number.isFinite(input.consumptionTodayKwh)) {
    selfConsumed = Math.max(0, Math.min(solar, input.consumptionTodayKwh));
  } else {
    return { selfConsumedKwh: undefined, pct: undefined };
  }
  // Round to 2 decimals for stable UI/tests (avoid 12.969999… float noise).
  selfConsumed = Math.round(selfConsumed * 100) / 100;
  const pct = Math.round((selfConsumed / solar) * 100);
  return { selfConsumedKwh: selfConsumed, pct: Math.max(0, Math.min(100, pct)) };
}

export function percentChange(today?: number, yesterday?: number): number | undefined {
  if (today == null || yesterday == null || !Number.isFinite(today) || !Number.isFinite(yesterday)) {
    return undefined;
  }
  if (yesterday === 0) return today === 0 ? 0 : undefined;
  return Math.round(((today - yesterday) / Math.abs(yesterday)) * 100);
}

export function formatSignedPercent(value: number | undefined): string {
  if (value == null || !Number.isFinite(value)) return "";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

export function formatKwLabel(kw: number | undefined, digits = 2): string {
  if (kw == null || !Number.isFinite(kw)) return "—";
  return `${formatEnergyValue(kw, digits)} kW`;
}

export function formatKwhLabel(kwh: number | undefined, digits = 2): string {
  if (kwh == null || !Number.isFinite(kwh)) return "—";
  return `${formatEnergyValue(kwh, digits)} kWh`;
}

/** Normalize a series for mini bar charts (0–1). */
export function normalizeSparkBars(values: number[], slots = 12): number[] {
  if (values.length === 0) return Array.from({ length: slots }, () => 0);
  const sampled =
    values.length === slots
      ? values
      : Array.from({ length: slots }, (_, i) => {
          const idx = Math.min(values.length - 1, Math.round((i / Math.max(1, slots - 1)) * (values.length - 1)));
          return values[idx] ?? 0;
        });
  const max = Math.max(0.001, ...sampled.map((v) => (Number.isFinite(v) ? Math.max(0, v) : 0)));
  return sampled.map((v) => Math.max(0, Math.min(1, (Number.isFinite(v) ? v : 0) / max)));
}

export function balanceBarWidths(input: {
  solar?: number;
  consumption?: number;
  export?: number;
  import?: number;
}): { solar: number; consumption: number; export: number; import: number } {
  const vals = [input.solar, input.consumption, input.export, input.import].map((v) =>
    v != null && Number.isFinite(v) && v > 0 ? v : 0
  );
  const max = Math.max(0.001, ...vals);
  return {
    solar: ((input.solar ?? 0) > 0 ? (input.solar as number) : 0) / max,
    consumption: ((input.consumption ?? 0) > 0 ? (input.consumption as number) : 0) / max,
    export: ((input.export ?? 0) > 0 ? (input.export as number) : 0) / max,
    import: ((input.import ?? 0) > 0 ? (input.import as number) : 0) / max,
  };
}
