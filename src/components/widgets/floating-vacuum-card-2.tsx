"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { VacuumCard2Widget } from "./vacuum-card-2-widget";
import { clampVacuumCard2Height, clampVacuumCard2Width } from "@/lib/vacuum-card";

const STORAGE_KEY_PREFIX = "dashboard.floatingVacuumHeroCardPosition.v2.";
const DEFAULT_OFFSET = 24;
const SIDEBAR_GUTTER = 88;

type Position = { left: number; bottom: number };

function storageKey(scope: string | undefined, widgetId: string): string {
  return scope ? `${STORAGE_KEY_PREFIX}${scope}.${widgetId}` : `${STORAGE_KEY_PREFIX}${widgetId}`;
}

function loadPosition(scope: string | undefined, widgetId: string, cardHeight: number): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKey(scope, widgetId));
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - cardHeight };
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

function defaultPosition(widgetIndex: number, cardWidth: number, cardHeight: number): Position {
  if (typeof window === "undefined") return { left: SIDEBAR_GUTTER, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - cardWidth;
  const maxBottom = window.innerHeight - cardHeight;
  const left = Math.min(Math.max(0, maxLeft), SIDEBAR_GUTTER + widgetIndex * (cardWidth + 24));
  // Keep the card in the lower third so it does not spawn under the centered media card.
  const bottom = Math.min(Math.max(0, maxBottom), 72);
  return { left, bottom };
}

export type VacuumCard2WidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  progress_entity_id?: string;
  background_image?: string;
  width?: number;
  height?: number;
};

const LONG_PRESS_MS = 500;

export function FloatingVacuumCard2({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onEdit,
  onEnterEditMode,
}: {
  widget: VacuumCard2WidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const cardWidth = clampVacuumCard2Width(widget.width);
  const cardHeight = clampVacuumCard2Height(widget.height);
  const [position, setPosition] = useState<Position>(
    () => loadPosition(storageScope, widget.id, cardHeight) ?? { left: 0, bottom: 0 }
  );
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
      if ((e.target as HTMLElement).closest?.("button")) return;
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
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - cardHeight : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widget.id, cardHeight);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex, cardWidth, cardHeight), bounds);
    setPosition(p);
    savePosition(storageScope, widget.id, p);
  }, [storageScope, widget.id, widgetIndex, cardWidth, cardHeight]);

  useEffect(() => {
    if (!initialized.current) return;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - cardHeight : 400;
    setPosition((prev) =>
      snapToGrid(
        {
          left: Math.max(0, Math.min(prev.left, maxLeft)),
          bottom: Math.max(0, Math.min(prev.bottom, maxBottom)),
        },
        { maxLeft, maxBottom }
      )
    );
  }, [cardWidth, cardHeight]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, left: position.left, bottom: position.bottom };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, editMode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardWidth : 400;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - cardHeight : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, cardWidth, cardHeight]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = typeof window !== "undefined" ? window.innerWidth - cardWidth : 400;
        const maxBottom = typeof window !== "undefined" ? window.innerHeight - cardHeight : 400;
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
    [isDragging, storageScope, widget.id, cardWidth, cardHeight]
  );

  return (
    <div
      className={cn(
        "fixed z-30",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: cardWidth,
        height: cardHeight,
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
      <VacuumCard2Widget
        title={widget.title}
        entity_id={widget.entity_id}
        progress_entity_id={widget.progress_entity_id}
        background_image={widget.background_image}
        width={cardWidth}
        height={cardHeight}
        size="md"
        onMoreClick={editMode ? onEdit : undefined}
      />
    </div>
  );
}
