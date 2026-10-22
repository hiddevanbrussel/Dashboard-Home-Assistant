"use client";

import { useEffect, useState } from "react";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { countHaMediaPlayers, showMusicNavigation } from "@/lib/music-nav";

/**
 * Muziek stays in the menu when Music Assistant is configured, and also when
 * it is off but Home Assistant still has media players.
 */
export function useMusicNavVisible(): boolean {
  const musicAssistantEnabled = useMusicAssistantStore((s) => s.enabled);
  const storeCount = useEntityStateStore((s) =>
    Object.keys(s.states).reduce((count, id) => count + (id.startsWith("media_player.") ? 1 : 0), 0)
  );
  const [fetchedCount, setFetchedCount] = useState(0);

  useEffect(() => {
    if (musicAssistantEnabled || storeCount > 0) return;
    let cancelled = false;
    fetch("/api/ha/entities")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: unknown) => {
        if (!cancelled) setFetchedCount(countHaMediaPlayers(data));
      })
      .catch(() => {
        if (!cancelled) setFetchedCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [musicAssistantEnabled, storeCount]);

  return showMusicNavigation({
    musicAssistantEnabled,
    mediaPlayerCount: Math.max(storeCount, fetchedCount),
  });
}
