"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Mic, Send, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { hydrateVoiceSatelliteStore, useVoiceSatelliteStore } from "@/stores/voice-satellite-store";
import {
  VOICE_MAX_SECONDS,
  concatFloat32,
  downsampleTo16k,
  floatTo16BitPcm,
  pcm16ToArrayBuffer,
} from "@/lib/voice-audio";

type AssistRunResponse = {
  transcript?: string | null;
  speech?: string | null;
  conversationId?: string | null;
  ttsUrl?: string | null;
  error?: string | null;
};

export function VoiceSatelliteOverlay() {
  const enabled = useVoiceSatelliteStore((s) => s.enabled);
  const open = useVoiceSatelliteStore((s) => s.open);
  useEffect(() => {
    hydrateVoiceSatelliteStore();
  }, []);
  if (!enabled || !open) return null;
  if (typeof document === "undefined") return null;
  return createPortal(<VoiceSatelliteSheet />, document.body);
}

function VoiceSatelliteSheet() {
  const { t } = useTranslation();
  const pipelineId = useVoiceSatelliteStore((s) => s.pipelineId);
  const phase = useVoiceSatelliteStore((s) => s.phase);
  const transcript = useVoiceSatelliteStore((s) => s.transcript);
  const speech = useVoiceSatelliteStore((s) => s.speech);
  const error = useVoiceSatelliteStore((s) => s.error);
  const conversationId = useVoiceSatelliteStore((s) => s.conversationId);
  const setOpen = useVoiceSatelliteStore((s) => s.setOpen);
  const setPhase = useVoiceSatelliteStore((s) => s.setPhase);
  const setTurn = useVoiceSatelliteStore((s) => s.setTurn);
  const resetTurn = useVoiceSatelliteStore((s) => s.resetTurn);
  const [text, setText] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const recorderRef = useRef<{
    stream: MediaStream;
    context: AudioContext;
    chunks: Float32Array[];
    sampleRate: number;
    timer: ReturnType<typeof setTimeout>;
  } | null>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);

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
    const pcm = floatTo16BitPcm(downsampleTo16k(raw, rec.sampleRate));
    return pcm;
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

  const submitText = useCallback(async () => {
    const next = text.trim();
    if (!next || phase === "processing" || phase === "listening") return;
    setText("");
    setPhase("processing");
    setTurn({ transcript: next, speech: "", error: null });
    try {
      const res = await fetch("/api/ha/assist/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: next,
          pipeline: pipelineId || undefined,
          conversationId: conversationId || undefined,
        }),
      });
      const data = (await res.json()) as AssistRunResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || t("voice.error"));
      setTurn({
        transcript: data.transcript ?? next,
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
  }, [conversationId, phase, pipelineId, playTts, setPhase, setTurn, t, text]);

  const startListening = useCallback(async () => {
    setMicError(null);
    resetTurn();
    stopPlayback();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const gain = context.createGain();
      gain.gain.value = 0;
      const processor = context.createScriptProcessor(4096, 1, 1);
      const chunks: Float32Array[] = [];
      processor.onaudioprocess = (event) => {
        chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      };
      source.connect(processor);
      processor.connect(gain);
      gain.connect(context.destination);
      const timer = setTimeout(() => {
        void (async () => {
          const pcm = await stopRecording();
          if (pcm && pcm.length) await submitPcm(pcm);
          else setPhase("idle");
        })();
      }, VOICE_MAX_SECONDS * 1000);
      recorderRef.current = { stream, context, chunks, sampleRate: context.sampleRate, timer };
      setPhase("listening");
    } catch {
      setMicError(t("voice.micDenied"));
      setPhase("error");
    }
  }, [resetTurn, setPhase, stopPlayback, stopRecording, submitPcm, t]);

  const toggleListen = useCallback(async () => {
    if (phase === "processing") return;
    if (phase === "listening") {
      const pcm = await stopRecording();
      if (pcm && pcm.length) await submitPcm(pcm);
      else setPhase("idle");
      return;
    }
    await startListening();
  }, [phase, setPhase, startListening, stopRecording, submitPcm]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    return () => {
      void stopRecording();
      stopPlayback();
    };
  }, [stopPlayback, stopRecording]);

  const status =
    micError ||
    error ||
    (phase === "listening"
      ? t("voice.listening")
      : phase === "processing"
        ? t("voice.processing")
        : phase === "responding"
          ? t("voice.responding")
          : t("voice.idleHint"));

  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/50 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/90">
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{t("voice.title")}</p>
          <button
            type="button"
            onClick={() => {
              void stopRecording();
              stopPlayback();
              setOpen(false);
            }}
            className="rounded-full p-2 text-gray-500 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
            aria-label={t("voice.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <button
            type="button"
            onClick={() => void toggleListen()}
            disabled={phase === "processing"}
            className={cn(
              "relative flex h-28 w-28 items-center justify-center rounded-full text-white shadow-lg transition-transform",
              phase === "listening" ? "bg-red-500 scale-105" : "bg-brand",
              phase === "processing" && "opacity-70"
            )}
            aria-label={phase === "listening" ? t("voice.stop") : t("voice.talk")}
          >
            {phase === "listening" ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400/40" aria-hidden />
            ) : null}
            {phase === "processing" ? <Loader2 className="h-10 w-10 animate-spin" /> : phase === "listening" ? <Square className="h-9 w-9" /> : <Mic className="h-10 w-10" />}
          </button>
          <p className="min-h-10 text-center text-sm text-gray-600 dark:text-gray-300">{status}</p>
          {transcript ? (
            <p className="w-full rounded-2xl bg-black/[0.04] px-4 py-3 text-sm text-gray-800 dark:bg-white/5 dark:text-gray-100">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t("voice.you")}</span>
              {transcript}
            </p>
          ) : null}
          {speech ? (
            <p className="w-full rounded-2xl bg-brand/10 px-4 py-3 text-sm text-gray-900 dark:bg-brand/20 dark:text-white">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-brand">{t("voice.assist")}</span>
              {speech}
            </p>
          ) : null}
        </div>
        <form
          className="flex items-center gap-2 border-t border-black/5 px-4 py-3 dark:border-white/10"
          onSubmit={(e) => {
            e.preventDefault();
            void submitText();
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("voice.placeholder")}
            className="min-w-0 flex-1 rounded-full bg-black/[0.04] px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:bg-white/5 dark:text-white"
          />
          <button
            type="submit"
            disabled={!text.trim() || phase === "processing" || phase === "listening"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
            aria-label={t("voice.send")}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
