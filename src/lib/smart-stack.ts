/** Smart Stack (slimme stapel): slideshow of nested dashboard cards. */

import { normalizeClimateDisplayMode } from "@/lib/climate-card";
import { normalizeNutsAccent, normalizeNutsPeriod } from "@/lib/nuts-card";
import type { WidgetConfig } from "@/stores/onboarding-store";

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

/** Edit-form fields that map onto nested smart-stack children (no width/height). */
export type SmartStackChildEditFields = {
  title?: string;
  entity_id?: string;
  icon?: string;
  humidity_entity_id?: string;
  display_mode?: string;
  card_layout?: "horizontal" | "square";
  show_icon?: boolean;
  show_state?: boolean;
  show_title?: boolean;
  size?: string;
  label?: string;
  color?: string;
  accent?: string;
  period?: string;
  today_entity_id?: string;
  current_entity_id?: string;
  icon_background_color?: string;
  progress_entity_id?: string;
  background_image?: string;
  background_image_dark?: string;
  image_conditions?: WidgetConfig["image_conditions"];
  minimal?: boolean;
  scale?: number;
  refresh?: number;
  conditions?: WidgetConfig["conditions"];
};

/**
 * Build persisted updates for a nested smart-stack child from the edit form.
 * Size (width/height) is intentionally omitted — the stack frame drives fill.
 */
export function buildSmartStackChildUpdates(
  childType: string,
  form: SmartStackChildEditFields
): Partial<WidgetConfig> {
  if (!isSmartStackChildType(childType)) {
    return {
      title: form.title ?? "",
      entity_id: form.entity_id ?? "",
    };
  }

  const base: Partial<WidgetConfig> = {
    title: form.title ?? "",
    entity_id: form.entity_id ?? "",
  };

  switch (childType) {
    case "climate_card_2":
      return {
        ...base,
        humidity_entity_id: form.humidity_entity_id || undefined,
        display_mode: normalizeClimateDisplayMode(form.display_mode),
        icon: form.icon || undefined,
      };
    case "nuts_card":
      return {
        ...base,
        icon: form.icon || undefined,
        icon_background_color: form.icon_background_color || undefined,
        today_entity_id: form.today_entity_id || undefined,
        current_entity_id: undefined,
        accent: normalizeNutsAccent(form.accent),
        period: normalizeNutsPeriod(form.period),
      };
    case "weather_card":
      return {
        ...base,
        show_icon: form.show_icon !== false,
      };
    case "vacuum_card_2":
      return {
        ...base,
        progress_entity_id: form.progress_entity_id || undefined,
        background_image: form.background_image || undefined,
      };
    case "light_card":
      return {
        ...base,
        icon: form.icon || undefined,
        card_layout: form.card_layout === "square" ? "square" : "horizontal",
      };
    case "media_card":
      return base;
    case "stat_pill_card":
      return {
        ...base,
        label: form.label || undefined,
        icon: form.icon || undefined,
        color: form.color || undefined,
        conditions: (form.conditions ?? []).length > 0 ? form.conditions : undefined,
      };
    case "sensor_card":
      return {
        ...base,
        icon: form.icon || undefined,
        show_icon: form.show_icon !== false,
        size: form.size || undefined,
        conditions: (form.conditions ?? []).length > 0 ? form.conditions : undefined,
      };
    case "energy_monitor_card":
      return {
        ...base,
        entity_id: form.entity_id || undefined,
        background_image: form.background_image || undefined,
        background_image_dark: form.background_image_dark || undefined,
        image_conditions:
          (form.image_conditions ?? []).filter((c) => c.image?.trim()).length > 0
            ? (form.image_conditions ?? []).filter((c) => c.image?.trim())
            : undefined,
        minimal: form.minimal ?? false,
        scale: form.scale ?? 1,
      };
    case "teamtracker_card":
      return base;
    case "camera_card":
      return {
        ...base,
        refresh: form.refresh ?? 10,
        show_title: form.show_title !== false,
      };
    case "calendar_card":
      return {
        title: form.title ?? "",
        entity_id: form.entity_id ?? "",
      };
    default:
      return base;
  }
}

/** Strip independent size so nested cards always fill the stack frame. */
export function stripSmartStackChildSize<T extends { width?: number; height?: number }>(
  updates: T
): Omit<T, "width" | "height"> {
  const { width: _w, height: _h, ...rest } = updates;
  return rest;
}
