"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  beginFloatingCardDrag,
  floatingDragBounds,
  floatingParentSize,
  floatingPositionFromElement,
  isFloatingCardNoDragTarget,
  snapToGrid,
} from "@/lib/floating-card-grid";
import { EnergyMetricWidget } from "./energy-metric-widget";

const STORAGE_KEY_PREFIX = "dashboard.floatingEnergyMetricPosition.";
const DEFAULT_OFFSET = 24;
const SIDEBAR_GUTTER = 96;
const FALLBACK_WIDTH = 140;
const FALLBACK_HEIGHT = 56;

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

/** Scatter new metrics around the board so several don't stack. */
function defaultPosition(widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: SIDEBAR_GUTTER, bottom: DEFAULT_OFFSET };
  const maxLeft = Math.max(0, window.innerWidth - FALLBACK_WIDTH);
  const maxBottom = Math.max(0, window.innerHeight - FALLBACK_HEIGHT);
  const presets: Position[] = [
    { left: SIDEBAR_GUTTER + 24, bottom: maxBottom - 80 },
    { left: Math.max(SIDEBAR_GUTTER, maxLeft - 40), bottom: maxBottom - 80 },
    { left: SIDEBAR_GUTTER + 24, bottom: DEFAULT_OFFSET + 48 },
    { left: Math.round(maxLeft / 2), bottom: DEFAULT_OFFSET + 48 },
    { left: Math.max(SIDEBAR_GUTTER, maxLeft - 40), bottom: DEFAULT_OFFSET + 48 },
  ];
  const p = presets[widgetIndex % presets.length] ?? presets[0];
  return {
    left: Math.max(0, Math.min(p.left, maxLeft)),
    bottom: Math.max(0, Math.min(p.bottom, maxBottom)),
  };
}

export type EnergyMetricWidgetItem = {
  id: string;
  title: string;
  entity_id?: string;
  unit?: string;
  manual_value?: string;
  secondary?: string;
  color?: string;
  unit_as_prefix?: boolean;
};

const LONG_PRESS_MS = 500;

export function FloatingEnergyMetric({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onEdit,
  onEnterEditMode,
}: {
  widget: EnergyMetricWidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(
    () => loadPosition(storageScope, widget.id) ?? { left: 0, bottom: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const cardElRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const draggingRef = useRef(false);
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
      if ((e.target as HTMLElement).closest?.("button,a")) return;
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
    const el = cardElRef.current;
    const w = el?.offsetWidth ?? FALLBACK_WIDTH;
    const h = el?.offsetHeight ?? FALLBACK_HEIGHT;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - w : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - h : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widget.id);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex), bounds);
    setPosition(p);
    savePosition(storageScope, widget.id, p);
  }, [storageScope, widget.id, widgetIndex]);

  const dragBoundsFor = useCallback((el: HTMLElement) => {
    const parent = typeof window !== "undefined" ? floatingParentSize(el) : { width: 400, height: 400 };
    const w = Math.max(FALLBACK_WIDTH, el.offsetWidth || FALLBACK_WIDTH);
    const h = Math.max(FALLBACK_HEIGHT, el.offsetHeight || FALLBACK_HEIGHT);
    return floatingDragBounds(w, h, parent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if (isFloatingCardNoDragTarget(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.currentTarget as HTMLElement;
      draggingRef.current = true;
      setIsDragging(true);
      dragStart.current = beginFloatingCardDrag(
        { clientX: e.clientX, clientY: e.clientY },
        position,
        floatingPositionFromElement(el)
      );
      el.setPointerCapture?.(e.pointerId);
    },
    [editMode, position]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const { maxLeft, maxBottom } = dragBoundsFor(e.currentTarget as HTMLElement);
      setPosition({
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      });
    },
    [dragBoundsFor]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current) {
        draggingRef.current = false;
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const { maxLeft, maxBottom } = dragBoundsFor(e.currentTarget as HTMLElement);
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
    [storageScope, widget.id, dragBoundsFor]
  );

  return (
    <div
      ref={cardElRef}
      data-no-page-swipe={editMode ? true : undefined}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      className={cn(
        "card-plot-in fixed z-30 w-max max-w-[min(90vw,420px)] [-webkit-user-drag:none]",
        editMode && "cursor-grab touch-none select-none active:cursor-grabbing",
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
      <EnergyMetricWidget
        title={widget.title}
        entity_id={widget.entity_id ?? ""}
        unit={widget.unit}
        manual_value={widget.manual_value}
        secondary={widget.secondary}
        color={widget.color}
        unit_as_prefix={widget.unit_as_prefix}
        onMoreClick={editMode ? onEdit : undefined}
      />
    </div>
  );
}
