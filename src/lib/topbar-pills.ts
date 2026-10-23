/**
 * Stat pills pinned to the top bar (phase 1: menu only, no drag).
 * Pure helpers over the top-level widgets array. Nested tiles (smart stack /
 * card group `children`) and other tile types are never touched.
 * Unknown fields are kept: tiles are spread, never rebuilt.
 */

export const TOPBAR_PILL_TYPE = "stat_pill_card";
export const TOPBAR_PILL_MAX = 4;

export type TopbarPillFields = {
  id: string;
  type: string;
  placement?: "topbar";
  topbar_order?: number;
};

function isTopbarPill(w: TopbarPillFields): boolean {
  return w.type === TOPBAR_PILL_TYPE && w.placement === "topbar";
}

/** Pinned pills in bar order. Missing order sorts last, then by array position. */
export function topbarPills<T extends TopbarPillFields>(widgets: readonly T[]): T[] {
  return widgets
    .map((w, index) => ({ w, index }))
    .filter(({ w }) => isTopbarPill(w))
    .sort((a, b) => {
      const ao = a.w.topbar_order ?? Number.POSITIVE_INFINITY;
      const bo = b.w.topbar_order ?? Number.POSITIVE_INFINITY;
      return ao === bo ? a.index - b.index : ao - bo;
    })
    .map(({ w }) => w);
}

export function canPinMore(widgets: readonly TopbarPillFields[], max = TOPBAR_PILL_MAX): boolean {
  return topbarPills(widgets).length < max;
}

/** Renumber pinned pills 0..n-1 in their current order. Untouched tiles keep their identity. */
function compactOrder<T extends TopbarPillFields>(widgets: T[]): T[] {
  const order = new Map(topbarPills(widgets).map((w, i) => [w.id, i]));
  return widgets.map((w) => {
    const next = order.get(w.id);
    if (next == null || !isTopbarPill(w) || w.topbar_order === next) return w;
    return { ...w, topbar_order: next };
  });
}

/**
 * Pin a top-level stat pill at the end of the bar.
 * Returns the input array unchanged when the id is unknown, not a stat pill,
 * already pinned, or the bar is full.
 */
export function moveToTopbar<T extends TopbarPillFields>(
  widgets: T[],
  id: string,
  max = TOPBAR_PILL_MAX
): T[] {
  const target = widgets.find((w) => w.id === id);
  if (!target || target.type !== TOPBAR_PILL_TYPE || isTopbarPill(target)) return widgets;
  const pinned = topbarPills(widgets).length;
  if (pinned >= max) return widgets;
  const next = widgets.map((w) =>
    w.id === id ? { ...w, placement: "topbar" as const, topbar_order: pinned } : w
  );
  return compactOrder(next);
}

/**
 * Unpin a stat pill back to the floating layer. The rest of the bar keeps its order.
 * Returns the input array unchanged when the id is not a pinned pill.
 */
export function moveToGrid<T extends TopbarPillFields>(widgets: T[], id: string): T[] {
  const target = widgets.find((w) => w.id === id);
  if (!target || !isTopbarPill(target)) return widgets;
  const next = widgets.map((w) => {
    if (w.id !== id) return w;
    const { placement: _placement, topbar_order: _order, ...rest } = w;
    return rest as T;
  });
  return compactOrder(next);
}
