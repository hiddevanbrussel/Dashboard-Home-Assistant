"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, FLOATING_CARD_GRID_STEP, floatingPositionFromElement } from "@/lib/floating-card-grid";
import {
  clampRoomCardHeight,
  clampRoomCardWidth,
  resizeRoomCardFromBottomRight,
} from "@/lib/room-card";
import { useTranslation } from "@/hooks/use-translation";
import { RoomCardWidget } from "./room-card-widget";

const STORAGE_KEY_PREFIX = "dashboard.floatingRoomCardPosition.";
const DEFAULT_OFFSET = 24;
const ROOM_CARD_GAP = 12;

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
      return { left: p.left, bottom: window.innerHeight - p.top - 200 };
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

const BOTTOM_MARGIN = 24;

function defaultPosition(widgetIndex: number, cardWidth: number, cardHeight: number): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  const stepX = cardWidth + ROOM_CARD_GAP;
  const stepY = cardHeight + ROOM_CARD_GAP;
  const col = widgetIndex % 3;
  const row = Math.floor(widgetIndex / 3);
  const left = Math.min(DEFAULT_OFFSET + col * stepX, window.innerWidth - cardWidth);
  const maxBottom = window.innerHeight - cardHeight - BOTTOM_MARGIN;
  const bottom = Math.min(DEFAULT_OFFSET + row * stepY, maxBottom);
  return { left: Math.max(0, left), bottom: Math.max(0, bottom) };
}

export { clampRoomCardWidth, clampRoomCardHeight } from "@/lib/room-card";

type Rect = { left: number; bottom: number; width: number; height: number };

function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.left < b.left + b.width &&
    b.left < a.left + a.width &&
    a.bottom < b.bottom + b.height &&
    b.bottom < a.bottom + a.height
  );
}

/** Bepaalt een positie op een plaatsingsgrid zodat kaarten niet overlappen. */
function getNonOverlappingPosition(
  desired: Position,
  myWidth: number,
  myHeight: number,
  others: Rect[],
  bounds: { maxLeft: number; maxBottom: number }
): Position {
  const stepX = myWidth + ROOM_CARD_GAP;
  const stepY = myHeight + ROOM_CARD_GAP;
  const myRect: Rect = { left: desired.left, bottom: desired.bottom, width: myWidth, height: myHeight };

  const snapped = snapToGrid(desired, bounds);
  let candidate: Position = { left: snapped.left, bottom: snapped.bottom };
  const gridStep = FLOATING_CARD_GRID_STEP;

  for (let attempt = 0; attempt < 200; attempt++) {
    myRect.left = candidate.left;
    myRect.bottom = candidate.bottom;
    const anyOverlap = others.some((o) => overlaps(myRect, o));
    if (!anyOverlap) return candidate;
    // Volgende gridpositie: eerst naar rechts, dan nieuwe rij omhoog
    candidate = {
      left: candidate.left + gridStep,
      bottom: candidate.bottom,
    };
    if (candidate.left > bounds.maxLeft) {
      candidate.left = 0;
      candidate.bottom = Math.min(candidate.bottom + gridStep, bounds.maxBottom);
    }
  }
  return candidate;
}

export type RoomCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  icon?: string;
  light_entity_id?: string;
  modal_light_entity_ids?: string[];
  modal_cards?: { id: string; type: "light" | "climate" | "media_player"; entity_id: string }[];
  media_player_entity_id?: string;
  climate_entity_id?: string;
  background_image?: string;
  icon_background_color?: string;
  width?: number;
  height?: number;
};

const LONG_PRESS_MS = 500;
const DRAG_THRESHOLD_PX = 6;

export type OtherRoomCardBounds = { id: string; width: number; height: number; index: number };

