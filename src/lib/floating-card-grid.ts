/**
 * Snap grid voor zwevende kaarten (weather, media, climate, etc.).
 * Zorgt dat kaarten op dezelfde afstand van elkaar kunnen staan bij neerzetten.
 */

export const FLOATING_CARD_GRID_STEP = 16;

export type Position = { left: number; bottom: number };

/**
 * Snapt een positie naar het dichtstbijzijnde grid (links en onder).
 * Optioneel clampen binnen [minLeft, maxLeft] en [minBottom, maxBottom].
 */
export function snapToGrid(
  position: Position,
  bounds?: { maxLeft: number; maxBottom: number; minLeft?: number; minBottom?: number }
): Position {
  const step = FLOATING_CARD_GRID_STEP;
  let left = Math.round(position.left / step) * step;
  let bottom = Math.round(position.bottom / step) * step;
  if (bounds != null) {
    const minL = bounds.minLeft ?? 0;
    const minB = bounds.minBottom ?? 0;
    left = Math.max(minL, Math.min(left, bounds.maxLeft));
    bottom = Math.max(minB, Math.min(bottom, bounds.maxBottom));
  }
  return { left, bottom };
}
