import { describe, expect, it } from "vitest";
import { countHaMediaPlayers, showMusicNavigation } from "@/lib/music-nav";

describe("music navigation", () => {
  it("shows Muziek when Music Assistant is on, or when HA has media players", () => {
    expect(showMusicNavigation({ musicAssistantEnabled: true, mediaPlayerCount: 0 })).toBe(true);
    expect(showMusicNavigation({ musicAssistantEnabled: false, mediaPlayerCount: 2 })).toBe(true);
    expect(showMusicNavigation({ musicAssistantEnabled: false, mediaPlayerCount: 0 })).toBe(false);
  });

  it("counts only media_player entities", () => {
    expect(
      countHaMediaPlayers([
        { entity_id: "media_player.woonkamer" },
        { entity_id: "light.keuken" },
        { entity_id: "media_player.keuken" },
        { entity_id: "" },
        null,
      ])
    ).toBe(2);
    expect(countHaMediaPlayers({ entity_id: "media_player.woonkamer" })).toBe(0);
    expect(countHaMediaPlayers(null)).toBe(0);
  });
});
