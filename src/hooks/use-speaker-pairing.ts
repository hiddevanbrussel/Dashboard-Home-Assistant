"use client";

import { useState, useCallback, useEffect } from "react";
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
 * Shared hook for speaker join/unjoin logic.
 * Fetches entity map and group members from Home Assistant when `enabled` is true.
 */
export function useSpeakerPairing({ enabled }: { enabled: boolean }) {
  const [entityMap, setEntityMap] = useState<Record<string, string>>({});
  const [groupMembers, setGroupMembers] = useState<Set<string>>(new Set());
  const [joinUnjoinPending, setJoinUnjoinPending] = useState(false);

  const refresh = useCallback(() => {
    fetch("/api/ha/ma-entity-map")
      .then((r) => (r.ok ? r.json() : {}))
      .then((map: Record<string, string>) => setEntityMap(map))
      .catch(() => setEntityMap({}));

    fetch("/api/ha/entities")
      .then((r) => (r.ok ? r.json() : []))
      .then((entities: { entity_id?: string; attributes?: { group_members?: string[] } }[]) => {
        const members = new Set<string>();
        for (const e of entities) {
          const gm = e.attributes?.group_members;
          if (Array.isArray(gm) && gm.length > 0) {
            members.add(e.entity_id ?? "");
            gm.forEach((id) => members.add(id));
          }
        }
        setGroupMembers(members);
      })
      .catch(() => setGroupMembers(new Set()));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    refresh();
  }, [enabled, refresh]);

  const handleJoin = useCallback(async (entityIds: string[]) => {
    if (entityIds.length < 2) return;
    setJoinUnjoinPending(true);
    try {
      const res = await fetch("/api/ha/join-speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_ids: entityIds }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Join failed");
      setGroupMembers((prev) => new Set([...prev, ...entityIds]));
    } finally {
      setJoinUnjoinPending(false);
    }
  }, []);

  const handleUnjoin = useCallback(async (entityId: string) => {
    setJoinUnjoinPending(true);
    try {
      const res = await fetch("/api/ha/unjoin-speaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_id: entityId }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Unjoin failed");
      setGroupMembers((prev) => {
        const next = new Set(prev);
        next.delete(entityId);
        return next;
      });
    } finally {
      setJoinUnjoinPending(false);
    }
  }, []);

  return { entityMap, groupMembers, joinUnjoinPending, handleJoin, handleUnjoin, refresh };
}
