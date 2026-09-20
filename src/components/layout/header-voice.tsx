"use client";

import { Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { headerVoiceCaption, headerVoiceOpensOverlay, isVoiceSessionActive } from "@/lib/voice-session";
import { WAKE_WORD_MODELS } from "@/lib/wake-word";
import { hydrateVoiceSatelliteStore, useVoiceSatelliteStore } from "@/stores/voice-satellite-store";
import { useEffect } from "react";

export function HeaderVoice({ contentLight }: { contentLight?: boolean } = {}) {
  const { t } = useTranslation();
  const enabled = useVoiceSatelliteStore((s) => s.enabled);
  const open = useVoiceSatelliteStore((s) => s.open);
  const phase = useVoiceSatelliteStore((s) => s.phase);
  const transcript = useVoiceSatelliteStore((s) => s.transcript);
  const speech = useVoiceSatelliteStore((s) => s.speech);
  const error = useVoiceSatelliteStore((s) => s.error);
  const source = useVoiceSatelliteStore((s) => s.source);
  const wakeWordEnabled = useVoiceSatelliteStore((s) => s.wakeWordEnabled);
  const wakeWordId = useVoiceSatelliteStore((s) => s.wakeWordId);
  const wakeWordStatus = useVoiceSatelliteStore((s) => s.wakeWordStatus);
  const setOpen = useVoiceSatelliteStore((s) => s.setOpen);
  const requestStopListen = useVoiceSatelliteStore((s) => s.requestStopListen);

  useEffect(() => {
    hydrateVoiceSatelliteStore();
  }, []);

  if (!enabled) return null;

  const active = isVoiceSessionActive(phase);
  const armed = wakeWordEnabled && wakeWordStatus === "armed" && !active;
  const captionKind = headerVoiceCaption({ phase, transcript, speech, error, armed });
  const phrase = t(WAKE_WORD_MODELS[wakeWordId].labelKey);
  const caption =
    captionKind === "listening"
      ? t("voice.listening")
      : captionKind === "processing"
        ? t("voice.processing")
        : captionKind === "responding"
          ? t("voice.responding")
          : captionKind === "transcript"
            ? transcript
            : captionKind === "speech"
              ? speech
              : captionKind === "error"
                ? error || t("voice.error")
                : captionKind === "armed"
                  ? phrase
                  : wakeWordEnabled && wakeWordStatus === "loading"
                    ? t("voice.wakeLoading")
                    : wakeWordEnabled && wakeWordStatus === "denied"
                      ? t("voice.wakeDenied")
                      : wakeWordEnabled && wakeWordStatus === "error"
                        ? t("voice.wakeError")
                        : null;
  const showChip = Boolean(caption);
  const label = caption || t("voice.title");

  return (
    <button
      type="button"
      onClick={() => {
        if (source === "wake" && phase === "listening") {
          requestStopListen();
          return;
        }
        if (!headerVoiceOpensOverlay({ source, phase })) return;
        setOpen(!open);
      }}
      className={cn(
        "relative flex h-9 shrink-0 items-center justify-center gap-2 transition-colors",
        showChip ? "max-w-[20rem] rounded-full px-3 text-sm font-semibold" : "w-9 rounded-lg",
        phase === "listening"
          ? "bg-red-500 text-white shadow-sm"
          : phase === "processing" || phase === "responding"
            ? "bg-brand text-white shadow-sm"
            : phase === "error" || wakeWordStatus === "denied" || wakeWordStatus === "error"
              ? "bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-200"
              : armed
                ? "bg-emerald-500/20 text-emerald-800 ring-1 ring-emerald-400/50 dark:bg-emerald-400/15 dark:text-emerald-200"
                : contentLight
                  ? "text-white/90 hover:bg-white/10"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
      )}
      aria-label={label}
      aria-pressed={open}
      title={label}
    >
      {phase === "processing" || wakeWordStatus === "loading" ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Mic className={cn("h-4 w-4 shrink-0", (active || armed) && "animate-pulse")} aria-hidden />
      )}
      {caption ? (
        <span className="min-w-0 truncate" aria-live="polite">
          {caption}
        </span>
      ) : null}
    </button>
  );
}
