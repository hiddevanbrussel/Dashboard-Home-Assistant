"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { ChoreCardWidget } from "./chore-card-widget";

const STORAGE_KEY_PREFIX = "dashboard.floatingChoreCard.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 280;

type Position = { left: number; bottom: number };

function storageKey(scope: string | undefined, widgetId: string): string {
  return scope ? `${STORAGE_KEY_PREFIX}${scope}.${widgetId}` : `${STORAGE_KEY_PREFIX}${widgetId}`;
}

function loadPosition(scope: string | undefined, widgetId: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKey(scope, widgetId));
    if (!s) return null;
    const p = JSON.parse(s) as Position;
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return p;
  } catch {
    // ignore
  }
  return null;
}

function savePosition(scope: string | undefined, widgetId: string, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(scope, widgetId), JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  return { left: window.innerWidth / 2 - CARD_WIDTH / 2, bottom: window.innerHeight / 2 - 150 };
}

const LONG_PRESS_MS = 500;
const DRAG_THRESHOLD_PX = 6;

export function FloatingChoreCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  widget: { id: string; title?: string; child_id?: string | null; show_chore_points?: boolean };
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope, widget.id) ?? { left: 0, bottom: DEFAULT_OFFSET });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const isPointerDownOnCard = useRef(false);
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback((e: React.PointerEvent) => {
    if (editMode || !onEnterEditMode) return;
    const target = e.target as HTMLElement;
    if (target?.closest?.("button") ?? false) return;
    clearLongPress();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      onEnterEditMode?.();
      onEdit?.();
    }, LONG_PRESS_MS);
  }, [editMode, onEnterEditMode, onEdit, clearLongPress]);

  const endLongPress = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    clearLongPress();
  }, [clearLongPress]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widget.id);
    if (saved) { setPosition(snapToGrid(saved, bounds)); return; }
    const p = snapToGrid(defaultPosition(), bounds);
    setPosition(p);
    savePosition(storageScope, widget.id, p);
  }, [widget.id, widgetIndex, storageScope]);

  const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!editMode) return;
    if ((e.target as HTMLElement)?.closest?.("button")) return;
    isPointerDownOnCard.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, left: position.left, bottom: position.bottom };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [position, editMode]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDownOnCard.current) return;
    if (!isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX) {
        e.preventDefault();
        setIsDragging(true);
      } else return;
    }
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const raw = {
      left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
      bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
    };
    setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
  }, [isDragging, maxLeft]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isPointerDownOnCard.current = false;
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      const next = snapToGrid(raw, { maxLeft, maxBottom });
      setPosition(next);
      savePosition(storageScope, widget.id, next);
    }
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, [isDragging, maxLeft, widget.id, storageScope]);

  return (
    <div
      className={cn(
        "fixed z-30 shadow-xl rounded-2xl overflow-hidden border transition-colors duration-200",
        "bg-white/80 dark:bg-gray-900/80 border-white/30 dark:border-white/10 backdrop-blur-2xl",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: CARD_WIDTH,
        ...(!editMode && onEnterEditMode ? { touchAction: "none" } : {}),
      }}
      {...(!editMode && onEnterEditMode && {
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
          isPointerDownOnCard.current = false;
          if (isDragging) handlePointerUp(e);
        },
        onPointerCancel: handlePointerUp,
      })}
    >
      <ChoreCardWidget
        childId={widget.child_id}
        showPoints={widget.show_chore_points ?? true}
        title={widget.title}
        onMoreClick={editMode ? onEdit : undefined}
      />
    </div>
  );
}
