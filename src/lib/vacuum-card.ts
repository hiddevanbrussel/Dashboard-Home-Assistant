export const VACUUM_CARD_2_DEFAULT_WIDTH = 320;
export const VACUUM_CARD_2_DEFAULT_HEIGHT = 460;
export const VACUUM_CARD_2_MIN_WIDTH = 240;
export const VACUUM_CARD_2_MAX_WIDTH = 500;
export const VACUUM_CARD_2_MIN_HEIGHT = 260;
export const VACUUM_CARD_2_MAX_HEIGHT = 640;
export const VACUUM_CARD_2_DEFAULT_IMAGE = "/vacuum-robot-light.webp";
export const VACUUM_CARD_2_DEFAULT_IMAGE_DARK = "/vacuum-robot-dark.webp";
export const VACUUM_CARD_2_FOOTER_MIN_HEIGHT = 380;

export function clampVacuumCard2Width(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return VACUUM_CARD_2_DEFAULT_WIDTH;
  return Math.min(VACUUM_CARD_2_MAX_WIDTH, Math.max(VACUUM_CARD_2_MIN_WIDTH, Math.round(v)));
}

export function clampVacuumCard2Height(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return VACUUM_CARD_2_DEFAULT_HEIGHT;
  return Math.min(VACUUM_CARD_2_MAX_HEIGHT, Math.max(VACUUM_CARD_2_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeVacuumCard2FromBottomRight(input: {
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
    VACUUM_CARD_2_MIN_WIDTH,
    Math.min(VACUUM_CARD_2_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    VACUUM_CARD_2_MIN_HEIGHT,
    Math.min(VACUUM_CARD_2_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampVacuumCard2Width(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampVacuumCard2Height(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}

export type VacuumFanMode = "eco" | "standard" | "turbo";

export const VACUUM_FAN_MODES: VacuumFanMode[] = ["eco", "standard", "turbo"];

const MODE_ALIASES: Record<VacuumFanMode, string[]> = {
  eco: ["eco", "quiet", "silent", "min", "low", "gentle", "eco_mode", "eco mode"],
  standard: ["standard", "normal", "medium", "mid", "balanced", "auto", "standard_mode", "standard mode"],
  turbo: ["turbo", "max", "high", "strong", "max+", "turbo_mode", "turbo mode", "max_fan"],
};

const ON_STATES = new Set(["cleaning", "paused", "returning", "on"]);

export function parsePercent(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (trimmed === "unknown" || trimmed === "unavailable" || trimmed === "none") return null;
    const n = Number(trimmed.replace("%", "").trim());
    if (!Number.isFinite(n)) return null;
    return clampPercent(n);
  }
  if (typeof value === "number" && Number.isFinite(value)) return clampPercent(value);
  return null;
}

function clampPercent(n: number): number {
  return Math.round(Math.min(100, Math.max(0, n)));
}

export function batteryFromAttributes(attrs: Record<string, unknown> | undefined): number | null {
  if (!attrs) return null;
  return parsePercent(attrs.battery_level ?? attrs.battery ?? attrs.battery_percent);
}

export function progressFromAttributes(attrs: Record<string, unknown> | undefined): number | null {
  if (!attrs) return null;
  return parsePercent(attrs.cleaning_progress ?? attrs.progress ?? attrs.cleaned_percent);
}

export function fanSpeedListFromAttributes(attrs: Record<string, unknown> | undefined): string[] {
  const list = attrs?.fan_speed_list;
  if (!Array.isArray(list)) return [];
  return list.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function currentFanSpeedFromAttributes(attrs: Record<string, unknown> | undefined): string | undefined {
  const value = attrs?.fan_speed;
  return typeof value === "string" && value.trim() ? value : undefined;
}

export function resolveFanSpeedForMode(mode: VacuumFanMode, fanSpeedList: string[]): string {
  if (fanSpeedList.length === 0) return mode;
  const lower = fanSpeedList.map((item) => item.toLowerCase());
  for (const alias of MODE_ALIASES[mode]) {
    const idx = lower.indexOf(alias);
    if (idx >= 0) return fanSpeedList[idx];
  }
  if (mode === "eco") return fanSpeedList[0];
  if (mode === "turbo") return fanSpeedList[fanSpeedList.length - 1];
  return fanSpeedList[Math.floor(fanSpeedList.length / 2)];
}

export function fanModeFromSpeed(
  fanSpeed: string | undefined | null,
  fanSpeedList: string[] = []
): VacuumFanMode | null {
  if (!fanSpeed) return null;
  const lower = fanSpeed.toLowerCase();
  for (const mode of VACUUM_FAN_MODES) {
    if (MODE_ALIASES[mode].includes(lower)) return mode;
  }
  const idx = fanSpeedList.findIndex((item) => item.toLowerCase() === lower);
  if (idx < 0 || fanSpeedList.length <= 1) return null;
  const t = idx / (fanSpeedList.length - 1);
  if (t <= 0.34) return "eco";
  if (t <= 0.67) return "standard";
  return "turbo";
}

export function isVacuumOn(state: string | undefined | null): boolean {
  return ON_STATES.has((state ?? "").toLowerCase());
}

export type VacuumHeadlineKind =
  | "cleaningProgress"
  | "cleaning"
  | "returning"
  | "paused"
  | "docked"
  | "idle"
  | "error"
  | "unavailable"
  | "unknown";

export function vacuumHeadlineKind(
  state: string | undefined | null,
  progress: number | null
): VacuumHeadlineKind {
  const normalized = (state ?? "").toLowerCase();
  if (normalized === "unavailable") return "unavailable";
  if (normalized === "error") return "error";
  if (normalized === "returning") return "returning";
  if (normalized === "paused") return "paused";
  if (normalized === "docked") return "docked";
  if (normalized === "idle") return "idle";
  if (normalized === "cleaning" || normalized === "on") {
    return progress != null ? "cleaningProgress" : "cleaning";
  }
  return "unknown";
}

/** True when a tap on the vacuum card should open the control sheet. */
export function isVacuumCardTap(input: {
  longPressFired: boolean;
  moved: boolean;
}): boolean {
  return !input.longPressFired && !input.moved;
}

export const VACUUM_SHEET_BACKDROP_GUARD_MS = 450;

/** Ignore a click on the dimmed backdrop that is really the same tap that opened the sheet. */
export function shouldIgnoreVacuumSheetBackdropClose(
  openedAt: number,
  now: number,
  windowMs = VACUUM_SHEET_BACKDROP_GUARD_MS
): boolean {
  return now - openedAt < windowMs;
}

export function vacuumCard2ArtSrc(input: {
  backgroundImage?: string | null;
  isDark: boolean;
}): string {
  const custom = input.backgroundImage?.trim();
  if (custom) return custom;
  return input.isDark ? VACUUM_CARD_2_DEFAULT_IMAGE_DARK : VACUUM_CARD_2_DEFAULT_IMAGE;
}

function parseTimestampMs(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1e12 ? Math.round(value * 1000) : Math.round(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "unknown" || trimmed === "unavailable" || trimmed === "none") return null;
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      const n = Number(trimmed);
      if (!Number.isFinite(n)) return null;
      return n < 1e12 ? Math.round(n * 1000) : Math.round(n);
    }
    const parsed = Date.parse(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function lastCleanAtFromAttributes(attrs: Record<string, unknown> | undefined): number | null {
  if (!attrs) return null;
  return (
    parseTimestampMs(attrs.last_clean_end) ??
    parseTimestampMs(attrs.last_clean_start) ??
    parseTimestampMs(attrs.clean_start) ??
    parseTimestampMs(attrs.last_clean) ??
    parseTimestampMs(attrs.last_seen)
  );
}

export function cleanedAreaM2FromAttributes(attrs: Record<string, unknown> | undefined): number | null {
  if (!attrs) return null;
  const raw = attrs.cleaned_area ?? attrs.cleaned_area_m2 ?? attrs.clean_area ?? attrs.total_cleaned_area;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(",", ".").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 10) / 10;
}

export type VacuumRelativeTimeKind = "justNow" | "minutesAgo" | "hoursAgo" | "daysAgo";

export function vacuumRelativeTimeKind(
  fromMs: number,
  nowMs: number
): { key: VacuumRelativeTimeKind; n: number } {
  const delta = Math.max(0, nowMs - fromMs);
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return { key: "justNow", n: 0 };
  if (minutes < 60) return { key: "minutesAgo", n: minutes };
  const hours = Math.round(minutes / 60);
  if (hours < 24) return { key: "hoursAgo", n: hours };
  return { key: "daysAgo", n: Math.round(hours / 24) };
}

export function vacuumSessionStatusKey(
  state: string | undefined | null
): "ready" | Exclude<VacuumHeadlineKind, "cleaningProgress" | "unknown"> {
  const kind = vacuumHeadlineKind(state, null);
  if (kind === "docked" || kind === "idle") return "ready";
  if (kind === "unknown" || kind === "cleaningProgress") return "ready";
  return kind;
}
