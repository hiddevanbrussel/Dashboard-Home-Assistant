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
import { CalendarCardWidget } from "./calendar-card-widget";
import {
  clampCalendarCardHeight,
  clampCalendarCardWidth,
  resizeCalendarCardFromBottomRight,
} from "@/lib/calendar-card";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY_PREFIX = "dashboard.floatingCalendarCardPosition.";
const DEFAULT_OFFSET = 16;
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
  const rightGutter = 16 + widgetIndex * 24;
  const left = Math.max(0, Math.min(maxLeft, window.innerWidth - cardWidth - rightGutter));
  const bottom = Math.max(0, Math.min(maxBottom, DEFAULT_OFFSET));
  return { left, bottom };
}

export type CalendarCardWidgetItem = {
  id: string;
  title?: string;
  width?: number;
  height?: number;
};

const LONG_PRESS_MS = 500;

export function FloatingCalendarCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onEdit,
  onEnterEditMode,
  onResize,
}: {
  widget: CalendarCardWidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  const { t } = useTranslation();
  const cardWidth = clampCalendarCardWidth(widget.width);
  const cardHeight = clampCalendarCardHeight(widget.height);
  const [position, setPosition] = useState<Position>(
    () => loadPosition(storageScope, widget.id, cardHeight) ?? { left: 0, bottom: 0 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const draggingRef = useRef(false);
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
    if (!initialized.current || isResizing || isDragging || draggingRef.current) return;
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
  }, [cardWidth, cardHeight, displayWidth, displayHeight, isResizing, isDragging]);

  useEffect(() => {
    if (!liveSize || isResizing) return;
    if (cardWidth === liveSize.width && cardHeight === liveSize.height) setLiveSize(null);
  }, [cardWidth, cardHeight, liveSize, isResizing]);

  const applyResizeDelta = useCallback((clientX: number, clientY: number) => {
    const start = resizeStart.current;
    const next = resizeCalendarCardFromBottomRight({
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

  const dragBoundsFor = useCallback(
    (el: HTMLElement) => {
      const parent = typeof window !== "undefined" ? floatingParentSize(el) : { width: 400, height: 400 };
      return floatingDragBounds(displayWidth, displayHeight, parent);
    },
    [displayWidth, displayHeight]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode || isResizing) return;
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
    [editMode, isResizing, position]
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
      data-no-page-swipe={editMode ? true : undefined}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      className={cn(
        "card-plot-in fixed z-40 [-webkit-user-drag:none]",
        editMode && !isResizing && "cursor-grab touch-none select-none active:cursor-grabbing"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: displayWidth,
        height: displayHeight,
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
      <div
        className={cn(
          "h-full w-full overflow-hidden rounded-3xl border shadow-2xl bg-white/90 dark:bg-gray-950/90 border-black/[0.06] dark:border-white/10 backdrop-blur-2xl",
          editMode && !isDragging && !isResizing && "animate-edit-wiggle"
        )}
      >
        <CalendarCardWidget
          title={widget.title}
          width={displayWidth}
          height={displayHeight}
          onMoreClick={editMode ? onEdit : undefined}
        />
      </div>
      {editMode ? (
        <button
          type="button"
          data-no-page-swipe
          data-no-drag
          aria-label={t("calendar.resize")}
          className="absolute bottom-0 right-0 z-30 flex h-8 w-8 cursor-nwse-resize touch-none items-end justify-end p-1"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-gray-500/70 dark:text-white/50" aria-hidden>
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
    </div>
  );
}
