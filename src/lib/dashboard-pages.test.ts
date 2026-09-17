import { describe, expect, it } from "vitest";
import {
  applyDashboardPageDrag,
  clampPageCount,
  clampPageIndex,
  dashboardPageSettleDurationMs,
  isBrowserBackGestureZone,
  pageSwipeClaimPx,
  parseDashboardLayout,
  reindexWidgetsAfterRemovedPage,
  resolvePageCount,
  rubberBandOffset,
  serializeDashboardLayout,
  settleDashboardPage,
  shouldConsumeHistoryBack,
  shouldIgnorePageSwipe,
  velocityFromPointerSamples,
  widgetPage,
} from "./dashboard-pages";

describe("dashboard pages", () => {
  it("clamps page counts onto 1–6", () => {
    expect(clampPageCount(undefined)).toBe(1);
    expect(clampPageCount(0)).toBe(1);
    expect(clampPageCount(3)).toBe(3);
    expect(clampPageCount(99)).toBe(6);
  });

  it("reads a widget page and keeps legacy cards on page 0", () => {
    expect(widgetPage({})).toBe(0);
    expect(widgetPage({ page: 2 })).toBe(2);
    expect(widgetPage({ page: "1" })).toBe(1);
    expect(widgetPage({ page: -4 })).toBe(0);
  });

  it("uses the highest widget page when stored count is lower", () => {
    expect(resolvePageCount(1, [{ page: 0 }, { page: 2 }])).toBe(3);
    expect(resolvePageCount(4, [{ page: 0 }])).toBe(4);
  });

  it("rubber-bands past the first and last page", () => {
    expect(applyDashboardPageDrag({ page: 1, pageCount: 3, dragPx: -80, pageWidth: 1000 })).toBe(-80);
    const resisted = applyDashboardPageDrag({ page: 0, pageCount: 3, dragPx: 200, pageWidth: 1000 });
    expect(resisted).toBeGreaterThan(0);
    expect(resisted).toBeLessThan(200);
    expect(rubberBandOffset(0, 1000)).toBe(0);
  });

  it("settles to the next page from distance or flick velocity", () => {
    expect(
      settleDashboardPage({ page: 0, pageCount: 3, dragPx: -200, velocityPxPerMs: 0, pageWidth: 1000 })
    ).toBe(1);
    expect(
      settleDashboardPage({ page: 0, pageCount: 3, dragPx: -130, velocityPxPerMs: 0, pageWidth: 1000 })
    ).toBe(1);
    expect(
      settleDashboardPage({ page: 1, pageCount: 3, dragPx: 40, velocityPxPerMs: 0.45, pageWidth: 1000 })
    ).toBe(0);
    expect(
      settleDashboardPage({ page: 0, pageCount: 3, dragPx: -50, velocityPxPerMs: 0, pageWidth: 1000 })
    ).toBe(0);
    expect(
      settleDashboardPage({ page: 1, pageCount: 3, dragPx: 200, velocityPxPerMs: 0, pageWidth: 1000 })
    ).toBe(0);
    expect(
      settleDashboardPage({ page: 1, pageCount: 3, dragPx: 50, velocityPxPerMs: 0, pageWidth: 1000 })
    ).toBe(1);
    expect(clampPageIndex(8, 2)).toBe(1);
  });

  it("allows a page swipe that starts on an SVG sidebar icon", () => {
    const svgIcon = { closest: () => null };
    expect(shouldIgnorePageSwipe(svgIcon as unknown as EventTarget, false)).toBe(false);
  });

  it("still ignores swipes that start in the app header", () => {
    const headerChild = {
      closest: (selector: string) => (selector.includes("data-app-header") ? {} : null),
    };
    expect(shouldIgnorePageSwipe(headerChild as unknown as EventTarget, false)).toBe(true);
  });

  it("claims a swipe sooner on touch than on mouse", () => {
    expect(pageSwipeClaimPx("touch")).toBe(8);
    expect(pageSwipeClaimPx("pen")).toBe(8);
    expect(pageSwipeClaimPx("mouse")).toBe(16);
    expect(pageSwipeClaimPx(undefined)).toBe(16);
    expect(pageSwipeClaimPx("touch", 12)).toBe(4);
    expect(pageSwipeClaimPx("mouse", 8)).toBe(16);
  });

  it("treats the left edge as a browser-back gesture zone on touch", () => {
    expect(isBrowserBackGestureZone(8, "touch")).toBe(true);
    expect(isBrowserBackGestureZone(40, "touch")).toBe(false);
    expect(isBrowserBackGestureZone(8, "mouse")).toBe(false);
    expect(shouldConsumeHistoryBack(0)).toBe(false);
    expect(shouldConsumeHistoryBack(1)).toBe(true);
  });

  it("shortens the settle animation for small remaining distances", () => {
    expect(dashboardPageSettleDurationMs(80)).toBe(240);
    expect(dashboardPageSettleDurationMs(1000)).toBe(420);
  });

  it("keeps a single-page layout as a plain array for backwards compatibility", () => {
    expect(serializeDashboardLayout([{ i: "a" }], 1)).toBe(JSON.stringify([{ i: "a" }]));
    expect(parseDashboardLayout(JSON.stringify([{ i: "a" }]))).toEqual({
      items: [{ i: "a" }],
      pageCount: 1,
    });
    expect(serializeDashboardLayout([{ i: "a" }], 3)).toBe(
      JSON.stringify({ items: [{ i: "a" }], pageCount: 3 })
    );
    expect(parseDashboardLayout(JSON.stringify({ items: [{ i: "b" }], pageCount: 4 }))).toEqual({
      items: [{ i: "b" }],
      pageCount: 4,
    });
    expect(parseDashboardLayout(null)).toEqual({ items: [], pageCount: 1 });
  });

  it("measures flick velocity from recent pointer samples", () => {
    expect(velocityFromPointerSamples([], 0, 100)).toBe(0);
    expect(
      velocityFromPointerSamples(
        [
          { x: 500, t: 0 },
          { x: 200, t: 100 },
        ],
        200,
        100
      )
    ).toBe(-3);
  });

  it("shifts later widgets down when a page is removed", () => {
    const next = reindexWidgetsAfterRemovedPage(
      [{ id: "a", page: 0 }, { id: "b", page: 1 }, { id: "c", page: 2 }],
      1
    );
    expect(next.map((w) => w.page)).toEqual([0, 0, 1]);
  });
});
