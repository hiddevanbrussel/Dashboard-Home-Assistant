export type StagedTilePosition = { left: number; bottom: number };

const staged = new Map<string, StagedTilePosition>();

/** Hand a position to the floating card before it mounts. The card consumes it once. */
export function stageTilePosition(widgetId: string, position: StagedTilePosition): void {
  staged.set(widgetId, position);
}

export function consumeStagedTilePosition(widgetId: string | undefined): StagedTilePosition | null {
  if (!widgetId) return null;
  const position = staged.get(widgetId) ?? null;
  if (position) staged.delete(widgetId);
  return position;
}

export function dropStagedTilePosition(widgetId: string | undefined): void {
  if (!widgetId) return;
  staged.delete(widgetId);
}

/** Saved localStorage wins. Otherwise a staged first-fit slot replaces the legacy default. */
export function stagedOrFallback<T extends StagedTilePosition>(
  widgetId: string | undefined,
  fallback: T
): T {
  const stagedPosition = consumeStagedTilePosition(widgetId);
  if (!stagedPosition) return fallback;
  return { ...fallback, left: stagedPosition.left, bottom: stagedPosition.bottom };
}

export function stagedOrFallbackAny<T extends StagedTilePosition>(
  widgetIds: Array<string | undefined>,
  fallback: T
): T {
  for (const widgetId of widgetIds) {
    const stagedPosition = consumeStagedTilePosition(widgetId);
    if (stagedPosition) return { ...fallback, left: stagedPosition.left, bottom: stagedPosition.bottom };
  }
  return fallback;
}
