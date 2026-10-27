import { describe, expect, it } from "vitest";
import type { MAPlayer } from "@/stores/music-player-store";
import {
  groupVolumeTargets,
  memberVolumePayloads,
  readPlayersVolume,
  selectedVolumeRole,
  volumePayloads,
  volumePercent,
} from "./music-volume-command";

const living: MAPlayer = { queue_id: "living", display_name: "Living room" };
const kitchen: MAPlayer = { queue_id: "kitchen", display_name: "Kitchen" };
const porch: MAPlayer = { queue_id: "porch", display_name: "Porch" };
const map = {
  living: "media_player.living",
  kitchen: "media_player.kitchen",
  porch: "media_player.porch",
};
const grouped = {
  "media_player.group": {
    attributes: {
      group_members: ["media_player.living", "media_player.kitchen", "media_player.unmapped", "media_player.kitchen"],
    },
  },
};

describe("group volume targets", () => {
  it("returns the speaker itself when it is not in a group", () => {
    expect(groupVolumeTargets("porch", [living, kitchen, porch], map, {})).toEqual(["porch"]);
    expect(groupVolumeTargets(null, [porch], map, {})).toEqual([]);
  });

  it("returns every mapped member once and skips a member without a queue id", () => {
    expect(groupVolumeTargets("kitchen", [living, kitchen, porch], map, grouped)).toEqual(["living", "kitchen"]);
    expect(groupVolumeTargets("living", [living, kitchen, porch], map, grouped)).toEqual(["living", "kitchen"]);
  });
});

describe("volume payloads", () => {
  it("sends group_volume 0..100 to the leader and volume_set to a chosen member or a loose speaker", () => {
    expect(selectedVolumeRole("living", [living, kitchen], map, grouped)).toBe("leader");
    expect(selectedVolumeRole("kitchen", [living, kitchen], map, grouped)).toBe("member");
    expect(selectedVolumeRole("porch", [living, kitchen, porch], map, grouped)).toBe("solo");

    expect(
      volumePayloads({ role: "leader", selectedQueueId: "living", leaderQueueId: "living", level: 32.6 })
    ).toEqual([
      { command: "players/cmd/group_volume", args: { player_id: "living", volume_level: 33 } },
    ]);
    expect(
      volumePayloads({ role: "member", selectedQueueId: "kitchen", leaderQueueId: "living", level: 32 })
    ).toEqual([
      { command: "players/cmd/volume_set", args: { player_id: "kitchen", volume_level: 32 } },
    ]);
    expect(
      volumePayloads({ role: "solo", selectedQueueId: "porch", leaderQueueId: "porch", level: 42 })
    ).toEqual([{ command: "players/cmd/volume_set", args: { player_id: "porch", volume_level: 42 } }]);
    expect(volumePayloads({ role: "solo", selectedQueueId: null, leaderQueueId: null, level: 10 })).toEqual([]);
  });

  it("keeps the per-member fallback on the 0..100 integer scale", () => {
    expect(memberVolumePayloads(["living", "kitchen"], 32.2)).toEqual([
      { command: "players/cmd/volume_set", args: { player_id: "living", volume_level: 32 } },
      { command: "players/cmd/volume_set", args: { player_id: "kitchen", volume_level: 32 } },
    ]);
    expect(memberVolumePayloads(["porch"], Number.NaN)[0]?.args.volume_level).toBe(0);
  });
});

describe("player state volume", () => {
  const players = {
    result: [
      { player_id: "living", volume_level: 20, group_volume: 44, volume_muted: false },
      { player_id: "kitchen", volume_level: 18, group_volume: 44, volume_muted: true },
    ],
  };

  it("reads 0..100 from players/all and does not invent 80", () => {
    expect(volumePercent(80)).toBe(80);
    expect(volumePercent(0)).toBe(0);
    expect(volumePercent(100)).toBe(100);
    expect(volumePercent(0.42)).toBe(0);
    expect(volumePercent(Number.NaN)).toBeNull();
    expect(readPlayersVolume(players, "living", "leader")).toEqual({ volume: 44, muted: false });
    expect(readPlayersVolume(players, "kitchen", "member")).toEqual({ volume: 18, muted: true });
    expect(readPlayersVolume(players, "porch", "solo")).toEqual({ volume: null, muted: null });
    expect(readPlayersVolume({ error: "nope", result: players.result }, "living", "leader")).toEqual({
      volume: null,
      muted: null,
    });
    expect(readPlayersVolume({ volume_level: 55, volume_muted: false, player_id: "porch" }, "porch", "solo")).toEqual({
      volume: 55,
      muted: false,
    });
    expect(
      readPlayersVolume({ event: "player_updated", data: { player_id: "porch", volume_level: 61 } }, "porch", "solo")
    ).toEqual({ volume: 61, muted: null });
  });

  it("uses group_volume only for the leader and falls back to volume_level when the group level is absent", () => {
    expect(
      readPlayersVolume({ result: [{ player_id: "living", volume_level: 27, volume_muted: false }] }, "living", "leader")
    ).toEqual({ volume: 27, muted: false });
    expect(
      readPlayersVolume({ result: [{ player_id: "living", volume_level: 27, group_volume: 0 }] }, "living", "leader")
    ).toEqual({ volume: 0, muted: null });
  });
});
