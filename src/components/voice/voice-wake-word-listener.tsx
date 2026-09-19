"use client";

import { useEffect, useRef } from "react";
import { hydrateVoiceSatelliteStore, useVoiceSatelliteStore } from "@/stores/voice-satellite-store";
import { downsampleTo16k, floatTo16BitPcm } from "@/lib/voice-audio";
import {
  WAKE_WORD_COOLDOWN_MS,
  WAKE_WORD_MODELS_BASE,
  WAKE_WORD_THRESHOLD,
  appendWakeWordPcm,
  shouldRunWakeWordListener,
  wakeWordModelRef,
  type WakeWordId,
} from "@/lib/wake-word";

const ORT_WASM_PATHS = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/";

type WakeEngine = {
  predict: (frame: Int16Array) => Promise<unknown>;
  reset: () => Promise<void> | void;
  threshold: number;
  onDetection: ((event: { label: string; score: number }) => void) | null;
};

export function VoiceWakeWordListener() {
  const enabled = useVoiceSatelliteStore((s) => s.enabled);
  const wakeWordEnabled = useVoiceSatelliteStore((s) => s.wakeWordEnabled);
  const wakeWordId = useVoiceSatelliteStore((s) => s.wakeWordId);
  const phase = useVoiceSatelliteStore((s) => s.phase);
  const setWakeWordStatus = useVoiceSatelliteStore((s) => s.setWakeWordStatus);
  const triggerWakeListen = useVoiceSatelliteStore((s) => s.triggerWakeListen);

  const triggerRef = useRef(triggerWakeListen);
  triggerRef.current = triggerWakeListen;
  const statusRef = useRef(setWakeWordStatus);
  statusRef.current = setWakeWordStatus;

  useEffect(() => {
    hydrateVoiceSatelliteStore();
  }, []);

  const armed = shouldRunWakeWordListener({ enabled, wakeWordEnabled, phase });

  useEffect(() => {
    if (!armed) {
      if (!enabled || !wakeWordEnabled) statusRef.current("off");
      return;
    }

    let cancelled = false;
    let stream: MediaStream | null = null;
    let context: AudioContext | null = null;
    let processor: ScriptProcessorNode | null = null;
    let engine: WakeEngine | null = null;
    let pending = new Int16Array(0);
    let lastDetect = 0;
    let detecting = false;

    statusRef.current("loading");

    async function start(id: WakeWordId) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const { OpenWakeWord, configureOrt } = await import("openwakeword-web");
        if (cancelled) return;

        configureOrt({ wasmPaths: ORT_WASM_PATHS, numThreads: 1 });
        const created = await OpenWakeWord.create({
          baseUrl: WAKE_WORD_MODELS_BASE,
          wakewordModels: [wakeWordModelRef(id)],
          threshold: WAKE_WORD_THRESHOLD,
          ort: { wasmPaths: ORT_WASM_PATHS, numThreads: 1 },
        });
        if (cancelled) {
          await created.reset().catch(() => {});
          return;
        }
        engine = created;
        engine.onDetection = () => {
          const now = Date.now();
          if (now - lastDetect < WAKE_WORD_COOLDOWN_MS) return;
          lastDetect = now;
          triggerRef.current();
        };

        context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const gain = context.createGain();
        gain.gain.value = 0;
        processor = context.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (event) => {
          if (cancelled || detecting || !engine) return;
          const pcm = floatTo16BitPcm(downsampleTo16k(event.inputBuffer.getChannelData(0), context?.sampleRate ?? 48000));
          const split = appendWakeWordPcm(pending, pcm);
          pending = split.rest;
          if (!split.frames.length) return;
          detecting = true;
          void (async () => {
            try {
              for (const frame of split.frames) {
                if (cancelled || !engine) return;
                await engine.predict(frame);
              }
            } catch {
              if (!cancelled) statusRef.current("error", "predict");
            } finally {
              detecting = false;
            }
          })();
        };
        source.connect(processor);
        processor.connect(gain);
        gain.connect(context.destination);
        if (cancelled) return;
        statusRef.current("armed");
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : "";
        const denied = name === "NotAllowedError" || name === "PermissionDeniedError";
        const noMic = name === "NotFoundError" || name === "DevicesNotFoundError";
        statusRef.current(denied ? "denied" : "error", noMic ? "nomics" : err instanceof Error ? err.message : "wake-word");
        stream?.getTracks().forEach((track) => track.stop());
      }
    }

    void start(wakeWordId);

    return () => {
      cancelled = true;
      processor?.disconnect();
      void context?.close().catch(() => {});
      stream?.getTracks().forEach((track) => track.stop());
      void engine?.reset?.();
    };
  }, [armed, enabled, wakeWordEnabled, wakeWordId]);

  return null;
}
