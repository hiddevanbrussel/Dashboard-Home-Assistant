import { describe, expect, it } from "vitest";
import {
  clampMediaCardHeight,
  clampMediaCardWidth,
  MEDIA_CARD_DEFAULT_HEIGHT,
  MEDIA_CARD_DEFAULT_WIDTH,
  MEDIA_CARD_MIN_HEIGHT,
  MEDIA_CARD_MIN_WIDTH,
  resizeMediaCardFromBottomRight,
  resolveMediaCardPlayerName,
} from "./media-card";

describe("resolveMediaCardPlayerName", () => {
  it("prefers a custom widget title over the friendly name", () => {
    expect(
      resolveMediaCardPlayerName({
        title: "Woonkamer",
        friendlyName: "Sonos Beam",
        entityId: "media_player.woonkamer",
      })
    ).toBe("Woonkamer");
  });

  it("falls back to friendly name when the title is a generic media default", () => {
    expect(
      resolveMediaCardPlayerName({
        title: "Media",
        friendlyName: "Keuken speaker",
        entityId: "media_player.keuken",
        fallback: "Media",
      })
    ).toBe("Keuken speaker");
    expect(
      resolveMediaCardPlayerName({
        title: "media card",
        friendlyName: "Nest Hub",
        entityId: "media_player.nest",
      })
    ).toBe("Nest Hub");
  });

  it("falls back to entity id when no friendly name is available", () => {
    expect(
      resolveMediaCardPlayerName({
        title: "",
        friendlyName: "",
        entityId: "media_player.office",
        fallback: "Media",
      })
    ).toBe("media_player.office");
  });
});

describe("media-card helpers", () => {
  it("clamps width and height onto the media card", () => {
    expect(clampMediaCardWidth(undefined)).toBe(MEDIA_CARD_DEFAULT_WIDTH);
    expect(clampMediaCardWidth("nope")).toBe(MEDIA_CARD_DEFAULT_WIDTH);
    expect(clampMediaCardWidth(180)).toBe(MEDIA_CARD_MIN_WIDTH);
    expect(clampMediaCardWidth(900)).toBe(500);
    expect(clampMediaCardWidth(360)).toBe(360);
    expect(clampMediaCardHeight(undefined)).toBe(MEDIA_CARD_DEFAULT_HEIGHT);
    expect(clampMediaCardHeight(180)).toBe(MEDIA_CARD_MIN_HEIGHT);
    expect(clampMediaCardHeight(900)).toBe(520);
    expect(clampMediaCardHeight(400)).toBe(400);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 280,
      startHeight: 340,
      startLeft: 80,
      startBottom: 40,
      viewportWidth: 1200,
      viewportHeight: 800,
    };
    const grown = resizeMediaCardFromBottomRight({ ...start, dx: 40, dy: 30 });
    expect(grown).toEqual({ width: 320, height: 370, left: 80, bottom: 10 });
    const shrunk = resizeMediaCardFromBottomRight({ ...start, dx: -80, dy: -120 });
    expect(shrunk.width).toBe(MEDIA_CARD_MIN_WIDTH);
    expect(shrunk.height).toBe(MEDIA_CARD_MIN_HEIGHT);
    expect(shrunk.left).toBe(80);
    expect(shrunk.bottom).toBe(140);
    const againstViewport = resizeMediaCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(350);
  });
});
