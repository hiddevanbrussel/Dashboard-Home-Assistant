"use client";

import { useEffect } from "react";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useMusicPlayerStore, type MAPlayer, type QueueState } from "@/stores/music-player-store";
import { callMusicAssistant } from "@/lib/music-assistant";

const POLL_INTERVAL_MS = 2000;

/**
 * Fetches MA players and polls queue state when Music Assistant is enabled.
 * Keeps the global music player store in sync so the player bar can be shown on any page.
 */
export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const musicAssistant = useMusicAssistantStore();
  const {
    setMaPlayers,
    setQueueState,
    selectedQueueId,
    setSelectedQueueId,
    maPlayers,
  } = useMusicPlayerStore();

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl) {
      setMaPlayers([]);
      setQueueState(null);
      return;
    }
    const { baseUrl, token } = musicAssistant;
    callMusicAssistant(baseUrl, token, "player_queues/all")
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        const list = Array.isArray(data) ? data : (data as { result?: MAPlayer[] })?.result ?? [];
        setMaPlayers(list as MAPlayer[]);
      })
      .catch(() => setMaPlayers([]));
  }, [musicAssistant, setMaPlayers, setQueueState]);

  useEffect(() => {
    if (maPlayers.length > 0 && !selectedQueueId) {
      const allowed = musicAssistant.allowedSpeakerIds;
      const first = allowed.length > 0
        ? maPlayers.find((p) => allowed.includes(p.queue_id)) ?? maPlayers[0]
        : maPlayers[0];
      if (first) setSelectedQueueId(first.queue_id);
    }
  }, [maPlayers, selectedQueueId, musicAssistant.allowedSpeakerIds, setSelectedQueueId]);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !selectedQueueId) return;
    const { baseUrl, token } = musicAssistant;
    const fetchState = () => {
      callMusicAssistant(baseUrl, token, "player_queues/get", { queue_id: selectedQueueId })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) return;
          const r = data as {
            result?: {
              state?: string;
              elapsed_time?: number;
              current_item?: {
                duration?: number;
                name?: string;
                artists?: { name?: string }[] | { name?: string };
                image?: string;
                image_url?: string;
                [key: string]: unknown;
              };
            };
          } | Record<string, unknown>;
          const res = (r?.result ?? r) as {
            state?: string;
            elapsed_time?: number;
            position?: number;
            current_item?: { duration?: number; name?: string; artists?: unknown; image?: string; [key: string]: unknown };
          } | null | undefined;
          const state = res?.state;
          const elapsed = res?.elapsed_time ?? res?.position;
          const cur = res?.current_item;
          const duration = cur?.duration;
          setQueueState({
            state: state as "playing" | "paused" | "idle" | undefined,
            position: typeof elapsed === "number" ? elapsed : undefined,
            duration,
            current_item: cur,
          } as QueueState);
        })
        .catch(() => {});
    };
    fetchState();
    const interval = setInterval(fetchState, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [musicAssistant, selectedQueueId, setQueueState]);

  return <>{children}</>;
}
