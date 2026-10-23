/**
 * Pure helpers for the tile popover menu (`components/layout/tile-menu.tsx`).
 * The menu renders hidden first, gets measured, is placed, and only then takes focus.
 */

export type MenuAnchor = { left: number; top: number; right: number; bottom: number };
export type MenuSize = { width: number; height: number };
export type MenuViewport = { width: number; height: number };

export const MENU_VIEWPORT_MARGIN = 8;
export const MENU_ANCHOR_GAP = 8;

/** Centred under the anchor, kept inside the viewport; flips above when there is no room below. */
export function placeTileMenu(anchor: MenuAnchor, size: MenuSize, viewport: MenuViewport): { left: number; top: number } {
  const centre = (anchor.left + anchor.right) / 2;
  const left = Math.min(
    Math.max(MENU_VIEWPORT_MARGIN, centre - size.width / 2),
    viewport.width - size.width - MENU_VIEWPORT_MARGIN
  );
  const below = anchor.bottom + MENU_ANCHOR_GAP;
  const top =
    below + size.height <= viewport.height - MENU_VIEWPORT_MARGIN
      ? below
      : Math.max(MENU_VIEWPORT_MARGIN, anchor.top - MENU_ANCHOR_GAP - size.height);
  return { left, top };
}

/** Row that gets focus when the menu opens: the first one that is not disabled, or -1. */
export function firstEnabledIndex(items: readonly { disabled?: boolean }[]): number {
  return items.findIndex((item) => !item.disabled);
}

/**
 * Focus may only move once the menu is visible: a `visibility: hidden` element cannot take focus,
 * so focusing before placement silently fails (keyboard users stayed on the trigger).
 */
export function canFocusMenu(placed: boolean, alreadyFocused: boolean): boolean {
  return placed && !alreadyFocused;
}
