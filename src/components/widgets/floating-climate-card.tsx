"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, floatingPositionFromElement } from "@/lib/floating-card-grid";
import { ClimateCard2Widget } from "./climate-card-2-widget";
import {
  clampClimateCardHeight,
  clampClimateCardWidth,
  resizeClimateCardFromBottomRight,
} from "@/lib/climate-card";
import { useTranslation } from "@/hooks/use-translation";

/** Voor backwards compatibility. Icon picker gebruikt CARD_ICON_OPTIONS. */
export const CLIMATE_ICON_OPTIONS: readonly string[] = [];

const STORAGE_KEY = "dashboard.floatingClimateCardPosition";
const DEFAULT_OFFSET = 24;
const SWIPE_THRESHOLD_PX = 50;
const SLIDE_DURATION_MS = 280;

type Position = { left: number; bottom: number };

function storageKeyForScope(scope: string | undefined): string {
  return scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY;
}

function loadPosition(scope: string | undefined): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKeyForScope(scope));
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number")
      return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - 200 };
    }
  } catch {
    // ignore
  }
  return null;
}

function savePosition(scope: string | undefined, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKeyForScope(scope), JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(cardWidth: number, cardHeight: number): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - cardWidth;
  const maxBottom = window.innerHeight - cardHeight - 24;
  return { left: maxLeft / 2, bottom: maxBottom / 2 };
}

export type ClimateCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  humidity_entity_id?: string;
  icon?: string;
  type?: "climate_card" | "climate_card_2";
  width?: number;
  height?: number;
};

const LONG_PRESS_MS = 500;

