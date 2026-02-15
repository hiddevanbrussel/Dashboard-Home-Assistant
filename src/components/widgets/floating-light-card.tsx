"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { LightCardWidget } from "./light-card-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";

const STORAGE_KEY_PREFIX = "dashboard.floatingLightCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 240;

type Position = { left: number; bottom: number };

function loadPosition(widgetId: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
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

function savePosition(widgetId: string, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(_widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - CARD_WIDTH;
  const maxBottom = window.innerHeight - 120;
  return { left: maxLeft / 2, bottom: maxBottom / 2 };
}

export type LightCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  icon?: string;
};

const LONG_PRESS_MS = 500;

export function FloatingLightCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  widget: LightCardWidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const entity = useEntityStateStore((s) => s.getState(widget.entity_id));
  const isSelectedOn = entity?.state === "on";

  const [position, setPosition] = useState<Position>(() => loadPosition(widget.id) ?? { left: 0, bottom: DEFAULT_OFFSET });
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

  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || !onEnterEditMode) return;
      const target = e.target as HTMLElement;
      if (target?.closest?.("button") ?? false) return;
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

  const totalWidth = CARD_WIDTH;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(widget.id);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex), bounds);
    setPosition(p);
    savePosition(widget.id, p);
  }, [totalWidth, widget.id, widgetIndex]);

  const DRAG_THRESHOLD_PX = 6;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      isPointerDownOnCard.current = true;
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
    },
    [isDragging, maxLeft]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
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
        savePosition(widget.id, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft, widget.id]
  );

  return (
    <div
      className={cn(
      "fixed z-30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-2xl border flex transition-colors duration-200",
      isSelectedOn
        ? "bg-white/25 border-white/30"
        : "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10",
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
          isPointerDownOnCard.current = false;
          if (isDragging) handlePointerUp(e);
        },
        onPointerCancel: handlePointerUp,
      })}
    >
      <div className="shrink-0 flex flex-col" style={{ width: CARD_WIDTH }}>
        <div className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
          <LightCardWidget
            title={widget.title}
            entity_id={widget.entity_id}
            icon={widget.icon}
            size="md"
            onMoreClick={onEdit}
          />
        </div>
      </div>
    </div>
  );
}
