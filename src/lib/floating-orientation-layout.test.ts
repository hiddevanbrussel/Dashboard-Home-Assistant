import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardLayoutNoticeView } from "@/components/dashboard-layout-notice";
import { DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX } from "@/components/dashboard-page-undo-toast";
import { cardDefaultPosition } from "@/lib/floating-card-defaults";
import { snapToGrid } from "@/lib/floating-card-grid";
import { readFloatingPositions, restoreFloatingPositions, type PositionStorage } from "@/lib/dashboard-page-removal";
import { getTranslations } from "@/lib/i18n";
import {
  blocksPlacement,
  firstFit,
  floatingStoragePrefixes,
  floatingTilesFromWidgets,
  layoutStorageKey,
  measuredSizeOverrides,
  consumeLayoutNotice,
  MIN_VISIBLE_BOTTOM_PX,
  overlapPairs,
  portraitBelowFold,
  PORTRAIT_BELOW_FOLD_NOTICE_KEY,
  pushDown,
  readingOrder,
  reconcileFloatingLayout,
  revealBelowFoldTiles,
  scrollOverflowPx,
  type FloatingTile,
  type PlacedTile,
} from "@/lib/floating-orientation-layout";

const SCOPE = "cmvj459ol0002329z00487bt3";
const PORTRAIT = { width: 800, height: 1280 };
const LANDSCAPE = { width: 1280, height: 800 };

const LANDSCAPE_LS: Record<string, string> = {
  [`dashboard.floatingClimateCardPosition.${SCOPE}`]: '{"left":432,"bottom":400}',
  [`dashboard.floatingWeatherCardPosition.${SCOPE}`]: '{"left":96,"bottom":400}',
  [`dashboard.floatingCalendarCardPosition.${SCOPE}.qa-calendar`]: '{"left":96,"bottom":32}',
  [`dashboard.floatingMediaCardPosition.${SCOPE}.qa-media`]: '{"left":752,"bottom":400}',
  [`dashboard.floatingLightCardPosition.${SCOPE}.qa-light1`]: '{"left":928,"bottom":240}',
  [`dashboard.floatingLightCardPosition.${SCOPE}.qa-light2`]: '{"left":928,"bottom":160}',
  [`dashboard.floatingSensorCardPosition.${SCOPE}.qa-sensor`]: '{"left":928,"bottom":32}',
  [`dashboard.floatingCameraCardPosition.${SCOPE}.qa-camera`]: '{"left":544,"bottom":32}',
};

const ORDER = ["Weer", "Klimaat", "Woonkamer", "Agenda", "Camera", "Bedlamp", "Keuken", "Buiten"] as const;

const BEREKEND: Record<(typeof ORDER)[number], { left: number; bottom: number; w: number; h: number }> = {
  Weer: { left: 96, bottom: 896, w: 320, h: 300 },
  Klimaat: { left: 432, bottom: 848, w: 300, h: 340 },
  Woonkamer: { left: 96, bottom: 528, w: 280, h: 340 },
  Agenda: { left: 96, bottom: 304, w: 420, h: 200 },
  Camera: { left: 400, bottom: 560, w: 360, h: 270 },
  Bedlamp: { left: 544, bottom: 464, w: 240, h: 70 },
  Keuken: { left: 544, bottom: 368, w: 240, h: 70 },
  Buiten: { left: 96, bottom: 176, w: 260, h: 108 },
};

const STAAND_NU = [
  { id: "Woonkamer", x: 520, y: 540, w: 280, h: 340 },
  { id: "Klimaat", x: 432, y: 540, w: 300, h: 340 },
  { id: "Bedlamp", x: 560, y: 970, w: 240, h: 70 },
  { id: "Keuken", x: 560, y: 1050, w: 240, h: 70 },
  { id: "Buiten", x: 540, y: 1140, w: 260, h: 108 },
  { id: "Weer", x: 96, y: 580, w: 320, h: 300 },
  { id: "Camera", x: 440, y: 978, w: 360, h: 270 },
  { id: "Agenda", x: 96, y: 1048, w: 420, h: 200 },
];

const LANDSCAPE_BOXES = [
  { id: "Woonkamer", x: 752, y: 60, w: 280, h: 340 },
  { id: "Klimaat", x: 432, y: 60, w: 300, h: 340 },
  { id: "Bedlamp", x: 928, y: 490, w: 240, h: 70 },
  { id: "Keuken", x: 928, y: 570, w: 240, h: 70 },
  { id: "Buiten", x: 928, y: 660, w: 260, h: 108 },
  { id: "Weer", x: 96, y: 100, w: 320, h: 300 },
  { id: "Camera", x: 544, y: 498, w: 360, h: 270 },
  { id: "Agenda", x: 96, y: 568, w: 420, h: 200 },
];

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

function qaTiles(): FloatingTile[] {
  return [
    tile("Weer", `dashboard.floatingWeatherCardPosition.${SCOPE}`, { shared: true, w: 320, h: 300, bottomInset: 24, legacyTopOffset: 200 }),
    tile("Klimaat", `dashboard.floatingClimateCardPosition.${SCOPE}`, { shared: true, persistsClamp: true, w: 300, h: 340, bottomInset: 24, legacyTopOffset: 200 }),
    tile("Woonkamer", `dashboard.floatingMediaCardPosition.${SCOPE}.qa-media`, { w: 280, h: 340, legacyTopOffset: 200 }),
    tile("Agenda", `dashboard.floatingCalendarCardPosition.${SCOPE}.qa-calendar`, { w: 420, h: 200, legacyTopOffset: 200 }),
    tile("Camera", `dashboard.floatingCameraCardPosition.${SCOPE}.qa-camera`, { w: 360, h: 270, legacyTopOffset: 270 }),
    tile("Bedlamp", `dashboard.floatingLightCardPosition.${SCOPE}.qa-light1`, { w: 240, h: 70, legacyTopOffset: 80 }),
    tile("Keuken", `dashboard.floatingLightCardPosition.${SCOPE}.qa-light2`, { w: 240, h: 70, legacyTopOffset: 80 }),
    tile("Buiten", `dashboard.floatingSensorCardPosition.${SCOPE}.qa-sensor`, { w: 260, h: 108, legacyTopOffset: 200 }),
  ];
}

function tile(id: string, key: string, extra: Partial<FloatingTile>): FloatingTile {
  return {
    id,
    key,
    page: 0,
    shared: false,
    persistsClamp: false,
    w: 100,
    h: 100,
    bottomInset: 0,
    legacyTopOffset: 200,
    ...extra,
  };
}

function seed(storage: MemoryStorage, values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) storage.setItem(key, value);
}

function placedFrom(spec: { left: number; bottom: number; w: number; h: number }, id: string, anchor = false): PlacedTile {
  return {
    id,
    left: spec.left,
    bottom: spec.bottom,
    x: spec.left,
    y: PORTRAIT.height - spec.bottom - spec.h,
    w: spec.w,
    h: spec.h,
    anchor,
    persistsClamp: id === "Klimaat",
    bottomInset: id === "Klimaat" || id === "Weer" ? 24 : 0,
  };
}

