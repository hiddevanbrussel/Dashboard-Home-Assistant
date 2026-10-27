"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeakerPairing } from "@/hooks/use-speaker-pairing";
import { useMusicAssistantStore } from "@/stores/music-assistant-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useMusicPlayerStore } from "@/stores/music-player-store";
import { callMusicAssistant } from "@/lib/music-assistant";
import { groupLeaderQueueId } from "@/lib/ma-group-leader";
import { seekPayload } from "@/lib/music-now-playing";
import { stepVolume as steppedVolume } from "@/lib/music-volume";
import { readPlayersVolume, selectedVolumeRole, volumePayloads } from "@/lib/music-volume-command";
import { playUiClick } from "@/lib/ui-click";

export function useMusicPlayerActions() {
  const musicAssistant = useMusicAssistantStore();
  const { selectedQueueId, maPlayers, queueState, setQueueState } = useMusicPlayerStore();
  const states = useEntityStateStore((s) => s.states);
  const { entityMap } = useSpeakerPairing({ enabled: true });
  const leaderId = groupLeaderQueueId(selectedQueueId, maPlayers, entityMap, states) ?? selectedQueueId;
  const role = selectedVolumeRole(selectedQueueId, maPlayers, entityMap, states);
  const volumePlayerId = role === "leader" ? leaderId : selectedQueueId;
  const [volume, setVolume] = useState<number | null>(null);
  const volumeRef = useRef<number | null>(volume);
  volumeRef.current = volume;
  const writeGeneration = useRef(0);
  const shownPlayerId = useRef<string | null>(null);
  const [volumePending, setVolumePending] = useState(false);
  const [volumeMuted, setVolumeMuted] = useState(false);
  const [seekPending, setSeekPending] = useState(false);
  const [dontStopTheMusicEnabled, setDontStopTheMusicEnabled] = useState(false);
  const [dontStopTheMusicPending, setDontStopTheMusicPending] = useState(false);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [shufflePending, setShufflePending] = useState(false);

  useEffect(() => {
    if (!musicAssistant.enabled || !musicAssistant.baseUrl || !volumePlayerId) {
      shownPlayerId.current = null;
      volumeRef.current = null;
      setVolume(null);
      return;
    }
    if (shownPlayerId.current !== volumePlayerId) {
      shownPlayerId.current = volumePlayerId;
      volumeRef.current = null;
      setVolume(null);
    }
    const generation = writeGeneration.current;
    let cancelled = false;
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/all")
      .then((data: unknown) => {
        if (cancelled || generation !== writeGeneration.current) return;
        const reading = readPlayersVolume(data, volumePlayerId, role);
        volumeRef.current = reading.volume;
        setVolume(reading.volume);
        if (reading.muted != null) setVolumeMuted(reading.muted);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, volumePlayerId, role]);

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
      const payload = seekPayload(selectedQueueId, positionSeconds);
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, payload.command, payload.args)
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

  const sendVolume = useCallback(
    (pct: number) => {
      if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
      const payloads = volumePayloads({
        role,
        selectedQueueId,
        leaderQueueId: leaderId,
        level: pct,
      });
      const next = payloads[0]?.args.volume_level;
      if (next == null) return;
      writeGeneration.current += 1;
      volumeRef.current = next;
      setVolume(next);
      setVolumeMuted(false);
      setVolumePending(true);
      Promise.all(
        payloads.map((payload) =>
          callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, payload.command, payload.args).catch(() => {})
        )
      ).finally(() => setVolumePending(false));
    },
    [selectedQueueId, role, leaderId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]
  );

  const setVolumeLevel = useCallback(
    (pct: number) => {
      sendVolume(pct);
    },
    [sendVolume]
  );

  const stepVolume = useCallback(
    (delta: number) => {
      if (volumeRef.current == null) return;
      sendVolume(steppedVolume(volumeRef.current, delta));
    },
    [sendVolume]
  );

  const volumeUp = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_up", {
      player_id: selectedQueueId,
    })
      .then(() => setVolume((v) => Math.min(100, (v ?? 0) + 5)))
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const volumeDown = useCallback(() => {
    if (!selectedQueueId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_down", {
      player_id: selectedQueueId,
    })
      .then(() => setVolume((v) => Math.max(0, (v ?? 0) - 5)))
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [selectedQueueId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const volumeMute = useCallback(() => {
    if (!leaderId || !musicAssistant.enabled || !musicAssistant.baseUrl) return;
    const nextMuted = !volumeMuted;
    setVolumePending(true);
    callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "players/cmd/volume_mute", {
      player_id: leaderId,
      muted: nextMuted,
    })
      .then((data: unknown) => {
        const err = (data as { error?: string })?.error;
        if (!err) setVolumeMuted(nextMuted);
      })
      .catch(() => {})
      .finally(() => setVolumePending(false));
  }, [leaderId, musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token, volumeMuted]);

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
