export const CALENDAR_CARD_DEFAULT_WIDTH = 340;
export const CALENDAR_CARD_DEFAULT_HEIGHT = 480;
export const CALENDAR_CARD_MIN_WIDTH = 280;
export const CALENDAR_CARD_MAX_WIDTH = 560;
export const CALENDAR_CARD_MIN_HEIGHT = 340;
export const CALENDAR_CARD_MAX_HEIGHT = 780;

export function clampCalendarCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return CALENDAR_CARD_DEFAULT_WIDTH;
  return Math.min(CALENDAR_CARD_MAX_WIDTH, Math.max(CALENDAR_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampCalendarCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return CALENDAR_CARD_DEFAULT_HEIGHT;
  return Math.min(CALENDAR_CARD_MAX_HEIGHT, Math.max(CALENDAR_CARD_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeCalendarCardFromBottomRight(input: {
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
    CALENDAR_CARD_MIN_WIDTH,
    Math.min(CALENDAR_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    CALENDAR_CARD_MIN_HEIGHT,
    Math.min(CALENDAR_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampCalendarCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampCalendarCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}
