/**
 * First free slot for a new floating tile.
 * Coordinates are viewport pixels: `top` grows downward, `bottom` is the
 * distance from the viewport bottom (the value floating cards store).
 */

export const TILE_PLACE_STEP_PX = 16;
export const TILE_PLACE_GAP_PX = 16;
/** Matches the floating icon rail (`SIDEBAR_INSET` = 5.5rem). */
export const TILE_SIDEBAR_INSET_PX = 88;
/** Edit-mode page bar height. Tiles stay above it. */
export const TILE_EDIT_BAR_INSET_PX = 28;

export type TileSize = { width: number; height: number };
export type TileRect = { left: number; top: number; width: number; height: number };
export type TileViewport = { width: number; height: number };

export type TilePlacementInput = {
  viewport: TileViewport;
  tile: TileSize;
  occupied: TileRect[];
  /** Left edge of the usable area (sidebar). */
  minLeft: number;
  /** Top edge of the usable area (header). */
  minTop: number;
  /** Space kept clear above the viewport bottom (edit bar). */
  minBottom: number;
  /** Same-type index used only by the legacy fallback. */
  widgetIndex?: number;
  gap?: number;
  step?: number;
};

export type TilePlacement = {
  left: number;
  bottom: number;
  width: number;
  height: number;
  placedBy: "first-fit" | "fallback";
};

const DEFAULT_TILE_SIZES: Record<string, TileSize> = {
  text_card: { width: 280, height: 72 },
  title_card: { width: 280, height: 72 },
  title_only_card: { width: 280, height: 72 },
  subtitle_card: { width: 280, height: 72 },
  climate_card: { width: 300, height: 340 },
  climate_card_2: { width: 300, height: 340 },
  light_card: { width: 240, height: 80 },
  media_card: { width: 280, height: 340 },
  solar_card: { width: 320, height: 220 },
  energy_monitor_card: { width: 360, height: 260 },
  power_usage_card: { width: 400, height: 380 },
  device_consumption_card: { width: 320, height: 320 },
  stat_pill_card: { width: 140, height: 44 },
  sensor_card: { width: 260, height: 160 },
  weather_card: { width: 320, height: 300 },
  vacuum_card: { width: 320, height: 220 },
  vacuum_card_2: { width: 320, height: 460 },
  alarm_card: { width: 300, height: 220 },
  camera_card: { width: 360, height: 270 },
  teamtracker_card: { width: 380, height: 280 },
  pill_card: { width: 280, height: 72 },
  room_card: { width: 220, height: 100 },
  nuts_card: { width: 320, height: 300 },
  smart_stack: { width: 300, height: 300 },
  card_group: { width: 280, height: 120 },
  chore_card: { width: 280, height: 180 },
  calendar_card: { width: 420, height: 200 },
  timer_card: { width: 280, height: 180 },
  trash_card: { width: 320, height: 320 },
};

export function defaultTileSize(type: string): TileSize {
  return DEFAULT_TILE_SIZES[type] ?? { width: 240, height: 80 };
}

function alignUp(value: number, step: number): number {
  if (step <= 1) return value;
  return Math.ceil(value / step) * step;
}

function snapToStep(value: number, step: number): number {
  if (step <= 1) return value;
  return Math.round(value / step) * step;
}

/** True when the gap between the two boxes is smaller than `gap`. */
export function tileRectsCollide(a: TileRect, b: TileRect, gap: number): boolean {
  return !(
    a.left >= b.left + b.width + gap ||
    b.left >= a.left + a.width + gap ||
    a.top >= b.top + b.height + gap ||
    b.top >= a.top + a.height + gap
  );
}

/**
 * Scan the visible area from top-left, on the placement grid.
 * Returns null when the tile does not fit anywhere without overlap.
 */
export function findFirstFreeTileSlot(input: TilePlacementInput): TileRect | null {
  const step = input.step ?? TILE_PLACE_STEP_PX;
  const gap = input.gap ?? TILE_PLACE_GAP_PX;
  const { viewport, tile, occupied, minLeft, minTop, minBottom } = input;
  if (tile.width <= 0 || tile.height <= 0 || viewport.width <= 0 || viewport.height <= 0) return null;

  const maxLeft = viewport.width - tile.width;
  const maxTop = viewport.height - minBottom - tile.height;
  if (maxLeft < minLeft || maxTop < minTop) return null;

  const startLeft = alignUp(Math.max(0, minLeft), step);
  const startTop = alignUp(Math.max(0, minTop), step);
  if (startLeft > maxLeft || startTop > maxTop) return null;

  for (let top = startTop; top <= maxTop; top += step) {
    for (let left = startLeft; left <= maxLeft; left += step) {
      const candidate: TileRect = { left, top, width: tile.width, height: tile.height };
      const blocked = occupied.some((rect) => tileRectsCollide(candidate, rect, gap));
      if (!blocked) return candidate;
    }
  }
  return null;
}

/**
 * Current default before first-fit: `24 + index * (width + 16)`, vertically centered.
 * `left` is then pulled out from behind the sidebar.
 */
export function fallbackTilePosition(input: TilePlacementInput): { left: number; bottom: number } {
  const step = input.step ?? TILE_PLACE_STEP_PX;
  const index = input.widgetIndex ?? 0;
  const offset = 24;
  const gap = 16;
  const { viewport, tile, minLeft, minTop, minBottom } = input;
  const maxLeft = Math.max(minLeft, viewport.width - tile.width);
  const maxBottom = Math.max(minBottom, viewport.height - tile.height - minTop);
  let left = Math.min(maxLeft, offset + index * (tile.width + gap));
  let bottom = Math.max(offset, (viewport.height - tile.height) / 2);
  left = Math.max(minLeft, left);
  left = Math.min(left, maxLeft);
  bottom = Math.max(minBottom, Math.min(bottom, maxBottom));
  const snappedLeft = snapToStep(left, step);
  left = snappedLeft < minLeft ? Math.min(maxLeft, snappedLeft + step) : Math.min(maxLeft, snappedLeft);
  bottom = snapToStep(bottom, step);
  bottom = Math.max(minBottom, Math.min(bottom, maxBottom));
  return { left, bottom };
}

function topToBottom(viewportHeight: number, top: number, height: number): number {
  return viewportHeight - top - height;
}

export function resolveTilePosition(input: TilePlacementInput): TilePlacement {
  const slot = findFirstFreeTileSlot(input);
  if (slot) {
    return {
      left: slot.left,
      bottom: topToBottom(input.viewport.height, slot.top, input.tile.height),
      width: input.tile.width,
      height: input.tile.height,
      placedBy: "first-fit",
    };
  }
  const fallback = fallbackTilePosition(input);
  return {
    left: fallback.left,
    bottom: fallback.bottom,
    width: input.tile.width,
    height: input.tile.height,
    placedBy: "fallback",
  };
}
