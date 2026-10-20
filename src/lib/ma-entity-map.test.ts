import { describe, expect, it } from "vitest";
import {
  pickSelectableQueueId,
  resolveEntityId,
  resolveQueueIdForEntity,
} from "./ma-entity-map";
import type { MAPlayer } from "@/stores/music-player-store";

const living: MAPlayer = { queue_id: "RINCON_AA", display_name: "Living Room" };
const kitchen: MAPlayer = { queue_id: "kitchen", display_name: "Kitchen" };

describe("ma-entity-map", () => {
  it("resolves entity_id from queue_id and display name keys", () => {
    const map = {
      RINCON_AA: "media_player.mass_rincon_aa",
      living_room: "media_player.mass_rincon_aa",
    };
    expect(resolveEntityId(living, map)).toBe("media_player.mass_rincon_aa");
  });

  it("maps a media card entity back to its queue_id", () => {
    const map = {
      RINCON_AA: "media_player.mass_rincon_aa",
      kitchen: "media_player.mass_kitchen",
    };
    expect(resolveQueueIdForEntity("media_player.mass_kitchen", [living, kitchen], map)).toBe(
      "kitchen"
    );
    expect(resolveQueueIdForEntity("media_player.mass_rincon_aa", [living, kitchen], map)).toBe(
      "RINCON_AA"
    );
  });

  it("falls back to media_player.mass_<queue> when map misses", () => {
    expect(resolveQueueIdForEntity("media_player.mass_kitchen", [living, kitchen], {})).toBe(
      "kitchen"
    );
    expect(resolveQueueIdForEntity("media_player.mass_RINCON_AA", [living, kitchen], {})).toBe(
      "RINCON_AA"
    );
  });

  it("respects the allowed-speaker list when picking a queue", () => {
    expect(pickSelectableQueueId("kitchen", [living, kitchen], [])).toBe("kitchen");
    expect(pickSelectableQueueId("kitchen", [living, kitchen], ["RINCON_AA"])).toBeNull();
    expect(pickSelectableQueueId("RINCON_AA", [living, kitchen], ["RINCON_AA"])).toBe("RINCON_AA");
    expect(pickSelectableQueueId("missing", [living, kitchen], [])).toBeNull();
  });
});