describe("portrait first-fit", () => {
  it("reads the QA landscape layout in the measured order", () => {
    expect(readingOrder(LANDSCAPE_BOXES).map((box) => box.id)).toEqual([...ORDER]);
  });

  it("turns the five clamped portrait overlaps into the measured first-fit", () => {
    const before = overlapPairs(STAAND_NU).map((pair) => [...pair].sort().join("+")).sort();
    expect(before).toEqual(
      ["Agenda+Camera", "Bedlamp+Camera", "Buiten+Camera", "Camera+Keuken", "Klimaat+Woonkamer"].sort()
    );

    const fitted = firstFit(
      ORDER.map((id) => ({ id, w: BEREKEND[id].w, h: BEREKEND[id].h, persistsClamp: id === "Klimaat", bottomInset: id === "Klimaat" || id === "Weer" ? 24 : 0 })),
      PORTRAIT
    );
    expect(fitted.map((item) => item.id)).toEqual([...ORDER]);
    for (const item of fitted) {
      expect({ left: item.left, bottom: item.bottom, w: item.w, h: item.h }).toEqual(BEREKEND[item.id as (typeof ORDER)[number]]);
    }
    expect(overlapPairs(fitted, "pixels")).toEqual([]);
    expect(overlapPairs(fitted, "gap")).toEqual([]);
  });

  it("counts the delete badge inside the 16px gap", () => {
    const clear = { x: 0, y: 0, w: 100, h: 100 };
    const sixteen = { x: 116, y: 0, w: 100, h: 100 };
    const twelve = { x: 112, y: 0, w: 100, h: 100 };
    expect(blocksPlacement(clear, sixteen)).toBe(false);
    expect(blocksPlacement(clear, twelve)).toBe(true);
  });

  it("keeps a wide phone tile on the grid and inside the screen", () => {
    const [placed] = firstFit([{ id: "wide", w: 320, h: 300 }], { width: 390, height: 844 });
    expect(placed.left % 16).toBe(0);
    expect(placed.left).toBeGreaterThanOrEqual(0);
    expect(placed.left).toBeLessThanOrEqual(390 - 320);
    expect(placed.left).toBe(64);
  });
});

describe("push down", () => {
  it("moves only the column under a grown climate tile, by 32px", () => {
    const grown = placedFrom({ ...BEREKEND.Klimaat, h: 372, bottom: 816 }, "Klimaat", true);
    const start = ORDER.map((id) => (id === "Klimaat" ? grown : placedFrom(BEREKEND[id], id, false)));
    const pushed = pushDown(start, PORTRAIT).tiles;
    const byId = Object.fromEntries(pushed.map((item) => [item.id, item]));

    expect(byId.Klimaat.left).toBe(432);
    expect(byId.Klimaat.bottom).toBe(816);
    expect(byId.Camera.left).toBe(400);
    expect(byId.Camera.bottom).toBe(528);
    expect(byId.Bedlamp.left).toBe(544);
    expect(byId.Bedlamp.bottom).toBe(432);
    expect(byId.Keuken.left).toBe(544);
    expect(byId.Keuken.bottom).toBe(336);
    for (const id of ["Weer", "Woonkamer", "Agenda", "Buiten"] as const) {
      expect(byId[id].left).toBe(BEREKEND[id].left);
      expect(byId[id].bottom).toBe(BEREKEND[id].bottom);
    }
    expect(overlapPairs(pushed, "gap")).toEqual([]);
  });

  it("separates two lights pushed onto the same spot by a camera grown 270px", () => {
    const camera = placedFrom({ ...BEREKEND.Camera, h: 540, bottom: 290 }, "Camera", true);
    const start = ORDER.map((id) => (id === "Camera" ? camera : placedFrom(BEREKEND[id], id, false)));
    const pushed = pushDown(start, PORTRAIT).tiles;
    const byId = Object.fromEntries(pushed.map((item) => [item.id, item]));

    expect(byId.Camera.left).toBe(400);
    expect(byId.Camera.bottom).toBe(290);
    expect(byId.Bedlamp.left).toBe(544);
    expect(byId.Keuken.left).toBe(544);
    expect(byId.Bedlamp.bottom).toBe(192);
    expect(byId.Keuken.bottom).toBe(96);
    expect(byId.Bedlamp.bottom).not.toBe(byId.Keuken.bottom);
    expect(overlapPairs(pushed, "gap")).toEqual([]);
    for (const item of pushed) {
      if (item.bottom < 0) continue;
      expect(item.bottom).toBeGreaterThanOrEqual(MIN_VISIBLE_BOTTOM_PX);
    }
  });

  it("leaves no gap overlap after push for seeded stacks", () => {
    for (let trial = 0; trial < 40; trial += 1) {
      const rand = mulberry32(0x6f1900 + trial);
      const count = 2 + Math.floor(rand() * 5);
      const anchorIndex = rand() < 0.7 ? Math.floor(rand() * count) : -1;
      const start: PlacedTile[] = [];
      for (let index = 0; index < count; index += 1) {
        const w = 96 + Math.floor(rand() * 8) * 16;
        const h = 64 + Math.floor(rand() * 6) * 16;
        const left = 16 + Math.floor(rand() * 20) * 16;
        const bottom = 32 + Math.floor(rand() * 48) * 16;
        start.push({
          id: `t${index}`,
          left,
          bottom,
          x: left,
          y: PORTRAIT.height - bottom - h,
          w,
          h,
          anchor: index === anchorIndex,
        });
      }
      const pushed = pushDown(start, PORTRAIT).tiles;
      const anchors = new Set(start.filter((tile) => tile.anchor).map((tile) => tile.id));
      for (const [leftId, rightId] of overlapPairs(pushed, "gap")) {
        expect(anchors.has(leftId) && anchors.has(rightId)).toBe(true);
      }
      for (const tile of pushed) {
        const before = start.find((item) => item.id === tile.id);
        expect(before).toBeTruthy();
        expect(tile.left).toBe(before?.left);
        if (tile.anchor) expect(tile.bottom).toBe(before?.bottom);
        if (tile.bottom >= 0) expect(tile.bottom).toBeGreaterThanOrEqual(MIN_VISIBLE_BOTTOM_PX);
      }
    }
  });

  it("keeps on-screen tiles 32px above the page bar without lifting below-fold tiles", () => {
    const onBar = placedFrom({ left: 96, bottom: 0, w: 240, h: 70 }, "Bedlamp");
    expect(pushDown([onBar], PORTRAIT).tiles[0]?.bottom).toBe(MIN_VISIBLE_BOTTOM_PX);
    const below = placedFrom({ left: 96, bottom: -48, w: 240, h: 70 }, "Keuken");
    expect(pushDown([below], PORTRAIT).tiles[0]?.bottom).toBe(-48);
    const climate = placedFrom({ left: 96, bottom: 0, w: 300, h: 340 }, "Klimaat");
    expect(pushDown([climate], PORTRAIT).tiles[0]?.bottom).toBe(MIN_VISIBLE_BOTTOM_PX);
  });

  it("stops when the only remaining overlap is between anchors", () => {
    const a = placedFrom(BEREKEND.Bedlamp, "Bedlamp", true);
    const b = placedFrom({ ...BEREKEND.Bedlamp, left: 544 }, "Keuken", true);
    const pushed = pushDown([a, b], PORTRAIT).tiles;
    expect(pushed.map((tile) => tile.bottom)).toEqual([BEREKEND.Bedlamp.bottom, BEREKEND.Bedlamp.bottom]);
  });

  it("keeps the climate position inside the clamp it would save", () => {
    const snapped = snapToGrid(
      { left: BEREKEND.Klimaat.left, bottom: BEREKEND.Klimaat.bottom },
      { maxLeft: 800 - 300, maxBottom: 1280 - 340 - 24 }
    );
    expect(snapped).toEqual({ left: 432, bottom: 848 });
  });
});

