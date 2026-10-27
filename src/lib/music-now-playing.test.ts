import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { clampVolume, describeNowPlaying, nowPlayingFavoriteUri, seekPayload } from "./music-now-playing";

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
    const slider = source("src/components/music-volume-slider.tsx");
    const dock = source("src/components/music-dock-bar.tsx");
    const actions = source("src/hooks/use-music-player-actions.ts");
    expect(slider).toContain("onPointerUp={onPointerUp}");
    expect(slider).toContain("onKeyUp={onCommit}");
    expect(actions).toContain("setVolumeLevel");
    expect(source("src/lib/music-volume-command.ts")).toContain("players/cmd/volume_set");
    expect(dock).not.toContain("player_queues/repeat");
    expect(actions).not.toContain("player_queues/repeat");
    expect(dock).toContain("w-40");
    expect(dock).toContain("shrink-0");
    expect(slider).toContain("h-2");
    expect(slider).toContain("h-6 w-6");
    expect(slider).toContain("h-11");
    expect(slider).toContain("bg-gray-500");
    expect(slider).toContain("dark:bg-white/40");
    expect(dock).toContain("landscape:lg:flex");
    expect(dock).toContain("landscape:lg:hidden");
    expect(dock).toContain('className="hidden landscape:xl:flex"');
    expect(dock).toContain('className="flex landscape:xl:hidden"');
    expect(source("src/lib/music-volume-command.ts")).toContain("players/cmd/group_volume");
    expect(actions).toContain("volumePayloads");
    expect(actions).toContain('"players/all"');
    expect(actions).not.toContain("useState(80)");
    expect(actions).not.toContain("/ 100");
    const panel = dock.slice(dock.indexOf('role="dialog"'));
    expect(panel).not.toContain("volumePending");
    expect(panel).toContain("disabled={!selectedQueueId}");
    expect(dock).toContain("volumeDownRef.current?.focus()");
    expect(dock).toContain("volumeButtonRef.current?.focus()");
    expect(slider).toContain("FOCUS_RING_BRAND");
    expect(slider).toContain("outline-none");
    expect(dock).toContain("FOCUS_RING_BRAND");
    expect(dock).toContain("🔊");
    expect(dock).toContain('aria-label={t("music.volumeDown")}');
    expect(dock).toContain('aria-label={t("music.volumeUp")}');
    expect(dock).toContain("inline-block w-[2ch] text-right");
    expect(dock).toContain("volumePanelText");
    expect(slider).toContain("aria-valuetext={valueText}");
  });

  it("opens now playing from the cover and no longer expands the sheet", () => {
    const dock = source("src/components/music-dock-bar.tsx");
    expect(dock).not.toContain("onExpand");
    expect(dock).not.toContain("Maximize2");
    expect(dock).toContain("MusicNowPlayingOverlay");
    const bar = source("src/components/global-music-bar.tsx");
    expect(bar).not.toContain("onExpand=");
  });

  it("shares the speaker picker and keeps the focus ring on its controls", () => {
    const dock = source("src/components/music-dock-bar.tsx");
    expect(dock).toContain("MusicSpeakerPicker");
    expect(dock).toContain("allowSpeakerSelection");
    const player = source("src/components/music-player-bar-content.tsx");
    expect(player).toContain("MusicSpeakerPicker");
    expect(player).not.toContain("music.switchTo");
    const picker = source("src/components/music-speaker-picker.tsx");
    expect(picker).toContain("FOCUS_RING_BRAND");
    expect(picker).toContain("outline-none");
    expect(picker).toContain("max-w-[120px]");
    expect(picker).not.toContain("max-w-[150px]");
    expect(picker).toContain("bg-green-700 dark:bg-green-400");
    expect(picker).toContain("bg-amber-700 dark:bg-amber-400");
    expect(picker).not.toContain("bg-green-600");
    expect(picker).not.toContain("ring-gray-400");
    expect(picker).toContain("ring-gray-500");
    expect(picker).toContain("bg-[#4700B5]/[0.06]");
    expect(picker).toContain("dark:bg-[#8357be]/20");
    expect(picker).toContain('t("music.groupWith")');
    expect(picker).toContain("speakerRowAriaLabel");
    expect(picker).toContain("aria-label={rowLabel}");
    expect(picker).toContain('status.code !== "off"');
    expect(picker).toContain("buttonRef.current?.focus()");
    expect(picker).toContain('data-speaker-row={selected ? "active" : ""}');
  });

  it("seeks from Now playing with the position in seconds and not from the dock", () => {
    expect(seekPayload("qa-snap-1", 84)).toEqual({
      command: "player_queues/seek",
      args: { queue_id: "qa-snap-1", position: 84 },
    });
    expect(seekPayload("qa-snap-1", Number.NaN).args.position).toBe(0);
    const actions = source("src/hooks/use-music-player-actions.ts");
    const overlay = source("src/components/music-now-playing-overlay.tsx");
    const dock = source("src/components/music-dock-bar.tsx");
    expect(actions).toContain("seekPayload(selectedQueueId, positionSeconds)");
    expect(overlay).toContain('type="range"');
    expect(overlay).toContain("onSeek(Number(e.target.value))");
    expect(overlay).toContain("labels.position");
    expect(overlay).toContain("h-11");
    expect(overlay).toContain("bg-white/40");
    expect(overlay).toContain("peer-focus-visible:ring-2 ring-white ring-offset-2 ring-offset-black/40");
    expect(overlay).not.toContain("bg-white/15");
    expect(dock).toContain("onSeek={seekTo}");
    expect(dock).not.toContain('type="range"');
    expect(dock).not.toContain("player_queues/seek");
  });
});
