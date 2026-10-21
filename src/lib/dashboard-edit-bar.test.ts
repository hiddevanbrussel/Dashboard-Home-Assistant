import { describe, expect, it } from "vitest";
import {
  DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX,
  editBarClearsResizeHandle,
  editBarVerticalBand,
  resizeHandleVerticalBand,
} from "./dashboard-edit-bar";

const PORTRAIT_HEIGHT = 1280;
const LANDSCAPE_HEIGHT = 800;
const BOTTOM_TILE_PX = 32;

describe("dashboard edit bar vs bottom resize handle", () => {
  it("keeps a bottom-32 handle clear of the flush edit bar in portrait and landscape", () => {
    expect(editBarClearsResizeHandle(PORTRAIT_HEIGHT, BOTTOM_TILE_PX)).toBe(true);
    expect(editBarClearsResizeHandle(LANDSCAPE_HEIGHT, BOTTOM_TILE_PX)).toBe(true);
  });

  it("shows the old bottom-5 bar covering that same handle", () => {
    expect(
      editBarClearsResizeHandle(PORTRAIT_HEIGHT, BOTTOM_TILE_PX, DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX)
    ).toBe(false);
    expect(
      editBarClearsResizeHandle(LANDSCAPE_HEIGHT, BOTTOM_TILE_PX, DASHBOARD_EDIT_BAR_LEGACY_OFFSET_PX)
    ).toBe(false);
  });

  it("places the handle's lower edge 2px above a 28px bar", () => {
    const handle = resizeHandleVerticalBand(PORTRAIT_HEIGHT, BOTTOM_TILE_PX);
    const bar = editBarVerticalBand(PORTRAIT_HEIGHT, 0);
    expect(bar.top - handle.bottom).toBe(2);
    expect(handle).toEqual({ top: 1226, bottom: 1250 });
    expect(bar).toEqual({ top: 1252, bottom: 1280 });
  });
});
