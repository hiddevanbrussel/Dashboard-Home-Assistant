export const VACUUM_CARD_2_DEFAULT_WIDTH = 320;
export const VACUUM_CARD_2_DEFAULT_HEIGHT = 460;
export const VACUUM_CARD_2_MIN_WIDTH = 240;
export const VACUUM_CARD_2_MAX_WIDTH = 500;
/** Matches media-card min height so vacuum can sit at ~248px beside media. */
export const VACUUM_CARD_2_MIN_HEIGHT = 240;
export const VACUUM_CARD_2_MAX_HEIGHT = 640;
export const VACUUM_CARD_2_DEFAULT_IMAGE = "/vacuum-robot-light.webp";
export const VACUUM_CARD_2_DEFAULT_IMAGE_DARK = "/vacuum-robot-dark.webp";
export const VACUUM_CARD_2_FOOTER_MIN_HEIGHT = 380;
/** Below this, hide mode labels (icons only) and tighten chrome. */
export const VACUUM_CARD_2_COMPACT_HEIGHT = 340;
/** Below this, hide the mode row so the robot art can breathe at media-card sizes. */
export const VACUUM_CARD_2_DENSE_HEIGHT = 280;

export type VacuumCard2Density = "comfortable" | "compact" | "dense";

export function vacuumCard2Density(height: number): VacuumCard2Density {
  if (height < VACUUM_CARD_2_DENSE_HEIGHT) return "dense";
  if (height < VACUUM_CARD_2_COMPACT_HEIGHT) return "compact";
  return "comfortable";
}

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
    const parsed = Date.parse(trimmed.replace(" ", "T"));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function lastCleanRecord(attrs: Record<string, unknown> | undefined): Record<string, unknown> | null {
  if (!attrs) return null;
  const raw = attrs.last_clean_record ?? attrs.last_clean;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  if (typeof raw !== "string" || !raw.trim()) return null;
  const trimmed = raw.trim();
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {
    // Xiaomi-style: begin,end,duration,area,...
  }
  const parts = trimmed.split(",").map((part) => part.trim());
  if (parts.length < 2) return null;
  return { begin: parts[0], end: parts[1], area: parts[3] };
}

export function lastCleanAtFromAttributes(attrs: Record<string, unknown> | undefined): number | null {
  if (!attrs) return null;
  const record = lastCleanRecord(attrs);
  return (
    parseTimestampMs(attrs.last_clean_end) ??
    parseTimestampMs(attrs.last_clean_stop) ??
    parseTimestampMs(attrs.last_clean_finish) ??
    parseTimestampMs(attrs.clean_stop) ??
    parseTimestampMs(attrs.clean_end) ??
    parseTimestampMs(attrs.last_clean_start) ??
    parseTimestampMs(attrs.last_clean_begin) ??
    parseTimestampMs(attrs.clean_start) ??
    parseTimestampMs(record?.end) ??
    parseTimestampMs(record?.finish) ??
    parseTimestampMs(record?.stop) ??
    parseTimestampMs(record?.begin) ??
    parseTimestampMs(typeof attrs.last_clean === "object" ? null : attrs.last_clean) ??
    parseTimestampMs(attrs.last_seen)
  );
}

export function normalizeVacuumAreaM2(n: number, unit?: string | null): number | null {
  if (!Number.isFinite(n) || n < 0) return null;
  const u = (unit ?? "").toLowerCase().replace("²", "2").replace(/\s/g, "");
  if (u === "cm2" || u === "cm^2") return Math.round((n / 10000) * 10) / 10;
  if (u === "m2" || u === "m^2" || u === "sqm" || u === "sq.m") return Math.round(n * 10) / 10;
  // Valetudo / Xiaomi often report cm² without a unit.
  if (n > 1000) return Math.round((n / 10000) * 10) / 10;
  return Math.round(n * 10) / 10;
}