describe("orientation migration", () => {
  it("leaves landscape storage untouched until the first portrait visit", () => {
    const storage = new MemoryStorage();
    const legacyKey = `dashboard.floatingTextCardPosition.${SCOPE}.legacy`;
    const legacy = '{"left":96,"top":100}';
    seed(storage, { ...LANDSCAPE_LS, [legacyKey]: legacy });
    const tiles = [...qaTiles(), tile("Tekst", legacyKey, { w: 280, h: 72, legacyTopOffset: 120 })];

    const landscape = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles,
      push: false,
      reportNotice: true,
      rederive: false,
      mounted: true,
    });
    expect(landscape.wrote).toBe(false);
    expect(storage.getItem(layoutStorageKey(SCOPE))).toBeNull();
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(storage.getItem(key)).toBe(value);
    expect(storage.getItem(legacyKey)).toBe(legacy);

    const portrait = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: true,
      reportNotice: true,
      rederive: false,
      mounted: false,
    });
    expect(portrait.wrote).toBe(true);
    expect(portrait.remount).toBe(false);
    expect(portrait.source).toBe("afgeleid");
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as {
      landscape: Record<string, string>;
      portrait: Record<string, string>;
      portraitBron: string;
      active: string;
    };
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) {
      expect(layout.landscape[key]).toBe(value);
      expect(storage.getItem(key)).toBe(JSON.stringify({ left: BEREKEND[keyName(key)].left, bottom: BEREKEND[keyName(key)].bottom }));
    }
    expect(layout.portraitBron).toBe("afgeleid");
    expect(layout.active).toBe("portrait");
    expect(overlapPairs(boxes(qaTiles(), layout.portrait), "gap")).toEqual([]);

    const again = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    expect(again.wrote).toBe(false);
    expect(again.remount).toBe(false);
  });

  it("keeps a portrait layout that is already clear of overlap", () => {
    const storage = new MemoryStorage();
    const clear: Record<string, string> = {};
    for (const id of ORDER) {
      const spec = BEREKEND[id];
      clear[qaTiles().find((entry) => entry.id === id)!.key] = JSON.stringify({ left: spec.left, bottom: spec.bottom });
    }
    seed(storage, clear);
    const result = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: true,
      reportNotice: true,
      rederive: false,
      mounted: true,
    });
    expect(result.source).toBe("gebruiker");
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { portrait: Record<string, string>; portraitBron: string };
    expect(layout.portraitBron).toBe("gebruiker");
    expect(layout.portrait).toEqual(clear);
  });

  it("restores the landscape master after the app was closed in portrait", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(storage.getItem(key)).not.toBe(value);

    const reopened = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    expect(reopened.remount).toBe(true);
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(storage.getItem(key)).toBe(value);
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as {
      active: string;
      landscape: Record<string, string>;
    };
    expect(layout.active).toBe("landscape");
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(layout.landscape[key]).toBe(value);
  });

  it("does not copy portrait bytes into the landscape master when a swap was interrupted", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    const saved = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as {
      landscape: Record<string, string>;
      portrait: Record<string, string>;
      portraitBron: string;
    };
    storage.setItem(
      layoutStorageKey(SCOPE),
      JSON.stringify({ v: 1, active: "landscape", landscape: saved.landscape, portrait: saved.portrait, portraitBron: saved.portraitBron })
    );

    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) {
      expect(storage.getItem(key)).toBe(value);
    }
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { landscape: Record<string, string> };
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(layout.landscape[key]).toBe(value);
  });

  it("keeps the landscape master on a portrait reload", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    const before = storage.getItem(layoutStorageKey(SCOPE));
    const portraitKeys = snapshotActive(storage, qaTiles());
    const reloaded = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    expect(reloaded.wrote).toBe(false);
    expect(snapshotActive(storage, qaTiles())).toEqual(portraitKeys);
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as {
      active: string;
      landscape: Record<string, string>;
    };
    expect(layout.active).toBe("portrait");
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(layout.landscape[key]).toBe(value);
    expect(storage.getItem(layoutStorageKey(SCOPE))).toBe(before);
  });

  it("restores landscape bytes after a portrait drag and does not push landscape", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    const mediaKey = `dashboard.floatingMediaCardPosition.${SCOPE}.qa-media`;
    storage.setItem(mediaKey, '{"left":96,"bottom":16}');
    const back = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles: qaTiles(),
      push: true,
      reportNotice: true,
      rederive: false,
      mounted: true,
    });
    expect(back.notice).toBeNull();
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(storage.getItem(key)).toBe(value);
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { portraitBron: string; landscape: Record<string, string> };
    expect(layout.portraitBron).toBe("gebruiker");
    expect(layout.landscape[mediaKey]).toBe(LANDSCAPE_LS[mediaKey]);
  });

  it("places a new portrait tile in the first free slot and a missing landscape tile without moving stored keys", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    const before = snapshotActive(storage, qaTiles());
    const added = tile("Extra", `dashboard.floatingLightCardPosition.${SCOPE}.qa-extra`, { w: 240, h: 70, legacyTopOffset: 80 });
    const withExtra = [...qaTiles(), added];
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: withExtra,
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    const raw = storage.getItem(added.key);
    expect(raw).toBeTruthy();
    for (const [key, value] of Object.entries(before)) expect(storage.getItem(key)).toBe(value);
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { portrait: Record<string, string> };
    expect(overlapPairs(boxes(withExtra, layout.portrait), "gap")).toEqual([]);

    const landscapeStorage = new MemoryStorage();
    seed(landscapeStorage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage: landscapeStorage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles: withExtra,
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    const placedExtra = landscapeStorage.getItem(added.key);
    expect(placedExtra).toBeTruthy();
    expect((JSON.parse(placedExtra ?? "") as { left: number }).left).toBeGreaterThanOrEqual(96);
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(landscapeStorage.getItem(key)).toBe(value);
    const saved = JSON.parse(landscapeStorage.getItem(layoutStorageKey(SCOPE)) ?? "") as {
      active: string;
      landscape: Record<string, string>;
    };
    expect(saved.active).toBe("landscape");
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(saved.landscape[key]).toBe(value);
  });

  it("reports landscape overlap from a size change without moving cards", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles: qaTiles(),
      push: true,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    const before = snapshotActive(storage, qaTiles());
    const grown = qaTiles().map((entry) => (entry.id === "Klimaat" ? { ...entry, w: 500, h: 500 } : entry));
    const result = reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "landscape",
      viewport: LANDSCAPE,
      tiles: grown,
      push: true,
      reportNotice: true,
      rederive: false,
      mounted: true,
    });
    expect(result.notice).toBe("landscape-overlap");
    expect(snapshotActive(storage, qaTiles())).toEqual(before);
  });

  it("reserves a shared climate rectangle on every page", () => {
    const storage = new MemoryStorage();
    const climate = tile("Klimaat", `dashboard.floatingClimateCardPosition.${SCOPE}`, {
      shared: true,
      persistsClamp: true,
      w: 300,
      h: 340,
      bottomInset: 24,
      page: 0,
    });
    const otherPage = tile("Woonkamer", `dashboard.floatingMediaCardPosition.${SCOPE}.page-1`, {
      w: 300,
      h: 340,
      page: 1,
    });
    seed(storage, {
      [climate.key]: '{"left":96,"bottom":400}',
      [otherPage.key]: '{"left":96,"bottom":400}',
    });
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: [climate, otherPage],
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { portrait: Record<string, string> };
    const climatePos = JSON.parse(layout.portrait[climate.key]) as { left: number; bottom: number };
    const mediaPos = JSON.parse(layout.portrait[otherPage.key]) as { left: number; bottom: number };
    expect(mediaPos).not.toEqual(climatePos);
    expect(overlapPairs([
      { id: "k", x: climatePos.left, y: PORTRAIT.height - climatePos.bottom - 340, w: 300, h: 340 },
      { id: "m", x: mediaPos.left, y: PORTRAIT.height - mediaPos.bottom - 340, w: 300, h: 340 },
    ], "gap")).toEqual([]);
  });

  it("drops keys of widgets that disappeared and keeps the layout key in page undo", () => {
    const storage = new MemoryStorage();
    seed(storage, LANDSCAPE_LS);
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: qaTiles(),
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: false,
    });
    const orphan = `dashboard.floatingLightCardPosition.${SCOPE}.gone`;
    storage.setItem(orphan, '{"left":96,"bottom":16}');
    const layoutBefore = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { portrait: Record<string, string>; landscape: Record<string, string> };
    layoutBefore.portrait[orphan] = '{"left":96,"bottom":16}';
    layoutBefore.landscape[orphan] = '{"left":16,"bottom":16}';
    storage.setItem(layoutStorageKey(SCOPE), JSON.stringify({ v: 1, active: "portrait", ...layoutBefore, portraitBron: "afgeleid" }));
    storage.setItem("unrelated.setting", "stay");

    const removed = qaTiles().filter((entry) => entry.id !== "Bedlamp");
    reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation: "portrait",
      viewport: PORTRAIT,
      tiles: removed,
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
    const bedlamp = `dashboard.floatingLightCardPosition.${SCOPE}.qa-light1`;
    expect(storage.getItem(orphan)).toBeNull();
    expect(storage.getItem(bedlamp)).toBeNull();
    expect(storage.getItem("unrelated.setting")).toBe("stay");
    const layout = JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as { portrait: Record<string, string>; landscape: Record<string, string> };
    expect(layout.portrait[orphan]).toBeUndefined();
    expect(layout.landscape[bedlamp]).toBeUndefined();
    expect(layout.landscape[`dashboard.floatingWeatherCardPosition.${SCOPE}`]).toBe(LANDSCAPE_LS[`dashboard.floatingWeatherCardPosition.${SCOPE}`]);

    const snapshot = readFloatingPositions(storage);
    expect(snapshot[layoutStorageKey(SCOPE)]).toBeTruthy();
    storage.removeItem(layoutStorageKey(SCOPE));
    restoreFloatingPositions(storage, snapshot);
    expect(storage.getItem(layoutStorageKey(SCOPE))).toBe(snapshot[layoutStorageKey(SCOPE)]);
  });
});

