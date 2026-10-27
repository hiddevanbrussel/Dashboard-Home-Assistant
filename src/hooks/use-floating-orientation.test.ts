import { describe, expect, it } from "vitest";
import { measurePlacementInset, reportLayoutNotice } from "@/hooks/use-floating-orientation";
import { reconcileFloatingLayout, type FloatingTile } from "@/lib/floating-orientation-layout";
import type { PositionStorage } from "@/lib/dashboard-page-removal";

function root(entries: Record<string, number>): ParentNode {
  return {
    querySelector(selector: string) {
      if (!(selector in entries)) return null;
      const bottom = entries[selector];
      return {
        getBoundingClientRect: () => ({ bottom }),
      } as HTMLElement;
    },
  } as ParentNode;
}

describe("placement inset after layout", () => {
  it("uses the edit heading box when the title can be edited, ahead of the shorter heading", () => {
    const inset = measurePlacementInset(root({
      "[data-app-heading-edit]": 192,
      "[data-app-page-heading]": 142,
      "[data-app-header]": 56,
    }));
    expect(inset).toBe(208);
  });

  it("uses the page heading when there is no edit box", () => {
    expect(measurePlacementInset(root({
      "[data-app-page-heading]": 142,
      "[data-app-header]": 56,
    }))).toBe(160);
  });

  it("stays on the 80px line when only the chrome bar is on screen", () => {
    expect(measurePlacementInset(root({ "[data-app-header]": 56 }))).toBe(80);
    expect(measurePlacementInset(root({ "[data-app-header]": 64 }))).toBe(80);
    expect(measurePlacementInset(root({ "[data-app-header]": 80 }))).toBe(80);
  });

  it("keeps the measured heading line when the chrome bar is taller", () => {
    expect(measurePlacementInset(root({
      "[data-app-heading-edit]": 192,
      "[data-app-header]": 80,
    }))).toBe(208);
    expect(measurePlacementInset(root({
      "[data-app-page-heading]": 142,
      "[data-app-header]": 80,
    }))).toBe(160);
  });

  it("returns undefined until a box has been laid out", () => {
    expect(measurePlacementInset(root({}))).toBeUndefined();
    expect(measurePlacementInset(root({
      "[data-app-heading-edit]": 0,
      "[data-app-page-heading]": 158,
    }))).toBe(176);
  });
});

class MemoryStorage implements PositionStorage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) ?? null) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

function placePair(topInset: number | undefined): Record<string, { left: number; bottom: number }> {
  const tiles: FloatingTile[] = [
    {
      id: "sensor",
      key: "dashboard.floatingSensorCardPosition.h6.sensor",
      page: 0,
      shared: false,
      persistsClamp: false,
      w: 260,
      h: 108,
      bottomInset: 0,
      legacyTopOffset: 200,
    },
    {
      id: "lamp",
      key: "dashboard.floatingLightCardPosition.h6.lamp",
      page: 0,
      shared: false,
      persistsClamp: false,
      w: 240,
      h: 70,
      bottomInset: 0,
      legacyTopOffset: 80,
    },
  ];
  const storage = new MemoryStorage();
  reconcileFloatingLayout({
    storage,
    dashboardId: "h6",
    orientation: "landscape",
    viewport: { width: 1280, height: 800 },
    tiles,
    push: false,
    reportNotice: false,
    rederive: false,
    mounted: false,
    topInset,
  });
  const placed: Record<string, { left: number; bottom: number }> = {};
  for (const tile of tiles) {
    placed[tile.id] = JSON.parse(storage.getItem(tile.key) ?? "{}") as { left: number; bottom: number };
  }
  return placed;
}

describe("fixed line without a heading (H6)", () => {
  it("places the sensor and lamp in the same spot in view mode and edit mode", () => {
    const view = measurePlacementInset(root({ "[data-app-header]": 64 }));
    const edit = measurePlacementInset(root({ "[data-app-header]": 80 }));
    expect(view).toBe(80);
    expect(edit).toBe(80);
    const viewPositions = placePair(view);
    const editPositions = placePair(edit);
    expect(editPositions).toEqual(viewPositions);
    expect(viewPositions.sensor).toEqual({ left: 96, bottom: 608 });
    expect(viewPositions.lamp).toEqual({ left: 384, bottom: 640 });
  });
});

describe("landscape notice on arrival (H7)", () => {
  it("reports overlap on a fresh landscape load and after a rotation", () => {
    expect(reportLayoutNotice({
      previous: null,
      orientation: "landscape",
      sizesChanged: false,
      actionReport: false,
    })).toBe(true);
    expect(reportLayoutNotice({
      previous: "portrait",
      orientation: "landscape",
      sizesChanged: false,
      actionReport: false,
    })).toBe(true);
    expect(reportLayoutNotice({
      previous: "landscape",
      orientation: "landscape",
      sizesChanged: false,
      actionReport: false,
    })).toBe(false);
    expect(reportLayoutNotice({
      previous: null,
      orientation: "portrait",
      sizesChanged: false,
      actionReport: false,
    })).toBe(false);
  });
});
