import { describe, expect, it } from "vitest";
import { notificationPanelFrame } from "./notification-panel-frame";

describe("notification panel frame", () => {
  it("caps the sidebar panel at the space above the trigger on a short landscape screen", () => {
    const anchor = { right: 64, bottom: 461.27 };
    const frame = notificationPanelFrame("sidebar", anchor, { width: 1280, height: 800 });
    expect(frame.maxHeight).toBeCloseTo(453.27);
    expect(frame.width).toBe(320);
    expect(anchor.bottom - frame.maxHeight).toBeCloseTo(8);
    expect(anchor.right + 8 + frame.width).toBeLessThanOrEqual(1280 - 8);
  });

  it("shrinks the sidebar panel so a 390px screen keeps an 8px margin", () => {
    const anchor = { right: 64, bottom: 483.11 };
    const frame = notificationPanelFrame("sidebar", anchor, { width: 390, height: 844 });
    expect(frame.width).toBeCloseTo(310);
    expect(anchor.right + 8 + frame.width).toBeCloseTo(390 - 8);
    expect(anchor.bottom - frame.maxHeight).toBeCloseTo(8);
  });

  it("keeps a tall portrait panel inside the viewport", () => {
    const anchor = { right: 64, bottom: 701.02 };
    const frame = notificationPanelFrame("sidebar", anchor, { width: 800, height: 1280 });
    expect(frame.maxHeight).toBeCloseTo(693.02);
    expect(frame.width).toBe(320);
    expect(anchor.bottom - frame.maxHeight).toBeGreaterThanOrEqual(8);
  });

  it("opens the header panel downward without crossing the viewport", () => {
    const anchor = { right: 200, bottom: 48 };
    const frame = notificationPanelFrame("header", anchor, { width: 390, height: 844 });
    expect(frame.width).toBe(192);
    expect(frame.maxHeight).toBe(844 - (48 + 4) - 8);
    expect(anchor.right - frame.width).toBeGreaterThanOrEqual(8);
  });
});