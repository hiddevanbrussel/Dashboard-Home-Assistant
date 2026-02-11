"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { PillCardWidget } from "./pill-card-widget";
import type { SensorCondition } from "./widget-types";

const STORAGE_KEY_PREFIX = "dashboard.floatingPillCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 280;

type Position = { left: number; bottom: number };

function loadPosition(widgetId: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - 80 };
    }
  } catch {
    // ignore
  }
  return null;
}

function savePosition(widgetId: string, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  return {
    left: DEFAULT_OFFSET + widgetIndex * (CARD_WIDTH + 12),
    bottom: DEFAULT_OFFSET,
  };
}

export type PillCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  icon?: string;
  conditions?: SensorCondition[];
  show_state?: boolean;
};

const LONG_PRESS_MS = 500;

export function FloatingPillCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  widget: PillCardWidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition(widget.id) ?? { left: 0, bottom: DEFAULT_OFFSET });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0, width: CARD_WIDTH, height: 80 });
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
    const w = typeof window !== "undefined" ? window.innerWidth : 400;
    const h = typeof window !== "undefined" ? window.innerHeight : 400;
    const maxLeft = w - CARD_WIDTH;
    const maxBottom = h - 80;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(widget.id);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex), bounds);
    setPosition(p);
    savePosition(widget.id, p);
  }, [widget.id, widgetIndex]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: position.left,
        bottom: position.bottom,
        width,
        height,
      };
      el.setPointerCapture?.(e.pointerId);
    },
    [position, editMode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxLeft = Math.max(0, (typeof window !== "undefined" ? window.innerWidth : 400) - dragStart.current.width);
      const maxBottom = Math.max(0, (typeof window !== "undefined" ? window.innerHeight : 400) - dragStart.current.height);
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = Math.max(0, (typeof window !== "undefined" ? window.innerWidth : 400) - dragStart.current.width);
        const maxBottom = Math.max(0, (typeof window !== "undefined" ? window.innerHeight : 400) - dragStart.current.height);
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(widget.id, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, widget.id]
  );

  return (
    <div
      className={cn(
        "fixed z-30 w-max max-w-[280px] shadow-xl rounded-2xl overflow-hidden bg-transparent",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
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
      <div className={cn(editMode && "[&>div]:rounded-2xl [&>div]:shadow-none")}>
        <PillCardWidget
          title={widget.title}
          entity_id={widget.entity_id}
          icon={widget.icon}
          conditions={widget.conditions}
          show_state={widget.show_state !== false}
          onMoreClick={editMode ? onEdit : undefined}
        />
      </div>
    </div>
  );
}
