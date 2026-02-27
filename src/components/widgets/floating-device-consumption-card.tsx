"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { DeviceConsumptionCardWidget } from "./device-consumption-card-widget";

const STORAGE_KEY = "dashboard.floatingDeviceConsumptionCardPosition";
const CARD_WIDTH = 320;
const CARD_HEIGHT = 320;

type Position = { left: number; bottom: number };

function loadPosition(scope: string | undefined): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY);
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - CARD_HEIGHT };
    }
  } catch {
    // ignore
  }
  return null;
}

function savePosition(scope: string | undefined, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: 100, bottom: 24 };
  const maxLeft = window.innerWidth - CARD_WIDTH;
  const maxBottom = window.innerHeight - 120;
  return { left: Math.max(0, maxLeft / 2), bottom: Math.max(24, maxBottom / 2) };
}

const LONG_PRESS_MS = 500;

export function FloatingDeviceConsumptionCard({
  title,
  device_entity_ids = [],
  device_names,
  width,
  height,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  title: string;
  device_entity_ids?: string[];
  device_names?: Record<string, string>;
  width?: number;
  height?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const cardW = width ?? CARD_WIDTH;
  const cardH = height ?? CARD_HEIGHT;
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope) ?? { left: 0, bottom: 0 });
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
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardW : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(), bounds);
    setPosition(p);
    savePosition(storageScope, p);
  }, [storageScope, cardW]);

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
      const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardW : 400;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, cardW]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardW : 400;
        const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(storageScope, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, storageScope, cardW]
  );

  return (
    <div
      className={cn(
        "fixed z-30 shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: cardW,
        minHeight: cardH,
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
        <DeviceConsumptionCardWidget
          title={title}
          device_entity_ids={device_entity_ids}
          device_names={device_names}
          onMoreClick={editMode ? onEdit : undefined}
          className="relative h-full"
        />
      </div>
    </div>
  );
}
