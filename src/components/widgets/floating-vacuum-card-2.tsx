"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { VacuumCard2Widget } from "./vacuum-card-2-widget";
import { VacuumBottomSheet } from "@/components/vacuum/vacuum-bottom-sheet";
import {
  clampVacuumCard2Height,
  clampVacuumCard2Width,
  isVacuumCardTap,
  resizeVacuumCard2FromBottomRight,
} from "@/lib/vacuum-card";
import { useTranslation } from "@/hooks/use-translation";

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
const TAP_MOVE_PX = 12;

export function FloatingVacuumCard2({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onEdit,
  onEnterEditMode,
  onResize,
}: {
  widget: VacuumCard2WidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  const { t } = useTranslation();
  const cardWidth = clampVacuumCard2Width(widget.width);
  const cardHeight = clampVacuumCard2Height(widget.height);
  const [position, setPosition] = useState<Position>(
    () => loadPosition(storageScope, widget.id, cardHeight) ?? { left: 0, bottom: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const resizeStart = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    left: 0,
    bottom: 0,
  });
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);
  const movedRef = useRef(false);
  const pressStart = useRef({ x: 0, y: 0 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const displayWidth = liveSize?.width ?? cardWidth;
  const displayHeight = liveSize?.height ?? cardHeight;

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || sheetOpen) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      longPressFiredRef.current = false;
      movedRef.current = false;
      pressStart.current = { x: e.clientX, y: e.clientY };
      clearLongPress();
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      if (!onEnterEditMode) return;
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null;
        longPressFiredRef.current = true;
        onEnterEditMode();
      }, LONG_PRESS_MS);
    },
    [editMode, sheetOpen, onEnterEditMode, clearLongPress]
  );

  const handlePressMove = useCallback(
    (e: React.PointerEvent) => {
      if (editMode || sheetOpen) return;
      const dx = e.clientX - pressStart.current.x;
      const dy = e.clientY - pressStart.current.y;
      if (dx * dx + dy * dy <= TAP_MOVE_PX * TAP_MOVE_PX) return;
      movedRef.current = true;
      clearLongPress();
    },
    [editMode, sheetOpen, clearLongPress]
  );

  const handlePressUp = useCallback(
    (e: React.PointerEvent) => {
      const timerPending = onEnterEditMode ? longPressTimerRef.current != null : true;
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      clearLongPress();
      if (editMode || sheetOpen) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      if (
        isVacuumCardTap({
          timerPending,
          longPressFired: longPressFiredRef.current,
          moved: movedRef.current,
        })
      ) {
        setSheetOpen(true);
      }
    },
    [editMode, sheetOpen, onEnterEditMode, clearLongPress]
  );

  const cancelPress = useCallback(
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
    if (!initialized.current || isResizing) return;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - displayWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - displayHeight : 400;
    setPosition((prev) =>
      snapToGrid(
        {
          left: Math.max(0, Math.min(prev.left, maxLeft)),
          bottom: Math.max(0, Math.min(prev.bottom, maxBottom)),
        },
        { maxLeft, maxBottom }
      )
    );
  }, [cardWidth, cardHeight, displayWidth, displayHeight, isResizing]);

  useEffect(() => {
    if (!liveSize || isResizing) return;
    if (cardWidth === liveSize.width && cardHeight === liveSize.height) setLiveSize(null);
  }, [cardWidth, cardHeight, liveSize, isResizing]);

  const applyResizeDelta = useCallback((clientX: number, clientY: number) => {
    const start = resizeStart.current;
    const next = resizeVacuumCard2FromBottomRight({
      startWidth: start.width,
      startHeight: start.height,
      startLeft: start.left,
      startBottom: start.bottom,
      dx: clientX - start.x,
      dy: clientY - start.y,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
      viewportHeight: typeof window !== "undefined" ? window.innerHeight : 800,
    });
    setLiveSize({ width: next.width, height: next.height });
    setPosition({ left: next.left, bottom: next.bottom });
    return next;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode || isResizing) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, left: position.left, bottom: position.bottom };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, editMode, isResizing]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxLeft = typeof window !== "undefined" ? window.innerWidth - displayWidth : 400;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - displayHeight : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, displayWidth, displayHeight]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = typeof window !== "undefined" ? window.innerWidth - displayWidth : 400;
        const maxBottom = typeof window !== "undefined" ? window.innerHeight - displayHeight : 400;
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
    [isDragging, storageScope, widget.id, displayWidth, displayHeight]
  );

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setIsResizing(true);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: displayWidth,
        height: displayHeight,
        left: position.left,
        bottom: position.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [editMode, displayWidth, displayHeight, position]
  );

  const handleResizePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isResizing) return;
      applyResizeDelta(e.clientX, e.clientY);
    },
    [isResizing, applyResizeDelta]
  );

  const handleResizePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isResizing) {
        const next = applyResizeDelta(e.clientX, e.clientY);
        setIsResizing(false);
        setPosition({ left: next.left, bottom: next.bottom });
        savePosition(storageScope, widget.id, { left: next.left, bottom: next.bottom });
        onResize?.({ width: next.width, height: next.height });
        if (!onResize) setLiveSize(null);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isResizing, applyResizeDelta, storageScope, widget.id, onResize]
  );

  return (
    <div
      className={cn(
        "fixed z-30",
        editMode && !isResizing && "cursor-grab touch-none active:cursor-grabbing",
      )}
      aria-haspopup="dialog"
      aria-expanded={sheetOpen}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: displayWidth,
        height: displayHeight,
        ...(!editMode ? { touchAction: "none" } : {}),
      }}
      {...(!editMode && {
        onPointerDown: startLongPress,
        onPointerMove: handlePressMove,
        onPointerUp: handlePressUp,
        onPointerCancel: cancelPress,
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
        width={displayWidth}
        height={displayHeight}
        size="md"
        interactive={!editMode}
        onMoreClick={editMode ? onEdit : undefined}
      />
      {editMode ? (
        <button
          type="button"
          aria-label={t("vacuumCard.resize")}
          className="absolute -bottom-1.5 -right-1.5 z-30 flex h-9 w-9 cursor-nwse-resize touch-none items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 dark:bg-zinc-800 dark:ring-white/25"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
        >
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 text-gray-600 dark:text-white/80" aria-hidden>
            <path
              d="M3.5 10.5h7M10.5 3.5v7M6 10.5h4.5M10.5 6v4.5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      ) : null}
      <VacuumBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
