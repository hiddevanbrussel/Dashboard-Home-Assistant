export const CARD_PLOT_CLASS = "card-plot-in";
export const CARD_PLOT_PLAYED_CLASS = "card-plot-played";
export const CARD_PLOT_INSTANT_CLASS = "card-plot-instant";
export const CARD_PLOT_STEP_MS = 55;
export const CARD_PLOT_FALLBACK_MS = 1600;
export const DASHBOARD_EDIT_ATTR = "data-dashboard-edit";

/** Edit mode should never replay the first-open plot animation. */
export function cardPlotShouldBeInstant(editMode: boolean): boolean {
  return editMode;
}

export function setDashboardEditFlag(editMode: boolean): void {
  if (typeof document === "undefined") return;
  if (editMode) document.documentElement.setAttribute(DASHBOARD_EDIT_ATTR, "1");
  else document.documentElement.removeAttribute(DASHBOARD_EDIT_ATTR);
}

/** Skip the plot animation on every card currently in the tree. */
export function markCardsPlotInstant(root: ParentNode = document): void {
  root.querySelectorAll(`.${CARD_PLOT_CLASS}`).forEach((el) => {
    el.classList.add(CARD_PLOT_INSTANT_CLASS, CARD_PLOT_PLAYED_CLASS);
  });
}

export function isDashboardEditFlagSet(): boolean {
  return typeof document !== "undefined" && document.documentElement.hasAttribute(DASHBOARD_EDIT_ATTR);
}

export type PlotRect = {
  top: number;
  left: number;
};

/** Place cards top-to-bottom, then left-to-right, so they plot onto the page. */
export function sortCardsForPlot<T>(items: T[], rectOf: (item: T) => PlotRect): T[] {
  return [...items].sort((a, b) => {
    const ra = rectOf(a);
    const rb = rectOf(b);
    const row = Math.round(ra.top / 24) - Math.round(rb.top / 24);
    if (row !== 0) return row;
    return ra.left - rb.left;
  });
}
