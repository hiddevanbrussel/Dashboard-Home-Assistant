import { describe, expect, it } from "vitest";
import {
  duplicateTileTitle,
  readSavedTilePosition,
  removeTileWithSnapshot,
  restoreRemovedTile,
  restoreSavedTilePosition,
} from "./tile-menu-actions";

type W = { id: string; type: string; title?: string; extra?: number };
type L = { i: string; x: number; y: number };

const widgets: W[] = [
  { id: "a", type: "text_card", title: "A" },
  { id: "b", type: "light_card", title: "B", extra: 7 },
  { id: "c", type: "stat_pill_card", title: "C" },
];
const layout: L[] = [
  { i: "a", x: 0, y: 0 },
  { i: "b", x: 4, y: 0 },
];

describe("removeTileWithSnapshot", () => {
  it("removes the tile and its layout item and remembers both positions", () => {
    const r = removeTileWithSnapshot(widgets, layout, "b");
    expect(r.widgets.map((w) => w.id)).toEqual(["a", "c"]);
    expect(r.layout.map((l) => l.i)).toEqual(["a"]);
    expect(r.snapshot).toEqual({ widget: widgets[1], widgetIndex: 1, layoutItem: layout[1], layoutIndex: 1 });
  });

  it("handles a floating tile without a layout item", () => {
    const r = removeTileWithSnapshot(widgets, layout, "c");
    expect(r.layout).toBe(layout);
    expect(r.snapshot?.layoutItem).toBeNull();
  });

  it("leaves everything untouched for an unknown id", () => {
    const r = removeTileWithSnapshot(widgets, layout, "x");
    expect(r.widgets).toBe(widgets);
    expect(r.layout).toBe(layout);
    expect(r.snapshot).toBeNull();
  });

  it("does not mutate its input", () => {
    const before = JSON.stringify({ widgets, layout });
    removeTileWithSnapshot(widgets, layout, "a");
    expect(JSON.stringify({ widgets, layout })).toBe(before);
  });
});

describe("restoreRemovedTile", () => {
  it("puts the tile back at its old place with all its fields", () => {
    const r = removeTileWithSnapshot(widgets, layout, "b");
    const back = restoreRemovedTile(r.widgets, r.layout, r.snapshot!);
    expect(back.widgets).toEqual(widgets);
    expect(back.layout).toEqual(layout);
  });

  it("is a no-op when the tile is already back (double undo)", () => {
    const r = removeTileWithSnapshot(widgets, layout, "b");
    const once = restoreRemovedTile(r.widgets, r.layout, r.snapshot!);
    const twice = restoreRemovedTile(once.widgets, once.layout, r.snapshot!);
    expect(twice.widgets).toBe(once.widgets);
    expect(twice.layout).toBe(once.layout);
  });

  it("appends at the end when the list has shrunk in the meantime", () => {
    const r = removeTileWithSnapshot(widgets, layout, "c");
    const shrunk = removeTileWithSnapshot(r.widgets, r.layout, "b");
    const back = restoreRemovedTile(shrunk.widgets, shrunk.layout, r.snapshot!);
    expect(back.widgets.map((w) => w.id)).toEqual(["a", "c"]);
  });
});

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe("saved tile position for undo", () => {
  const key = "dashboard.floatingTextCardPosition.d1.b";

  it("reads the stored position, or null when there is none", () => {
    const storage = memoryStorage({ [key]: '{"left":304,"bottom":576}' });
    expect(readSavedTilePosition(storage, key)).toEqual({ key, value: '{"left":304,"bottom":576}' });
    expect(readSavedTilePosition(storage, "other")).toBeNull();
    expect(readSavedTilePosition(storage, null)).toBeNull();
  });

  it("writes the position back after removal pruned it", () => {
    const storage = memoryStorage({ [key]: '{"left":304,"bottom":576}' });
    const saved = readSavedTilePosition(storage, key);
    storage.data.delete(key);
    restoreSavedTilePosition(storage, saved);
    expect(storage.getItem(key)).toBe('{"left":304,"bottom":576}');
  });

  it("leaves a key alone that has a value again (e.g. a shared position)", () => {
    const storage = memoryStorage({ [key]: '{"left":0,"bottom":0}' });
    restoreSavedTilePosition(storage, { key, value: '{"left":304,"bottom":576}' });
    expect(storage.getItem(key)).toBe('{"left":0,"bottom":0}');
    restoreSavedTilePosition(storage, null);
    expect(storage.getItem(key)).toBe('{"left":0,"bottom":0}');
  });
});

describe("duplicateTileTitle", () => {
  it("adds the translated copy suffix", () => {
    expect(duplicateTileTitle("Keuken", "kopie")).toBe("Keuken (kopie)");
    expect(duplicateTileTitle("  Kitchen ", "copy")).toBe("Kitchen (copy)");
  });

  it("keeps an empty title empty", () => {
    expect(duplicateTileTitle("", "kopie")).toBe("");
    expect(duplicateTileTitle(undefined, "kopie")).toBe("");
  });
});
