import { describe, expect, it } from "vitest";
import {
  ENERGY_MONITOR_CARD_DEFAULT_HEIGHT,
  ENERGY_MONITOR_CARD_DEFAULT_WIDTH,
  ENERGY_MONITOR_CARD_KEEP_VISIBLE,
  ENERGY_MONITOR_CARD_MIN_HEIGHT,
  ENERGY_MONITOR_CARD_MIN_WIDTH,
  clampEnergyMonitorCardHeight,
  clampEnergyMonitorCardPosition,
  clampEnergyMonitorCardWidth,
  energyMonitorCardDragBounds,
  resizeEnergyMonitorCardFromBottomRight,
} from "./energy-monitor-card";

describe("energy-monitor-card helpers", () => {
  it("clamps width and height onto the image card", () => {
    expect(clampEnergyMonitorCardWidth(undefined)).toBe(ENERGY_MONITOR_CARD_DEFAULT_WIDTH);
    expect(clampEnergyMonitorCardWidth("nope")).toBe(ENERGY_MONITOR_CARD_DEFAULT_WIDTH);
    expect(clampEnergyMonitorCardWidth(20)).toBe(ENERGY_MONITOR_CARD_MIN_WIDTH);
    expect(clampEnergyMonitorCardWidth(48)).toBe(48);
    expect(clampEnergyMonitorCardWidth(2000)).toBe(960);
    expect(clampEnergyMonitorCardWidth(400)).toBe(400);
    expect(clampEnergyMonitorCardHeight(undefined)).toBe(ENERGY_MONITOR_CARD_DEFAULT_HEIGHT);
    expect(clampEnergyMonitorCardHeight(20)).toBe(ENERGY_MONITOR_CARD_MIN_HEIGHT);
    expect(clampEnergyMonitorCardHeight(48)).toBe(48);
    expect(clampEnergyMonitorCardHeight(2000)).toBe(720);
    expect(clampEnergyMonitorCardHeight(300)).toBe(300);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 360,
      startHeight: 260,
      startLeft: 80,
      startBottom: 40,
      viewportWidth: 1200,
      viewportHeight: 800,
    };
    const grown = resizeEnergyMonitorCardFromBottomRight({ ...start, dx: 40, dy: 30 });
    expect(grown).toEqual({ width: 400, height: 290, left: 80, bottom: 10 });
    const shrunk = resizeEnergyMonitorCardFromBottomRight({ ...start, dx: -400, dy: -400 });
    expect(shrunk.width).toBe(ENERGY_MONITOR_CARD_MIN_WIDTH);
    expect(shrunk.height).toBe(ENERGY_MONITOR_CARD_MIN_HEIGHT);
    expect(shrunk.left).toBe(80);
    expect(shrunk.bottom).toBe(252);
    const againstViewport = resizeEnergyMonitorCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(270);
  });

  it("lets the image hang off every edge while keeping a grab handle", () => {
    const bounds = energyMonitorCardDragBounds(360, 260, { width: 1200, height: 800 });
    expect(bounds).toEqual({
      minLeft: ENERGY_MONITOR_CARD_KEEP_VISIBLE - 360,
      maxLeft: 1200 - ENERGY_MONITOR_CARD_KEEP_VISIBLE,
      minBottom: ENERGY_MONITOR_CARD_KEEP_VISIBLE - 260,
      maxBottom: 800 - ENERGY_MONITOR_CARD_KEEP_VISIBLE,
    });
    expect(clampEnergyMonitorCardPosition({ left: -400, bottom: 40 }, bounds)).toEqual({
      left: bounds.minLeft,
      bottom: 40,
    });
    expect(clampEnergyMonitorCardPosition({ left: 2000, bottom: 2000 }, bounds)).toEqual({
      left: bounds.maxLeft,
      bottom: bounds.maxBottom,
    });
    expect(clampEnergyMonitorCardPosition({ left: 80, bottom: 24 }, bounds)).toEqual({
      left: 80,
      bottom: 24,
    });
  });
});
