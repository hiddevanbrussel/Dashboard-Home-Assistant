/** Smart Stack (slimme stapel): slideshow of nested dashboard cards. */

export const SMART_STACK_DEFAULT_WIDTH = 300;
export const SMART_STACK_DEFAULT_HEIGHT = 300;
export const SMART_STACK_MIN_WIDTH = 250;
export const SMART_STACK_MAX_WIDTH = 480;
export const SMART_STACK_MIN_HEIGHT = 250;
export const SMART_STACK_MAX_HEIGHT = 480;

/** Default auto-advance interval in seconds. */
export const SMART_STACK_DEFAULT_INTERVAL_SEC = 8;
export const SMART_STACK_MIN_INTERVAL_SEC = 3;
export const SMART_STACK_MAX_INTERVAL_SEC = 60;

/** Auto-rotate slides; `undefined` / missing means on (backward compatible). */
export const SMART_STACK_DEFAULT_AUTOPLAY = true;

/** Crossfade / soft-slide duration between stacked cards (ms). */
export const SMART_STACK_TRANSITION_MS = 520;

/** Card types that can be nested inside a smart stack. */
export const SMART_STACK_CHILD_TYPES = [
  "climate_card_2",
  "nuts_card",
  "weather_card",
  "vacuum_card_2",
  "light_card",
  "media_card",
  "stat_pill_card",
  "sensor_card",
  "energy_monitor_card",
  "teamtracker_card",
  "camera_card",
  "calendar_card",
] as const;

export type SmartStackChildType = (typeof SMART_STACK_CHILD_TYPES)[number];

export function isSmartStackChildType(type: string): type is SmartStackChildType {
  return (SMART_STACK_CHILD_TYPES as readonly string[]).includes(type);
}

export function clampSmartStackWidth(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return SMART_STACK_DEFAULT_WIDTH;
  return Math.min(SMART_STACK_MAX_WIDTH, Math.max(SMART_STACK_MIN_WIDTH, Math.round(n)));
}

export function clampSmartStackHeight(h: unknown): number {
  const n = Number(h);
  if (!Number.isFinite(n)) return SMART_STACK_DEFAULT_HEIGHT;
  return Math.min(SMART_STACK_MAX_HEIGHT, Math.max(SMART_STACK_MIN_HEIGHT, Math.round(n)));
}

export function clampSmartStackIntervalSec(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return SMART_STACK_DEFAULT_INTERVAL_SEC;
  return Math.min(
    SMART_STACK_MAX_INTERVAL_SEC,
    Math.max(SMART_STACK_MIN_INTERVAL_SEC, Math.round(n))
  );
}

/** Whether the stack should auto-advance. Explicit `false` disables; otherwise on. */
export function isSmartStackAutoplayEnabled(raw: unknown): boolean {
  if (raw === false || raw === 0 || raw === "false" || raw === "0") return false;
  return SMART_STACK_DEFAULT_AUTOPLAY;
}

export function normalizeSmartStackIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  const i = Math.trunc(index);
  return ((i % length) + length) % length;
}
