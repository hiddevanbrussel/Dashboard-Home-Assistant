import { groupLeaderQueueId, groupMemberIds } from "@/lib/ma-group-leader";
import { resolveEntityId, resolveQueueIdForEntity } from "@/lib/ma-entity-map";
import { clampVolume } from "@/lib/music-now-playing";
import type { MAPlayer } from "@/stores/music-player-store";

type StateLike = {
  attributes?: Record<string, unknown>;
};

export type VolumeRole = "leader" | "member" | "solo";

export type VolumePayload = {
  command: "players/cmd/group_volume" | "players/cmd/volume_set";
  args: { player_id: string; volume_level: number };
};

/**
 * Queue ids that a per-member volume_set would hit.
 * A loose speaker is just itself. A group is every member, without duplicates.
 * A member that cannot be mapped to a queue id is skipped.
 */
export function groupVolumeTargets(
  selectedQueueId: string | null,
  players: MAPlayer[],
  entityMap: Record<string, string>,
  states: Record<string, StateLike>
): string[] {
  if (!selectedQueueId) return [];
  const player = players.find((item) => item.queue_id === selectedQueueId);
  if (!player) return [selectedQueueId];
  const entityId = resolveEntityId(player, entityMap);
  if (!entityId) return [selectedQueueId];

  for (const entity of Object.values(states)) {
    const members = groupMemberIds(entity.attributes);
    if (!members?.includes(entityId)) continue;
    const targets: string[] = [];
    for (const memberId of members) {
      const queueId = resolveQueueIdForEntity(memberId, players, entityMap);
      if (!queueId || targets.includes(queueId)) continue;
      targets.push(queueId);
    }
    return targets.length > 0 ? targets : [selectedQueueId];
  }
  return [selectedQueueId];
}

/** Leader of a real group, a chosen member, or a speaker that is not grouped. */
export function selectedVolumeRole(
  selectedQueueId: string | null,
  players: MAPlayer[],
  entityMap: Record<string, string>,
  states: Record<string, StateLike>
): VolumeRole {
  if (!selectedQueueId) return "solo";
  const targets = groupVolumeTargets(selectedQueueId, players, entityMap, states);
  if (targets.length < 2) return "solo";
  const leader = groupLeaderQueueId(selectedQueueId, players, entityMap, states);
  if (leader && leader !== selectedQueueId) return "member";
  return "leader";
}

/**
 * What the bar sends.
 * A group leader gets `group_volume` on the leader. A loose speaker or a chosen
 * member gets `volume_set` on that speaker. `volume_level` is an integer 0..100.
 */
export function volumePayloads(input: {
  role: VolumeRole;
  selectedQueueId: string | null;
  leaderQueueId: string | null;
  level: number;
}): VolumePayload[] {
  if (!input.selectedQueueId) return [];
  const volume_level = clampVolume(input.level);
  switch (input.role) {
    case "leader":
      return [
        {
          command: "players/cmd/group_volume",
          args: { player_id: input.leaderQueueId ?? input.selectedQueueId, volume_level },
        },
      ];
    case "member":
    case "solo":
      return [
        {
          command: "players/cmd/volume_set",
          args: { player_id: input.selectedQueueId, volume_level },
        },
      ];
    default: {
      const unreachable: never = input.role;
      return unreachable;
    }
  }
}

/** Per-member fallback. Same 0..100 integer as `volume_set` on one speaker. */
export function memberVolumePayloads(targets: string[], level: number): VolumePayload[] {
  const volume_level = clampVolume(level);
  return targets.map((player_id) => ({
    command: "players/cmd/volume_set",
    args: { player_id, volume_level },
  }));
}

export function volumePercent(level: unknown): number | null {
  if (typeof level !== "number" || !Number.isFinite(level)) return null;
  if (level < 0 || level > 100) return null;
  return Math.round(level);
}

export type PlayerVolumeReading = {
  volume: number | null;
  muted: boolean | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function playerRecords(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.filter(isRecord);
  if (!isRecord(data) || data.error) return [];
  if (Array.isArray(data.result)) return data.result.filter(isRecord);
  if (isRecord(data.data)) return [data.data];
  if (data.player_id != null || data.queue_id != null || data.volume_level != null || data.group_volume != null) {
    return [data];
  }
  return [];
}

/**
 * Volume from `players/all` / `players/get` / a player_updated object.
 * Levels are already 0..100. A leader shows `group_volume` when MA sends it.
 * Missing data stays null so the UI can show a dash instead of 80.
 */
export function readPlayersVolume(data: unknown, playerId: string, role: VolumeRole): PlayerVolumeReading {
  const player = playerRecords(data).find((item) => item.player_id === playerId || item.queue_id === playerId);
  if (!player) return { volume: null, muted: null };
  const muted = typeof player.volume_muted === "boolean" ? player.volume_muted : null;
  const own = volumePercent(player.volume_level);
  const group = volumePercent(player.group_volume);
  switch (role) {
    case "leader":
      return { volume: group ?? own, muted };
    case "member":
    case "solo":
      return { volume: own, muted };
    default: {
      const unreachable: never = role;
      return unreachable;
    }
  }
}
