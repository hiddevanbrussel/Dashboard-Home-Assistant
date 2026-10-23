import { describe, expect, it } from "vitest";
import { canFocusMenu, firstEnabledIndex, placeTileMenu } from "./tile-menu-layout";

const viewport = { width: 1280, height: 800 };
const size = { width: 220, height: 100 };

describe("canFocusMenu", () => {
  it("waits until the menu is placed (visible)", () => {
    expect(canFocusMenu(false, false)).toBe(false);
    expect(canFocusMenu(true, false)).toBe(true);
  });

  it("focuses only once, so re-renders do not pull focus back to the first row", () => {
    expect(canFocusMenu(true, true)).toBe(false);
  });
});

describe("firstEnabledIndex", () => {
  it("skips disabled rows", () => {
    expect(firstEnabledIndex([{ disabled: true }, {}, {}])).toBe(1);
    expect(firstEnabledIndex([{}, { disabled: true }])).toBe(0);
  });

  it("returns -1 when every row is disabled", () => {
    expect(firstEnabledIndex([{ disabled: true }])).toBe(-1);
    expect(firstEnabledIndex([])).toBe(-1);
  });
});

describe("placeTileMenu", () => {
  it("centres below the anchor", () => {
    const pos = placeTileMenu({ left: 500, right: 600, top: 100, bottom: 140 }, size, viewport);
    expect(pos).toEqual({ left: 440, top: 148 });
  });

  it("stays inside the left and right edges", () => {
    expect(placeTileMenu({ left: 0, right: 40, top: 10, bottom: 50 }, size, viewport).left).toBe(8);
    expect(placeTileMenu({ left: 1240, right: 1280, top: 10, bottom: 50 }, size, viewport).left).toBe(1280 - 220 - 8);
  });

  it("flips above the anchor when there is no room below", () => {
    const pos = placeTileMenu({ left: 500, right: 600, top: 700, bottom: 740 }, size, viewport);
    expect(pos.top).toBe(700 - 8 - 100);
  });
});
