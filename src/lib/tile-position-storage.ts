/**
 * localStorage keys each floating card already uses in savePosition / loadPosition.
 * The add flow writes `{ left, bottom }` before the card mounts. The card then
 * takes its existing saved path. Cards are not modified.
 *
 * A shared key is one position for the whole type. Writing it while it already
 * exists would move the card that owns it, so those writes are skipped.
 */

export type TilePosition = { left: number; bottom: number };

export type TilePositionStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type TilePositionKey = {
  key: string;
  /** One key for every card of this type on the dashboard. */
  shared: boolean;
};

type KeyShape =
  | { kind: "per-widget"; prefix: string }
  | { kind: "widget-id"; prefix: string }
  | { kind: "shared"; prefix: string }
  | { kind: "device"; prefix: string };

/**
 * Prefixes copied from each card's STORAGE_KEY / STORAGE_KEY_PREFIX.
 * per-widget prefixes already include the trailing dot.
 * widget-id prefixes do not: the card inserts the widget id itself.
 * device is per card because the page passes storageScope `${dashboardId}-${widgetId}`.
 */
const TILE_POSITION_SHAPES: Record<string, KeyShape> = {
  text_card: { kind: "per-widget", prefix: "dashboard.floatingTextCardPosition." },
  title_card: { kind: "per-widget", prefix: "dashboard.floatingTextCardPosition." },
  title_only_card: { kind: "per-widget", prefix: "dashboard.floatingTextCardPosition." },
  subtitle_card: { kind: "per-widget", prefix: "dashboard.floatingTextCardPosition." },
  light_card: { kind: "per-widget", prefix: "dashboard.floatingLightCardPosition." },
  alarm_card: { kind: "per-widget", prefix: "dashboard.floatingAlarmCardPosition." },
  calendar_card: { kind: "per-widget", prefix: "dashboard.floatingCalendarCardPosition." },
  card_group: { kind: "per-widget", prefix: "dashboard.floatingCardGroupPosition." },
  chore_card: { kind: "per-widget", prefix: "dashboard.floatingChoreCard." },
  nuts_card: { kind: "per-widget", prefix: "dashboard.floatingNutsCardPosition." },
  pill_card: { kind: "per-widget", prefix: "dashboard.floatingPillCardPosition." },
  room_card: { kind: "per-widget", prefix: "dashboard.floatingRoomCardPosition." },
  sensor_card: { kind: "per-widget", prefix: "dashboard.floatingSensorCardPosition." },
  smart_stack: { kind: "per-widget", prefix: "dashboard.floatingSmartStackPosition." },
  stat_pill_card: { kind: "per-widget", prefix: "dashboard.floatingStatPillCardPosition." },
  timer_card: { kind: "per-widget", prefix: "dashboard.floatingTimerCard." },
  trash_card: { kind: "per-widget", prefix: "dashboard.floatingTrashCardPosition." },
  vacuum_card_2: { kind: "per-widget", prefix: "dashboard.floatingVacuumHeroCardPosition.v2." },
  energy_metric: { kind: "per-widget", prefix: "dashboard.floatingEnergyMetricPosition." },
  media_card: { kind: "widget-id", prefix: "dashboard.floatingMediaCardPosition" },
  camera_card: { kind: "widget-id", prefix: "dashboard.floatingCameraCardPosition" },
  energy_monitor_card: { kind: "widget-id", prefix: "dashboard.floatingEnergyMonitorCardPosition" },
  teamtracker_card: { kind: "widget-id", prefix: "dashboard.floatingTeamtrackerCardPosition" },
  weather_card: { kind: "shared", prefix: "dashboard.floatingWeatherCardPosition" },
  solar_card: { kind: "shared", prefix: "dashboard.floatingSolarCardPosition" },
  vacuum_card: { kind: "shared", prefix: "dashboard.floatingVacuumCardPosition" },
  power_usage_card: { kind: "shared", prefix: "dashboard.floatingPowerUsageCardPosition" },
  climate_card: { kind: "shared", prefix: "dashboard.floatingClimateCardPosition" },
  climate_card_2: { kind: "shared", prefix: "dashboard.floatingClimateCardPosition" },
  device_consumption_card: { kind: "device", prefix: "dashboard.floatingDeviceConsumptionCardPosition" },
};

