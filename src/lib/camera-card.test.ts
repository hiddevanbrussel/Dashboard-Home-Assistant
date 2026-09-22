import { describe, expect, it } from "vitest";
import {
  CAMERA_CARD_DEFAULT_HEIGHT,
  CAMERA_CARD_DEFAULT_WIDTH,
  CAMERA_CARD_MIN_HEIGHT,
  CAMERA_CARD_MIN_WIDTH,
  clampCameraCardHeight,
  clampCameraCardWidth,
  resizeCameraCardFromBottomRight,
} from "./camera-card";

describe("camera-card helpers", () => {
  it("clamps width and height onto the camera card", () => {
    expect(clampCameraCardWidth(undefined)).toBe(CAMERA_CARD_DEFAULT_WIDTH);
    expect(clampCameraCardWidth("nope")).toBe(CAMERA_CARD_DEFAULT_WIDTH);
    expect(clampCameraCardWidth(100)).toBe(CAMERA_CARD_MIN_WIDTH);
    expect(clampCameraCardWidth(900)).toBe(720);
    expect(clampCameraCardWidth(400)).toBe(400);
    expect(clampCameraCardHeight(undefined)).toBe(CAMERA_CARD_DEFAULT_HEIGHT);
    expect(clampCameraCardHeight(80)).toBe(CAMERA_CARD_MIN_HEIGHT);
    expect(clampCameraCardHeight(900)).toBe(540);
    expect(clampCameraCardHeight(300)).toBe(300);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 360,
      startHeight: 270,
      startLeft: 80,
      startBottom: 40,
      viewportWidth: 1200,
      viewportHeight: 800,
    };
    const grown = resizeCameraCardFromBottomRight({ ...start, dx: 40, dy: 30 });
    expect(grown).toEqual({ width: 400, height: 300, left: 80, bottom: 10 });
    const shrunk = resizeCameraCardFromBottomRight({ ...start, dx: -200, dy: -200 });
    expect(shrunk.width).toBe(CAMERA_CARD_MIN_WIDTH);
    expect(shrunk.height).toBe(CAMERA_CARD_MIN_HEIGHT);
    expect(shrunk.left).toBe(80);
    expect(shrunk.bottom).toBe(160);
    const againstViewport = resizeCameraCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(280);
  });
});
