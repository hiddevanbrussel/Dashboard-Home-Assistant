/**
 * Energy metric: loose floating title + value/unit text for the energy board.
 * Matches mockup labels (Opwek, Net, Kosten, …) — no card chrome.
 */

export const ENERGY_METRIC_DEFAULT_WIDTH = 160;
export const ENERGY_METRIC_DEFAULT_HEIGHT = 56;
export const ENERGY_METRIC_MIN_WIDTH = 80;
export const ENERGY_METRIC_MAX_WIDTH = 420;
export const ENERGY_METRIC_MIN_HEIGHT = 40;
export const ENERGY_METRIC_MAX_HEIGHT = 120;

/** Default text color (white) for readability on the energy illustration. */
export const ENERGY_METRIC_DEFAULT_COLOR = "#FFFFFF";

/** Units that render before the number (e.g. €0.76). */
const PREFIX_UNITS = new Set(["€", "$", "£"]);

export function clampEnergyMetricWidth(w: unknown): number {
  const n = typeof w === "number" ? w : Number(w);
  if (!Number.isFinite(n)) return ENERGY_METRIC_DEFAULT_WIDTH;
  return Math.max(
    ENERGY_METRIC_MIN_WIDTH,
    Math.min(ENERGY_METRIC_MAX_WIDTH, Math.round(n))
  );
}

export function clampEnergyMetricHeight(h: unknown): number {
  const n = typeof h === "number" ? h : Number(h);
  if (!Number.isFinite(n)) return ENERGY_METRIC_DEFAULT_HEIGHT;
  return Math.max(
    ENERGY_METRIC_MIN_HEIGHT,
    Math.min(ENERGY_METRIC_MAX_HEIGHT, Math.round(n))
  );
}

export function isPrefixUnit(unit: string | undefined | null): boolean {
  if (!unit) return false;
  return PREFIX_UNITS.has(unit.trim());
}

/**
 * Format a numeric (or string) metric value with optional unit and secondary text.
 * - Prefix units (€, $, £) go before the number.
 * - Other units append after a space.
 * - `secondary` (e.g. "82%") appends after the primary value/unit.
 */
export function formatEnergyMetricDisplay(input: {
  value: string | number | null | undefined;
  unit?: string | null;
  secondary?: string | null;
  /** Force unit before the value even when not in PREFIX_UNITS. */
  unitAsPrefix?: boolean;
}): string {
  const raw = input.value;
  if (raw == null || raw === "" || raw === "unavailable" || raw === "unknown") {
    return "—";
  }

  let numberText: string;
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return "—";
    const rounded = Math.round(raw * 100) / 100;
    numberText = Number.isInteger(rounded)
      ? String(rounded)
      : String(rounded).replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
  } else {
    const asNum = Number(String(raw).trim().replace(",", "."));
    if (String(raw).trim() !== "" && Number.isFinite(asNum) && /^-?\d/.test(String(raw).trim())) {
      const rounded = Math.round(asNum * 100) / 100;
      numberText = Number.isInteger(rounded)
        ? String(rounded)
        : String(rounded).replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
    } else {
      numberText = String(raw).trim();
    }
  }

  const unit = (input.unit ?? "").trim();
  const asPrefix = input.unitAsPrefix === true || isPrefixUnit(unit);
  let primary = numberText;
  if (unit) {
    primary = asPrefix ? `${unit}${numberText}` : `${numberText} ${unit}`;
  }

  const secondary = (input.secondary ?? "").trim();
  if (secondary) return `${primary} ${secondary}`;
  return primary;
}

/** Resolve display value: prefer live entity reading, else manual override. */
export function resolveEnergyMetricValue(input: {
  entityState?: string | null;
  entityUnit?: string | null;
  manualValue?: string | null;
  unitOverride?: string | null;
  secondary?: string | null;
  unitAsPrefix?: boolean;
}): { display: string; usingManual: boolean } {
  const entityState = input.entityState;
  const hasEntity =
    entityState != null &&
    entityState !== "" &&
    entityState !== "unavailable" &&
    entityState !== "unknown";

  if (hasEntity) {
    return {
      display: formatEnergyMetricDisplay({
        value: entityState,
        unit: input.unitOverride?.trim() || input.entityUnit || "",
        secondary: input.secondary,
        unitAsPrefix: input.unitAsPrefix,
      }),
      usingManual: false,
    };
  }

  const manual = input.manualValue?.trim();
  if (manual) {
    return {
      display: formatEnergyMetricDisplay({
        value: manual,
        unit: input.unitOverride?.trim() || "",
        secondary: input.secondary,
        unitAsPrefix: input.unitAsPrefix,
      }),
      usingManual: true,
    };
  }

  return { display: "—", usingManual: false };
}