export function FloatingClimateCard({
  widgets: widgetsProp,
  title: titleProp,
  entity_id: entityIdProp,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
  onResize,
}: {
  /** Meerdere climate widgets: swipe om te wisselen. Bij één widget mag je title + entity_id gebruiken. */
  widgets?: ClimateCardWidgetItem[];
  title?: string;
  entity_id?: string;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: (widgetId: string) => void;
  onEdit?: (widgetId: string) => void;
  onEnterEditMode?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  const { t } = useTranslation();
  const widgets = widgetsProp ?? (titleProp != null && entityIdProp != null ? [{ id: "", title: titleProp, entity_id: entityIdProp, type: "climate_card_2" as const }] : []);
  const cardWidth = clampClimateCardWidth(widgets[0]?.width);
  const cardHeight = clampClimateCardHeight(widgets[0]?.height);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const totalWidth = liveSize?.width ?? cardWidth;
  const totalHeight = liveSize?.height ?? cardHeight;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flipDeg, setFlipDeg] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeAreaLongPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || !onEnterEditMode) return;
      if ((e.target as HTMLElement).closest?.("[data-climate-swipe-area]")) return;
      clearLongPress();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        onEnterEditMode();
      }, LONG_PRESS_MS);
    },
    [editMode, onEnterEditMode, clearLongPress]
  );

  const endLongPress = useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      clearLongPress();
    },
    [clearLongPress]
  );

  useEffect(() => {
    if (widgets.length === 0) return;
    setSelectedIndex((prev) => Math.min(prev, Math.max(0, widgets.length - 1)));
  }, [widgets.length]);

  const selected = widgets[selectedIndex] ?? widgets[0];
  const hasMultiple = widgets.length > 1;

  const goToIndex = useCallback((index: number) => {
    if (index === selectedIndex || index < 0 || index >= widgets.length) return;
    setSelectedIndex(index);
  }, [selectedIndex, widgets.length]);

  const [position, setPosition] = useState<Position>(() =>
    loadPosition(storageScope) ?? { left: 0, bottom: DEFAULT_OFFSET }
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;
    const bounds = { maxLeft, maxBottom };
    if (!initialized.current) {
      initialized.current = true;
      const saved = loadPosition(storageScope);
      if (saved) {
        const clamped = snapToGrid(saved, bounds);
        setPosition(clamped);
        savePosition(storageScope, clamped);
        return;
      }
      const p = snapToGrid(defaultPosition(totalWidth, totalHeight), bounds);
      setPosition(p);
      savePosition(storageScope, p);
    } else {
      setPosition((prev) => {
        const clamped = snapToGrid(prev, bounds);
        if (clamped.left !== prev.left || clamped.bottom !== prev.bottom) {
          savePosition(storageScope, clamped);
          return clamped;
        }
        return prev;
      });
    }
  }, [totalWidth, totalHeight, storageScope]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode || isResizing) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      const measured = floatingPositionFromElement(e.currentTarget as HTMLElement);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: measured.left,
        bottom: measured.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, editMode, isResizing]
  );

  const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
  const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(
          0,
          Math.min(dragStart.current.bottom - dy, maxBottom)
        ),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, maxLeft, maxBottom]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(
            0,
            Math.min(dragStart.current.bottom - dy, maxBottom)
          ),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(storageScope, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft, maxBottom, storageScope]
  );

  const applyResizeDelta = useCallback((clientX: number, clientY: number) => {
    const start = resizeStart.current;
    const next = resizeClimateCardFromBottomRight({
      startWidth: start.width,
      startHeight: start.height,
      startLeft: start.left,
      startBottom: start.bottom,
      dx: clientX - start.x,
      dy: clientY - start.y,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
      viewportHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    });
    setLiveSize({ width: next.width, height: next.height });
    setPosition({ left: next.left, bottom: next.bottom });
    return next;
  }, []);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: totalWidth,
        height: totalHeight,
        left: position.left,
        bottom: position.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [editMode, totalWidth, totalHeight, position.left, position.bottom]
  );

  const handleResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing) return;
      applyResizeDelta(e.clientX, e.clientY);
    },
    [isResizing, applyResizeDelta]
  );

  const handleResizePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isResizing) {
        const next = applyResizeDelta(e.clientX, e.clientY);
        setIsResizing(false);
        setPosition({ left: next.left, bottom: next.bottom });
        savePosition(storageScope, { left: next.left, bottom: next.bottom });
        onResize?.({ width: next.width, height: next.height });
        if (!onResize) setLiveSize(null);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isResizing, applyResizeDelta, storageScope, onResize]
  );

  useEffect(() => {
    if (!liveSize || isResizing) return;
    if (cardWidth === liveSize.width && cardHeight === liveSize.height) setLiveSize(null);
  }, [cardWidth, cardHeight, liveSize, isResizing]);

  return (
    <div
      className={cn(
        "card-plot-in fixed z-30 rounded-2xl bg-transparent shadow-[0_18px_50px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]",
        editMode && !isResizing && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && !isResizing && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        height: totalHeight,
        ...(!editMode && onEnterEditMode ? { touchAction: "pan-y" } : {}),
      }}
      {...(!editMode &&
        onEnterEditMode && {
          onPointerDown: startLongPress,
          onPointerUp: endLongPress,
          onPointerLeave: endLongPress,
          onPointerCancel: endLongPress,
        })}
      {...(editMode && {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
      })}
    >
      <div className="flex flex-col min-w-0 flex-1 w-full h-full">
        <div
          data-climate-swipe-area
          data-no-page-swipe={hasMultiple ? true : undefined}
          className={cn("relative h-full overflow-hidden rounded-2xl bg-transparent", hasMultiple && "touch-none")}
          style={{ touchAction: hasMultiple ? "none" : undefined, perspective: "1000px", minHeight: totalHeight }}
          onPointerDown={hasMultiple ? (e) => {
            if (!editMode) {
              swipeStart.current = { x: e.clientX, y: e.clientY };
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
              if (onEnterEditMode) {
                if (swipeAreaLongPressRef.current) clearTimeout(swipeAreaLongPressRef.current);
                swipeAreaLongPressRef.current = setTimeout(() => {
                  swipeAreaLongPressRef.current = null;
                  onEnterEditMode();
                }, LONG_PRESS_MS);
              }
            }
          } : undefined}
          onPointerMove={hasMultiple ? (e) => {
            if (swipeStart.current && !editMode) {
              const dx = e.clientX - swipeStart.current.x;
              const dy = e.clientY - swipeStart.current.y;
              if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
                if (swipeAreaLongPressRef.current) {
                  clearTimeout(swipeAreaLongPressRef.current);
                  swipeAreaLongPressRef.current = null;
                }
                if (Math.abs(dx) > Math.abs(dy)) {
                  e.preventDefault();
                }
              }
            }
          } : undefined}
          onPointerUp={hasMultiple ? (e) => {
            if (swipeAreaLongPressRef.current) {
              clearTimeout(swipeAreaLongPressRef.current);
              swipeAreaLongPressRef.current = null;
            }
            if (!swipeStart.current || editMode) return;
            const dx = e.clientX - swipeStart.current.x;
            const dy = e.clientY - swipeStart.current.y;
            if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
              if (dx > 0) goToIndex(selectedIndex - 1);
              else goToIndex(selectedIndex + 1);
            }
            swipeStart.current = null;
            (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
          } : undefined}
          onPointerCancel={hasMultiple ? (e) => {
            if (swipeAreaLongPressRef.current) {
              clearTimeout(swipeAreaLongPressRef.current);
              swipeAreaLongPressRef.current = null;
            }
            swipeStart.current = null;
            (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
          } : undefined}
          onPointerLeave={hasMultiple ? () => {
            if (swipeAreaLongPressRef.current) {
              clearTimeout(swipeAreaLongPressRef.current);
              swipeAreaLongPressRef.current = null;
            }
            /* Niet swipeStart nullen: op tablet verlaat de vinger vaak het element tijdens swipe;
               met setPointerCapture krijgen we pointerup nog steeds, dus swipe wordt dan correct herkend. */
          } : undefined}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-2xl bg-transparent"
            style={{ minHeight: totalHeight }}
          >
            <div
              className="flex w-full h-full"
              style={{
                width: hasMultiple ? `${widgets.length * 100}%` : "100%",
                transform: hasMultiple ? `translateX(-${selectedIndex * (100 / widgets.length)}%)` : "none",
                transition: `transform ${SLIDE_DURATION_MS}ms ease-out`,
              }}
            >
              {widgets.map((w, i) => (
                <div
                  key={w.id}
                  className="shrink-0 w-full"
                  style={hasMultiple ? { width: `${100 / widgets.length}%` } : undefined}
                >
                  <ClimateCard2Widget
                    title={w.title}
                    entity_id={w.entity_id}
                    humidity_entity_id={w.humidity_entity_id}
                    icon={w.icon}
                    width={totalWidth}
                    height={totalHeight}
                    size="md"
                    onMoreClick={editMode ? () => w.id && onEdit?.(w.id) : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
          {hasMultiple && (
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {widgets.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                    i === selectedIndex ? "bg-gray-400" : "bg-gray-300/70"
                  )}
                  aria-hidden
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {editMode ? (
        <button
          type="button"
          aria-label={t("climateCard.resize")}
          className="absolute -bottom-1.5 -right-1.5 z-30 flex h-9 w-9 cursor-nwse-resize touch-none items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 dark:bg-zinc-800 dark:ring-white/25"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
        >
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 text-gray-600 dark:text-white/80" aria-hidden>
            <path
              d="M3.5 10.5h7M10.5 3.5v7M6 10.5h4.5M10.5 6v4.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
