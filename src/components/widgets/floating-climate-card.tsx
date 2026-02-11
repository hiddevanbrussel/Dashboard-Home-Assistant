"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { ClimateCard2Widget } from "./climate-card-2-widget";

/** Voor backwards compatibility (icon picker verwijderd). */
export const CLIMATE_ICON_OPTIONS: readonly string[] = [];

const STORAGE_KEY = "dashboard.floatingClimateCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
const SWIPE_THRESHOLD_PX = 50;
const SLIDE_DURATION_MS = 280;

type Position = { left: number; bottom: number };

function loadPosition(): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
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

function savePosition(p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  return {
    left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET,
    bottom: DEFAULT_OFFSET,
  };
}

export type ClimateCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  humidity_entity_id?: string;
  type?: "climate_card" | "climate_card_2";
};

const LONG_PRESS_MS = 500;

export function FloatingClimateCard({
  widgets: widgetsProp,
  title: titleProp,
  entity_id: entityIdProp,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  /** Meerdere climate widgets: swipe om te wisselen. Bij één widget mag je title + entity_id gebruiken. */
  widgets?: ClimateCardWidgetItem[];
  title?: string;
  entity_id?: string;
  editMode?: boolean;
  onRemove?: (widgetId: string) => void;
  onEdit?: (widgetId: string) => void;
  onEnterEditMode?: () => void;
}) {
  const widgets = widgetsProp ?? (titleProp != null && entityIdProp != null ? [{ id: "", title: titleProp, entity_id: entityIdProp, type: "climate_card_2" as const }] : []);
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
    loadPosition() ?? { left: 0, bottom: DEFAULT_OFFSET }
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const totalWidth = CARD_WIDTH;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition();
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(), bounds);
    setPosition(p);
    savePosition(p);
  }, [totalWidth]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: position.left,
        bottom: position.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, editMode]
  );

  const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxBottom =
        typeof window !== "undefined" ? window.innerHeight - 120 : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(
          0,
          Math.min(dragStart.current.bottom - dy, maxBottom)
        ),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, maxLeft]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxBottom =
          typeof window !== "undefined" ? window.innerHeight - 120 : 400;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(
            0,
            Math.min(dragStart.current.bottom - dy, maxBottom)
          ),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft]
  );

  return (
    <div
      className={cn(
        "fixed z-30 flex shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        ...(!editMode && onEnterEditMode ? { touchAction: "none" } : {}),
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
        onPointerLeave: (e: React.PointerEvent) => {
          if (isDragging) handlePointerUp(e);
        },
        onPointerCancel: handlePointerUp,
      })}
    >
      <div className="flex flex-col min-w-0 flex-1 w-[320px]">
        <div
          data-climate-swipe-area
          className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none [&_.rounded-2xl]:rounded-b-none", "relative touch-pan-y overflow-hidden")}
          style={{ touchAction: hasMultiple ? "pan-y" : undefined, perspective: "1000px" }}
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
              if (Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy)) {
                e.preventDefault();
                if (swipeAreaLongPressRef.current) {
                  clearTimeout(swipeAreaLongPressRef.current);
                  swipeAreaLongPressRef.current = null;
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
            swipeStart.current = null;
          } : undefined}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ minHeight: 200 }}
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
                    i === selectedIndex ? "bg-white" : "bg-white/40"
                  )}
                  aria-hidden
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
