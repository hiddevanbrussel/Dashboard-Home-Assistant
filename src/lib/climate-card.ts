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

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeClimateCardFromBottomRight(input: {
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startBottom: number;
  dx: number;
  dy: number;
  viewportWidth: number;
  viewportHeight: number;
}): { width: number; height: number; left: number; bottom: number } {
  const top = input.viewportHeight - input.startBottom - input.startHeight;
  const maxWidth = Math.max(
    CLIMATE_CARD_MIN_WIDTH,
    Math.min(CLIMATE_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    CLIMATE_CARD_MIN_HEIGHT,
    Math.min(CLIMATE_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampClimateCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampClimateCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
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

/** Visual thermostat scale: 0 °C (cold / blue) → 30 °C (warm / red). */
export const CLIMATE_GAUGE_MIN = 0;
export const CLIMATE_GAUGE_MAX = 30;
export const CLIMATE_GAUGE_TICK_COUNT = 40;

export function climateGaugeProgress(
  temp: number | undefined,
  min: number = CLIMATE_GAUGE_MIN,
  max: number = CLIMATE_GAUGE_MAX
): number {
  if (temp == null || !Number.isFinite(temp)) return 0;
  const span = max - min;
  if (!(span > 0)) return 0;
  return Math.min(1, Math.max(0, (temp - min) / span));
}

export function climateGaugeTickFilled(index: number, tickCount: number, progress: number): boolean {
  if (tickCount <= 0) return false;
  if (tickCount === 1) return progress >= 1;
  return index / (tickCount - 1) <= progress + 1e-6;
}

const GAUGE_COLOR_STOPS: { t: number; rgb: [number, number, number] }[] = [
  { t: 0, rgb: [59, 158, 255] },
  { t: 0.45, rgb: [56, 189, 248] },
  { t: 0.62, rgb: [251, 191, 36] },
  { t: 0.82, rgb: [249, 115, 22] },
  { t: 1, rgb: [239, 68, 68] },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Blue at the cold end of the gauge, red at the warm end. */
export function climateGaugeColor(
  temp: number,
  min: number = CLIMATE_GAUGE_MIN,
  max: number = CLIMATE_GAUGE_MAX
): string {
  const p = climateGaugeProgress(temp, min, max);
  for (let i = 1; i < GAUGE_COLOR_STOPS.length; i++) {
    const next = GAUGE_COLOR_STOPS[i];
    if (p <= next.t) {
      const prev = GAUGE_COLOR_STOPS[i - 1];
      const u = (p - prev.t) / (next.t - prev.t || 1);
      return rgbToHex(
        lerp(prev.rgb[0], next.rgb[0], u),
        lerp(prev.rgb[1], next.rgb[1], u),
        lerp(prev.rgb[2], next.rgb[2], u)
      );
    }
  }
  const last = GAUGE_COLOR_STOPS[GAUGE_COLOR_STOPS.length - 1];
  return rgbToHex(last.rgb[0], last.rgb[1], last.rgb[2]);
}
