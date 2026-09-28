export const MEDIA_CARD_DEFAULT_WIDTH = 280;
export const MEDIA_CARD_DEFAULT_HEIGHT = 340;
export const MEDIA_CARD_MIN_WIDTH = 240;
export const MEDIA_CARD_MAX_WIDTH = 500;
export const MEDIA_CARD_MIN_HEIGHT = 240;
export const MEDIA_CARD_MAX_HEIGHT = 520;

/** Default / auto-generated titles that should not override the HA friendly name. */
const GENERIC_MEDIA_CARD_TITLES = new Set(["media", "media card", "mediakaart"]);

/**
 * Player label on the media card: custom widget title if set (and not a generic
 * default), otherwise the entity friendly name, then entity_id / fallback.
 */
export function resolveMediaCardPlayerName(input: {
  title?: string | null;
  friendlyName?: string | null;
  entityId?: string | null;
  fallback?: string;
}): string {
  const custom = input.title?.trim() ?? "";
  const friendly = input.friendlyName?.trim() ?? "";
  const entityId = input.entityId?.trim() ?? "";
  const fallback = input.fallback?.trim() || "Media";
  const isGeneric =
    !custom ||
    GENERIC_MEDIA_CARD_TITLES.has(custom.toLowerCase()) ||
    custom.toLowerCase() === fallback.toLowerCase();
  if (!isGeneric) return custom;
  return friendly || entityId || fallback;
}

export function clampMediaCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return MEDIA_CARD_DEFAULT_WIDTH;
  return Math.min(MEDIA_CARD_MAX_WIDTH, Math.max(MEDIA_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampMediaCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return MEDIA_CARD_DEFAULT_HEIGHT;
  return Math.min(MEDIA_CARD_MAX_HEIGHT, Math.max(MEDIA_CARD_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeMediaCardFromBottomRight(input: {
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
    MEDIA_CARD_MIN_WIDTH,
    Math.min(MEDIA_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    MEDIA_CARD_MIN_HEIGHT,
    Math.min(MEDIA_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampMediaCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampMediaCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}
