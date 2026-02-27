"use client";

import { useCallback, useEffect, useState } from "react";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { callMusicAssistant } from "@/lib/music-assistant";

export function useMusicPlayerActions() {
  const musicAssistant = useMusicAssistantStore();
  const { selectedQueueId, queueState, setQueueState } = useMusicPlayerStore();
  const [volume, setVolume] = useState(80);
  const [volumePending, setVolumePending] = useState(false);
  const [volumeMuted, setVolumeMuted] = useState(false);
  const [seekPending, setSeekPending] = useState(false);
  const [dontStopTheMusicEnabled, setDontStopTheMusicEnabled] = useState(false);
  const [dontStopTheMusicPending, setDontStopTheMusicPending] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [shufflePending, setShufflePending] = useState(false);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !selectedQueueId) return;
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "config/players/get", {
      player_id: selectedQueueId,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        const res = (data as { result?: { volume_level?: number; volume_muted?: boolean } })?.result ?? (data as { volume_level?: number; volume_muted?: boolean });
        const vol = res?.volume_level;
        if (typeof vol === "number" && vol >= 0 && vol <= 1) setVolume(Math.round(vol * 100));
        if (typeof res?.volume_muted === "boolean") setVolumeMuted(res.volume_muted);
      })
      .catch(() => {});
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, selectedQueueId]);

  const queueControl = useCallback(
    (action: "previous" | "play" | "pause" | "next") => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const cmd =
        action === "play"
          ? "player_queues/play"
          : action === "pause"
            ? "player_queues/pause"
            : action === "next"
              ? "player_queues/next"
              : "player_queues/previous";
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, cmd, { queue_id: selectedQueueId })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) return;
        })
        .catch(() => {});
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const seekTo = useCallback(
    (positionSeconds: number) => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      setSeekPending(true);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/seek", {
        queue_id: selectedQueueId,
        position: positionSeconds,
      })
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) return;
          setQueueState(queueState ? { ...queueState, position: positionSeconds } : null);
        })
        .catch(() => {})
        .finally(() => setSeekPending(false));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, setQueueState, queueState]
  );

  const setVolumeLevel = useCallback(
    (pct: number) => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const level = Math.max(0, Math.min(100, pct)) / 100;
      setVolume(Math.round(pct));
      setVolumePending(true);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_set", {
        player_id: selectedQueueId,
        volume_level: level,
      })
        .then(() => {})
        .catch(() => {})
        .finally(() => setVolumePending(false));
    },
    [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const volumeUp = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_up", {
      player_id: selectedQueueId,
    })
      .then(() => setVolume((v) => Math.min(100, v + 5)))
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const volumeDown = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_down", {
      player_id: selectedQueueId,
    })
      .then(() => setVolume((v) => Math.max(0, v - 5)))
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const volumeMute = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const nextMuted = !volumeMuted;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_mute", {
      player_id: selectedQueueId,
      muted: nextMuted,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (!err) setVolumeMuted(nextMuted);
      })
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, volumeMuted]);

  const toggleDontStopTheMusic = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const next = !dontStopTheMusicEnabled;
    setDontStopTheMusicPending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/dont_stop_the_music", {
      queue_id: selectedQueueId,
      dont_stop_the_music_enabled: next,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        setDontStopTheMusicEnabled(next);
      })
      .catch(() => {})
      .finally(() => setDontStopTheMusicPending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, dontStopTheMusicEnabled]);

  const toggleShuffle = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const next = !shuffleEnabled;
    setShufflePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/shuffle", {
      queue_id: selectedQueueId,
      shuffle_enabled: next,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (err) return;
        setShuffleEnabled(next);
      })
      .catch(() => {})
      .finally(() => setShufflePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, shuffleEnabled]);

  useEffect(() => {
    if (typeof queueState?.shuffle_enabled === "boolean") {
      setShuffleEnabled(queueState.shuffle_enabled);
    }
  }, [queueState?.shuffle_enabled]);

  useEffect(() => {
    setShuffleEnabled(false);
  }, [selectedQueueId]);

  return {
    queueControl,
    seekTo,
    volumeUp,
    volumeDown,
    volumeMute,
    volumeMuted,
    toggleDontStopTheMusic,
    toggleShuffle,
    volume,
    volumePending,
    seekPending,
    dontStopTheMusicEnabled,
    dontStopTheMusicPending,
    shuffleEnabled,
    shufflePending,
  };
}
