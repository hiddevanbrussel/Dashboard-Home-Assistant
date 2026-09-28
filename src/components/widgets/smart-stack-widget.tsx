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
  title,
  children = [],
  interval_seconds,
  width,
  height,
  className,
  onMoreClick,
  paused = false,
}: {
  title?: string;
  children?: WidgetConfig[];
  interval_seconds?: number;
  width?: number;
  height?: number;
  className?: string;
  onMoreClick?: () => void;
  /** Pause auto-advance (e.g. while editing). */
  paused?: boolean;
}) {
  const { t } = useTranslation();
  const slides = children;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const intervalSec = clampSmartStackIntervalSec(interval_seconds ?? SMART_STACK_DEFAULT_INTERVAL_SEC);
  const cardW = clampSmartStackWidth(width);
  const cardH = clampSmartStackHeight(height);

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
        "relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl",
        "bg-white/70 shadow-xl backdrop-blur-2xl border border-black/5",
        "dark:bg-zinc-950/70 dark:border-white/10",
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
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-3 pt-2">
        <div className="pointer-events-none flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm dark:bg-black/50">
          <Layers className="h-3 w-3" aria-hidden />
          <span className="max-w-[9rem] truncate">{title?.trim() || t("cardType.smart_stack")}</span>
          {count > 0 && (
            <span className="tabular-nums text-white/70">
              {normalizeSmartStackIndex(index, count) + 1}/{count}
            </span>
          )}
        </div>
        {onMoreClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="pointer-events-auto rounded-lg p-1 text-white/80 hover:bg-white/15 hover:text-white"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <div className="relative min-h-0 flex-1">
        {count === 0 || !active ? (
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

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5">
          {slides.map((slide, i) => {
            const activeDot = i === normalizeSmartStackIndex(index, count);
            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  activeDot ? "w-4 bg-white shadow" : "w-1.5 bg-white/45 hover:bg-white/70"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
