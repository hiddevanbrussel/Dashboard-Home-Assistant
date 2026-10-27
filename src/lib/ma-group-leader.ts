import { resolveEntityId, resolveQueueIdForEntity } from "@/lib/ma-entity-map";
import type { MAPlayer } from "@/stores/music-player-store";

type StateLike = {
  attributes?: Record<string, unknown>;
};

/** `attributes.group_members` when every entry is a non-empty entity id. */
export function groupMemberIds(attributes: Record<string, unknown> | undefined): string[] | null {
  const raw = attributes?.group_members;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  if (!raw.every((id) => typeof id === "string" && id.length > 0)) return null;
  return raw;
}

/**
 * Queue id that should receive group volume.
 * Leader is `group_members[0]` of the Home Assistant entity that contains the
 * selected player. Without a group or a map, the selected queue id is returned.
 */
export function groupLeaderQueueId(
  selectedQueueId: string | null,
  players: MAPlayer[],
  entityMap: Record<string, string>,
  states: Record<string, StateLike>
): string | null {
  if (!selectedQueueId) return null;
  const player = players.find((item) => item.queue_id === selectedQueueId);
  if (!player) return selectedQueueId;
  const entityId = resolveEntityId(player, entityMap);
  if (!entityId) return selectedQueueId;

  for (const entity of Object.values(states)) {
    const members = groupMemberIds(entity.attributes);
    if (!members?.includes(entityId)) continue;
    const leaderId = members[0];
    return resolveQueueIdForEntity(leaderId, players, entityMap) ?? selectedQueueId;
  }
  return selectedQueueId;
}