export function FloatingRoomCard({
  widget,
  widgetIndex = 0,
  editMode = false,
  storageScope,
  otherRoomCards,
  flowLayout = false,
  onRemove,
  onEdit,
  onEnterEditMode,
  onCardClick,
  onResize,
}: {
  widget: RoomCardWidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  /** Andere kamerkaarten (id, width, height, index) om overlap mee te voorkomen. */
  otherRoomCards?: OtherRoomCardBounds[];
  /** Flow-layout: kaarten in een flex-wrap rij met padding, geen overlap, volgende rij wanneer niet past. */
  flowLayout?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onCardClick?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  const { t } = useTranslation();
  const cardWidth = clampRoomCardWidth(widget.width);
  const cardHeight = clampRoomCardHeight(widget.height);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const totalWidth = liveSize?.width ?? cardWidth;
  const totalHeight = liveSize?.height ?? cardHeight;
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope, widget.id) ?? { left: 0, bottom: DEFAULT_OFFSET });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, bottom: 0 });
  const isPointerDownOnCard = useRef(false);
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bounds = useMemo(
    () => ({
      maxLeft: typeof window !== "undefined" ? window.innerWidth - totalWidth : 400,
      maxBottom: typeof window !== "undefined" ? window.innerHeight - totalHeight - BOTTOM_MARGIN : 400,
    }),
    [totalWidth, totalHeight]
  );

  const getOthersRects = useCallback((): Rect[] => {
    if (!otherRoomCards?.length) return [];
    return otherRoomCards
      .map((o) => {
        const p = loadPosition(storageScope, o.id) ?? defaultPosition(o.index, o.width, o.height);
        return { left: p.left, bottom: p.bottom, width: o.width, height: o.height };
      })
      .filter((r) => r.left >= 0 && r.bottom >= 0);
  }, [otherRoomCards, storageScope]);

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
    const saved = loadPosition(storageScope, widget.id);
    const others = getOthersRects();
    let p: Position;
    if (saved) {
      p = snapToGrid(saved, bounds);
      if (others.length > 0) p = getNonOverlappingPosition(p, totalWidth, totalHeight, others, bounds);
    } else {
      p = snapToGrid(defaultPosition(widgetIndex, totalWidth, totalHeight), bounds);
      if (others.length > 0) p = getNonOverlappingPosition(p, totalWidth, totalHeight, others, bounds);
    }
    setPosition(p);
    savePosition(storageScope, widget.id, p);
  }, [widget.id, widgetIndex, totalWidth, totalHeight, storageScope, bounds, getOthersRects]);

  useEffect(() => {
    if (!liveSize || isResizing) return;
    if (cardWidth === liveSize.width && cardHeight === liveSize.height) setLiveSize(null);
  }, [cardWidth, cardHeight, liveSize, isResizing]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode || isResizing) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      e.stopPropagation();
      isPointerDownOnCard.current = true;
      const measured = floatingPositionFromElement(e.currentTarget as HTMLElement);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: measured.left,
        bottom: measured.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, editMode, isResizing]
  );

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
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, bounds.maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, bounds.maxBottom)),
      };
      setPosition(snapToGrid(raw, bounds));
    },
    [isDragging, bounds]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      isPointerDownOnCard.current = false;
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, bounds.maxLeft)),
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, bounds.maxBottom)),
        };
        let next = snapToGrid(raw, bounds);
        const others = getOthersRects();
        if (others.length > 0) next = getNonOverlappingPosition(next, totalWidth, totalHeight, others, bounds);
        setPosition(next);
        savePosition(storageScope, widget.id, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, bounds, widget.id, storageScope, totalWidth, totalHeight, getOthersRects]
  );

  const applyResizeDelta = useCallback((clientX: number, clientY: number) => {
    const start = resizeStart.current;
    const next = resizeRoomCardFromBottomRight({
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
        width: totalWidth,
        height: totalHeight,
        left: position.left,
        bottom: position.bottom,
      };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [editMode, totalWidth, totalHeight, position]
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

  const resizeHandle = editMode ? (
    <button
      type="button"
      data-no-page-swipe
      data-no-drag
      aria-label={t("roomCard.resize")}
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
  ) : null;

  const cardContent = (
    <div className={cn("shrink-0 flex flex-col w-full", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
      <RoomCardWidget
        title={widget.title}
        entity_id={widget.entity_id}
        icon={widget.icon}
        light_entity_id={widget.light_entity_id}
        media_player_entity_id={widget.media_player_entity_id}
        climate_entity_id={widget.climate_entity_id}
        background_image={widget.background_image}
        icon_background_color={widget.icon_background_color}
        width={totalWidth}
        height={totalHeight}
        embedded
        onMoreClick={editMode ? onEdit : undefined}
        onCardClick={!editMode ? onCardClick : undefined}
      />
    </div>
  );

  if (flowLayout) {
    return (
      <div
        className={cn(
          "card-plot-in relative z-30 shrink-0",
          editMode && !isResizing && "animate-edit-wiggle"
        )}
        style={{
          width: totalWidth,
          height: totalHeight,
          ...(!editMode && onEnterEditMode ? { touchAction: "none" } : {}),
        }}
        {...(!editMode &&
          onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress,
          })}
      >
        <div
          className={cn(
            "flex h-full w-full overflow-hidden rounded-2xl border shadow-xl backdrop-blur-2xl transition-colors duration-200",
            "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10"
          )}
        >
          {cardContent}
        </div>
        {resizeHandle}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "card-plot-in fixed z-30",
        editMode && !isResizing && "cursor-grab touch-none active:cursor-grabbing"
      )}
      data-no-page-swipe={editMode ? true : undefined}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        height: totalHeight,
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
          "flex h-full w-full overflow-hidden rounded-2xl border shadow-xl backdrop-blur-2xl transition-colors duration-200",
          "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10",
          editMode && !isDragging && !isResizing && "animate-edit-wiggle"
        )}
      >
        {cardContent}
      </div>
      {resizeHandle}
    </div>
  );
}
