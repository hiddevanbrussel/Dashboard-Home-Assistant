"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Layers, MoreVertical } from "lucide-react";
import type { WidgetConfig } from "@/stores/onboarding-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  SMART_STACK_DEFAULT_INTERVAL_SEC,
  clampSmartStackHeight,
  clampSmartStackIntervalSec,
  clampSmartStackWidth,
  normalizeSmartStackIndex,
} from "@/lib/smart-stack";
import { SmartStackChild } from "./smart-stack-child";

export function SmartStackWidget({
  slides = [],
  interval_seconds,
  width,
  height,
  className,
  onMoreClick,
  paused = false,
}: {
  title?: string;
  /** Nested cards shown in the slideshow (stored as widget.children). */
  slides?: WidgetConfig[];
  interval_seconds?: number;
  width?: number;
  height?: number;
  className?: string;
  onMoreClick?: () => void;
  /** Pause auto-advance (e.g. while editing). */
  paused?: boolean;
}) {
  const { t } = useTranslation();
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const intervalSec = clampSmartStackIntervalSec(interval_seconds ?? SMART_STACK_DEFAULT_INTERVAL_SEC);
  const cardW = clampSmartStackWidth(width);
  const cardH = clampSmartStackHeight(height);
  const isEmpty = count === 0;

  useEffect(() => {
    setIndex((i) => normalizeSmartStackIndex(i, count));
  }, [count]);

  const go = useCallback(
    (next: number) => {
      setIndex(normalizeSmartStackIndex(next, count));
      setPausedUntil(Date.now() + 12_000);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil) return;
      setIndex((i) => normalizeSmartStackIndex(i + 1, count));
    }, intervalSec * 1000);
    return () => window.clearInterval(id);
  }, [paused, count, intervalSec, pausedUntil]);

  const active = count > 0 ? slides[normalizeSmartStackIndex(index, count)] : null;

  return (
    <div
      className={cn(
        "relative h-full w-full min-h-0 overflow-hidden",
        // Empty / edit placeholder only: light frame. With slides, the nested card is the visual.
        isEmpty &&
          "flex flex-col rounded-2xl border border-black/5 bg-white/70 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70",
        className
      )}
      style={{ width: cardW, height: cardH }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest?.("button")) return;
        touchStartX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (touchStartX.current == null || count <= 1) return;
        const dx = e.clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 40) return;
        go(index + (dx < 0 ? 1 : -1));
      }}
      onPointerCancel={() => {
        touchStartX.current = null;
      }}
    >
      {onMoreClick && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end px-2 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="pointer-events-auto rounded-lg bg-black/35 p-1 text-white/80 backdrop-blur-sm hover:bg-black/50 hover:text-white dark:bg-black/50"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="relative h-full min-h-0 w-full">
        {isEmpty || !active ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Layers className="h-8 w-8 text-gray-400 dark:text-white/35" aria-hidden />
            <p className="text-sm font-medium text-gray-700 dark:text-white/80">
              {t("smartStack.emptyTitle")}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/45">{t("smartStack.emptyHint")}</p>
          </div>
        ) : (
          <div key={active.id} className="absolute inset-0 transition-opacity duration-300">
            <SmartStackChild child={active} width={cardW} height={cardH} />
          </div>
        )}
      </div>
    </div>
  );
}
