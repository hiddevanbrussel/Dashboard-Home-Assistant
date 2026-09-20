"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { playVoiceChime } from "@/lib/voice-chime";
import {
  VOICE_MAX_SECONDS,
  concatFloat32,
  downsampleTo16k,
  floatTo16BitPcm,
  nextWakeSilenceState,
  pcm16ToArrayBuffer,
  pcmRms,
  type WakeSilenceState,
} from "@/lib/voice-audio";
import { useVoiceSatelliteStore } from "@/stores/voice-satellite-store";

function onProgrammaticWake() {
  useVoiceSatelliteStore.getState().triggerWakeListen();
}

type AssistRunResponse = {
  transcript?: string | null;
  speech?: string | null;
  conversationId?: string | null;
  ttsUrl?: string | null;
  error?: string | null;
};

let lastListenId = 0;
let lastStopId = 0;
let lastCancelId = 0;

export function VoiceSatelliteEngine() {
  const { t } = useTranslation();
  const enabled = useVoiceSatelliteStore((s) => s.enabled);
  const pipelineId = useVoiceSatelliteStore((s) => s.pipelineId);
  const conversationId = useVoiceSatelliteStore((s) => s.conversationId);
  const source = useVoiceSatelliteStore((s) => s.source);
  const listenId = useVoiceSatelliteStore((s) => s.listenId);
  const stopListenId = useVoiceSatelliteStore((s) => s.stopListenId);
  const cancelListenId = useVoiceSatelliteStore((s) => s.cancelListenId);
  const setPhase = useVoiceSatelliteStore((s) => s.setPhase);
  const setTurn = useVoiceSatelliteStore((s) => s.setTurn);
  const resetTurn = useVoiceSatelliteStore((s) => s.resetTurn);

  const sourceRef = useRef(source);
  sourceRef.current = source;
  const recorderRef = useRef<{
    stream: MediaStream;
    context: AudioContext;
    chunks: Float32Array[];
    sampleRate: number;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const finishingRef = useRef(false);

  const stopPlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    player.pause();
    player.removeAttribute("src");
    playerRef.current = null;
  }, []);

  const stopRecording = useCallback(async () => {
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (!rec) return null;
    clearTimeout(rec.timer);
    rec.stream.getTracks().forEach((track) => track.stop());
    await rec.context.close().catch(() => {});
    const raw = concatFloat32(rec.chunks);
    return floatTo16BitPcm(downsampleTo16k(raw, rec.sampleRate));
  }, []);

  const playTts = useCallback(
    (ttsUrl: string | null | undefined) => {
      stopPlayback();
      if (!ttsUrl) {
        setPhase("idle");
        return;
      }
      const href = `/api/ha/assist/tts?url=${encodeURIComponent(ttsUrl)}`;
      const audio = new Audio(href);
      playerRef.current = audio;
      setPhase("responding");
      audio.onended = () => setPhase("idle");
      audio.onerror = () => setPhase("idle");
      audio.play().catch(() => setPhase("idle"));
    },
    [setPhase, stopPlayback]
  );

  const submitPcm = useCallback(
    async (pcm: Int16Array) => {
      setPhase("processing");
      try {
        const res = await fetch("/api/ha/assist/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "X-Sample-Rate": "16000",
            ...(pipelineId ? { "X-Assist-Pipeline": pipelineId } : {}),
            ...(conversationId ? { "X-Assist-Conversation": conversationId } : {}),
          },
          body: pcm16ToArrayBuffer(pcm),
        });
        const data = (await res.json()) as AssistRunResponse & { error?: string };
        if (!res.ok) throw new Error(data.error || t("voice.error"));
        setTurn({
          transcript: data.transcript ?? "",
          speech: data.speech ?? "",
          error: data.error ?? null,
          conversationId: data.conversationId ?? conversationId,
        });
        if (data.error) {
          setPhase("error");
          return;
        }
        playTts(data.ttsUrl);
      } catch (err) {
        setTurn({ error: err instanceof Error ? err.message : t("voice.error") });
        setPhase("error");
      }
    },
    [conversationId, pipelineId, playTts, setPhase, setTurn, t]
  );

  const finishListening = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    try {
      const pcm = await stopRecording();
      if (pcm && pcm.length) await submitPcm(pcm);
      else setPhase("idle");
    } finally {
      finishingRef.current = false;
    }
  }, [setPhase, stopRecording, submitPcm]);

  const startListening = useCallback(async () => {
    finishingRef.current = false;
    resetTurn();
    stopPlayback();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });
      const context = new AudioContext();
      const sourceNode = context.createMediaStreamSource(stream);
      const gain = context.createGain();
      gain.gain.value = 0;
      const processor = context.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      let silence: WakeSilenceState = { heard: 0, silent: 0, done: false };
      processor.onaudioprocess = (event) => {
        const frame = new Float32Array(event.inputBuffer.getChannelData(0));
        chunks.push(frame);
        if (sourceRef.current !== "wake" || finishingRef.current) return;
        silence = nextWakeSilenceState(silence, pcmRms(frame));
        if (silence.done) void finishListening();
      };
      sourceNode.connect(processor);
      processor.connect(gain);
      gain.connect(context.destination);
      const timer = setTimeout(() => {
        void finishListening();
      }, VOICE_MAX_SECONDS * 1000);
      recorderRef.current = { stream, context, chunks, sampleRate: context.sampleRate, timer };
      setPhase("listening");
    } catch {
      setTurn({ error: t("voice.micDenied") });
      setPhase("error");
    }
  }, [finishListening, resetTurn, setPhase, setTurn, stopPlayback, t]);

  useEffect(() => {
    if (!enabled || listenId === 0 || lastListenId === listenId) return;
    lastListenId = listenId;
    if (sourceRef.current === "wake") playVoiceChime();
    void startListening();
  }, [enabled, listenId, startListening]);

  useEffect(() => {
    if (!enabled || stopListenId === 0 || lastStopId === stopListenId) return;
    lastStopId = stopListenId;
    void finishListening();
  }, [enabled, finishListening, stopListenId]);

  useEffect(() => {
    if (!enabled || cancelListenId === 0 || lastCancelId === cancelListenId) return;
    lastCancelId = cancelListenId;
    finishingRef.current = true;
    void stopRecording();
    stopPlayback();
  }, [cancelListenId, enabled, stopPlayback, stopRecording]);

  useEffect(() => {
    if (enabled) return;
    void stopRecording();
    stopPlayback();
  }, [enabled, stopPlayback, stopRecording]);

  useEffect(() => {
    window.addEventListener("dashboard:voice-wake", onProgrammaticWake);
    return () => window.removeEventListener("dashboard:voice-wake", onProgrammaticWake);
  }, []);

  useEffect(() => {
    return () => {
      void stopRecording();
      stopPlayback();
    };
  }, [stopPlayback, stopRecording]);

  return null;
}
