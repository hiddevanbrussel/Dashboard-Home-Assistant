export const CAMERA_CARD_DEFAULT_WIDTH = 360;
export const CAMERA_CARD_DEFAULT_HEIGHT = 270;
export const CAMERA_CARD_MIN_WIDTH = 200;
export const CAMERA_CARD_MAX_WIDTH = 720;
export const CAMERA_CARD_MIN_HEIGHT = 150;
export const CAMERA_CARD_MAX_HEIGHT = 540;

export function clampCameraCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return CAMERA_CARD_DEFAULT_WIDTH;
  return Math.min(CAMERA_CARD_MAX_WIDTH, Math.max(CAMERA_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampCameraCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return CAMERA_CARD_DEFAULT_HEIGHT;
  return Math.min(CAMERA_CARD_MAX_HEIGHT, Math.max(CAMERA_CARD_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeCameraCardFromBottomRight(input: {
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
    CAMERA_CARD_MIN_WIDTH,
    Math.min(CAMERA_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    CAMERA_CARD_MIN_HEIGHT,
    Math.min(CAMERA_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampCameraCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampCameraCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}
