"use client";

import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { hydrateVoiceSatelliteStore, useVoiceSatelliteStore } from "@/stores/voice-satellite-store";
import { useEffect } from "react";

export function HeaderVoice({ contentLight }: { contentLight?: boolean } = {}) {
  const { t } = useTranslation();
  const enabled = useVoiceSatelliteStore((s) => s.enabled);
  const open = useVoiceSatelliteStore((s) => s.open);
  const phase = useVoiceSatelliteStore((s) => s.phase);
  const setOpen = useVoiceSatelliteStore((s) => s.setOpen);

  useEffect(() => {
    hydrateVoiceSatelliteStore();
  }, []);

  if (!enabled) return null;

  const active = phase === "listening" || phase === "processing" || phase === "responding";

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
        active
          ? "text-brand dark:text-accent-purple"
          : contentLight
            ? "text-white/90 hover:bg-white/10"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
      )}
      aria-label={t("voice.title")}
      aria-pressed={open}
      title={t("voice.title")}
    >
      <Mic className={cn("h-4 w-4", active && "animate-pulse")} aria-hidden />
    </button>
  );
}
