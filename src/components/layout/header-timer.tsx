"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pause, Play, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIMER_PRESETS, formatTimerMs } from "@/lib/timer";
import { useTimerStore } from "@/stores/timer-store";
import { useLiveTimerRemaining } from "@/hooks/use-live-timer";
import { useTranslation } from "@/hooks/use-translation";
import { unlockTimerAudio } from "@/components/timer-sound";

export function HeaderTimer({ contentLight }: { contentLight?: boolean } = {}) {
  const { t } = useTranslation();
  const { status, remaining } = useLiveTimerRemaining();
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const cancel = useTimerStore((s) => s.cancel);
  const dismiss = useTimerStore((s) => s.dismiss);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const active = status !== "idle";
  const ringing = status === "ringing";

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inButton = buttonRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inButton && !inPanel) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (ringing) setOpen(true);
  }, [ringing]);

  const label = ringing
    ? t("timer.done")
    : active
      ? formatTimerMs(remaining)
      : t("timer.title");

  return (
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2 py-1 -mx-2 text-sm font-medium transition-colors",
          ringing
            ? "text-brand dark:text-accent-purple"
            : contentLight
              ? "text-white/90 hover:bg-white/10"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
        )}
        aria-label={label}
        aria-expanded={open}
        title={t("timer.title")}
      >
        <Timer
          className={cn("h-4 w-4 shrink-0", ringing && "animate-pulse")}
          aria-hidden
        />
        {active ? (
          <span
            className={cn("tabular-nums", ringing && "animate-pulse")}
            aria-live="polite"
          >
            {ringing ? t("timer.done") : formatTimerMs(remaining)}
          </span>
        ) : null}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <TimerPanel
              panelRef={panelRef}
              anchorRect={buttonRef.current?.getBoundingClientRect()}
              status={status}
              remaining={remaining}
              onStart={(seconds) => {
                unlockTimerAudio();
                start(seconds);
              }}
              onPause={pause}
              onResume={resume}
              onCancel={() => {
                cancel();
                setOpen(false);
              }}
              onDismiss={() => {
                dismiss();
                setOpen(false);
              }}
            />,
            document.body
          )
        : null}
    </div>
  );
}

function TimerPanel({
  panelRef,
  anchorRect,
  status,
  remaining,
  onStart,
  onPause,
  onResume,
  onCancel,
  onDismiss,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  anchorRect: DOMRect | undefined;
  status: ReturnType<typeof useLiveTimerRemaining>["status"];
  remaining: number;
  onStart: (seconds: number) => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const pos = panelPosition(anchorRect);
  const ringing = status === "ringing";
  const active = status !== "idle";

  return (
    <div
      ref={panelRef}
      className="fixed z-[200] w-[260px] overflow-hidden rounded-2xl border border-white/50 bg-white/90 p-4 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-gray-950/90"
      style={{ top: pos.top, left: pos.left }}
    >
      <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-white">{t("timer.title")}</p>
      {active ? (
        <div className="flex flex-col gap-3">
          <p
            className={cn(
              "text-center font-light tabular-nums text-gray-900 dark:text-white",
              ringing ? "animate-pulse text-3xl text-brand" : "text-3xl"
            )}
          >
            {ringing ? t("timer.done") : formatTimerMs(remaining)}
          </p>
          {status === "paused" ? (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">{t("timer.paused")}</p>
          ) : null}
          <div className="flex items-center justify-center gap-2">
            {ringing ? (
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
              >
                {t("timer.stop")}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={status === "paused" ? onResume : onPause}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"
                  aria-label={status === "paused" ? t("timer.resume") : t("timer.pause")}
                >
                  {status === "paused" ? <Play className="h-4 w-4 ml-0.5" /> : <Pause className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-gray-700 dark:bg-white/10 dark:text-gray-200"
                  aria-label={t("timer.cancel")}
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {TIMER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onStart(preset.seconds)}
              className="rounded-full bg-black/[0.06] px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-brand/15 hover:text-brand dark:bg-white/10 dark:text-gray-100 dark:hover:bg-brand/30"
            >
              {t(`timer.preset.${preset.id}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function panelPosition(anchorRect: DOMRect | undefined) {
  if (!anchorRect) return { top: 0, left: 0 };
  const width = 260;
  const left = Math.min(
    Math.max(8, anchorRect.left),
    Math.max(8, window.innerWidth - width - 8)
  );
  return { top: anchorRect.bottom + 8, left };
}
