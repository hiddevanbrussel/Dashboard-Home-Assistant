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
import { NutsCardWidget } from "./nuts-card-widget";
import {
  NUTS_CARD_DEFAULT_HEIGHT,
  NUTS_CARD_DEFAULT_WIDTH,
  clampNutsCardHeight,
  clampNutsCardWidth,
  normalizeNutsAccent,
  normalizeNutsPeriod,
  resizeNutsCardFromBottomRight,
  type NutsCardAccent,
  type NutsCardPeriod,
} from "@/lib/nuts-card";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY_PREFIX = "dashboard.floatingNutsCardPosition.";
const DEFAULT_OFFSET = 24;

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
  if (typeof window === "undefined") return { left: 100 + widgetIndex * 40, bottom: DEFAULT_OFFSET };
  const maxLeft = Math.max(0, window.innerWidth - cardWidth);
  const maxBottom = Math.max(0, window.innerHeight - cardHeight - 24);
  const left = Math.min(maxLeft, 24 + widgetIndex * (cardWidth + 24));
  const bottom = Math.min(maxBottom, 48 + (widgetIndex % 2) * 24);
  return { left, bottom };
}

const LONG_PRESS_MS = 500;

export function FloatingNutsCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
  onResize,
}: {
  widget: {
    id: string;
    title: string;
    entity_id: string;
    today_entity_id?: string;
    current_entity_id?: string;
    icon?: string;
    icon_background_color?: string;
    accent?: NutsCardAccent | string;
    period?: NutsCardPeriod | string;
    width?: number;
    height?: number;
  };
  widgetIndex?: number;
  editMode?: boolean;
  /** Dashboard/room id so position is stored per page. */
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  void onRemove;
  const { t } = useTranslation();
  const cardWidth = clampNutsCardWidth(widget.width ?? NUTS_CARD_DEFAULT_WIDTH);
  const cardHeight = clampNutsCardHeight(widget.height ?? NUTS_CARD_DEFAULT_HEIGHT);
  const [position, setPosition] = useState<Position>(
    () => loadPosition(storageScope, widget.id, cardHeight) ?? { left: 0, bottom: DEFAULT_OFFSET }
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
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - cardHeight - 24 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widget.id, cardHeight);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex, cardWidth, cardHeight), bounds);
    setPosition(p);
    savePosition(storageScope, widget.id, p);
  }, [widget.id, widgetIndex, cardWidth, cardHeight, storageScope]);

  useEffect(() => {
    if (!initialized.current || isResizing || isDragging || draggingRef.current) return;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - displayWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - displayHeight - 24 : 400;
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
    const next = resizeNutsCardFromBottomRight({
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
        "card-plot-in fixed z-30 outline-none [-webkit-user-drag:none]",
        editMode && !isResizing && "cursor-grab touch-none select-none active:cursor-grabbing",
        editMode && !isDragging && !isResizing && "animate-edit-wiggle"
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
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl">
        <NutsCardWidget
          title={widget.title}
          entity_id={widget.entity_id}
          today_entity_id={widget.today_entity_id}
          current_entity_id={widget.current_entity_id}
          icon={widget.icon}
          icon_background_color={widget.icon_background_color}
          accent={normalizeNutsAccent(widget.accent)}
          period={normalizeNutsPeriod(widget.period)}
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
          aria-label={t("nutsCard.resize")}
          className="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 cursor-nwse-resize touch-none items-center justify-center rounded-md bg-white/70 shadow-sm ring-1 ring-black/[0.08] backdrop-blur-sm dark:bg-zinc-800/75 dark:ring-white/15"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-gray-500/80 dark:text-white/55" aria-hidden>
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
