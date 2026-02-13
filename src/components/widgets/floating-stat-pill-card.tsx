"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { StatPillCardWidget } from "./stat-pill-card-widget";

const STORAGE_KEY_PREFIX = "dashboard.floatingStatPillCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 260;

type Position = { left: number; bottom: number };

function loadPosition(widgetId: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
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

function savePosition(widgetId: string, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - CARD_WIDTH;
  const maxBottom = window.innerHeight - 120;
  const offset = widgetIndex * (CARD_WIDTH + 16);
  return { left: Math.min(offset, maxLeft / 2), bottom: maxBottom / 2 };
}

const LONG_PRESS_MS = 500;

export function FloatingStatPillCard({
  widgetId,
  widgetIndex = 0,
  title,
  entity_id,
  label,
  icon,
  color = "amber",
  conditions,
  size = "md",
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  widgetId: string;
  widgetIndex?: number;
  title: string;
  entity_id: string;
  label?: string;
  icon?: string;
  color?: "amber" | "purple" | "emerald" | "red";
  conditions?: { operator: string; value: string; color: string }[];
  size?: "sm" | "md" | "lg";
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition(widgetId) ?? { left: 0, bottom: 0 });
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
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(widgetId);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex), bounds);
    setPosition(p);
    savePosition(widgetId, p);
  }, [widgetId, widgetIndex]);

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

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
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
        const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
        const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(widgetId, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging]
  );

  return (
    <div
      className={cn(
        "fixed z-30 w-[260px] overflow-visible bg-transparent",
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
      <div className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
        <StatPillCardWidget
          title={title}
          entity_id={entity_id}
          label={label}
          icon={icon}
          color={color}
          conditions={conditions}
          size={size}
          onMoreClick={editMode ? onEdit : undefined}
        />
      </div>
    </div>
  );
}
