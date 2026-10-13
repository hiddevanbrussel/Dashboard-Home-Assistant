export const ENERGY_MONITOR_CARD_DEFAULT_WIDTH = 360;
export const ENERGY_MONITOR_CARD_DEFAULT_HEIGHT = 260;
export const ENERGY_MONITOR_CARD_MIN_WIDTH = 48;
export const ENERGY_MONITOR_CARD_MAX_WIDTH = 960;
export const ENERGY_MONITOR_CARD_MIN_HEIGHT = 48;
export const ENERGY_MONITOR_CARD_MAX_HEIGHT = 720;
/** Grab handle that stays on-screen so the image can hang off any edge. */
export const ENERGY_MONITOR_CARD_KEEP_VISIBLE = 48;

export type EnergyMonitorCardDragBounds = {
  minLeft: number;
  maxLeft: number;
  minBottom: number;
  maxBottom: number;
};

/** Allow the image card to sit partly off-screen on every edge. */
export function energyMonitorCardDragBounds(
  cardWidth: number,
  cardHeight: number,
  viewport: { width: number; height: number }
): EnergyMonitorCardDragBounds {
  const width = Math.max(1, Math.round(cardWidth));
  const height = Math.max(1, Math.round(cardHeight));
  const keepX = Math.min(ENERGY_MONITOR_CARD_KEEP_VISIBLE, width);
  const keepY = Math.min(ENERGY_MONITOR_CARD_KEEP_VISIBLE, height);
  return {
    minLeft: keepX - width,
    maxLeft: viewport.width - keepX,
    minBottom: keepY - height,
    maxBottom: viewport.height - keepY,
  };
}

export function clampEnergyMonitorCardPosition(
  position: { left: number; bottom: number },
  bounds: EnergyMonitorCardDragBounds
): { left: number; bottom: number } {
  return {
    left: Math.max(bounds.minLeft, Math.min(position.left, bounds.maxLeft)),
    bottom: Math.max(bounds.minBottom, Math.min(position.bottom, bounds.maxBottom)),
  };
}

export function clampEnergyMonitorCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return ENERGY_MONITOR_CARD_DEFAULT_WIDTH;
  return Math.min(
    ENERGY_MONITOR_CARD_MAX_WIDTH,
    Math.max(ENERGY_MONITOR_CARD_MIN_WIDTH, Math.round(v))
  );
}

export function clampEnergyMonitorCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return ENERGY_MONITOR_CARD_DEFAULT_HEIGHT;
  return Math.min(
    ENERGY_MONITOR_CARD_MAX_HEIGHT,
    Math.max(ENERGY_MONITOR_CARD_MIN_HEIGHT, Math.round(v))
  );
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeEnergyMonitorCardFromBottomRight(input: {
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startBottom: number;
  dx: number;
  dy: number;
  viewportWidth: number;
  viewportHeight: number;
}): { width: number; height: number; left: number; bottom: number } {
  const top = input.viewportHeight - input.startBottom - input.startHeight;
  const maxWidth = Math.max(
    ENERGY_MONITOR_CARD_MIN_WIDTH,
    Math.min(ENERGY_MONITOR_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    ENERGY_MONITOR_CARD_MIN_HEIGHT,
    Math.min(ENERGY_MONITOR_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampEnergyMonitorCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampEnergyMonitorCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}
