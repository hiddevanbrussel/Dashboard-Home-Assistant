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
  const listening = phase === "listening";
  const problem = phase === "error" || wakeWordStatus === "denied" || wakeWordStatus === "error";

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
        "relative flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors",
        showChip ? "max-w-[16rem] px-2 py-1 -mx-2" : "h-9 w-9",
        problem
          ? contentLight
            ? "text-red-200 hover:bg-white/10"
            : "text-red-600 hover:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/10"
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
        <Mic className={cn("h-4 w-4 shrink-0", listening && "animate-pulse")} aria-hidden />
      )}
      {caption ? (
        <span className="min-w-0 truncate" aria-live="polite">
          {caption}
        </span>
      ) : null}
      {!problem && (armed || listening) ? (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            listening ? "bg-red-500" : "bg-emerald-500/70"
          )}
          aria-hidden
        />
      ) : null}
    </button>
  );
}
