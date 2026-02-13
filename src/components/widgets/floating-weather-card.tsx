"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { WeatherCardWidget } from "./weather-card-widget";

const STORAGE_KEY = "dashboard.floatingWeatherCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 320;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_CARD_HEIGHT = 180;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = 400;

function clampWidth(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}

function clampHeight(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}

type Position = { left: number; bottom: number };

function loadPosition(): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
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

function defaultPosition(cardWidth: number, cardHeight: number): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - cardWidth;
  const maxBottom = window.innerHeight - cardHeight - 24;
  return { left: maxLeft / 2, bottom: maxBottom / 2 };
}

const LONG_PRESS_MS = 500;

export function FloatingWeatherCard({
  title,
  entity_id,
  show_icon = true,
  width,
  height,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  title: string;
  entity_id: string;
  show_icon?: boolean;
  width?: number;
  height?: number;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const totalWidth = clampWidth(width);
  const totalHeight = clampHeight(height);
  const [position, setPosition] = useState<Position>(() => loadPosition() ?? { left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || !onEnterEditMode) return;
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
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition();
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(totalWidth, totalHeight), bounds);
    setPosition(p);
    savePosition(p);
  }, [totalWidth, totalHeight]);

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
  const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
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
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft, maxBottom]
  );

  return (
    <div
      className={cn(
        "fixed z-30 shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        height: totalHeight,
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
      <div className={cn("flex flex-col h-full min-h-0", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
        <WeatherCardWidget
          title={title}
          entity_id={entity_id}
          show_icon={show_icon}
          size="md"
          onMoreClick={editMode ? onEdit : undefined}
          className="flex-1 min-h-0"
        />
      </div>
    </div>
  );
}
