import { sharedPositionStillUsed, tilePositionStorageKey } from "@/lib/tile-position-storage";

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

export function tilePositionStorageKeys(
  type: string,
  scope: string | undefined,
  widgetId: string,
  reason: "cancel" | "undo",
  remainingTypes?: readonly string[]
): string[] {
  const spec = tilePositionStorageKey(type, scope, widgetId);
  if (!spec) return [];
  if (spec.shared) {
    if (reason !== "undo") return [];
    if (remainingTypes && sharedPositionStillUsed(type, remainingTypes)) return [];
  }
  return [spec.key];
}

export function clearTilePositionStorage(
  storage: { removeItem: (key: string) => void },
  type: string,
  scope: string | undefined,
  widgetId: string,
  reason: "cancel" | "undo",
  remainingTypes?: readonly string[]
): string[] {
  const keys = tilePositionStorageKeys(type, scope, widgetId, reason, remainingTypes);
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
