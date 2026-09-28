/**
 * Energy home card: house illustration with floating day metrics
 * (Opwek, Zelfvoorzienend, Net, Kosten, Teruglevering).
 */

export const ENERGY_HOME_CARD_DEFAULT_WIDTH = 420;
export const ENERGY_HOME_CARD_DEFAULT_HEIGHT = 340;
export const ENERGY_HOME_CARD_MIN_WIDTH = 280;
export const ENERGY_HOME_CARD_MAX_WIDTH = 720;
export const ENERGY_HOME_CARD_MIN_HEIGHT = 220;
export const ENERGY_HOME_CARD_MAX_HEIGHT = 560;

/** Demo values matching the design mockup (when HA sensors are unavailable). */
export const ENERGY_HOME_DEMO = {
  generationKwh: 13,
  selfConsumedKwh: 8.4,
  selfSufficiencyPct: 82,
  gridImportKwh: 1.8,
  costEur: 0.76,
  exportKwh: 4.6,
} as const;

export type EnergyHomeMetrics = {
  generationKwh: number;
  selfConsumedKwh: number;
  selfSufficiencyPct: number;
  gridImportKwh: number;
  costEur: number;
  exportKwh: number;
  /** True when showing mockup demo numbers (no linked sensors). */
  usingDemo: boolean;
};

export function clampEnergyHomeCardWidth(w: unknown): number {
  const n = typeof w === "number" ? w : Number(w);
  if (!Number.isFinite(n)) return ENERGY_HOME_CARD_DEFAULT_WIDTH;
  return Math.max(
    ENERGY_HOME_CARD_MIN_WIDTH,
    Math.min(ENERGY_HOME_CARD_MAX_WIDTH, Math.round(n))
  );
}

export function clampEnergyHomeCardHeight(h: unknown): number {
  const n = typeof h === "number" ? h : Number(h);
  if (!Number.isFinite(n)) return ENERGY_HOME_CARD_DEFAULT_HEIGHT;
  return Math.max(
    ENERGY_HOME_CARD_MIN_HEIGHT,
    Math.min(ENERGY_HOME_CARD_MAX_HEIGHT, Math.round(n))
  );
}

/**
 * Derive self-consumed energy and self-sufficiency from generation, export, and grid import.
 *
 * - selfConsumed = max(0, generation − export)
 * - homeConsumption = selfConsumed + gridImport
 * - selfSufficiencyPct = selfConsumed / homeConsumption × 100
 * - cost = gridImport × costPerKwh (0 when rate missing)
 *
 * When no readings are provided, returns demo metrics matching the mockup.
 */
export function computeEnergyHomeMetrics(input: {
  generationKwh?: number;
  exportKwh?: number;
  gridImportKwh?: number;
  costPerKwh?: number;
}): EnergyHomeMetrics {
  const hasGeneration = input.generationKwh != null && Number.isFinite(input.generationKwh);
  const hasExport = input.exportKwh != null && Number.isFinite(input.exportKwh);
  const hasImport = input.gridImportKwh != null && Number.isFinite(input.gridImportKwh);

  if (!hasGeneration && !hasExport && !hasImport) {
    return { ...ENERGY_HOME_DEMO, usingDemo: true };
  }

  const generationKwh = hasGeneration ? Math.max(0, input.generationKwh as number) : 0;
  const exportKwh = hasExport ? Math.max(0, input.exportKwh as number) : 0;
  const gridImportKwh = hasImport ? Math.max(0, input.gridImportKwh as number) : 0;

  const selfConsumedKwh = Math.max(0, generationKwh - exportKwh);
  const homeConsumption = selfConsumedKwh + gridImportKwh;
  const selfSufficiencyPct =
    homeConsumption > 0 ? Math.round((selfConsumedKwh / homeConsumption) * 100) : 0;

  const rate =
    input.costPerKwh != null && Number.isFinite(input.costPerKwh) && input.costPerKwh > 0
      ? input.costPerKwh
      : undefined;
  const costEur = rate != null ? gridImportKwh * rate : 0;

  return {
    generationKwh,
    selfConsumedKwh,
    selfSufficiencyPct,
    gridImportKwh,
    costEur,
    exportKwh,
    usingDemo: false,
  };
}

export function formatEnergyHomeKwh(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  const rounded =
    digits === 0
      ? Math.round(value)
      : Math.round(value * 10 ** digits) / 10 ** digits;
  const text =
    digits === 0
      ? String(rounded)
      : rounded.toFixed(digits).replace(/\.0$/, "");
  return `${text} kWh`;
}

export function formatEnergyHomeCost(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 10 ** digits) / 10 ** digits;
  return `€${rounded.toFixed(digits)}`;
}

export function formatEnergyHomeSelfSufficiency(
  selfConsumedKwh: number,
  pct: number,
  kwhDigits = 1
): string {
  return `${formatEnergyHomeKwh(selfConsumedKwh, kwhDigits)} ${Math.round(pct)}%`;
}

/** Bottom-right resize: grow width rightward, height upward (bottom stays put when possible). */
export function resizeEnergyHomeCardFromBottomRight(input: {
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startBottom: number;
  dx: number;
  dy: number;
  viewportWidth: number;
  viewportHeight: number;
}): { width: number; height: number; left: number; bottom: number } {
  const width = clampEnergyHomeCardWidth(input.startWidth + input.dx);
  const height = clampEnergyHomeCardHeight(input.startHeight - input.dy);
  const maxLeft = Math.max(0, input.viewportWidth - width);
  const maxBottom = Math.max(0, input.viewportHeight - height);
  const left = Math.max(0, Math.min(input.startLeft, maxLeft));
  const bottom = Math.max(0, Math.min(input.startBottom, maxBottom));
  return { width, height, left, bottom };
}
