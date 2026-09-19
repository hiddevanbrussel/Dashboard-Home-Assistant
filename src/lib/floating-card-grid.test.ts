import { describe, expect, it } from "vitest";
import {
  beginFloatingCardDrag,
  createsContainingBlock,
  floatingDragBounds,
  isFloatingCardNoDragTarget,
  leftBottomInParent,
  snapToGrid,
} from "./floating-card-grid";

describe("floating-card-grid", () => {
  it("snaps to the 16px grid and clamps to bounds", () => {
    expect(snapToGrid({ left: 20, bottom: 12 })).toEqual({ left: 16, bottom: 16 });
    expect(snapToGrid({ left: 40, bottom: 80 }, { maxLeft: 32, maxBottom: 64 })).toEqual({
      left: 32,
      bottom: 64,
    });
  });

  it("treats a positioned page as the containing block for absolute cards", () => {
    expect(createsContainingBlock({ position: "relative", transform: "none" })).toBe(true);
    expect(createsContainingBlock({ position: "static", transform: "none" })).toBe(false);
    expect(createsContainingBlock({ position: "static", transform: "translateX(10px)" })).toBe(true);
  });

  it("converts a viewport box into left/bottom inside a transformed parent", () => {
    expect(
      leftBottomInParent({ left: 420, bottom: 640 }, { left: 0, bottom: 800 })
    ).toEqual({ left: 420, bottom: 160 });
    expect(
      leftBottomInParent({ left: 120, bottom: 400 }, { left: 80, bottom: 700 })
    ).toEqual({ left: 40, bottom: 300 });
  });

  it("starts a drag from the measured box so the card does not jump", () => {
    expect(
      beginFloatingCardDrag({ clientX: 410, clientY: 220 }, { left: 80, bottom: 40 }, { left: 120, bottom: 64 })
    ).toEqual({ x: 410, y: 220, left: 120, bottom: 64 });
    expect(
      beginFloatingCardDrag({ clientX: 10, clientY: 20 }, { left: 80, bottom: 40 }, null)
    ).toEqual({ x: 10, y: 20, left: 80, bottom: 40 });
  });

  it("only treats data-no-drag targets as non-draggable", () => {
    expect(isFloatingCardNoDragTarget(null)).toBe(false);
    expect(isFloatingCardNoDragTarget({ closest: () => null })).toBe(false);
    expect(isFloatingCardNoDragTarget({ closest: (sel: string) => (sel === "[data-no-drag]" ? {} : null) })).toBe(true);
  });

  it("clamps drag bounds to the containing block, not the window", () => {
    expect(floatingDragBounds(200, 100, { width: 800, height: 600 }, 24)).toEqual({
      maxLeft: 600,
      maxBottom: 476,
    });
    expect(floatingDragBounds(900, 700, { width: 800, height: 600 })).toEqual({
      maxLeft: 0,
      maxBottom: 0,
    });
  });
});
