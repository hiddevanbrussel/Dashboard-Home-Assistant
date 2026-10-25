import { describe, expect, it } from "vitest";
import { UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
import {
  MUSIC_ASSISTANT_ALLOWED_COMMANDS,
  MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND,
  MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND,
  MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND,
} from "@/lib/music-assistant-commands";
import {
  MUSIC_QUEUE_READ_COMMAND,
  createMusicQueueUndo,
  musicQueueItemsArgs,
  musicQueueMutationRequest,
  parseMusicQueueItems,
} from "@/lib/music-queue";

const QUEUE = "woonkamer";

describe("music queue commands", () => {
  it("uses the three exact allowlist strings and their argument names", () => {
    expect(MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND).toBe("player_queues/items");
    expect(MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND).toBe("player_queues/delete_item");
    expect(MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND).toBe("player_queues/clear");
    expect(MUSIC_QUEUE_READ_COMMAND).toBe("player_queues/items");
    for (const command of [
      MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND,
      MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND,
      MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND,
    ]) {
      expect(MUSIC_ASSISTANT_ALLOWED_COMMANDS).toContain(command);
    }
    expect(MUSIC_ASSISTANT_ALLOWED_COMMANDS).not.toContain("player_queues/move_item");
    expect(MUSIC_ASSISTANT_ALLOWED_COMMANDS).not.toContain("player_queues/repeat");
    expect(MUSIC_ASSISTANT_ALLOWED_COMMANDS).not.toContain("player_queues/items_x");
    expect(MUSIC_ASSISTANT_ALLOWED_COMMANDS).not.toContain("player_queues/clear/extra");

    expect(musicQueueItemsArgs(QUEUE)).toEqual({ queue_id: QUEUE, limit: 500, offset: 0 });
    expect(
      musicQueueMutationRequest({ kind: "delete", queueId: QUEUE, itemId: "item-2" })
    ).toEqual({
      command: "player_queues/delete_item",
      args: { queue_id: QUEUE, item_id_or_index: "item-2" },
    });
    expect(musicQueueMutationRequest({ kind: "clear", queueId: QUEUE })).toEqual({
      command: "player_queues/clear",
      args: { queue_id: QUEUE },
    });
  });

  it("parses a Music Assistant items payload", () => {
    const rows = parseMusicQueueItems({
      result: [
        {
          queue_item_id: "now",
          name: "Licht in de keuken",
          duration: 150,
          media_item: { name: "Licht in de keuken", artists: [{ name: "Noorderlicht" }] },
        },
        { queue_item_id: "next", name: "Golven tellen", media_item: { duration: 187, artists: [{ name: "Mira Velde" }] } },
        { name: "missing id" },
      ],
    });
    expect(rows.map((row) => row.id)).toEqual(["now", "next"]);
    expect(rows[0]).toMatchObject({ name: "Licht in de keuken", artist: "Noorderlicht", duration: 150 });
    expect(rows[1]).toMatchObject({ name: "Golven tellen", artist: "Mira Velde", duration: 187 });
    expect(parseMusicQueueItems({ error: "Command not allowed" })).toEqual([]);
  });
});

describe("music queue undo", () => {
  const remove = { kind: "delete" as const, queueId: QUEUE, itemId: "a" };
  const clear = { kind: "clear" as const, queueId: QUEUE };

  it("sends nothing until the undo window has elapsed", () => {
    const undo = createMusicQueueUndo(UNDO_TOAST_DURATION_MS);
    expect(UNDO_TOAST_DURATION_MS).toBe(5000);
    expect(undo.schedule(remove, 1_000)).toBeNull();
    expect(undo.takeDue(1_000 + UNDO_TOAST_DURATION_MS - 1)).toBeNull();
    expect(undo.peek()).toEqual(remove);
    expect(undo.takeDue(1_000 + UNDO_TOAST_DURATION_MS)).toEqual(remove);
    expect(undo.peek()).toBeNull();
    expect(undo.flush()).toBeNull();
  });

  it("drops the write when the user undoes", () => {
    const undo = createMusicQueueUndo(UNDO_TOAST_DURATION_MS);
    undo.schedule(clear, 0);
    undo.undo();
    expect(undo.takeDue(UNDO_TOAST_DURATION_MS)).toBeNull();
    expect(undo.flush()).toBeNull();
  });

  it("sends the previous write immediately when the next action starts", () => {
    const undo = createMusicQueueUndo(UNDO_TOAST_DURATION_MS);
    undo.schedule(remove, 0);
    expect(undo.schedule(clear, 1_000)).toEqual(remove);
    expect(undo.takeDue(1_000 + UNDO_TOAST_DURATION_MS - 1)).toBeNull();
    expect(undo.takeDue(1_000 + UNDO_TOAST_DURATION_MS)).toEqual(clear);
  });

  it("sends a waiting write when the panel closes", () => {
    const undo = createMusicQueueUndo(UNDO_TOAST_DURATION_MS);
    undo.schedule(remove, 0);
    expect(undo.remainingMs(1_500)).toBe(UNDO_TOAST_DURATION_MS - 1_500);
    expect(undo.flush()).toEqual(remove);
    expect(undo.flush()).toBeNull();
  });
});
