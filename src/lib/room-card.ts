export function roomDashboardHref(areaId: unknown): string | null {
  if (typeof areaId !== "string") return null;
  const id = areaId.trim();
  if (!id) return null;
  return `/dashboards/room-${encodeURIComponent(id)}`;
}

export const ROOM_CARD_DEFAULT_WIDTH = 220;
export const ROOM_CARD_DEFAULT_HEIGHT = 100;
export const ROOM_CARD_MIN_WIDTH = 180;
export const ROOM_CARD_MAX_WIDTH = 480;
export const ROOM_CARD_MIN_HEIGHT = 72;
export const ROOM_CARD_MAX_HEIGHT = 320;

export function clampRoomCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return ROOM_CARD_DEFAULT_WIDTH;
  return Math.min(ROOM_CARD_MAX_WIDTH, Math.max(ROOM_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampRoomCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return ROOM_CARD_DEFAULT_HEIGHT;
  return Math.min(ROOM_CARD_MAX_HEIGHT, Math.max(ROOM_CARD_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeRoomCardFromBottomRight(input: {
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
    ROOM_CARD_MIN_WIDTH,
    Math.min(ROOM_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    ROOM_CARD_MIN_HEIGHT,
    Math.min(ROOM_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampRoomCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampRoomCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}
