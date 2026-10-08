import { describe, expect, it } from "vitest";
import {
  ENERGY_MONITOR_CARD_DEFAULT_HEIGHT,
  ENERGY_MONITOR_CARD_DEFAULT_WIDTH,
  ENERGY_MONITOR_CARD_MIN_HEIGHT,
  ENERGY_MONITOR_CARD_MIN_WIDTH,
  clampEnergyMonitorCardHeight,
  clampEnergyMonitorCardWidth,
  resizeEnergyMonitorCardFromBottomRight,
} from "./energy-monitor-card";

describe("energy-monitor-card helpers", () => {
  it("clamps width and height onto the image card", () => {
    expect(clampEnergyMonitorCardWidth(undefined)).toBe(ENERGY_MONITOR_CARD_DEFAULT_WIDTH);
    expect(clampEnergyMonitorCardWidth("nope")).toBe(ENERGY_MONITOR_CARD_DEFAULT_WIDTH);
    expect(clampEnergyMonitorCardWidth(40)).toBe(ENERGY_MONITOR_CARD_MIN_WIDTH);
    expect(clampEnergyMonitorCardWidth(2000)).toBe(960);
    expect(clampEnergyMonitorCardWidth(400)).toBe(400);
    expect(clampEnergyMonitorCardHeight(undefined)).toBe(ENERGY_MONITOR_CARD_DEFAULT_HEIGHT);
    expect(clampEnergyMonitorCardHeight(20)).toBe(ENERGY_MONITOR_CARD_MIN_HEIGHT);
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
    expect(shrunk.bottom).toBe(220);
    const againstViewport = resizeEnergyMonitorCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(270);
  });
});