describe("below the fold and widget prefixes", () => {
  it("shows the below-fold notice once per session and keeps repeating landscape overlap", () => {
    const session = new MemoryStorage();
    expect(consumeLayoutNotice("portrait-below-fold", session)).toBe("portrait-below-fold");
    expect(session.getItem(PORTRAIT_BELOW_FOLD_NOTICE_KEY)).toBe("1");
    expect(consumeLayoutNotice("portrait-below-fold", session)).toBeNull();
    expect(consumeLayoutNotice("landscape-overlap", session)).toBe("landscape-overlap");
    expect(consumeLayoutNotice("landscape-overlap", session)).toBe("landscape-overlap");
    expect(consumeLayoutNotice(null, session)).toBeNull();
  });

  it("asks for vertical scroll room when a bottom is negative", () => {
    expect(scrollOverflowPx([32, 0])).toBe(0);
    expect(scrollOverflowPx([32, -32])).toBe(48);
    expect(portraitBelowFold({ a: '{"left":16,"bottom":-32}' }, [tile("A", "a", { w: 100, h: 80 })], PORTRAIT)).toBe(true);
  });

  it("writes the stored bottom back onto a clamped card", () => {
    const node = { style: { left: "96px", bottom: "0px", width: "240px" }, offsetWidth: 240 };
    expect(revealBelowFoldTiles([node], [{ left: 96, bottom: -32, w: 240 }])).toBe(1);
    expect(node.style.bottom).toBe("-32px");
  });

  it("matches every floating-card storage prefix without editing the cards", () => {
    const dir = path.join(process.cwd(), "src/components/widgets");
    const found = new Set<string>();
    for (const file of readdirSync(dir)) {
      if (!file.startsWith("floating-") || !file.endsWith(".tsx")) continue;
      const source = readFileSync(path.join(dir, file), "utf8");
      for (const match of source.matchAll(/dashboard\.floating[A-Za-z0-9.]*/g)) {
        found.add(match[0].replace(/\.$/, ""));
      }
    }
    expect([...found].sort()).toEqual([...floatingStoragePrefixes()].sort());
  });

  it("has both layout messages in Dutch and English", () => {
    const en = getTranslations("en");
    const nl = getTranslations("nl");
    expect(nl["dashboardLayout.portraitBelowFold"]).toBe(
      "Sommige tegels staan onder de schermrand. Scroll omlaag om ze te zien."
    );
    expect(en["dashboardLayout.portraitBelowFold"]).toBe(
      "Some tiles sit below the screen edge. Scroll down to see them."
    );
    expect(nl["dashboardLayout.landscapeOverlap"]).toBe(
      "Tegels overlappen in liggende stand. Verplaats ze daar zelf."
    );
    expect(en["dashboardLayout.landscapeOverlap"]).toBe(
      "Tiles overlap in landscape. Move them there yourself."
    );

    const notice = renderToStaticMarkup(
      createElement(DashboardLayoutNoticeView, {
        message: nl["dashboardLayout.portraitBelowFold"],
        onDismiss: () => {},
      })
    );
    expect(notice).toContain('role="status"');
    expect(notice).not.toMatch(/<button[^>]*role=/);
    expect(notice).toContain("h-11");
    expect(notice).toContain("whitespace-nowrap");
    expect(notice).toContain(`bottom:${DASHBOARD_PAGE_UNDO_TOAST_BOTTOM_PX}px`);
    expect(notice).not.toContain("top-16");
    expect(notice).toContain(nl["dashboardLayout.portraitBelowFold"]);

    const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain("html[data-dashboard-edit] [data-dashboard-pager]");
    expect(css).toContain("html[data-dashboard-edit][data-portrait-scroll] [data-dashboard-pager]");
    expect(css).toContain("pointer-events: auto");
    expect(css).toContain(
      "html[data-portrait-scroll]:not([data-dashboard-edit]) [data-dashboard-page] .card-plot-in"
    );
    expect(css).toContain("touch-action: pan-x pan-y !important");
  });

  it("records a measured size that differs from the widget config", () => {
    const overrides = measuredSizeOverrides(
      [
        { style: { left: "96px", width: "280px" }, offsetWidth: 280, offsetHeight: 340 },
        { style: { left: "96px", width: "260px" }, offsetWidth: 260, offsetHeight: 108 },
      ],
      [{ key: "sensor", left: 96, w: 260, h: 120 }]
    );
    expect(overrides.sensor).toEqual({ w: 260, h: 108 });
  });
});

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function keyName(key: string): (typeof ORDER)[number] {
  if (key.includes("Weather")) return "Weer";
  if (key.includes("Climate")) return "Klimaat";
  if (key.includes("qa-media")) return "Woonkamer";
  if (key.includes("qa-calendar")) return "Agenda";
  if (key.includes("qa-camera")) return "Camera";
  if (key.includes("qa-light1")) return "Bedlamp";
  if (key.includes("qa-light2")) return "Keuken";
  return "Buiten";
}

