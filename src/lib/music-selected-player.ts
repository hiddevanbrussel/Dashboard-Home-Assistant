import { pickSelectableQueueId } from "@/lib/ma-entity-map";
import type { MAPlayer } from "@/stores/music-player-store";

export const SELECTED_QUEUE_STORAGE_KEY = "dashboard.musicAssistant.selectedQueueId";

export type QueueIdStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export function readStoredQueueId(storage: QueueIdStorage | null | undefined): string | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(SELECTED_QUEUE_STORAGE_KEY);
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

export function writeStoredQueueId(storage: QueueIdStorage | null | undefined, id: string): void {
  if (!storage) return;
  try {
    storage.setItem(SELECTED_QUEUE_STORAGE_KEY, id);
  } catch {
    // Storage can throw in private mode. The in-memory choice still applies.
  }
}

/**
 * A valid stored queue id wins. Otherwise the first allowed player, then
 * `players[0]`. An empty player list is null.
 */
export function resolveInitialQueueId(
  stored: string | null,
  players: MAPlayer[],
  allowed: string[]
): string | null {
  const picked = pickSelectableQueueId(stored, players, allowed);
  if (picked) return picked;
  if (allowed.length > 0) {
    const firstAllowed = players.find((player) => allowed.includes(player.queue_id));
    if (firstAllowed) return firstAllowed.queue_id;
  }
  return players[0]?.queue_id ?? null;
}
