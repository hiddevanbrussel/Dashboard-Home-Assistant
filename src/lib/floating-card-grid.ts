/**
 * Snap grid voor zwevende kaarten (weather, media, climate, etc.).
 * Zorgt dat kaarten op dezelfde afstand van elkaar kunnen staan bij neerzetten.
 */

export const FLOATING_CARD_GRID_STEP = 16;

export type Position = { left: number; bottom: number };

/**
 * Snapt een positie naar het dichtstbijzijnde grid (links en onder).
 * Optioneel clampen binnen maxLeft en maxBottom.
 */
export function snapToGrid(
  position: Position,
  bounds?: { maxLeft: number; maxBottom: number }
): Position {
  const step = FLOATING_CARD_GRID_STEP;
  let left = Math.round(position.left / step) * step;
  let bottom = Math.round(position.bottom / step) * step;
  if (bounds != null) {
    left = Math.max(0, Math.min(left, bounds.maxLeft));
    bottom = Math.max(0, Math.min(bottom, bounds.maxBottom));
  }
  return { left, bottom };
}