function boxes(tiles: readonly FloatingTile[], positions: Record<string, string>) {
  return tiles.map((entry) => {
    const parsed = JSON.parse(positions[entry.key]) as { left: number; bottom: number };
    return { id: entry.id, x: parsed.left, y: PORTRAIT.height - parsed.bottom - entry.h, w: entry.w, h: entry.h };
  });
}

function snapshotActive(storage: MemoryStorage, tiles: readonly FloatingTile[]): Record<string, string> {
  const snap: Record<string, string> = {};
  for (const entry of tiles) {
    const value = storage.getItem(entry.key);
    if (value != null) snap[entry.key] = value;
  }
  return snap;
}

describe("parked tiles (stat pills pinned to the top bar)", () => {
  const PILL_KEY = `dashboard.floatingStatPillCardPosition.${SCOPE}.pill`;
  // In landscape the pill sits where portrait first-fit would put the weather card.
  const PILL_LANDSCAPE = '{"left":96,"bottom":896}';
  const pill = (parked: boolean) =>
    tile("Pill", PILL_KEY, { w: 140, h: 44, legacyTopOffset: 44, ...(parked ? { parked: true } : {}) });

  function run(
    storage: MemoryStorage,
    orientation: "landscape" | "portrait",
    tiles: FloatingTile[],
    push = false,
    anchorKeys?: ReadonlySet<string>
  ) {
    return reconcileFloatingLayout({
      storage,
      dashboardId: SCOPE,
      orientation,
      viewport: orientation === "portrait" ? PORTRAIT : LANDSCAPE,
      tiles,
      push,
      anchorKeys,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
  }

  function layoutOf(storage: MemoryStorage) {
    return JSON.parse(storage.getItem(layoutStorageKey(SCOPE)) ?? "{}") as {
      landscape: Record<string, string>;
      portrait: Record<string, string> | null;
    };
  }

  it("takes no space when portrait is derived", () => {
    const withPill = new MemoryStorage();
    seed(withPill, { ...LANDSCAPE_LS, [PILL_KEY]: PILL_LANDSCAPE });
    run(withPill, "portrait", [...qaTiles(), pill(true)], true);

    const without = new MemoryStorage();
    seed(without, LANDSCAPE_LS);
    run(without, "portrait", qaTiles(), true);

    const portraitWith = { ...(layoutOf(withPill).portrait ?? {}) };
    expect(portraitWith[PILL_KEY]).toBeUndefined();
    expect(portraitWith).toEqual(layoutOf(without).portrait);
  });

  it("keeps its landscape position in the master and gets it back byte for byte", () => {
    const storage = new MemoryStorage();
    seed(storage, { ...LANDSCAPE_LS, [PILL_KEY]: PILL_LANDSCAPE });
    const tiles = [...qaTiles(), pill(true)];
    run(storage, "portrait", tiles, true);
    expect(layoutOf(storage).landscape[PILL_KEY]).toBe(PILL_LANDSCAPE);

    run(storage, "landscape", tiles);
    expect(storage.getItem(PILL_KEY)).toBe(PILL_LANDSCAPE);
    for (const [key, value] of Object.entries(LANDSCAPE_LS)) expect(storage.getItem(key)).toBe(value);
  });

  it("is not pruned as a removed widget", () => {
    const storage = new MemoryStorage();
    seed(storage, { ...LANDSCAPE_LS, [PILL_KEY]: PILL_LANDSCAPE });
    run(storage, "portrait", [...qaTiles(), pill(false)], true);
    run(storage, "portrait", [...qaTiles(), pill(true)]);
    expect(layoutOf(storage).landscape[PILL_KEY]).toBe(PILL_LANDSCAPE);
  });

  it("does not push other tiles away", () => {
    const storage = new MemoryStorage();
    seed(storage, { ...LANDSCAPE_LS, [PILL_KEY]: PILL_LANDSCAPE });
    run(storage, "portrait", qaTiles(), true);
    const before = snapshotActive(storage, qaTiles());
    // The parked pill's stored portrait spot sits right on top of the weather card, and it is an
    // anchor (as if just moved), so if it took part in the push the weather card would have to yield.
    storage.setItem(PILL_KEY, before[`dashboard.floatingWeatherCardPosition.${SCOPE}`]);
    run(storage, "portrait", [...qaTiles(), pill(true)]);
    expect(layoutOf(storage).portrait?.[PILL_KEY]).toBe(before[`dashboard.floatingWeatherCardPosition.${SCOPE}`]);
    run(storage, "portrait", [...qaTiles(), pill(true)], true, new Set([PILL_KEY]));
    expect(snapshotActive(storage, qaTiles())).toEqual(before);
  });

  it("gets a free portrait slot once it is unparked without a portrait position", () => {
    const storage = new MemoryStorage();
    seed(storage, { ...LANDSCAPE_LS, [PILL_KEY]: PILL_LANDSCAPE });
    run(storage, "portrait", [...qaTiles(), pill(true)], true);
    expect(storage.getItem(PILL_KEY)).toBeNull();

    run(storage, "portrait", [...qaTiles(), pill(false)]);
    const all = [...qaTiles(), pill(false)];
    const portrait = layoutOf(storage).portrait ?? {};
    expect(portrait[PILL_KEY]).toBeDefined();
    expect(overlapPairs(boxes(all, portrait), "pixels")).toEqual([]);
  });
});

describe("landscape missing positions (N1)", () => {
  const ROOM = "room-qa_woonkamer";

  function roomTiles(): FloatingTile[] {
    return [
      tile("Temperatuur", `dashboard.floatingSensorCardPosition.${ROOM}.sensor`, { w: 260, h: 108, legacyTopOffset: 200 }),
      tile("Plafondlamp", `dashboard.floatingLightCardPosition.${ROOM}.lamp`, { w: 240, h: 70, legacyTopOffset: 80 }),
      tile("Media", `dashboard.floatingMediaCardPosition.${ROOM}.media`, { w: 280, h: 340, legacyTopOffset: 200 }),
    ];
  }

  function run(
    storage: MemoryStorage,
    orientation: "landscape" | "portrait",
    tiles: readonly FloatingTile[],
    mounted = true
  ) {
    return reconcileFloatingLayout({
      storage,
      dashboardId: ROOM,
      orientation,
      viewport: orientation === "landscape" ? LANDSCAPE : PORTRAIT,
      tiles,
      push: false,
      reportNotice: false,
      rederive: false,
      mounted,
    });
  }

  function savedLayout(storage: MemoryStorage) {
    const raw = storage.getItem(layoutStorageKey(ROOM));
    if (!raw) return null;
    return JSON.parse(raw) as {
      active: string;
      landscape: Record<string, string>;
      portrait: Record<string, string> | null;
    };
  }

  function gapPairs(tiles: readonly FloatingTile[], positions: Record<string, string>) {
    const placed = tiles.flatMap((entry) => {
      const raw = positions[entry.key];
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { left: number; bottom: number };
      return [{
        id: entry.id,
        x: parsed.left,
        y: LANDSCAPE.height - parsed.bottom - entry.h,
        w: entry.w,
        h: entry.h,
      }];
    });
    return overlapPairs(placed, "gap");
  }

  function leftOf(raw: string): number {
    return (JSON.parse(raw) as { left: number }).left;
  }

  function dump(storage: MemoryStorage): Record<string, string> {
    const entries: Record<string, string> = {};
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key == null) continue;
      entries[key] = storage.getItem(key) ?? "";
    }
    return entries;
  }

  it("places a fresh landscape room beside the rail without overlap", () => {
    const storage = new MemoryStorage();
    const tiles = roomTiles();
    const result = run(storage, "landscape", tiles, false);
    expect(result.wrote).toBe(true);
    expect(result.remount).toBe(false);
    const positions = snapshotActive(storage, tiles);
    expect(gapPairs(tiles, positions)).toEqual([]);
    for (const entry of tiles) {
      const raw = positions[entry.key];
      expect(raw).toBeTruthy();
      expect(leftOf(raw)).toBeGreaterThanOrEqual(96);
    }
    expect(savedLayout(storage)?.active).toBe("landscape");

    const again = run(storage, "landscape", tiles, true);
    expect(again.wrote).toBe(false);
    expect(snapshotActive(storage, tiles)).toEqual(positions);
  });

  it("writes nothing when every landscape key is already stored, including one under the rail", () => {
    const storage = new MemoryStorage();
    const [sensor, lamp, media] = roomTiles();
    seed(storage, {
      [sensor.key]: '{"left":96,"bottom":400}',
      [lamp.key]: '{"left":0,"bottom":640}',
      [media.key]: '{"left": 752, "bottom": 200}',
    });
    const before = dump(storage);
    const result = run(storage, "landscape", [sensor, lamp, media], true);
    expect(result.wrote).toBe(false);
    expect(result.remount).toBe(false);
    expect(dump(storage)).toEqual(before);
    expect(storage.getItem(layoutStorageKey(ROOM))).toBeNull();
  });

  it("places only the new tile when a landscape record already exists", () => {
    const storage = new MemoryStorage();
    const [sensor, lamp, media] = roomTiles();
    const stored = {
      [sensor.key]: '{"left":0,"bottom":400}',
      [lamp.key]: '{"left":400,"bottom":400}',
      [media.key]: '{"left": 752, "bottom": 200}',
    };
    seed(storage, stored);
    storage.setItem(layoutStorageKey(ROOM), JSON.stringify({
      v: 1,
      active: "landscape",
      landscape: { ...stored },
      portrait: null,
      portraitBron: null,
    }));
    const extra = tile("Extra", `dashboard.floatingLightCardPosition.${ROOM}.extra`, { w: 240, h: 70, legacyTopOffset: 80 });
    const result = run(storage, "landscape", [sensor, lamp, media, extra], true);
    expect(result.wrote).toBe(true);
    expect(result.remount).toBe(true);
    for (const [key, value] of Object.entries(stored)) expect(storage.getItem(key)).toBe(value);
    const extraRaw = storage.getItem(extra.key);
    expect(extraRaw).toBeTruthy();
    expect(leftOf(extraRaw ?? "")).toBeGreaterThanOrEqual(96);
    const saved = savedLayout(storage);
    expect(saved?.active).toBe("landscape");
    for (const [key, value] of Object.entries(stored)) expect(saved?.landscape[key]).toBe(value);
    expect(saved?.landscape[extra.key]).toBe(extraRaw);
    expect(gapPairs([sensor, lamp, media, extra], snapshotActive(storage, [sensor, lamp, media, extra]))).toEqual([]);
  });

  it("fills an empty landscape map when rotating out of portrait", () => {
    const storage = new MemoryStorage();
    const tiles = roomTiles();
    run(storage, "portrait", tiles, false);
    const mid = savedLayout(storage);
    expect(mid?.active).toBe("portrait");
    expect(mid?.landscape).toEqual({});
    const result = run(storage, "landscape", tiles, true);
    expect(result.wrote).toBe(true);
    const positions = snapshotActive(storage, tiles);
    expect(gapPairs(tiles, positions)).toEqual([]);
    for (const entry of tiles) expect(leftOf(positions[entry.key])).toBeGreaterThanOrEqual(96);
    expect(savedLayout(storage)?.active).toBe("landscape");
  });

  it("does not move a shared climate key or a parked pill and treats both as obstacles", () => {
    const storage = new MemoryStorage();
    const climate = tile("Klimaat", `dashboard.floatingClimateCardPosition.${ROOM}`, {
      shared: true,
      persistsClamp: true,
      w: 300,
      h: 340,
      bottomInset: 24,
      legacyTopOffset: 200,
    });
    const pill = tile("Pill", `dashboard.floatingStatPillCardPosition.${ROOM}.pill`, {
      parked: true,
      w: 140,
      h: 44,
      legacyTopOffset: 44,
    });
    const lamp = tile("Plafondlamp", `dashboard.floatingLightCardPosition.${ROOM}.lamp`, {
      w: 240,
      h: 70,
      legacyTopOffset: 80,
    });
    const climateRaw = '{"left":96,"bottom":380}';
    const climateBox = { x: 96, y: LANDSCAPE.height - 380 - climate.h, w: climate.w, h: climate.h };
    const [predicted] = firstFit([{ id: lamp.key, w: lamp.w, h: lamp.h }], LANDSCAPE, [climateBox]);
    const pillRaw = JSON.stringify({
      left: predicted.left,
      bottom: LANDSCAPE.height - predicted.y - pill.h,
    });
    seed(storage, { [climate.key]: climateRaw, [pill.key]: pillRaw });
    const result = run(storage, "landscape", [climate, pill, lamp], false);
    expect(result.wrote).toBe(true);
    expect(storage.getItem(climate.key)).toBe(climateRaw);
    expect(storage.getItem(pill.key)).toBe(pillRaw);
    const lampRaw = storage.getItem(lamp.key);
    expect(lampRaw).toBeTruthy();
    expect(leftOf(lampRaw ?? "")).toBeGreaterThanOrEqual(96);
    expect(gapPairs([climate, pill, lamp], snapshotActive(storage, [climate, pill, lamp]))).toEqual([]);
    const saved = savedLayout(storage);
    expect(saved?.landscape[climate.key]).toBe(climateRaw);
    expect(saved?.landscape[pill.key]).toBe(pillRaw);
  });
});

