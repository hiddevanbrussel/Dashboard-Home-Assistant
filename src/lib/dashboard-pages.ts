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

/** Fraction of the page width that commits a swipe on release (without a flick). */
export const DASHBOARD_PAGE_SETTLE_DISTANCE_RATIO = 0.12;
/** Horizontal flick speed (px/ms) that commits a page change. */
export const DASHBOARD_PAGE_SETTLE_VELOCITY = 0.4;

export function pageSwipeClaimPx(pointerType: string | undefined): number {
  if (pointerType === "touch" || pointerType === "pen") return 8;
  return 16;
}

export function dashboardPageSettleDurationMs(distancePx: number): number {
  const distance = Math.abs(distancePx);
  if (!Number.isFinite(distance)) return 280;
  return Math.min(420, Math.max(240, Math.round(distance * 0.42 + 180)));
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
  const distanceThreshold = width * DASHBOARD_PAGE_SETTLE_DISTANCE_RATIO;
  const velocityThreshold = DASHBOARD_PAGE_SETTLE_VELOCITY;
  let next = page;
  if (input.dragPx <= -distanceThreshold || input.velocityPxPerMs <= -velocityThreshold) {
    next = page + 1;
  } else if (input.dragPx >= distanceThreshold || input.velocityPxPerMs >= velocityThreshold) {
    next = page - 1;
  }
  return clampPageIndex(next, input.pageCount);
}

/** Horizontal velocity over the most recent pointer samples (px/ms). */
export function velocityFromPointerSamples(
  samples: { x: number; t: number }[],
  endX: number,
  endT: number,
  windowMs = 100
): number {
  if (!Number.isFinite(endX) || !Number.isFinite(endT)) return 0;
  const cutoff = endT - windowMs;
  let first = samples[0];
  for (const sample of samples) {
    if (sample.t >= cutoff) {
      first = sample;
      break;
    }
  }
  if (!first) return 0;
  const dt = endT - first.t;
  if (dt <= 0) return 0;
  return (endX - first.x) / dt;
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
