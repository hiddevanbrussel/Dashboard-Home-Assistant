import { describe, expect, it } from "vitest";
import {
  applyDashboardPageDrag,
  clampPageCount,
  clampPageIndex,
  parseDashboardLayout,
  reindexWidgetsAfterRemovedPage,
  resolvePageCount,
  rubberBandOffset,
  serializeDashboardLayout,
  settleDashboardPage,
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
      settleDashboardPage({ page: 1, pageCount: 3, dragPx: 40, velocityPxPerMs: 0.8, pageWidth: 1000 })
    ).toBe(0);
    expect(
      settleDashboardPage({ page: 0, pageCount: 3, dragPx: -20, velocityPxPerMs: 0, pageWidth: 1000 })
    ).toBe(0);
    expect(clampPageIndex(8, 2)).toBe(1);
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

  it("shifts later widgets down when a page is removed", () => {
    const next = reindexWidgetsAfterRemovedPage(
      [{ id: "a", page: 0 }, { id: "b", page: 1 }, { id: "c", page: 2 }],
      1
    );
    expect(next.map((w) => w.page)).toEqual([0, 0, 1]);
  });
});
