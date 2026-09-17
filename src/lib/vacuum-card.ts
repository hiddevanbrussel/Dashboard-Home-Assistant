export const VACUUM_CARD_2_DEFAULT_WIDTH = 300;
export const VACUUM_CARD_2_DEFAULT_HEIGHT = 330;
export const VACUUM_CARD_2_MIN_WIDTH = 240;
export const VACUUM_CARD_2_MAX_WIDTH = 500;
export const VACUUM_CARD_2_MIN_HEIGHT = 260;
export const VACUUM_CARD_2_MAX_HEIGHT = 520;
export const VACUUM_CARD_2_DEFAULT_IMAGE = "/vacuum-xiaomi-5-top.webp";

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

/** True when a pointer-up on the vacuum card should open the control sheet. */
export function isVacuumCardTap(input: {
  timerPending: boolean;
  longPressFired: boolean;
  moved: boolean;
}): boolean {
  return input.timerPending && !input.longPressFired && !input.moved;
}