/**
 * Only the first card of these types is shown per page
 * (src/app/dashboards/[id]/page.tsx:3279, :3120, :3167, :3367).
 * vacuum_card_2 is per tile. climate_card and climate_card_2 are bundled.
 */
const SINGLETON_TILE_TYPES = new Set([
  "weather_card",
  "solar_card",
  "power_usage_card",
  "vacuum_card",
]);

export function isSingletonTileType(type: string): boolean {
  return SINGLETON_TILE_TYPES.has(type);
}

const SHARED_GROUP: Record<string, string> = {
  weather_card: "weather",
  solar_card: "solar",
  vacuum_card: "vacuum",
  power_usage_card: "power",
  climate_card: "climate",
  climate_card_2: "climate",
};

function scoped(scope: string | undefined): string | undefined {
  return scope ? scope : undefined;
}

function perWidgetKey(prefix: string, scope: string | undefined, widgetId: string): string {
  const dashboardScope = scoped(scope);
  return dashboardScope ? `${prefix}${dashboardScope}.${widgetId}` : `${prefix}${widgetId}`;
}

function widgetIdKey(prefix: string, scope: string | undefined, widgetId: string): string {
  const dashboardScope = scoped(scope);
  if (widgetId) {
    return dashboardScope ? `${prefix}.${dashboardScope}.${widgetId}` : `${prefix}.${widgetId}`;
  }
  return dashboardScope ? `${prefix}.${dashboardScope}` : prefix;
}

function sharedKey(prefix: string, scope: string | undefined): string {
  const dashboardScope = scoped(scope);
  return dashboardScope ? `${prefix}.${dashboardScope}` : prefix;
}

/** Same string the card builds. Null when this type has no saved-position path we can fill. */
export function tilePositionStorageKey(
  type: string,
  scope: string | undefined,
  widgetId: string
): TilePositionKey | null {
  const shape = TILE_POSITION_SHAPES[type];
  if (!shape) return null;
  switch (shape.kind) {
    case "per-widget":
      return { key: perWidgetKey(shape.prefix, scope, widgetId), shared: false };
    case "widget-id":
      return { key: widgetIdKey(shape.prefix, scope, widgetId), shared: false };
    case "shared":
      return { key: sharedKey(shape.prefix, scope), shared: true };
    case "device": {
      const dashboardScope = scoped(scope);
      const key = dashboardScope ? `${shape.prefix}.${dashboardScope}-${widgetId}` : shape.prefix;
      return { key, shared: false };
    }
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

/** JSON written by every card's savePosition: `{ left, bottom }` only. */
export function serializeTilePosition(position: TilePosition): string {
  return JSON.stringify({ left: position.left, bottom: position.bottom });
}

export type WriteTilePositionResult = {
  written: boolean;
  key: string | null;
  shared: boolean;
};

/**
 * Write the first-fit slot before mount.
 * A shared key that already has a value is left untouched.
 */
export function writeTilePosition(
  storage: Pick<TilePositionStorage, "getItem" | "setItem">,
  type: string,
  scope: string | undefined,
  widgetId: string,
  position: TilePosition
): WriteTilePositionResult {
  const spec = tilePositionStorageKey(type, scope, widgetId);
  if (!spec) return { written: false, key: null, shared: false };
  if (spec.shared && storage.getItem(spec.key) != null) {
    return { written: false, key: spec.key, shared: true };
  }
  storage.setItem(spec.key, serializeTilePosition(position));
  return { written: true, key: spec.key, shared: spec.shared };
}

export function forgetTilePosition(
  storage: Pick<TilePositionStorage, "removeItem">,
  key: string | null | undefined
): void {
  if (!key) return;
  storage.removeItem(key);
}

/** True when another card still uses this type's shared position key. */
export function sharedPositionStillUsed(type: string, remainingTypes: readonly string[]): boolean {
  const group = SHARED_GROUP[type];
  if (!group) return false;
  return remainingTypes.some((other) => SHARED_GROUP[other] === group);
}
