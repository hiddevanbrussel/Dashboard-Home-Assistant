import { describe, expect, it } from "vitest";
import {
  isActiveMediaPlayerState,
  isScreensaverMusicOff,
  pickScreensaverMusicPlayer,
  SCREENSAVER_MUSIC_OFF,
  screensaverMusicFromHaEntity,
  shouldShowScreensaverMusic,
} from "./screensaver-music";

const woonkamer = {
  entity_id: "media_player.woonkamer",
  state: "playing",
  attributes: {
    media_title: "Song",
    media_artist: "Artist",
    entity_picture: "/api/media_player_proxy/woonkamer",
    media_content_id: "id-1",
  },
};
const keuken = { entity_id: "media_player.keuken", state: "paused", attributes: {} };
const idle = { entity_id: "media_player.slaapkamer", state: "idle", attributes: {} };

describe("screensaver music source", () => {
  it("treats playing and paused as active", () => {
    expect(isActiveMediaPlayerState("playing")).toBe(true);
    expect(isActiveMediaPlayerState("paused")).toBe(true);
    expect(isActiveMediaPlayerState("idle")).toBe(false);
  });

  it("picks the first active player when no source is set", () => {
    expect(pickScreensaverMusicPlayer([idle, keuken, woonkamer], null)?.entity_id).toBe(
      "media_player.keuken"
    );
  });

  it("only uses the chosen speaker when that one is active", () => {
    expect(pickScreensaverMusicPlayer([woonkamer, keuken], "media_player.keuken")?.entity_id).toBe(
      "media_player.keuken"
    );
    expect(pickScreensaverMusicPlayer([woonkamer, idle], "media_player.slaapkamer")).toBeNull();
  });

  it("hides music when the source is off", () => {
    expect(isScreensaverMusicOff(SCREENSAVER_MUSIC_OFF)).toBe(true);
    expect(pickScreensaverMusicPlayer([woonkamer], SCREENSAVER_MUSIC_OFF)).toBeNull();
    expect(
      shouldShowScreensaverMusic({
        preferredEntityId: SCREENSAVER_MUSIC_OFF,
        preferredPlayerActive: true,
        musicAssistantPlaying: true,
      })
    ).toBe(false);
  });

  it("uses Music Assistant only when no speaker is pinned", () => {
    expect(
      shouldShowScreensaverMusic({
        preferredEntityId: null,
        preferredPlayerActive: false,
        musicAssistantPlaying: true,
      })
    ).toBe(true);
    expect(
      shouldShowScreensaverMusic({
        preferredEntityId: "media_player.woonkamer",
        preferredPlayerActive: false,
        musicAssistantPlaying: true,
      })
    ).toBe(false);
  });

  it("reads title, artist and artwork from the Home Assistant player", () => {
    const lines = screensaverMusicFromHaEntity(woonkamer);
    expect(lines.title).toBe("Song");
    expect(lines.artist).toBe("Artist");
    expect(lines.coverUrl).toContain("entity_id=media_player.woonkamer");
  });
});
