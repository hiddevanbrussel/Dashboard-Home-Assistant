import { describe, expect, it } from "vitest";
import {
  ROOM_CARD_DEFAULT_HEIGHT,
  ROOM_CARD_DEFAULT_WIDTH,
  clampRoomCardHeight,
  clampRoomCardWidth,
  resizeRoomCardFromBottomRight,
} from "./room-card";

describe("room-card helpers", () => {
  it("clamps width and height onto the card bounds", () => {
    expect(clampRoomCardWidth("not-a-number")).toBe(ROOM_CARD_DEFAULT_WIDTH);
    expect(clampRoomCardWidth(100)).toBe(180);
    expect(clampRoomCardWidth(900)).toBe(480);
    expect(clampRoomCardWidth(300)).toBe(300);
    expect(clampRoomCardHeight(undefined)).toBe(ROOM_CARD_DEFAULT_HEIGHT);
    expect(clampRoomCardHeight(40)).toBe(72);
    expect(clampRoomCardHeight(900)).toBe(320);
    expect(clampRoomCardHeight(180)).toBe(180);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 220,
      startHeight: 100,
      startLeft: 88,
      startBottom: 72,
      viewportWidth: 1280,
      viewportHeight: 800,
    };
    const grown = resizeRoomCardFromBottomRight({ ...start, dx: 80, dy: 50 });
    expect(grown).toEqual({ width: 300, height: 150, left: 88, bottom: 22 });
    const shrunk = resizeRoomCardFromBottomRight({ ...start, dx: -80, dy: -20 });
    expect(shrunk.width).toBe(180);
    expect(shrunk.height).toBe(80);
    expect(shrunk.left).toBe(88);
    expect(shrunk.bottom).toBe(92);
    const againstViewport = resizeRoomCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(110);
  });
});
