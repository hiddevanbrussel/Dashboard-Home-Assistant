import { describe, expect, it } from "vitest";
import {
  TILE_SIDEBAR_INSET_PX,
  defaultTileSize,
  findFirstFreeTileSlot,
  resolveTilePosition,
  type TilePlacementInput,
  type TileRect,
} from "./tile-placement";

const landscape = { width: 1280, height: 800 };
const portrait = { width: 800, height: 1280 };

function input(overrides: Partial<TilePlacementInput> & Pick<TilePlacementInput, "viewport" | "tile">): TilePlacementInput {
  return {
    occupied: [],
    minLeft: 0,
    minTop: 0,
    minBottom: 0,
    gap: 0,
    step: 16,
    ...overrides,
  };
}

describe("findFirstFreeTileSlot", () => {
  it("places the first tile at the top-left of an empty visible area", () => {
    const tile = { width: 240, height: 80 };
    const slot = findFirstFreeTileSlot(
      input({
        viewport: landscape,
        tile,
        minLeft: TILE_SIDEBAR_INSET_PX,
        minTop: 64,
        minBottom: 36,
      })
    );
    expect(slot).toEqual({ left: 96, top: 64, width: 240, height: 80 });
  });

  it("returns null when the visible area is already full", () => {
    const tile = { width: 200, height: 100 };
    const occupied: TileRect[] = [{ left: 0, top: 0, width: 400, height: 300 }];
    expect(
      findFirstFreeTileSlot(
        input({ viewport: { width: 400, height: 300 }, tile, occupied, gap: 0, step: 16 })
      )
    ).toBeNull();
  });

  it("uses a gap at the right edge and rejects a gap that is one pixel too small", () => {
    const tile = { width: 64, height: 64 };
    const viewport = { width: 320, height: 200 };
    const exact = findFirstFreeTileSlot(
      input({
        viewport,
        tile,
        occupied: [{ left: 0, top: 0, width: 256, height: 200 }],
        gap: 0,
        step: 16,
      })
    );
    expect(exact).toEqual({ left: 256, top: 0, width: 64, height: 64 });

    const tooSmall = findFirstFreeTileSlot(
      input({
        viewport,
        tile,
        occupied: [{ left: 0, top: 0, width: 257, height: 200 }],
        gap: 0,
        step: 1,
      })
    );
    expect(tooSmall).toBeNull();
  });

  it("keeps the slot to the right of the sidebar", () => {
    const slot = findFirstFreeTileSlot(
      input({
        viewport: portrait,
        tile: defaultTileSize("stat_pill_card"),
        minLeft: TILE_SIDEBAR_INSET_PX,
        minTop: 64,
        minBottom: 36,
      })
    );
    expect(slot).not.toBeNull();
    expect(slot!.left).toBeGreaterThanOrEqual(TILE_SIDEBAR_INSET_PX);
  });

  it("wraps under an occupied block in portrait and stays beside it in landscape", () => {
    const tile = { width: 360, height: 200 };
    const occupied: TileRect[] = [{ left: 96, top: 64, width: 360, height: 200 }];
    const shared = {
      tile,
      occupied,
      minLeft: TILE_SIDEBAR_INSET_PX,
      minTop: 64,
      minBottom: 36,
      gap: 16,
      step: 16,
    };
    const wide = findFirstFreeTileSlot(input({ ...shared, viewport: landscape }));
    const tall = findFirstFreeTileSlot(input({ ...shared, viewport: portrait }));
    expect(wide).not.toBeNull();
    expect(tall).not.toBeNull();
    expect(wide!.top).toBe(64);
    expect(wide!.left).toBeGreaterThan(96);
    expect(tall!.left).toBe(96);
    expect(tall!.top).toBeGreaterThan(64);
  });
});

describe("resolveTilePosition", () => {
  it("falls back to the legacy centered spot, never behind the sidebar, when nothing fits", () => {
    const tile = defaultTileSize("light_card");
    const placed = resolveTilePosition(
      input({
        viewport: landscape,
        tile,
        occupied: [{ left: 0, top: 0, width: landscape.width, height: landscape.height }],
        minLeft: TILE_SIDEBAR_INSET_PX,
        minTop: 64,
        minBottom: 36,
        widgetIndex: 0,
        gap: 0,
      })
    );
    expect(placed.placedBy).toBe("fallback");
    expect(placed.left).toBeGreaterThanOrEqual(TILE_SIDEBAR_INSET_PX);
    expect(placed.width).toBe(240);
    expect(placed.height).toBe(80);
  });

  it("uses the standard size per type", () => {
    expect(defaultTileSize("weather_card")).toEqual({ width: 320, height: 300 });
    expect(defaultTileSize("climate_card_2")).toEqual({ width: 300, height: 340 });
    expect(defaultTileSize("light_card")).toEqual({ width: 240, height: 80 });
  });
});
