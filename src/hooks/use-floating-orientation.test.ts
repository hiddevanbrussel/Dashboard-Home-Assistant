import { describe, expect, it } from "vitest";
import { measurePlacementInset } from "@/hooks/use-floating-orientation";

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
  });

  it("returns undefined until a box has been laid out", () => {
    expect(measurePlacementInset(root({}))).toBeUndefined();
    expect(measurePlacementInset(root({
      "[data-app-heading-edit]": 0,
      "[data-app-page-heading]": 158,
    }))).toBe(176);
  });
});
