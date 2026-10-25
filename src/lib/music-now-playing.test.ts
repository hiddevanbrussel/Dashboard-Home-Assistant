import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { clampVolume, describeNowPlaying, nowPlayingFavoriteUri } from "./music-now-playing";

describe("describeNowPlaying", () => {
  it("uses the track name and all artists", () => {
    expect(
      describeNowPlaying({ name: "Golden", artists: [{ name: "Harry Styles" }, { name: "Bottom Two" }] })
    ).toEqual({ title: "Golden", artist: "Harry Styles, Bottom Two" });
  });

  it("reads a single artist object and a plain artist string", () => {
    expect(describeNowPlaying({ name: "Aye", artists: { name: "Sam Fender" } }).artist).toBe("Sam Fender");
    expect(describeNowPlaying({ name: "Aye", artist: " Sam Fender " }).artist).toBe("Sam Fender");
  });

  it("radio: the stream title is the song and the station becomes the second line", () => {
    expect(describeNowPlaying({ name: "NPO Radio 2", stream_title: "Bente - Golven" })).toEqual({
      title: "Bente - Golven",
      artist: "NPO Radio 2",
    });
  });

  it("splits 'Artist - Title' when Music Assistant gives no artist", () => {
    expect(describeNowPlaying({ name: "Harry Styles - Golden" })).toEqual({ title: "Golden", artist: "Harry Styles" });
    expect(describeNowPlaying({ name: "Intro" })).toEqual({ title: "Intro", artist: "" });
  });

  it("Home Assistant only fills lines Music Assistant leaves empty", () => {
    expect(describeNowPlaying({ name: "Golden", artists: [{ name: "Harry Styles" }] }, { title: "Other", artist: "HA" })).toEqual({
      title: "Golden",
      artist: "Harry Styles",
    });
    expect(describeNowPlaying(undefined, { title: " Golden ", artist: "Harry Styles" })).toEqual({
      title: "Golden",
      artist: "Harry Styles",
    });
    expect(describeNowPlaying(null)).toEqual({ title: "", artist: "" });
  });
});

describe("nowPlayingFavoriteUri", () => {
  it("prefers the media item's uri", () => {
    expect(nowPlayingFavoriteUri({ uri: "queue://x", media_item: { uri: "library://track/12" } })).toBe("library://track/12");
    expect(nowPlayingFavoriteUri({ uri: "library://radio/3" })).toBe("library://radio/3");
    expect(nowPlayingFavoriteUri({ name: "No uri" })).toBeNull();
    expect(nowPlayingFavoriteUri(undefined)).toBeNull();
  });
});

describe("clampVolume", () => {
  it("keeps the slider value between 0 and 100 in whole steps", () => {
    expect(clampVolume(42.6)).toBe(43);
    expect(clampVolume(-5)).toBe(0);
    expect(clampVolume(140)).toBe(100);
    expect(clampVolume(Number.NaN)).toBe(0);
  });
});

describe("music page player bar", () => {
  const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

  it("docks the full bar on /music instead of the old chip", () => {
    const bar = source("src/components/global-music-bar.tsx");
    expect(bar).toContain("<MusicDockBar");
    expect(bar).not.toContain("musicPageChip");
  });

  it("sends the volume once on release, through the allowed volume_set command", () => {
    const dock = source("src/components/music-dock-bar.tsx");
    expect(dock).toContain("onPointerUp={commitVolume}");
    expect(dock).toContain("onKeyUp={commitVolume}");
    expect(dock).toContain("setVolumeLevel(next)");
    expect(dock).not.toContain("player_queues/repeat");
  });
});
