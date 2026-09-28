import { describe, expect, it } from "vitest";
import {
  CALENDAR_CARD_DEFAULT_HEIGHT,
  CALENDAR_CARD_DEFAULT_WIDTH,
  calendarVisibleEventCount,
  clampCalendarCardHeight,
  clampCalendarCardWidth,
  resizeCalendarCardFromBottomRight,
} from "./calendar-card";

describe("calendar-card helpers", () => {
  it("clamps width and height onto the horizontal card bounds", () => {
    expect(clampCalendarCardWidth("not-a-number")).toBe(CALENDAR_CARD_DEFAULT_WIDTH);
    expect(clampCalendarCardWidth(100)).toBe(320);
    expect(clampCalendarCardWidth(900)).toBe(640);
    expect(clampCalendarCardWidth(420)).toBe(420);
    expect(clampCalendarCardHeight(undefined)).toBe(CALENDAR_CARD_DEFAULT_HEIGHT);
    expect(clampCalendarCardHeight(100)).toBe(160);
    expect(clampCalendarCardHeight(900)).toBe(420);
    expect(clampCalendarCardHeight(220)).toBe(220);
  });

  it("estimates how many event rows fit before the overflow footer", () => {
    expect(calendarVisibleEventCount(160)).toBe(1);
    expect(calendarVisibleEventCount(200)).toBe(2);
    expect(calendarVisibleEventCount(320)).toBe(4);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 420,
      startHeight: 200,
      startLeft: 88,
      startBottom: 72,
      viewportWidth: 1280,
      viewportHeight: 800,
    };
    const grown = resizeCalendarCardFromBottomRight({ ...start, dx: 80, dy: 50 });
    expect(grown).toEqual({ width: 500, height: 250, left: 88, bottom: 22 });
    const shrunk = resizeCalendarCardFromBottomRight({ ...start, dx: -120, dy: -80 });
    expect(shrunk.width).toBe(320);
    expect(shrunk.height).toBe(160);
    expect(shrunk.left).toBe(88);
    expect(shrunk.bottom).toBe(112);
    const againstViewport = resizeCalendarCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(210);
  });
});
