export const CALENDAR_CARD_DEFAULT_WIDTH = 420;
export const CALENDAR_CARD_DEFAULT_HEIGHT = 200;
export const CALENDAR_CARD_MIN_WIDTH = 320;
export const CALENDAR_CARD_MAX_WIDTH = 640;
export const CALENDAR_CARD_MIN_HEIGHT = 160;
export const CALENDAR_CARD_MAX_HEIGHT = 420;

/** Approximate vertical budget for each event row + the overflow footer. */
const EVENT_ROW_PX = 52;
const CARD_VERTICAL_PAD_PX = 40;
const OVERFLOW_FOOTER_PX = 22;

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

/** How many event rows fit in the card before showing an overflow footer. */
export function calendarVisibleEventCount(height: unknown): number {
  const h = clampCalendarCardHeight(height);
  const available = Math.max(EVENT_ROW_PX, h - CARD_VERTICAL_PAD_PX - OVERFLOW_FOOTER_PX);
  return Math.max(1, Math.floor(available / EVENT_ROW_PX));
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
