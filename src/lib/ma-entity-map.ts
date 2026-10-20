import type { MAPlayer } from "@/stores/music-player-store";

/** Map a Music Assistant player to its Home Assistant entity_id. */
export function resolveEntityId(p: MAPlayer, entityMap: Record<string, string>): string | null {
  const q = p.queue_id;
  const name = (p.display_name as string) ?? "";
  return (
    entityMap[q] ??
    entityMap[q?.toLowerCase?.() ?? ""] ??
    entityMap[name.toLowerCase().replace(/\s+/g, "_")] ??
    null
  );
}

/**
 * Find the MA queue_id for a dashboard media card's HA `media_player.*` entity.
 * Uses the MA↔HA entity map, then a `media_player.mass_<queue>` fallback.
 */
export function resolveQueueIdForEntity(
  entityId: string,
  players: MAPlayer[],
  entityMap: Record<string, string>
): string | null {
  const target = entityId.trim();
  if (!target || players.length === 0) return null;

  for (const p of players) {
    if (resolveEntityId(p, entityMap) === target) return p.queue_id;
  }

  const mass = target.match(/^media_player\.mass_(.+)$/i);
  if (mass) {
    const suffix = mass[1];
    const hit = players.find(
      (p) =>
        p.queue_id === suffix ||
        p.queue_id.toLowerCase() === suffix.toLowerCase() ||
        p.queue_id.toLowerCase().replace(/-/g, "_") === suffix.toLowerCase()
    );
    if (hit) return hit.queue_id;
  }

  for (const [key, mapped] of Object.entries(entityMap)) {
    if (mapped !== target) continue;
    const byQueue = players.find(
      (p) => p.queue_id === key || p.queue_id.toLowerCase() === key.toLowerCase()
    );
    if (byQueue) return byQueue.queue_id;
  }

  return null;
}

/** Keep selection within MA players and optional allow-list. */
export function pickSelectableQueueId(
  queueId: string | null | undefined,
  players: MAPlayer[],
  allowedSpeakerIds: string[] = []
): string | null {
  if (!queueId) return null;
  if (!players.some((p) => p.queue_id === queueId)) return null;
  if (allowedSpeakerIds.length > 0 && !allowedSpeakerIds.includes(queueId)) return null;
  return queueId;
}

/** Fetch queue_id → entity_id map from the app API. */
export async function fetchMaEntityMap(): Promise<Record<string, string>> {
  try {
    const res = await fetch("/api/ha/ma-entity-map");
    if (!res.ok) return {};
    const data = (await res.json()) as unknown;
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    return data as Record<string, string>;
  } catch {
    return {};
  }
}