function parseAreaNumber(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function cleanedAreaM2FromAttributes(attrs: Record<string, unknown> | undefined): number | null {
  if (!attrs) return null;
  const record = lastCleanRecord(attrs);
  const raw =
    attrs.cleaned_area ??
    attrs.cleaned_area_m2 ??
    attrs.clean_area ??
    attrs.last_clean_area ??
    attrs.last_cleaning_area ??
    attrs.cleaning_area ??
    attrs.total_cleaned_area ??
    record?.area ??
    record?.cleaned_area;
  const n = parseAreaNumber(raw);
  if (n == null) return null;
  return normalizeVacuumAreaM2(n);
}

export type VacuumRelatedEntity = {
  entity_id: string;
  state: string;
  attributes?: Record<string, unknown>;
};

export function vacuumObjectId(entityId: string | undefined | null): string {
  if (!entityId) return "";
  const dot = entityId.indexOf(".");
  return dot >= 0 ? entityId.slice(dot + 1) : entityId;
}

export const VACUUM_LAST_SESSION_SENSOR_HINTS = [
  "last_clean_end",
  "last_clean_stop",
  "last_cleaning_end",
  "last_clean_finish",
  "last_clean_begin",
  "last_clean_start",
  "last_clean",
] as const;

export const VACUUM_AREA_SENSOR_HINTS = [
  "last_clean_area",
  "last_cleaning_area",
  "cleaned_area",
  "cleaning_area",
  "clean_area",
  "current_statistics_area",
] as const;

export function findRelatedVacuumSensor(
  entities: Iterable<VacuumRelatedEntity>,
  vacuumEntityId: string | undefined | null,
  hints: readonly string[]
): VacuumRelatedEntity | undefined {
  const objectId = vacuumObjectId(vacuumEntityId);
  if (!objectId) return undefined;
  const prefix = `sensor.${objectId}`;
  const related: VacuumRelatedEntity[] = [];
  for (const entity of entities) {
    if (entity.entity_id === prefix || entity.entity_id.startsWith(`${prefix}_`)) related.push(entity);
  }
  for (const hint of hints) {
    const found = related.find((entity) => entity.entity_id.includes(hint));
    if (found) return found;
  }
  return undefined;
}

export function lastCleanAtFromEntity(entity: VacuumRelatedEntity | undefined): number | null {
  if (!entity) return null;
  return (
    parseTimestampMs(entity.state) ??
    parseTimestampMs(entity.attributes?.timestamp) ??
    parseTimestampMs(entity.attributes?.last_changed)
  );
}

export function cleanedAreaM2FromEntity(entity: VacuumRelatedEntity | undefined): number | null {
  if (!entity) return null;
  const n = parseAreaNumber(entity.state);
  if (n == null) return null;
  const unit =
    typeof entity.attributes?.unit_of_measurement === "string"
      ? entity.attributes.unit_of_measurement
      : null;
  return normalizeVacuumAreaM2(n, unit);
}

export function resolveVacuumLastCleanAt(input: {
  attrs?: Record<string, unknown>;
  entities?: Iterable<VacuumRelatedEntity>;
  vacuumEntityId?: string | null;
}): number | null {
  return (
    lastCleanAtFromAttributes(input.attrs) ??
    lastCleanAtFromEntity(
      findRelatedVacuumSensor(input.entities ?? [], input.vacuumEntityId, VACUUM_LAST_SESSION_SENSOR_HINTS)
    )
  );
}

export function resolveVacuumCleanedAreaM2(input: {
  attrs?: Record<string, unknown>;
  entities?: Iterable<VacuumRelatedEntity>;
  vacuumEntityId?: string | null;
  valetudoAreaCm2?: number | null;
}): number | null {
  return (
    cleanedAreaM2FromAttributes(input.attrs) ??
    cleanedAreaM2FromEntity(
      findRelatedVacuumSensor(input.entities ?? [], input.vacuumEntityId, VACUUM_AREA_SENSOR_HINTS)
    ) ??
    normalizeVacuumAreaM2(input.valetudoAreaCm2 ?? Number.NaN, "cm2")
  );
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
