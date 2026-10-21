"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, floatingPositionFromElement, floatingParentSize } from "@/lib/floating-card-grid";
import { StatPillCardWidget } from "./stat-pill-card-widget";
import type { SensorCondition } from "./widget-types";

const STORAGE_KEY_PREFIX = "dashboard.floatingStatPillCardPosition.";
const DEFAULT_OFFSET = 24;
/** Edit-options button may slightly overhang; allow flush edge placement of the pill. */
const EDGE_OVERFLOW = 8;
const FALLBACK_WIDTH = 140;
const FALLBACK_HEIGHT = 44;

type Position = { left: number; bottom: number };

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
      return { left: p.left, bottom: window.innerHeight - p.top - FALLBACK_HEIGHT };
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

function defaultPosition(widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - FALLBACK_WIDTH;
  const maxBottom = window.innerHeight - FALLBACK_HEIGHT;
  const offset = widgetIndex * (FALLBACK_WIDTH + 16);
  return { left: Math.min(offset, Math.max(0, maxLeft / 2)), bottom: Math.max(0, maxBottom / 2) };
}

function dragBounds(el: HTMLElement | null): {
  maxLeft: number;
  maxBottom: number;
  minLeft: number;
  minBottom: number;
} {
  const parent = el ? floatingParentSize(el) : { width: window.innerWidth, height: window.innerHeight };
  const width = Math.max(FALLBACK_WIDTH, el?.offsetWidth ?? FALLBACK_WIDTH);
  const height = Math.max(FALLBACK_HEIGHT, el?.offsetHeight ?? FALLBACK_HEIGHT);
  return {
    minLeft: -EDGE_OVERFLOW,
    minBottom: -EDGE_OVERFLOW,
    maxLeft: Math.max(-EDGE_OVERFLOW, parent.width - width + EDGE_OVERFLOW),
    maxBottom: Math.max(-EDGE_OVERFLOW, parent.height - height + EDGE_OVERFLOW),
  };
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
  storageScope,
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
  /** Dashboard/room id so position is stored per page. */
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope, widgetId) ?? { left: 0, bottom: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardElRef = useRef<HTMLDivElement | null>(null);
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
    const bounds = dragBounds(cardElRef.current);
    const saved = loadPosition(storageScope, widgetId);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex), bounds);
    setPosition(p);
    savePosition(storageScope, widgetId, p);
  }, [widgetId, widgetIndex, storageScope]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
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
    [editMode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const bounds = dragBounds(cardElRef.current);
      const raw = {
        left: dragStart.current.left + dx,
        bottom: dragStart.current.bottom - dy,
      };
      setPosition(snapToGrid(raw, bounds));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const bounds = dragBounds(cardElRef.current);
        const raw = {
          left: dragStart.current.left + dx,
          bottom: dragStart.current.bottom - dy,
        };
        const next = snapToGrid(raw, bounds);
        setPosition(next);
        savePosition(storageScope, widgetId, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, widgetId, storageScope]
  );

  return (
    <div
      ref={cardElRef}
      className={cn(
        "card-plot-in fixed z-30 w-fit overflow-visible bg-transparent",
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
        onPointerCancel: handlePointerUp,
      })}
    >
      <StatPillCardWidget
        title={title}
        entity_id={entity_id}
        label={label}
        icon={icon}
        color={color}
        conditions={conditions as SensorCondition[] | undefined}
        size={size}
        onMoreClick={editMode ? onEdit : undefined}
      />
    </div>
  );
}
