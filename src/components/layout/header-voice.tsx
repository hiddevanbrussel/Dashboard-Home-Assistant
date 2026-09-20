"use client";

import { Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { headerVoiceCaption, headerVoiceOpensOverlay, isVoiceSessionActive } from "@/lib/voice-session";
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
  const wakeWordStatus = useVoiceSatelliteStore((s) => s.wakeWordStatus);
  const setOpen = useVoiceSatelliteStore((s) => s.setOpen);
  const requestStopListen = useVoiceSatelliteStore((s) => s.requestStopListen);

  useEffect(() => {
    hydrateVoiceSatelliteStore();
  }, []);

  if (!enabled) return null;

  const active = isVoiceSessionActive(phase);
  const armed = wakeWordEnabled && wakeWordStatus === "armed" && !active;
  const captionKind = headerVoiceCaption({ phase, transcript, speech, error });
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
                : null;
  const label =
    caption ||
    (wakeWordStatus === "denied"
      ? t("voice.wakeDenied")
      : wakeWordStatus === "error"
        ? t("voice.wakeError")
        : armed
          ? t("voice.wakeArmed")
          : t("voice.title"));

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
        "relative flex h-9 max-w-[16rem] shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 transition-colors",
        active || armed
          ? "text-brand dark:text-accent-purple"
          : contentLight
            ? "text-white/90 hover:bg-white/10"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
      )}
      aria-label={label}
      aria-pressed={open}
      title={label}
    >
      {phase === "processing" ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Mic className={cn("h-4 w-4 shrink-0", (active || armed) && "animate-pulse")} aria-hidden />
      )}
      {caption ? (
        <span className="min-w-0 truncate text-xs font-medium" aria-live="polite">
          {caption}
        </span>
      ) : null}
      {armed ? <span className="absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden /> : null}
    </button>
  );
}
