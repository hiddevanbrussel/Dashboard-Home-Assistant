import { describe, expect, it } from "vitest";
import { activeLyricIndex, extractTrackLyrics, parseLrcLine, parseLyricsText } from "./lrc-lyrics";

describe("lrc lyrics", () => {
  it("parses an LRC timestamp line", () => {
    expect(parseLrcLine("[01:02.50] Hello world")).toEqual({ time: 62.5, text: "Hello world" });
  });

  it("parses synced lyrics and finds the active line", () => {
    const lines = parseLyricsText("[00:01.00] One\n[00:05.00] Two\n[00:09.00] Three");
    expect(lines).toHaveLength(3);
    expect(activeLyricIndex(lines, 0)).toBe(-1);
    expect(activeLyricIndex(lines, 1.2)).toBe(0);
    expect(activeLyricIndex(lines, 5)).toBe(1);
    expect(activeLyricIndex(lines, 20)).toBe(2);
  });

  it("keeps plain lyrics without timestamps", () => {
    const lines = parseLyricsText("Verse one\n\nChorus");
    expect(lines.map((l) => l.text)).toEqual(["Verse one", "Chorus"]);
    expect(lines.every((l) => l.time == null)).toBe(true);
  });

  it("reads lyrics from track metadata", () => {
    expect(
      extractTrackLyrics({
        metadata: { lyrics: "plain", lrc_lyrics: "[00:01.00] synced" },
      })
    ).toEqual({ plain: "plain", lrc: "[00:01.00] synced" });
  });
});
