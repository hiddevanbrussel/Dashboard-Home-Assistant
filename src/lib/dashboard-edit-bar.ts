/**
 * The edit bar sits on the viewport bottom (`bottom-0`, `h-7` = 28px).
 * A floating tile parked at `bottom: 32px` draws a 24px resize handle 2px
 * outside the card, so the handle occupies 30–54px above the viewport edge.
 * A 28px bar stays below that handle. `bottom-5` (20px) used to lift the bar
 * into the handle, and the bar's hit box swallowed the drag.
 */
export const DASHBOARD_EDIT_BAR_HEIGHT_PX = 28;

/** Matches the floating-card resize control (`h-6 w-6`). */
export const DASHBOARD_RESIZE_HANDLE_PX = 24;

/** `-bottom-0.5 -right-0.5` pulls the handle 2px outside the card. */
export const DASHBOARD_RESIZE_HANDLE_OUTSET_PX = 2;

/** Previous `bottom-5` offset. Still the position outside edit mode. */
export const DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX = 20;

/** Page-dot height (`h-2`). Outside edit mode the cluster is only this tall. */
export const DASHBOARD_PAGE_DOT_PX = 8;

export type VerticalBand = { top: number; bottom: number };

/** Viewport Y band of a bottom-right resize handle on a full-height page. */
export function resizeHandleVerticalBand(viewportHeight: number, cardBottomPx: number): VerticalBand {
  const bottom = viewportHeight - cardBottomPx + DASHBOARD_RESIZE_HANDLE_OUTSET_PX;
  return { top: bottom - DASHBOARD_RESIZE_HANDLE_PX, bottom };
}

/** Viewport Y band of the edit bar. `bottomOffsetPx` is the CSS `bottom` offset. */
export function editBarVerticalBand(viewportHeight: number, bottomOffsetPx = 0): VerticalBand {
  const bottom = viewportHeight - bottomOffsetPx;
  return { top: bottom - DASHBOARD_EDIT_BAR_HEIGHT_PX, bottom };
}

export function verticalBandsOverlap(a: VerticalBand, b: VerticalBand): boolean {
  return a.top < b.bottom && a.bottom > b.top;
}

/**
 * True when a tile at `cardBottomPx` can be resized without the edit bar
 * covering the handle, at every horizontal position.
 */
/**
 * Top of the page dots outside edit mode. Main places a content-sized cluster
 * `bottom-5` (20px) above the viewport edge, so an 8px dot starts 28px up.
 * At 800px that is y 772; the flush edit bar centers the same dot at y 782.
 */
export function browsePageDotTop(viewportHeight: number): number {
  return viewportHeight - DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX - DASHBOARD_PAGE_DOT_PX;
}

export function editBarClearsResizeHandle(
  viewportHeight: number,
  cardBottomPx: number,
  bottomOffsetPx = 0
): boolean {
  return !verticalBandsOverlap(
    resizeHandleVerticalBand(viewportHeight, cardBottomPx),
    editBarVerticalBand(viewportHeight, bottomOffsetPx)
  );
}
