import { describe, expect, it } from "vitest";
import { isPlayingMediaPlayerState, selectPlayingMediaPlayers } from "./media-player-state";

describe("playing media player state", () => {
  it("only treats playing as now-playing", () => {
    expect(isPlayingMediaPlayerState("playing")).toBe(true);
    expect(isPlayingMediaPlayerState("paused")).toBe(false);
    expect(isPlayingMediaPlayerState("idle")).toBe(false);
    expect(isPlayingMediaPlayerState("off")).toBe(false);
    expect(isPlayingMediaPlayerState(undefined)).toBe(false);
  });

  it("keeps only media players that are playing", () => {
    const entities = [
      { entity_id: "media_player.woonkamer", state: "paused" },
      { entity_id: "media_player.keuken", state: "playing" },
      { entity_id: "light.keuken", state: "playing" },
      { entity_id: "media_player.slaapkamer", state: "idle" },
    ];
    expect(selectPlayingMediaPlayers(entities).map((entity) => entity.entity_id)).toEqual([
      "media_player.keuken",
    ]);
  });
});
