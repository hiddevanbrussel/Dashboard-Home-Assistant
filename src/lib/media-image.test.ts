import { describe, expect, it } from "vitest";
import {
  mediaArtworkCacheKey,
  mediaImageRequestUrl,
  mediaImageServerCacheKey,
} from "./media-image";

describe("mediaArtworkCacheKey", () => {
  it("changes when the title changes even if the picture URL is unchanged", () => {
    const picture = "/api/media_player_proxy/media_player.woonkamer";
    const first = mediaArtworkCacheKey({
      entityPicture: picture,
      mediaTitle: "Track A",
      mediaArtist: "Artist",
    });
    const second = mediaArtworkCacheKey({
      entityPicture: picture,
      mediaTitle: "Track B",
      mediaArtist: "Artist",
    });
    expect(first).not.toBe(second);
  });

  it("stays the same while the same track is playing", () => {
    const key = {
      entityPicture: "/api/media_player_proxy/x",
      mediaTitle: "Track A",
      mediaArtist: "Artist",
      mediaContentId: "spotify:track:1",
    };
    expect(mediaArtworkCacheKey(key)).toBe(mediaArtworkCacheKey(key));
  });
});

describe("mediaImageRequestUrl", () => {
  it("includes entity id and track cache key", () => {
    const url = mediaImageRequestUrl("media_player.woonkamer", "pic|Song|Artist|id");
    expect(url).toContain("entity_id=media_player.woonkamer");
    expect(url).toContain("t=");
  });
});

describe("mediaImageServerCacheKey", () => {
  it("does not reuse artwork across tracks of the same player", () => {
    const entity = "media_player.woonkamer";
    expect(mediaImageServerCacheKey(entity, "a")).not.toBe(mediaImageServerCacheKey(entity, "b"));
  });
});