describe("stored card defaults (N1)", () => {
  const ROOM = "room-qa_woonkamer";
  const sensorSize = { w: 260, h: 108 };
  const lampSize = { w: 240, h: 70 };
  const sensorDefault = cardDefaultPosition("sensor_card", 0, sensorSize, LANDSCAPE);
  const lampDefault = cardDefaultPosition("light_card", 0, lampSize, LANDSCAPE);
  const sensorRaw = JSON.stringify(sensorDefault);
  const lampRaw = JSON.stringify(lampDefault);

  function sensorTile(defaultSize = true): FloatingTile {
    return tile("Temperatuur", `dashboard.floatingSensorCardPosition.${ROOM}.sensor`, {
      ...sensorSize,
      legacyTopOffset: 200,
      cardDefault: sensorDefault ?? undefined,
      defaultSize,
    });
  }

  function lampTile(defaultSize = true): FloatingTile {
    return tile("Plafondlamp", `dashboard.floatingLightCardPosition.${ROOM}.lamp`, {
      ...lampSize,
      legacyTopOffset: 80,
      cardDefault: lampDefault ?? undefined,
      defaultSize,
    });
  }

  function run(
    storage: MemoryStorage,
    tiles: readonly FloatingTile[],
    orientation: "landscape" | "portrait" = "landscape"
  ) {
    return reconcileFloatingLayout({
      storage,
      dashboardId: ROOM,
      orientation,
      viewport: orientation === "landscape" ? LANDSCAPE : PORTRAIT,
      tiles,
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
    });
  }

  function remember(storage: MemoryStorage, positions: Record<string, string>) {
    seed(storage, positions);
    storage.setItem(layoutStorageKey(ROOM), JSON.stringify({
      v: 1,
      active: "landscape",
      landscape: { ...positions },
      portrait: null,
      portraitBron: null,
    }));
  }

  function gapPairs(tiles: readonly FloatingTile[], positions: Record<string, string>) {
    const placed = tiles.flatMap((entry) => {
      const raw = positions[entry.key];
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { left: number; bottom: number };
      return [{
        id: entry.id,
        x: parsed.left,
        y: LANDSCAPE.height - parsed.bottom - entry.h,
        w: entry.w,
        h: entry.h,
      }];
    });
    return overlapPairs(placed, "gap");
  }

  it("moves a sensor and lamp that are still on the card default", () => {
    const storage = new MemoryStorage();
    const sensor = sensorTile();
    const lamp = lampTile();
    seed(storage, { [sensor.key]: sensorRaw, [lamp.key]: lampRaw });
    const result = run(storage, [sensor, lamp]);
    expect(result.wrote).toBe(true);
    const positions = snapshotActive(storage, [sensor, lamp]);
    expect(gapPairs([sensor, lamp], positions)).toEqual([]);
    for (const raw of Object.values(positions)) {
      expect((JSON.parse(raw) as { left: number }).left).toBeGreaterThanOrEqual(96);
    }
    const again = run(storage, [sensor, lamp]);
    expect(again.wrote).toBe(false);
    expect(snapshotActive(storage, [sensor, lamp])).toEqual(positions);
  });

  it("leaves a scaled lamp on the card default", () => {
    const storage = new MemoryStorage();
    const sensor = sensorTile();
    const lamp = lampTile(false);
    seed(storage, { [sensor.key]: sensorRaw, [lamp.key]: lampRaw });
    run(storage, [sensor, lamp]);
    expect(storage.getItem(lamp.key)).toBe(lampRaw);
    const sensorNow = storage.getItem(sensor.key);
    expect(sensorNow).toBeTruthy();
    expect((JSON.parse(sensorNow ?? "") as { left: number }).left).toBeGreaterThanOrEqual(96);
    expect(gapPairs([sensor, lamp], snapshotActive(storage, [sensor, lamp]))).toEqual([]);
  });

  it("leaves a lamp that was placed under the rail but not on the card default", () => {
    const storage = new MemoryStorage();
    const sensor = sensorTile();
    const lamp = lampTile();
    const placed = {
      [sensor.key]: '{"left":96,"bottom":400}',
      [lamp.key]: '{"left":0,"bottom":640}',
    };
    remember(storage, placed);
    const result = run(storage, [sensor, lamp]);
    expect(result.wrote).toBe(false);
    expect(storage.getItem(lamp.key)).toBe(placed[lamp.key]);
    expect(storage.getItem(sensor.key)).toBe(placed[sensor.key]);
  });

  it("leaves two tiles that overlap on purpose away from the card default", () => {
    const storage = new MemoryStorage();
    const sensor = sensorTile();
    const lamp = lampTile();
    const placed = {
      [sensor.key]: '{"left":400,"bottom":200}',
      [lamp.key]: '{"left":480,"bottom":220}',
    };
    remember(storage, placed);
    const result = run(storage, [sensor, lamp]);
    expect(result.wrote).toBe(false);
    expect(storage.getItem(sensor.key)).toBe(placed[sensor.key]);
    expect(storage.getItem(lamp.key)).toBe(placed[lamp.key]);
    expect(gapPairs([sensor, lamp], placed)).not.toEqual([]);
  });

  it("keeps stored card defaults in the landscape master while portrait is open", () => {
    const storage = new MemoryStorage();
    const sensor = sensorTile();
    const lamp = lampTile();
    seed(storage, { [sensor.key]: sensorRaw, [lamp.key]: lampRaw });
    run(storage, [sensor, lamp], "portrait");
    const saved = JSON.parse(storage.getItem(layoutStorageKey(ROOM)) ?? "") as {
      active: string;
      landscape: Record<string, string>;
    };
    expect(saved.active).toBe("portrait");
    expect(saved.landscape[sensor.key]).toBe(sensorRaw);
    expect(saved.landscape[lamp.key]).toBe(lampRaw);
  });

  it("numbers light and sensor defaults per type per page and flags a scaled widget", () => {
    const tiles = floatingTilesFromWidgets([
      { id: "media", type: "media_card", page: 0 },
      { id: "sensor-0", type: "sensor_card", page: 0 },
      { id: "lamp-0", type: "light_card", page: 0 },
      { id: "lamp-1", type: "light_card", page: 0, scale: 1.5 },
      { id: "sensor-wide", type: "sensor_card", page: 0, width: 400 },
      { id: "sensor-page-1", type: "sensor_card", page: 1 },
    ], ROOM, LANDSCAPE);
    const byId = Object.fromEntries(tiles.map((entry) => [entry.id, entry]));
    expect(byId.media.cardDefault).toBeUndefined();
    expect(byId["sensor-0"].cardDefault).toEqual({ left: 0, bottom: 336 });
    expect(byId["sensor-0"].defaultSize).toBe(true);
    expect(byId["lamp-0"].cardDefault).toEqual({ left: 32, bottom: 368 });
    expect(byId["lamp-0"].defaultSize).toBe(true);
    expect(byId["lamp-1"].cardDefault).toEqual({ left: 288, bottom: 368 });
    expect(byId["lamp-1"].defaultSize).toBe(false);
    expect(byId["sensor-wide"].defaultSize).toBe(false);
    expect(byId["sensor-wide"].cardDefault).toEqual({ left: 272, bottom: 336 });
    expect(byId["sensor-page-1"].cardDefault).toEqual({ left: 0, bottom: 336 });
    expect(byId["sensor-page-1"].defaultSize).toBe(true);
  });
});

