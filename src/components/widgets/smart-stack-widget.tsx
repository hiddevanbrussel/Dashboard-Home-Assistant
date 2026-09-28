"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Layers, MoreVertical } from "lucide-react";
import type { WidgetConfig } from "@/stores/onboarding-store";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  SMART_STACK_DEFAULT_INTERVAL_SEC,
  SMART_STACK_TRANSITION_MS,
  clampSmartStackHeight,
  clampSmartStackIntervalSec,
  clampSmartStackWidth,
  normalizeSmartStackIndex,
} from "@/lib/smart-stack";
import { SmartStackChild } from "./smart-stack-child";

type SlidePhase = "idle" | "enter";

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
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<SlidePhase>("idle");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pausedUntil, setPausedUntil] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(index);
  const intervalSec = clampSmartStackIntervalSec(interval_seconds ?? SMART_STACK_DEFAULT_INTERVAL_SEC);
  const cardW = clampSmartStackWidth(width);
  const cardH = clampSmartStackHeight(height);
  const isEmpty = count === 0;

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    setIndex((i) => normalizeSmartStackIndex(i, count));
    setOutgoingIndex(null);
    setPhase("idle");
  }, [count]);

  useEffect(() => {
    return () => {
      if (transitionTimer.current != null) clearTimeout(transitionTimer.current);
    };
  }, []);

  const go = useCallback(
    (next: number, dir?: 1 | -1) => {
      if (count <= 1) return;
      const current = indexRef.current;
      const target = normalizeSmartStackIndex(next, count);
      if (target === current) return;

      if (transitionTimer.current != null) clearTimeout(transitionTimer.current);

      const resolvedDir =
        dir ??
        (normalizeSmartStackIndex(current + 1, count) === target
          ? 1
          : normalizeSmartStackIndex(current - 1, count) === target
            ? -1
            : target > current
              ? 1
              : -1);

      setDirection(resolvedDir);
      setOutgoingIndex(current);
      setIndex(target);
      setPhase("enter");
      setPausedUntil(Date.now() + 12_000);

      // Double-rAF so the enter frame paints at opacity 0 before transitioning in.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase("idle");
        });
      });

      transitionTimer.current = setTimeout(() => {
        setOutgoingIndex(null);
        transitionTimer.current = null;
      }, SMART_STACK_TRANSITION_MS);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil) return;
      go(indexRef.current + 1, 1);
    }, intervalSec * 1000);
    return () => window.clearInterval(id);
  }, [paused, count, intervalSec, pausedUntil, go]);

  const active = count > 0 ? slides[normalizeSmartStackIndex(index, count)] : null;
  const outgoing =
    outgoingIndex != null && count > 0
      ? slides[normalizeSmartStackIndex(outgoingIndex, count)]
      : null;
  const entering = phase === "enter";

  return (
    <div
      className={cn(
        "relative h-full w-full min-h-0 overflow-hidden rounded-2xl",
        // Empty / edit placeholder only: light frame. With slides, the nested card is the visual.
        isEmpty &&
          "flex flex-col border border-black/5 bg-white/70 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70",
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
        go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
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

      <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl isolate">
        {isEmpty || !active ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <Layers className="h-8 w-8 text-gray-400 dark:text-white/35" aria-hidden />
            <p className="text-sm font-medium text-gray-700 dark:text-white/80">
              {t("smartStack.emptyTitle")}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/45">{t("smartStack.emptyHint")}</p>
          </div>
        ) : (
          <>
            {outgoing && outgoing.id !== active.id && (
              <div
                className="absolute inset-0 overflow-hidden rounded-2xl will-change-transform"
                style={{
                  zIndex: 1,
                  opacity: entering ? 1 : 0,
                  transform: entering
                    ? "translateX(0) scale(1)"
                    : `translateX(${direction * -12}px) scale(0.985)`,
                  transition: `opacity ${SMART_STACK_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${SMART_STACK_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                  pointerEvents: "none",
                }}
                aria-hidden
              >
                <SmartStackChild child={outgoing} width={cardW} height={cardH} />
              </div>
            )}
            <div
              key={active.id}
              className="absolute inset-0 overflow-hidden rounded-2xl will-change-transform"
              style={{
                zIndex: 2,
                opacity: entering ? 0 : 1,
                transform: entering
                  ? `translateX(${direction * 16}px) scale(0.985)`
                  : "translateX(0) scale(1)",
                transition: entering
                  ? "none"
                  : `opacity ${SMART_STACK_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${SMART_STACK_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            >
              <SmartStackChild child={active} width={cardW} height={cardH} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
