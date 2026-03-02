"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { TextCardWidget } from "./text-card-widget";

const STORAGE_KEY_PREFIX = "dashboard.floatingTextCardPosition.";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 280;

type Position = { left: number; bottom: number };

function defaultPositionForWidth(cardWidth: number, widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - cardWidth;
  const maxBottom = window.innerHeight - 120;
  const cols = 3;
  const row = Math.floor(widgetIndex / cols);
  const col = widgetIndex % cols;
  return {
    left: Math.max(0, Math.min(col * Math.max(1, maxLeft / (cols - 1)), maxLeft)),
    bottom: Math.max(0, maxBottom - row * 80),
  };
}

function storageKey(scope: string | undefined, widgetId: string): string {
  return scope ? `${STORAGE_KEY_PREFIX}${scope}.${widgetId}` : `${STORAGE_KEY_PREFIX}${widgetId}`;
}

function loadPosition(scope: string | undefined, widgetId: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKey(scope, widgetId));
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - 120 };
    }
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

export type FloatingTextCardItem = {
  id: string;
  title: string;
  textMode?: "title" | "subtitle" | "text";
  show_icon?: boolean;
  icon?: string;
  /** Breedte kaart in px (standaard 280). */
  width?: number;
  /** Entity voor aan/uit-schakelaar (switch, light, input_boolean). */
  entity_id?: string;
};

const LONG_PRESS_MS = 500;

export function FloatingTextCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  widget: FloatingTextCardItem;
  widgetIndex?: number;
  editMode?: boolean;
  /** Dashboard/room id so position is stored per page. */
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

  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || !onEnterEditMode) return;
      const target = e.target as HTMLElement;
      if (target?.closest?.("button")) return;
      clearLongPress();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        onEnterEditMode?.();
        onEdit?.();
      }, LONG_PRESS_MS);
    },
    [editMode, onEnterEditMode, onEdit, clearLongPress]
  );

  const endLongPress = useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      clearLongPress();
    },
    [clearLongPress]
  );

  const totalWidth = widget.width ?? DEFAULT_CARD_WIDTH;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widget.id);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPositionForWidth(totalWidth, widgetIndex), bounds);
    setPosition(p);
    savePosition(storageScope, widget.id, p);
  }, [totalWidth, widget.id, widgetIndex, storageScope]);

  const DRAG_THRESHOLD_PX = 6;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement)?.closest?.("button")) return;
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
        savePosition(storageScope, widget.id, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft, widget.id, storageScope]
  );

  return (
    <div
      className={cn(
        "fixed z-30 rounded-2xl overflow-visible flex transition-colors duration-200",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
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
      <div className={cn("shrink-0 flex flex-col p-4 w-full", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")} style={{ width: totalWidth }}>
        <TextCardWidget
          text={widget.title ?? ""}
          type={widget.textMode ?? "title"}
          show_icon={widget.show_icon ?? false}
          icon={widget.icon ?? "Type"}
          width={totalWidth}
          entity_id={widget.entity_id}
          onMoreClick={editMode && onEdit ? () => onEdit() : undefined}
        />
      </div>
    </div>
  );
}
