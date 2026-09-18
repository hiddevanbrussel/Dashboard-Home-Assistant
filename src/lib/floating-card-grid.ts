/**
 * Snap grid voor zwevende kaarten (weather, media, climate, etc.).
 * Zorgt dat kaarten op dezelfde afstand van elkaar kunnen staan bij neerzetten.
 */

export const FLOATING_CARD_GRID_STEP = 16;

export type Position = { left: number; bottom: number };

/**
 * Snapt een positie naar het dichtstbijzijnde grid (links en onder).
 * Optioneel clampen binnen [minLeft, maxLeft] en [minBottom, maxBottom].
 */
export function snapToGrid(
  position: Position,
  bounds?: { maxLeft: number; maxBottom: number; minLeft?: number; minBottom?: number }
): Position {
  const step = FLOATING_CARD_GRID_STEP;
  let left = Math.round(position.left / step) * step;
  let bottom = Math.round(position.bottom / step) * step;
  if (bounds != null) {
    const minL = bounds.minLeft ?? 0;
    const minB = bounds.minBottom ?? 0;
    left = Math.max(minL, Math.min(left, bounds.maxLeft));
    bottom = Math.max(minB, Math.min(bottom, bounds.maxBottom));
  }
  return { left, bottom };
}

/** Convert an element's viewport box into left/bottom inside a transformed ancestor (dashboard pager). */
export function leftBottomInParent(
  rect: { left: number; bottom: number },
  parent: { left: number; bottom: number }
): Position {
  return {
    left: rect.left - parent.left,
    bottom: parent.bottom - rect.bottom,
  };
}

/** Prefer the on-screen box so a drag stays under the pointer after containing-block changes. */
export function beginFloatingCardDrag(
  pointer: { clientX: number; clientY: number },
  fallback: Position,
  measured?: Position | null
): { x: number; y: number; left: number; bottom: number } {
  const origin =
    measured && Number.isFinite(measured.left) && Number.isFinite(measured.bottom)
      ? measured
      : fallback;
  return {
    x: pointer.clientX,
    y: pointer.clientY,
    left: origin.left,
    bottom: origin.bottom,
  };
}

export function floatingDragBounds(
  cardWidth: number,
  cardHeight: number,
  parent: { width: number; height: number },
  insetBottom = 0
): { maxLeft: number; maxBottom: number } {
  return {
    maxLeft: Math.max(0, parent.width - cardWidth),
    maxBottom: Math.max(0, parent.height - cardHeight - insetBottom),
  };
}

export function createsContainingBlock(style: {
  position?: string;
  transform?: string;
}): boolean {
  if (style.transform && style.transform !== "none") return true;
  const position = style.position ?? "static";
  return position === "relative" || position === "absolute" || position === "fixed" || position === "sticky";
}

function containingBlockRect(el: HTMLElement): DOMRect {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if (node.style.transform || createsContainingBlock(window.getComputedStyle(node))) {
      return node.getBoundingClientRect();
    }
    node = node.parentElement;
  }
  return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}

/** Read a floating card's left/bottom from its on-screen box, not from possibly stale state. */
export function floatingPositionFromElement(el: HTMLElement): Position {
  const rect = el.getBoundingClientRect();
  const parent = containingBlockRect(el);
  return leftBottomInParent(rect, parent);
}
