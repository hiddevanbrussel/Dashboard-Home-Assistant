import { describe, expect, it } from "vitest";
import {
  formatLayoutNotice,
  landscapeLineReady,
  landscapeTileIsOwn,
  landscapeWithheldIds,
  LAYOUT_NOTICE_MS,
  measurePlacementInset,
  readPlacementLine,
  reportLayoutNotice,
  visibleLayoutNotice,
} from "@/hooks/use-floating-orientation";
import { getTranslations } from "@/lib/i18n";
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

  it("uses the lower heading edge, so a short edit reserve does not drop the 16px gap", () => {
    expect(measurePlacementInset(root({
      "[data-app-heading-edit]": 176,
      "[data-app-page-heading]": 192,
      "[data-app-header]": 64,
    }))).toBe(208);
    expect(readPlacementLine(root({
      "[data-app-heading-edit]": 176,
      "[data-app-page-heading]": 192,
    }))).toEqual({ phase: "ready", inset: 208, source: "heading" });
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

  it("does not fall through to the chrome bar while a heading has no box", () => {
    expect(measurePlacementInset(root({
      "[data-app-heading-edit]": 0,
      "[data-app-header]": 80,
    }))).toBeUndefined();
    expect(readPlacementLine(root({
      "[data-app-page-heading]": 0,
      "[data-app-header]": 64,
    })).phase).toBe("provisional");
  });
});

describe("definitive landscape line (H8)", () => {
  it("keeps chrome-only 80 provisional while a heading is still expected", () => {
    const chrome = readPlacementLine(root({ "[data-app-header]": 64 }));
    expect(chrome).toEqual({ phase: "ready", inset: 80, source: "chrome" });
    expect(landscapeLineReady(chrome, false)).toBe(true);
    expect(landscapeLineReady(chrome, true)).toBe(false);
    const heading = readPlacementLine(root({
      "[data-app-page-heading]": 192,
      "[data-app-header]": 80,
    }));
    expect(heading).toEqual({ phase: "ready", inset: 208, source: "heading" });
    expect(landscapeLineReady(heading, true)).toBe(true);
    expect(landscapeLineReady({ phase: "pending" }, false)).toBe(false);
    expect(landscapeLineReady({ phase: "provisional" }, false)).toBe(false);
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
    expect(viewPositions.sensor).toEqual({ left: 352, bottom: 608 });
    expect(viewPositions.lamp).toEqual({ left: 96, bottom: 640 });
  });
});

describe("withhold until the landscape line is definitive (H8)", () => {
  const sensor = {
    id: "sensor",
    key: "dashboard.floatingSensorCardPosition.h8.sensor",
    page: 0,
    shared: false,
    persistsClamp: false,
    w: 260,
    h: 108,
    bottomInset: 0,
    legacyTopOffset: 200,
    cardDefault: { left: 512, bottom: 336 },
    defaultSize: true,
  };

  it("keeps a card default out until the line is ready and shows a dragged tile at once", () => {
    const readDefault = () => '{"left":512,"bottom":336}';
    const dragged = '{"left": 400, "bottom": 300}';
    expect(landscapeTileIsOwn(sensor, readDefault)).toBe(false);
    expect(landscapeTileIsOwn(sensor, () => dragged)).toBe(true);
    expect(landscapeTileIsOwn({ ...sensor, defaultSize: false }, readDefault)).toBe(true);
    expect(landscapeTileIsOwn(sensor, () => null)).toBe(false);
    const waiting = landscapeWithheldIds({
      orientation: "landscape",
      landscapeReady: false,
      viewport: { width: 1280, height: 800 },
      tiles: [sensor],
      read: readDefault,
    });
    expect(waiting).toEqual(["sensor"]);
    expect(landscapeWithheldIds({
      orientation: "landscape",
      landscapeReady: false,
      viewport: { width: 1280, height: 800 },
      tiles: [sensor],
      read: () => dragged,
    })).toEqual([]);
    expect(landscapeWithheldIds({
      orientation: "portrait",
      landscapeReady: false,
      viewport: { width: 800, height: 1280 },
      tiles: [sensor],
      read: () => null,
    })).toEqual([]);
  });
});

describe("landscape notice text (H9)", () => {
  it("uses a singular sentence for one tile and keeps the notice for 8 seconds", () => {
    const nl = getTranslations("nl");
    const en = getTranslations("en");
    const translate = (dict: Record<string, string>) => (key: string) => dict[key] ?? key;
    expect(formatLayoutNotice("dashboardLayout.landscapeOverlap", 1, translate(nl))).toBe(
      "1 tegel past niet in liggende stand. Draai naar staand om hem te zien."
    );
    expect(formatLayoutNotice("dashboardLayout.landscapeOverlap", 1, translate(en))).toBe(
      "1 tile doesn't fit in landscape. Rotate to portrait to see it."
    );
    expect(formatLayoutNotice("dashboardLayout.landscapeOverlap", 10, translate(nl))).toBe(
      "10 tegels passen niet in liggende stand. Draai naar staand om ze te zien."
    );
    expect(formatLayoutNotice("dashboardLayout.landscapeOverlap", 10, translate(en))).toBe(
      "10 tiles don't fit in landscape. Rotate to portrait to see them."
    );
    expect(formatLayoutNotice("dashboardLayout.portraitBelowFold", 3, translate(nl))).toBe(
      nl["dashboardLayout.portraitBelowFold"]
    );
    expect(LAYOUT_NOTICE_MS).toBe(8000);
    expect(visibleLayoutNotice("landscape-overlap", 0)).toBeNull();
    expect(visibleLayoutNotice("landscape-overlap", 8)).toBe("landscape-overlap");
    expect(visibleLayoutNotice("portrait-below-fold", 0)).toBe("portrait-below-fold");
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
