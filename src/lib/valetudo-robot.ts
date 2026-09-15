export type FanPreset =
  | "off"
  | "min"
  | "low"
  | "medium"
  | "high"
  | "max"
  | "turbo"
  | "custom";

export type ConsumableType = "filter" | "brush" | "mop" | "detergent" | "bin" | "cleaning";
export type ConsumableSubType =
  | "none"
  | "all"
  | "main"
  | "secondary"
  | "side_left"
  | "side_right"
  | "dock"
  | "sensor"
  | "wheel";
export type ConsumableUnit = "minutes" | "percent";

export type ConsumableState = {
  type: ConsumableType | string;
  subType?: ConsumableSubType | string;
  remaining: {
    value: number;
    unit: ConsumableUnit | string;
  };
};

export type ConsumableMeta = {
  type: ConsumableType | string;
  subType: ConsumableSubType | string;
  unit: ConsumableUnit | string;
  maxValue?: number;
};

export const CONSUMABLE_DUE_RATIO = 0.2;

export const FAN_PRESET_ORDER: FanPreset[] = ["off", "min", "low", "medium", "high", "turbo", "max", "custom"];

export function isFanPreset(value: string): value is FanPreset {
  return (FAN_PRESET_ORDER as string[]).includes(value);
}

export function sortFanPresets(presets: string[]): FanPreset[] {
  const known = presets.filter(isFanPreset);
  return FAN_PRESET_ORDER.filter((preset) => known.includes(preset));
}

export function fanSpeedFromAttributes(
  attributes: Array<{ __class?: string; type?: string; value?: string | number }>
): FanPreset | null {
  const match = attributes.find(
    (item) => item.__class === "PresetSelectionStateAttribute" && item.type === "fan_speed"
  );
  const value = typeof match?.value === "string" ? match.value : "";
  return isFanPreset(value) ? value : null;
}

export function consumableKey(item: { type: string; subType?: string }): string {
  const sub = item.subType && item.subType !== "none" ? item.subType : "none";
  return `${item.type}/${sub}`;
}

export function consumablePath(item: { type: string; subType?: string }): string {
  const base = `/api/v2/robot/capabilities/ConsumableMonitoringCapability/${item.type}`;
  if (item.subType && item.subType !== "none") return `${base}/${item.subType}`;
  return base;
}

export function consumableRemainingRatio(
  item: ConsumableState,
  meta?: ConsumableMeta | null
): number {
  const value = Number(item.remaining?.value);
  if (!Number.isFinite(value)) return 1;
  if (item.remaining?.unit === "percent") {
    return Math.max(0, Math.min(1, value / 100));
  }
  const max = meta?.maxValue;
  if (typeof max === "number" && max > 0) {
    return Math.max(0, Math.min(1, value / max));
  }
  return value > 0 ? 1 : 0;
}

export function isConsumableDue(item: ConsumableState, meta?: ConsumableMeta | null): boolean {
  return consumableRemainingRatio(item, meta) <= CONSUMABLE_DUE_RATIO;
}

export function metaForConsumable(
  item: ConsumableState,
  available: ConsumableMeta[]
): ConsumableMeta | undefined {
  return available.find(
    (meta) => meta.type === item.type && (meta.subType || "none") === (item.subType || "none")
  );
}

export function sortConsumables(
  items: ConsumableState[],
  available: ConsumableMeta[] = []
): ConsumableState[] {
  return [...items].sort((a, b) => {
    const aDue = isConsumableDue(a, metaForConsumable(a, available)) ? 0 : 1;
    const bDue = isConsumableDue(b, metaForConsumable(b, available)) ? 0 : 1;
    if (aDue !== bDue) return aDue - bDue;
    return consumableKey(a).localeCompare(consumableKey(b));
  });
}

export function fanPresetLabelKey(preset: string): string {
  return `vacuum.fan.${preset}`;
}

export function consumableLabelKey(item: { type: string; subType?: string }): string {
  const sub = item.subType && item.subType !== "none" ? item.subType : "";
  if (sub) return `vacuum.consumable.${item.type}.${sub}`;
  return `vacuum.consumable.${item.type}`;
}

export function parseFanPresets(data: unknown): FanPreset[] {
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { presets?: unknown })?.presets)
      ? (data as { presets: unknown[] }).presets
      : [];
  return sortFanPresets(list.filter((item): item is string => typeof item === "string"));
}

export function parseConsumables(data: unknown): ConsumableState[] {
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { consumables?: unknown })?.consumables)
      ? (data as { consumables: unknown[] }).consumables
      : [];
  return list.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    if (typeof item.type !== "string") return [];
    const remaining = item.remaining;
    if (!remaining || typeof remaining !== "object") return [];
    const value = Number((remaining as { value?: unknown }).value);
    const unit = (remaining as { unit?: unknown }).unit;
    if (!Number.isFinite(value) || typeof unit !== "string") return [];
    return [
      {
        type: item.type,
        subType: typeof item.subType === "string" ? item.subType : "none",
        remaining: { value, unit },
      },
    ];
  });
}

export const DEFAULT_SEGMENT_ITERATION_MAX = 3;
export const MAX_SEGMENT_ITERATION_CAP = 10;

export function parseSegmentIterationMax(data: unknown): number {
  const count =
    data && typeof data === "object"
      ? (data as { iterationCount?: { max?: unknown } }).iterationCount
      : undefined;
  const max = Number(count?.max);
  if (!Number.isFinite(max) || max < 1) return DEFAULT_SEGMENT_ITERATION_MAX;
  return Math.min(MAX_SEGMENT_ITERATION_CAP, Math.round(max));
}

export function segmentIterationOptions(max: number): number[] {
  const n = Math.max(1, Math.min(Math.round(max) || DEFAULT_SEGMENT_ITERATION_MAX, MAX_SEGMENT_ITERATION_CAP));
  return Array.from({ length: n }, (_, i) => i + 1);
}

export function clampSegmentIterations(value: number, max: number): number {
  const hi = Math.max(1, Math.round(max) || DEFAULT_SEGMENT_ITERATION_MAX);
  const n = Number.isFinite(value) ? Math.round(value) : 1;
  return Math.min(hi, Math.max(1, n));
}

export function parseConsumableProperties(data: unknown): ConsumableMeta[] {
  if (!data || typeof data !== "object") return [];
  const list = (data as { availableConsumables?: unknown }).availableConsumables;
  if (!Array.isArray(list)) return [];
  return list.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    if (typeof item.type !== "string") return [];
    const maxValue = Number(item.maxValue);
    return [
      {
        type: item.type,
        subType: typeof item.subType === "string" ? item.subType : "none",
        unit: typeof item.unit === "string" ? item.unit : "percent",
        maxValue: Number.isFinite(maxValue) && maxValue > 0 ? maxValue : undefined,
      },
    ];
  });
}
