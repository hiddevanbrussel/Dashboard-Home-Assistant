/**
 * Types that open the settings step while adding.
 * The tile is kept in memory until that step confirms.
 * Energie covers the energy cards that open this step (image card and power usage).
 */
export const CONFIGURE_BEFORE_SAVE_TYPES = [
  "text_card",
  "room_card",
  "nuts_card",
  "smart_stack",
  "energy_monitor_card",
  "power_usage_card",
  "stat_pill_card",
  "trash_card",
] as const;

const CONFIGURE_BEFORE_SAVE = new Set<string>(CONFIGURE_BEFORE_SAVE_TYPES);

export function tileDefersSave(type: string): boolean {
  return CONFIGURE_BEFORE_SAVE.has(type);
}

export type TileCommitPlan<TWidget extends { id: string }, TLayout extends { i: string }> = {
  widgets: TWidget[];
  layout: TLayout[];
  persist: boolean;
  storageKeys: string[];
};

/** Per-widget localStorage keys. Shared keys are listed only for undo, after the card has written them. */
const PER_WIDGET_POSITION_PREFIX: Record<string, string> = {
  text_card: "dashboard.floatingTextCardPosition.",
  title_card: "dashboard.floatingTextCardPosition.",
  title_only_card: "dashboard.floatingTextCardPosition.",
  subtitle_card: "dashboard.floatingTextCardPosition.",
  light_card: "dashboard.floatingLightCardPosition.",
  alarm_card: "dashboard.floatingAlarmCardPosition.",
  calendar_card: "dashboard.floatingCalendarCardPosition.",
  card_group: "dashboard.floatingCardGroupPosition.",
  chore_card: "dashboard.floatingChoreCard.",
  nuts_card: "dashboard.floatingNutsCardPosition.",
  pill_card: "dashboard.floatingPillCardPosition.",
  room_card: "dashboard.floatingRoomCardPosition.",
  sensor_card: "dashboard.floatingSensorCardPosition.",
  smart_stack: "dashboard.floatingSmartStackPosition.",
  stat_pill_card: "dashboard.floatingStatPillCardPosition.",
  timer_card: "dashboard.floatingTimerCard.",
  trash_card: "dashboard.floatingTrashCardPosition.",
  vacuum_card_2: "dashboard.floatingVacuumHeroCardPosition.v2.",
  energy_metric: "dashboard.floatingEnergyMetricPosition.",
  media_card: "dashboard.floatingMediaCardPosition.",
  camera_card: "dashboard.floatingCameraCardPosition.",
  energy_monitor_card: "dashboard.floatingEnergyMonitorCardPosition.",
  teamtracker_card: "dashboard.floatingTeamtrackerCardPosition.",
};

/** One key for the whole type. Cancel must not delete these: an existing card may own them. */
const SHARED_POSITION_PREFIX: Record<string, string> = {
  power_usage_card: "dashboard.floatingPowerUsageCardPosition",
  solar_card: "dashboard.floatingSolarCardPosition",
  weather_card: "dashboard.floatingWeatherCardPosition",
  vacuum_card: "dashboard.floatingVacuumCardPosition",
  climate_card: "dashboard.floatingClimateCardPosition",
  climate_card_2: "dashboard.floatingClimateCardPosition",
  device_consumption_card: "dashboard.floatingDeviceConsumptionCardPosition",
};

function perWidgetKey(prefix: string, scope: string | undefined, widgetId: string): string {
  return scope ? `${prefix}${scope}.${widgetId}` : `${prefix}${widgetId}`;
}

function sharedKey(prefix: string, scope: string | undefined): string {
  return scope ? `${prefix}.${scope}` : prefix;
}

export function tilePositionStorageKeys(
  type: string,
  scope: string | undefined,
  widgetId: string,
  reason: "cancel" | "undo"
): string[] {
  const keys: string[] = [];
  const perWidget = PER_WIDGET_POSITION_PREFIX[type];
  if (perWidget) keys.push(perWidgetKey(perWidget, scope, widgetId));
  if (reason === "undo") {
    const shared = SHARED_POSITION_PREFIX[type];
    if (shared) keys.push(sharedKey(shared, scope));
  }
  return keys;
}

export function clearTilePositionStorage(
  storage: { removeItem: (key: string) => void },
  type: string,
  scope: string | undefined,
  widgetId: string,
  reason: "cancel" | "undo"
): string[] {
  const keys = tilePositionStorageKeys(type, scope, widgetId, reason);
  for (const key of keys) storage.removeItem(key);
  return keys;
}

/** Drop a tile that was never confirmed. Nothing is written to the database. */
export function planCancelPendingAdd<TWidget extends { id: string }, TLayout extends { i: string }>(
  widgets: readonly TWidget[],
  layout: readonly TLayout[],
  pendingId: string,
  type: string,
  scope: string | undefined
): TileCommitPlan<TWidget, TLayout> {
  return {
    widgets: widgets.filter((widget) => widget.id !== pendingId),
    layout: layout.filter((item) => item.i !== pendingId),
    persist: false,
    storageKeys: tilePositionStorageKeys(type, scope, pendingId, "cancel"),
  };
}

/** Remove a tile that was already saved, and persist that removal. */
export function planUndoAddedTile<TWidget extends { id: string }, TLayout extends { i: string }>(
  widgets: readonly TWidget[],
  layout: readonly TLayout[],
  tileId: string,
  type: string,
  scope: string | undefined
): TileCommitPlan<TWidget, TLayout> {
  return {
    widgets: widgets.filter((widget) => widget.id !== tileId),
    layout: layout.filter((item) => item.i !== tileId),
    persist: true,
    storageKeys: tilePositionStorageKeys(type, scope, tileId, "undo"),
  };
}

export function planConfirmPendingAdd(widgets: readonly { id: string }[], pendingId: string): { persist: boolean } {
  return { persist: widgets.some((widget) => widget.id === pendingId) };
}
