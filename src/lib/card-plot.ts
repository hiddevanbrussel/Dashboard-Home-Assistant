export const CARD_PLOT_CLASS = "card-plot-in";
export const CARD_PLOT_PLAYED_CLASS = "card-plot-played";
export const CARD_PLOT_STEP_MS = 55;
export const CARD_PLOT_FALLBACK_MS = 1600;

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