describe("landscape header clearance (O1)", () => {
  const ROOM = "room-qa_woonkamer";

  function roomTiles(): FloatingTile[] {
    return [
      tile("Temperatuur", `dashboard.floatingSensorCardPosition.${ROOM}.sensor`, { w: 260, h: 108, legacyTopOffset: 200 }),
      tile("Plafondlamp", `dashboard.floatingLightCardPosition.${ROOM}.lamp`, { w: 240, h: 70, legacyTopOffset: 80 }),
      tile("Media", `dashboard.floatingMediaCardPosition.${ROOM}.media`, { w: 280, h: 340, legacyTopOffset: 200 }),
    ];
  }

  function run(
    storage: MemoryStorage,
    orientation: "landscape" | "portrait",
    tiles: readonly FloatingTile[],
    topInset?: number
  ) {
    return reconcileFloatingLayout({
      storage,
      dashboardId: ROOM,
      orientation,
      viewport: orientation === "landscape" ? LANDSCAPE : PORTRAIT,
      tiles,
      push: false,
      reportNotice: false,
      rederive: false,
      mounted: true,
      topInset,
    });
  }

  function tops(
    tiles: readonly FloatingTile[],
    positions: Record<string, string>,
    height: number
  ): number[] {
    return tiles.map((entry) => {
      const parsed = JSON.parse(positions[entry.key] ?? "") as { bottom: number };
      return height - parsed.bottom - entry.h;
    });
  }

  function gapPairs(
    tiles: readonly FloatingTile[],
    positions: Record<string, string>,
    height: number
  ) {
    const placed = tiles.flatMap((entry) => {
      const raw = positions[entry.key];
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { left: number; bottom: number };
      return [{
        id: entry.id,
        x: parsed.left,
        y: height - parsed.bottom - entry.h,
        w: entry.w,
        h: entry.h,
      }];
    });
    return overlapPairs(placed, "gap");
  }

  it("places new landscape tiles under a header inset of 160", () => {
    const storage = new MemoryStorage();
    const tiles = roomTiles();
    const result = run(storage, "landscape", tiles, 160);
    expect(result.wrote).toBe(true);
    const positions = snapshotActive(storage, tiles);
    for (const top of tops(tiles, positions, LANDSCAPE.height)) {
      expect(top).toBeGreaterThanOrEqual(160);
    }
    expect(gapPairs(tiles, positions, LANDSCAPE.height)).toEqual([]);
    for (const raw of Object.values(positions)) {
      expect((JSON.parse(raw) as { left: number }).left).toBeGreaterThanOrEqual(96);
    }
    const again = run(storage, "landscape", tiles, 160);
    expect(again.wrote).toBe(false);
    expect(snapshotActive(storage, tiles)).toEqual(positions);
  });

  it("keeps the 80px top margin when no header inset is passed", () => {
    const storage = new MemoryStorage();
    const tiles = roomTiles();
    run(storage, "landscape", tiles);
    const positions = snapshotActive(storage, tiles);
    const placedTops = tops(tiles, positions, LANDSCAPE.height);
    for (const top of placedTops) expect(top).toBeGreaterThanOrEqual(80);
    expect(Math.min(...placedTops)).toBeLessThan(160);
    expect(gapPairs(tiles, positions, LANDSCAPE.height)).toEqual([]);
  });

  it("keeps portrait positions when the same header inset is passed", () => {
    const tiles = roomTiles();
    const plain = new MemoryStorage();
    const withInset = new MemoryStorage();
    run(plain, "portrait", tiles);
    run(withInset, "portrait", tiles, 160);
    const before = snapshotActive(plain, tiles);
    expect(snapshotActive(withInset, tiles)).toEqual(before);
    const placedTops = tops(tiles, before, PORTRAIT.height);
    for (const top of placedTops) expect(top).toBeGreaterThanOrEqual(80);
    expect(Math.min(...placedTops)).toBeLessThan(160);
  });

  it("leaves a user-placed landscape tile at y=40", () => {
    const storage = new MemoryStorage();
    const [sensor, lamp] = roomTiles();
    const placedTop = 40;
    const raw = JSON.stringify({ left: 400, bottom: LANDSCAPE.height - placedTop - sensor.h });
    seed(storage, { [sensor.key]: raw });
    storage.setItem(layoutStorageKey(ROOM), JSON.stringify({
      v: 1,
      active: "landscape",
      landscape: { [sensor.key]: raw },
      portrait: null,
      portraitBron: null,
    }));
    const result = run(storage, "landscape", [sensor, lamp], 160);
    expect(result.wrote).toBe(true);
    expect(storage.getItem(sensor.key)).toBe(raw);
    const lampRaw = storage.getItem(lamp.key);
    expect(lampRaw).toBeTruthy();
    const lampTop = LANDSCAPE.height - (JSON.parse(lampRaw ?? "") as { bottom: number }).bottom - lamp.h;
    expect(lampTop).toBeGreaterThanOrEqual(160);
    expect((JSON.parse(lampRaw ?? "") as { left: number }).left).toBeGreaterThanOrEqual(96);
    const again = run(storage, "landscape", [sensor, lamp], 160);
    expect(again.wrote).toBe(false);
    expect(storage.getItem(sensor.key)).toBe(raw);
  });
});
