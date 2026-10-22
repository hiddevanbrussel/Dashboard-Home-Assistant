import { describe, expect, it } from "vitest";
import { MUSIC_ASSISTANT_PLAYER_VOLUME_COMMAND } from "./music-assistant-commands";
import { readPreloadedPlayerVolume } from "./player-volume";

describe("player volume preload", () => {
  it("reads the wrapped config/players/get payload the player bar stores", () => {
    expect(MUSIC_ASSISTANT_PLAYER_VOLUME_COMMAND).toBe("config/players/get");
    expect(
      readPreloadedPlayerVolume({
        result: { player_id: "queue-1", volume_level: 0.42, volume_muted: true },
      })
    ).toEqual({ volume: 42, muted: true });
  });

  it("reads a flat player payload and the 0 and 1 endpoints", () => {
    expect(readPreloadedPlayerVolume({ volume_level: 0, volume_muted: false })).toEqual({
      volume: 0,
      muted: false,
    });
    expect(readPreloadedPlayerVolume({ volume_level: 1, volume_muted: false })).toEqual({
      volume: 100,
      muted: false,
    });
  });

  it("ignores a proxy rejection and a level outside 0..1", () => {
    expect(readPreloadedPlayerVolume({ error: "Command not allowed" })).toEqual({
      volume: null,
      muted: null,
    });
    expect(readPreloadedPlayerVolume({ result: { volume_level: 80, volume_muted: false } })).toEqual({
      volume: null,
      muted: false,
    });
  });
});
