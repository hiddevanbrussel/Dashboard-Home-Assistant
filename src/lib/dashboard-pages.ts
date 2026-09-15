export const DASHBOARD_MIN_PAGES = 1;
export const DASHBOARD_MAX_PAGES = 6;

export type DashboardLayoutPayload = {
  items: unknown[];
  pageCount?: number;
};

export function clampPageCount(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return DASHBOARD_MIN_PAGES;
  return Math.min(DASHBOARD_MAX_PAGES, Math.max(DASHBOARD_MIN_PAGES, Math.round(v)));
}

export function clampPageIndex(page: unknown, pageCount: number): number {
  const count = clampPageCount(pageCount);
  const v = typeof page === "number" ? page : Number(page);
  if (!Number.isFinite(v)) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(v)));
}

export function widgetPage(widget: { page?: unknown } | null | undefined): number {
  if (!widget) return 0;
  const v = typeof widget.page === "number" ? widget.page : Number(widget.page);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.round(v));
}

export function resolvePageCount(
  storedPageCount: unknown,
  widgets: { page?: unknown }[]
): number {
  const fromWidgets = widgets.reduce((max, widget) => Math.max(max, widgetPage(widget) + 1), 1);
  return clampPageCount(Math.max(fromWidgets, clampPageCount(storedPageCount)));
}

/** iOS-style resistance when dragging past the first or last page. */
export function rubberBandOffset(overscrollPx: number, pageWidth: number): number {
  const width = pageWidth > 0 ? pageWidth : 1;
  const overscroll = Math.abs(overscrollPx);
  const resisted = overscroll / (1 + overscroll / (width * 0.55));
  return Math.sign(overscrollPx) * resisted;
}

export function applyDashboardPageDrag(input: {
  page: number;
  pageCount: number;
  dragPx: number;
  pageWidth: number;
}): number {
  const page = clampPageIndex(input.page, input.pageCount);
  const atStart = page <= 0 && input.dragPx > 0;
  const atEnd = page >= input.pageCount - 1 && input.dragPx < 0;
  if (atStart || atEnd) return rubberBandOffset(input.dragPx, input.pageWidth);
  return input.dragPx;
}

export function settleDashboardPage(input: {
  page: number;
  pageCount: number;
  dragPx: number;
  velocityPxPerMs: number;
  pageWidth: number;
}): number {
  const page = clampPageIndex(input.page, input.pageCount);
  const width = input.pageWidth > 0 ? input.pageWidth : 1;
  const distanceThreshold = width * 0.18;
  const velocityThreshold = 0.55;
  let next = page;
  if (input.dragPx <= -distanceThreshold || input.velocityPxPerMs <= -velocityThreshold) {
    next = page + 1;
  } else if (input.dragPx >= distanceThreshold || input.velocityPxPerMs >= velocityThreshold) {
    next = page - 1;
  }
  return clampPageIndex(next, input.pageCount);
}

export function parseDashboardLayout(layout: string | null | undefined): {
  items: unknown[];
  pageCount: number;
} {
  if (!layout) return { items: [], pageCount: DASHBOARD_MIN_PAGES };
  try {
    const parsed = JSON.parse(layout) as unknown;
    if (Array.isArray(parsed)) {
      return { items: parsed, pageCount: DASHBOARD_MIN_PAGES };
    }
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as DashboardLayoutPayload).items)) {
      const payload = parsed as DashboardLayoutPayload;
      return { items: payload.items, pageCount: clampPageCount(payload.pageCount) };
    }
    return { items: [], pageCount: DASHBOARD_MIN_PAGES };
  } catch {
    return { items: [], pageCount: DASHBOARD_MIN_PAGES };
  }
}

export function serializeDashboardLayout(items: unknown[], pageCount: number): string {
  const count = clampPageCount(pageCount);
  if (count <= DASHBOARD_MIN_PAGES) return JSON.stringify(items);
  return JSON.stringify({ items, pageCount: count });
}

export function reindexWidgetsAfterRemovedPage<T extends { page?: number }>(
  widgets: T[],
  removedPage: number
): T[] {
  return widgets.map((widget) => {
    const page = widgetPage(widget);
    if (page === removedPage) return { ...widget, page: Math.max(0, removedPage - 1) };
    if (page > removedPage) return { ...widget, page: page - 1 };
    return widget;
  });
}
