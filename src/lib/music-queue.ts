/**
 * Music Assistant queue read and the two delayed edits.
 *
 * Names checked against music-assistant/server `music_assistant/controllers/player_queues.py`
 * (dev, PlayerQueuesController):
 * - player_queues/items(queue_id: str, limit: int = 500, offset: int = 0)
 * - player_queues/delete_item(queue_id: str, item_id_or_index: int | str)
 * - player_queues/clear(queue_id: str, skip_stop: bool = False)
 *
 * Clear is sent with only `queue_id`, so the server default stops playback and
 * empties the queue. The UI waits UNDO_TOAST_DURATION_MS before any of these
 * writes. Undo drops the pending write. A later remove/clear, or closing the
 * panel, sends the previous write immediately.
 */

import {
  MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND,
  MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND,
  MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND,
} from "@/lib/music-assistant-commands";
import { parseMaItemList } from "@/lib/ma-parse";

export const MUSIC_QUEUE_ITEMS_LIMIT = 500;
export const MUSIC_QUEUE_ITEMS_OFFSET = 0;

export type MusicQueueMutation =
  | { kind: "delete"; queueId: string; itemId: string }
  | { kind: "clear"; queueId: string };

export type MusicQueueCommandRequest = {
  command: typeof MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND | typeof MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND;
  args: { queue_id: string; item_id_or_index?: string };
};

export function musicQueueItemsArgs(queueId: string): { queue_id: string; limit: number; offset: number } {
  return { queue_id: queueId, limit: MUSIC_QUEUE_ITEMS_LIMIT, offset: MUSIC_QUEUE_ITEMS_OFFSET };
}

export function musicQueueMutationRequest(mutation: MusicQueueMutation): MusicQueueCommandRequest {
  switch (mutation.kind) {
    case "delete":
      return {
        command: MUSIC_ASSISTANT_QUEUE_DELETE_ITEM_COMMAND,
        args: { queue_id: mutation.queueId, item_id_or_index: mutation.itemId },
      };
    case "clear":
      return {
        command: MUSIC_ASSISTANT_QUEUE_CLEAR_COMMAND,
        args: { queue_id: mutation.queueId },
      };
    default: {
      const unreachable: never = mutation;
      return unreachable;
    }
  }
}

export type MusicQueueRow = {
  id: string;
  name: string;
  artist: string;
  duration: number;
  imageUrl: string | null;
  mediaItem: Record<string, unknown> | null;
};

function artistNames(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (!entry || typeof entry !== "object") return "";
        const name = (entry as { name?: unknown }).name;
        return typeof name === "string" ? name.trim() : "";
      })
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
  }
  if (value && typeof value === "object") {
    const name = (value as { name?: unknown }).name;
    return typeof name === "string" ? name.trim() : "";
  }
  return "";
}

function durationSeconds(record: Record<string, unknown>, media: Record<string, unknown> | null): number {
  const raw = record.duration ?? media?.duration;
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? raw : 0;
}

function imageUrl(record: Record<string, unknown>, media: Record<string, unknown> | null): string | null {
  const candidates = [record.image, media?.image, media?.image_url];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
    if (candidate && typeof candidate === "object") {
      const url = (candidate as { url?: unknown; path?: unknown }).url ?? (candidate as { path?: unknown }).path;
      if (typeof url === "string" && url.trim()) return url.trim();
    }
  }
  return null;
}

export function parseMusicQueueItems(data: unknown): MusicQueueRow[] {
  const rows: MusicQueueRow[] = [];
  for (const entry of parseMaItemList(data)) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const id = record.queue_item_id;
    if (typeof id !== "string" || !id) continue;
    const media =
      record.media_item && typeof record.media_item === "object" && !Array.isArray(record.media_item)
        ? (record.media_item as Record<string, unknown>)
        : null;
    const nameRaw = record.name ?? media?.name;
    const name = typeof nameRaw === "string" ? nameRaw : "";
    rows.push({
      id,
      name,
      artist: artistNames(media?.artists ?? record.artists),
      duration: durationSeconds(record, media),
      imageUrl: imageUrl(record, media),
      mediaItem: media,
    });
  }
  return rows;
}

type PendingQueueMutation = { mutation: MusicQueueMutation; dueAt: number };

/**
 * Holds at most one queue write. Nothing is returned as "due" before the window.
 * `schedule` of a second write returns the first so the caller can send it now.
 */
export function createMusicQueueUndo(durationMs: number) {
  let pending: PendingQueueMutation | null = null;

  return {
    peek(): MusicQueueMutation | null {
      return pending?.mutation ?? null;
    },
    schedule(next: MusicQueueMutation, now: number): MusicQueueMutation | null {
      const previous = pending?.mutation ?? null;
      pending = { mutation: next, dueAt: now + durationMs };
      return previous;
    },
    undo(): void {
      pending = null;
    },
    remainingMs(now: number): number | null {
      if (!pending) return null;
      return Math.max(0, pending.dueAt - now);
    },
    takeDue(now: number): MusicQueueMutation | null {
      if (!pending || now < pending.dueAt) return null;
      const mutation = pending.mutation;
      pending = null;
      return mutation;
    },
    flush(): MusicQueueMutation | null {
      const mutation = pending?.mutation ?? null;
      pending = null;
      return mutation;
    },
  };
}

export const MUSIC_QUEUE_READ_COMMAND = MUSIC_ASSISTANT_QUEUE_ITEMS_COMMAND;
