export const ENERGY_MONITOR_CARD_DEFAULT_WIDTH = 360;
export const ENERGY_MONITOR_CARD_DEFAULT_HEIGHT = 260;
export const ENERGY_MONITOR_CARD_MIN_WIDTH = 48;
export const ENERGY_MONITOR_CARD_MAX_WIDTH = 960;
export const ENERGY_MONITOR_CARD_MIN_HEIGHT = 48;
export const ENERGY_MONITOR_CARD_MAX_HEIGHT = 720;

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
