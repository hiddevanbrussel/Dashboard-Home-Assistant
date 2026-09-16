import { describe, expect, it } from "vitest";
import {
  CALENDAR_CARD_DEFAULT_HEIGHT,
  CALENDAR_CARD_DEFAULT_WIDTH,
  clampCalendarCardHeight,
  clampCalendarCardWidth,
  resizeCalendarCardFromBottomRight,
} from "./calendar-card";

describe("calendar-card helpers", () => {
  it("clamps width and height onto the card bounds", () => {
    expect(clampCalendarCardWidth("not-a-number")).toBe(CALENDAR_CARD_DEFAULT_WIDTH);
    expect(clampCalendarCardWidth(100)).toBe(280);
    expect(clampCalendarCardWidth(900)).toBe(560);
    expect(clampCalendarCardWidth(360)).toBe(360);
    expect(clampCalendarCardHeight(undefined)).toBe(CALENDAR_CARD_DEFAULT_HEIGHT);
    expect(clampCalendarCardHeight(200)).toBe(340);
    expect(clampCalendarCardHeight(900)).toBe(780);
    expect(clampCalendarCardHeight(500)).toBe(500);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 340,
      startHeight: 480,
      startLeft: 88,
      startBottom: 72,
      viewportWidth: 1280,
      viewportHeight: 800,
    };
    const grown = resizeCalendarCardFromBottomRight({ ...start, dx: 80, dy: 50 });
    expect(grown).toEqual({ width: 420, height: 530, left: 88, bottom: 22 });
    const shrunk = resizeCalendarCardFromBottomRight({ ...start, dx: -80, dy: -80 });
    expect(shrunk.width).toBe(280);
    expect(shrunk.height).toBe(400);
    expect(shrunk.left).toBe(88);
    expect(shrunk.bottom).toBe(152);
    const againstViewport = resizeCalendarCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(490);
  });
});
