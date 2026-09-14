"use client";

import { MoreVertical, Pause, Play, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIMER_PRESETS, formatTimerMs } from "@/lib/timer";
import { useTimerStore } from "@/stores/timer-store";
import { useLiveTimerRemaining } from "@/hooks/use-live-timer";
import { useTranslation } from "@/hooks/use-translation";
import { unlockTimerAudio } from "@/components/timer-sound";

export function TimerCardWidget({
  title,
  onMoreClick,
}: {
  title?: string;
  onMoreClick?: () => void;
}) {
  const { t } = useTranslation();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const cancel = useTimerStore((s) => s.cancel);
  const dismiss = useTimerStore((s) => s.dismiss);
  const { status, remaining } = useLiveTimerRemaining();
  const active = status !== "idle";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white/60 shadow-md backdrop-blur-sm dark:bg-white/5">
      <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10">
        <Timer className="h-4 w-4 text-brand" />
        <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-white">
          {title || t("cardType.timer_card")}
        </span>
        {onMoreClick && (
          <button
            type="button"
            onClick={onMoreClick}
            className="rounded-lg p-1 text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        {active ? (
          <>
            <p
              className={cn(
                "text-center font-light tabular-nums text-gray-900 dark:text-white",
                status === "ringing" ? "animate-pulse text-4xl text-brand" : "text-4xl"
              )}
            >
              {status === "ringing" ? t("timer.done") : formatTimerMs(remaining)}
            </p>
            {status === "paused" ? (
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">{t("timer.paused")}</p>
            ) : null}
            <div className="flex items-center justify-center gap-2">
              {status === "ringing" ? (
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
                >
                  {t("timer.stop")}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={status === "paused" ? resume : pause}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"
                    aria-label={status === "paused" ? t("timer.resume") : t("timer.pause")}
                  >
                    {status === "paused" ? <Play className="h-4 w-4 ml-0.5" /> : <Pause className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={cancel}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-gray-700 dark:bg-white/10 dark:text-gray-200"
                    aria-label={t("timer.cancel")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {TIMER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  unlockTimerAudio();
                  start(preset.seconds);
                }}
                className="rounded-full bg-black/[0.06] px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-brand/15 hover:text-brand dark:bg-white/10 dark:text-gray-100 dark:hover:bg-brand/30"
              >
                {t(`timer.preset.${preset.id}`)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
