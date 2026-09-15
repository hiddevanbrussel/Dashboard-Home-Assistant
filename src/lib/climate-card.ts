export const CLIMATE_CARD_DEFAULT_WIDTH = 300;
export const CLIMATE_CARD_DEFAULT_HEIGHT = 340;
export const CLIMATE_CARD_MIN_WIDTH = 240;
export const CLIMATE_CARD_MAX_WIDTH = 500;
export const CLIMATE_CARD_MIN_HEIGHT = 280;
export const CLIMATE_CARD_MAX_HEIGHT = 480;

export function clampClimateCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return CLIMATE_CARD_DEFAULT_WIDTH;
  return Math.min(CLIMATE_CARD_MAX_WIDTH, Math.max(CLIMATE_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampClimateCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return CLIMATE_CARD_DEFAULT_HEIGHT;
  return Math.min(CLIMATE_CARD_MAX_HEIGHT, Math.max(CLIMATE_CARD_MIN_HEIGHT, Math.round(v)));
}

export type ClimateModeTile = "auto" | "heat" | "cool";

export const CLIMATE_MODE_TILES: ClimateModeTile[] = ["auto", "heat", "cool"];

export type ClimateStatusKind = "heating" | "cooling" | "idle" | "off" | "heat" | "cool" | "auto";

export type ClimateRingTone = "sky" | "amber" | "teal" | "gray";

const AUTO_ALIASES = ["auto", "heat_cool"];

function normalizeModes(hvacModes: string[]): { original: string; lower: string }[] {
  return hvacModes
    .filter((mode): mode is string => typeof mode === "string" && mode.trim().length > 0)
    .map((mode) => ({ original: mode, lower: mode.toLowerCase() }));
}

export function parseClimateTemp(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "unknown" || trimmed === "unavailable" || trimmed === "none") return undefined;
    const n = Number(trimmed.replace("°", "").replace("c", "").trim());
    return Number.isFinite(n) ? n : undefined;
  }
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

export function climateTempsDiffer(current: number | undefined, target: number | undefined): boolean {
  if (current == null || target == null) return false;
  return Math.abs(current - target) >= 0.25;
}

export function isClimateOn(state: string | undefined | null, hvacMode?: string | undefined | null): boolean {
  const s = (state ?? "").toLowerCase();
  const m = (hvacMode ?? "").toLowerCase();
  if (s === "unavailable" || s === "unknown") return false;
  if (s === "off" || m === "off") return false;
  if (!s && !m) return false;
  return true;
}

export function climateHvacModesFromAttributes(attrs: Record<string, unknown> | undefined): string[] {
  const list = attrs?.hvac_modes;
  if (!Array.isArray(list)) return [];
  return list.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function resolveHvacModeForTile(tile: ClimateModeTile, hvacModes: string[]): string {
  const modes = normalizeModes(hvacModes);
  if (tile === "auto") {
    for (const alias of AUTO_ALIASES) {
      const match = modes.find((mode) => mode.lower === alias);
      if (match) return match.original;
    }
    return "auto";
  }
  const match = modes.find((mode) => mode.lower === tile);
  return match?.original ?? tile;
}

export function climateTileFromHvacMode(mode: string | undefined | null): ClimateModeTile | null {
  const m = (mode ?? "").toLowerCase();
  if (AUTO_ALIASES.includes(m) || m === "idle") return "auto";
  if (m === "heat" || m === "heating") return "heat";
  if (m === "cool" || m === "cooling") return "cool";
  return null;
}

export function climateTileEnabled(tile: ClimateModeTile, hvacModes: string[]): boolean {
  if (hvacModes.length === 0) return true;
  const lower = normalizeModes(hvacModes).map((mode) => mode.lower);
  if (tile === "auto") return AUTO_ALIASES.some((alias) => lower.includes(alias));
  return lower.includes(tile);
}

export function preferredClimateOnMode(hvacModes: string[]): string {
  const modes = normalizeModes(hvacModes);
  for (const pref of ["auto", "heat_cool", "heat", "cool"] as const) {
    const match = modes.find((mode) => mode.lower === pref);
    if (match) return match.original;
  }
  const firstOn = modes.find((mode) => mode.lower !== "off");
  return firstOn?.original ?? "auto";
}

export function climateStatusKind(input: {
  hvacAction?: string | undefined | null;
  hvacMode?: string | undefined | null;
  state?: string | undefined | null;
}): ClimateStatusKind {
  const action = (input.hvacAction ?? "").toLowerCase();
  if (action === "heating") return "heating";
  if (action === "cooling") return "cooling";
  if (action === "idle") return "idle";
  if (action === "off") return "off";
  if (!isClimateOn(input.state, input.hvacMode)) return "off";
  const tile = climateTileFromHvacMode(input.hvacMode || input.state);
  if (tile === "heat") return "heat";
  if (tile === "cool") return "cool";
  if (tile === "auto") return "auto";
  return "idle";
}

export function climateStatusLabelKey(kind: ClimateStatusKind): string {
  switch (kind) {
    case "heating":
      return "climateCard.heating";
    case "cooling":
      return "climateCard.cooling";
    case "idle":
      return "climateCard.idle";
    case "off":
      return "climateCard.off";
    case "heat":
      return "climateCard.heat";
    case "cool":
      return "climateCard.cool";
    case "auto":
      return "climateCard.auto";
  }
}

export function climateRingTone(kind: ClimateStatusKind): ClimateRingTone {
  if (kind === "heating" || kind === "heat") return "amber";
  if (kind === "cooling" || kind === "cool") return "sky";
  if (kind === "off") return "gray";
  return "teal";
}
