/**
 * Pure helpers behind the tile ⋮ menu (Tegel bewerken / dupliceren / verwijderen).
 * Removing keeps a snapshot so the 5-second undo can put the tile back exactly where it was.
 */

export type RemovableTile = { id: string };
export type RemovableLayoutItem = { i: string };

export type RemovedTileSnapshot<W extends RemovableTile, L extends RemovableLayoutItem> = {
  widget: W;
  widgetIndex: number;
  layoutItem: L | null;
  layoutIndex: number;
};

/** Remove a top-level tile and remember where it was. Unknown ids leave both arrays untouched. */
export function removeTileWithSnapshot<W extends RemovableTile, L extends RemovableLayoutItem>(
  widgets: W[],
  layout: L[],
  id: string
): { widgets: W[]; layout: L[]; snapshot: RemovedTileSnapshot<W, L> | null } {
  const widgetIndex = widgets.findIndex((w) => w.id === id);
  if (widgetIndex < 0) return { widgets, layout, snapshot: null };
  const layoutIndex = layout.findIndex((item) => item.i === id);
  return {
    widgets: widgets.filter((_, i) => i !== widgetIndex),
    layout: layoutIndex < 0 ? layout : layout.filter((_, i) => i !== layoutIndex),
    snapshot: {
      widget: widgets[widgetIndex],
      widgetIndex,
      layoutItem: layoutIndex < 0 ? null : layout[layoutIndex],
      layoutIndex,
    },
  };
}

/**
 * Put a removed tile back at its old index. If it is already there (double undo), nothing changes.
 * Indexes past the end of a list that has since shrunk append at the end.
 */
export function restoreRemovedTile<W extends RemovableTile, L extends RemovableLayoutItem>(
  widgets: W[],
  layout: L[],
  snapshot: RemovedTileSnapshot<W, L>
): { widgets: W[]; layout: L[] } {
  if (widgets.some((w) => w.id === snapshot.widget.id)) return { widgets, layout };
  const nextWidgets = [...widgets];
  nextWidgets.splice(Math.min(snapshot.widgetIndex, nextWidgets.length), 0, snapshot.widget);
  let nextLayout = layout;
  if (snapshot.layoutItem && !layout.some((item) => item.i === snapshot.widget.id)) {
    nextLayout = [...layout];
    nextLayout.splice(Math.min(snapshot.layoutIndex, nextLayout.length), 0, snapshot.layoutItem);
  }
  return { widgets: nextWidgets, layout: nextLayout };
}

/** A floating tile's stored `{left,bottom}`, kept with the undo snapshot because removal prunes the key. */
export type SavedTilePosition = { key: string; value: string };

export function readSavedTilePosition(
  storage: Pick<Storage, "getItem">,
  key: string | null | undefined
): SavedTilePosition | null {
  if (!key) return null;
  const value = storage.getItem(key);
  return value == null ? null : { key, value };
}

/** Put the position back before the tile mounts again. A key that has a value by now is left alone. */
export function restoreSavedTilePosition(
  storage: Pick<Storage, "getItem" | "setItem">,
  saved: SavedTilePosition | null
): void {
  if (!saved || storage.getItem(saved.key) != null) return;
  storage.setItem(saved.key, saved.value);
}

/** Title for a duplicated tile: "Keuken" → "Keuken (kopie)". An empty title stays empty. */
export function duplicateTileTitle(title: string | undefined, copySuffix: string): string {
  const base = (title ?? "").trim();
  return base ? `${base} (${copySuffix})` : base;
}
