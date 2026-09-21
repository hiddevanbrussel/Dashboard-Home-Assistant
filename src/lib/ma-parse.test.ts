import { describe, expect, it } from "vitest";
import { parseMaItemList, parseMaPlaylist, parseMaPlaylistTracks, parseMaRecentItems } from "./ma-parse";
import { maCacheKey, maCommandCacheTtlMs, readMaCache, writeMaCache } from "./ma-cache";

describe("ma parse", () => {
  it("reads items from result.items or typed lists", () => {
    expect(parseMaItemList({ result: { items: [{ name: "A" }] } })).toEqual([{ name: "A" }]);
    expect(parseMaItemList({ result: { albums: [{ name: "B" }] } }, ["albums"])).toEqual([{ name: "B" }]);
    expect(parseMaItemList({ error: "nope", result: { items: [1] } })).toEqual([]);
  });

  it("reads a playlist and playlist tracks", () => {
    expect(parseMaPlaylist({ result: { name: "Hits", uri: "library://playlist/1" } })?.name).toBe("Hits");
    expect(parseMaPlaylistTracks({ result: { items: [{ track: { name: "Song" } }] } })).toEqual([{ name: "Song" }]);
  });

  it("reads recently played lists", () => {
    expect(parseMaRecentItems({ result: { recently_played: [{ name: "X" }] } })).toEqual([{ name: "X" }]);
  });
});

describe("ma cache", () => {
  it("only caches library-style commands", () => {
    expect(maCommandCacheTtlMs("music/albums/library_items")).toBeGreaterThan(0);
    expect(maCommandCacheTtlMs("player_queues/get")).toBeNull();
    expect(maCommandCacheTtlMs("player_queues/play_media")).toBeNull();
  });

  it("expires entries and keeps keys stable", () => {
    const store = new Map();
    const key = maCacheKey("http://ma:8095", "tok", "music/albums/library_items", { limit: 10 });
    expect(maCacheKey("http://ma:8095/", "tok", "music/albums/library_items", { limit: 10 })).toBe(key);
    writeMaCache(store, key, { ok: true }, 1_000, 0);
    expect(readMaCache(store, key, 500)).toEqual({ ok: true });
    expect(readMaCache(store, key, 1_001)).toBeUndefined();
  });
});
