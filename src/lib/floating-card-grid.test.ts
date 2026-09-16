import { describe, expect, it } from "vitest";
import { leftBottomInParent, snapToGrid } from "./floating-card-grid";

describe("floating-card-grid", () => {
  it("snaps to the 16px grid and clamps to bounds", () => {
    expect(snapToGrid({ left: 20, bottom: 12 })).toEqual({ left: 16, bottom: 16 });
    expect(snapToGrid({ left: 40, bottom: 80 }, { maxLeft: 32, maxBottom: 64 })).toEqual({
      left: 32,
      bottom: 64,
    });
  });

  it("converts a viewport box into left/bottom inside a transformed parent", () => {
    expect(
      leftBottomInParent({ left: 420, bottom: 640 }, { left: 0, bottom: 800 })
    ).toEqual({ left: 420, bottom: 160 });
    expect(
      leftBottomInParent({ left: 120, bottom: 400 }, { left: 80, bottom: 700 })
    ).toEqual({ left: 40, bottom: 300 });
  });
});
