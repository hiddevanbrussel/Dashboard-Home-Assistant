import { describe, expect, it } from "vitest";
import type { MAPlayer } from "@/stores/music-player-store";
import { groupLeaderQueueId } from "./ma-group-leader";

const living: MAPlayer = { queue_id: "living", display_name: "Living room" };
const kitchen: MAPlayer = { queue_id: "kitchen", display_name: "Kitchen" };
const map = {
  living: "media_player.living",
  kitchen: "media_player.kitchen",
};
const grouped = {
  "media_player.living": {
    attributes: {
      group_members: ["media_player.living", "media_player.kitchen"],
    },
  },
};

describe("groupLeaderQueueId", () => {
  it("returns the leader for a group member", () => {
    expect(groupLeaderQueueId("kitchen", [living, kitchen], map, grouped)).toBe("living");
  });

  it("returns the player itself when it is the leader or not in a group", () => {
    expect(groupLeaderQueueId("living", [living, kitchen], map, grouped)).toBe("living");
    expect(groupLeaderQueueId("kitchen", [living, kitchen], map, {})).toBe("kitchen");
  });

  it("returns the player itself when there is no entity map", () => {
    expect(groupLeaderQueueId("kitchen", [living, kitchen], {}, grouped)).toBe("kitchen");
  });
});
