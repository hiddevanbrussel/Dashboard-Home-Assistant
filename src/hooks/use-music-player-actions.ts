"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeakerPairing } from "@/hooks/use-speaker-pairing";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { callMusicAssistant } from "@/lib/music-assistant";
import { MUSIC_ASSISTANT_PLAYER_VOLUME_COMMAND } from "@/lib/music-assistant-commands";
import { groupLeaderQueueId } from "@/lib/ma-group-leader";
import { stepVolume as steppedVolume } from "@/lib/music-volume";
import { readPreloadedPlayerVolume } from "@/lib/player-volume";
import { playUiClick } from "@/lib/ui-click";

export function useMusicPlayerActions() {
  const musicAssistant = useMusicAssistantStore();
  const { selectedQueueId, maPlayers, queueState, setQueueState } = useMusicPlayerStore();
  const states = useEntityStateStore((s) => s.states);
  const { entityMap } = useSpeakerPairing({ enabled: true });
  const volumeTargetId = groupLeaderQueueId(selectedQueueId, maPlayers, entityMap, states) ?? selectedQueueId;
  const [volume, setVolume] = useState(80);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const [volumePending, setVolumePending] = useState(false);
  const [volumeMuted, setVolumeMuted] = useState(false);
  const [seekPending, setSeekPending] = useState(false);
  const [dontStopTheMusicEnabled, setDontStopTheMusicEnabled] = useState(false);
  const [dontStopTheMusicPending, setDontStopTheMusicPending] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [shufflePending, setShufflePending] = useState(false);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !volumeTargetId) return;
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, MUSIC_ASSISTANT_PLAYER_VOLUME_COMMAND, {
      player_id: volumeTargetId,
    })
      .then((data: unknown) => {
        const next = readPreloadedPlayerVolume(data);
        if (next.volume != null) setVolume(next.volume);
        if (next.muted != null) setVolumeMuted(next.muted);
      })
      .catch(() => {});
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, volumeTargetId]);

  const queueControl = useCallback(
    (action: "previous" | "play" | "pause" | "next") => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      playUiClick();
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
      if (!volumeTargetId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const level = Math.max(0, Math.min(100, pct)) / 100;
      const next = Math.round(pct);
      volumeRef.current = next;
      setVolume(next);
      setVolumeMuted(false);
      setVolumePending(true);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_set", {
        player_id: volumeTargetId,
        volume_level: level,
      })
        .then(() => {})
        .catch(() => {})
        .finally(() => setVolumePending(false));
    },
    [volumeTargetId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const stepVolume = useCallback(
    (delta: number) => {
      if (!volumeTargetId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const next = steppedVolume(volumeRef.current, delta);
      volumeRef.current = next;
      setVolume(next);
      setVolumeMuted(false);
      setVolumePending(true);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_set", {
        player_id: volumeTargetId,
        volume_level: next / 100,
      })
        .then(() => {})
        .catch(() => {})
        .finally(() => setVolumePending(false));
    },
    [volumeTargetId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
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
    if (!volumeTargetId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const nextMuted = !volumeMuted;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_mute", {
      player_id: volumeTargetId,
      muted: nextMuted,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (!err) setVolumeMuted(nextMuted);
      })
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [volumeTargetId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, volumeMuted]);

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
    setVolumeLevel,
    stepVolume,
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
