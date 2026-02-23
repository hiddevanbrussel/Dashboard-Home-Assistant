"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, FLOATING_CARD_GRID_STEP } from "@/lib/floating-card-grid";
import { RoomCardWidget } from "./room-card-widget";

const STORAGE_KEY_PREFIX = "dashboard.floatingRoomCardPosition.";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 220;
const MIN_WIDTH = 180;
const MAX_WIDTH = 380;
const DEFAULT_CARD_HEIGHT = 100;
const MIN_HEIGHT = 72;
const MAX_HEIGHT = 200;
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

export function clampRoomCardWidth(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}

export function clampRoomCardHeight(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}

function clampWidth(w: unknown): number {
  return clampRoomCardWidth(w);
}

function clampHeight(w: unknown): number {
  return clampRoomCardHeight(w);
}

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
  onRemove,
  onEdit,
  onEnterEditMode,
  onCardClick,
}: {
  widget: RoomCardWidgetItem;
  widgetIndex?: number;
  editMode?: boolean;
  storageScope?: string;
  /** Andere kamerkaarten (id, width, height, index) om overlap mee te voorkomen. */
  otherRoomCards?: OtherRoomCardBounds[];
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onCardClick?: () => void;
}) {
  const totalWidth = clampWidth(widget.width);
  const totalHeight = clampHeight(widget.height);
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope, widget.id) ?? { left: 0, bottom: DEFAULT_OFFSET });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const isPointerDownOnCard = useRef(false);
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bounds = { maxLeft: typeof window !== "undefined" ? window.innerWidth - totalWidth : 400, maxBottom: typeof window !== "undefined" ? window.innerHeight - totalHeight - BOTTOM_MARGIN : 400 };

  function getOthersRects(): Rect[] {
    if (!otherRoomCards?.length) return [];
    return otherRoomCards
      .map((o) => {
        const p = loadPosition(storageScope, o.id) ?? defaultPosition(o.index, o.width, o.height);
        return { left: p.left, bottom: p.bottom, width: o.width, height: o.height };
      })
      .filter((r) => r.left >= 0 && r.bottom >= 0);
  }

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
  }, [widget.id, widgetIndex, totalWidth, totalHeight, storageScope]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
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
    [isDragging, bounds.maxLeft, bounds.maxBottom]
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
    [isDragging, bounds, widget.id, storageScope, totalWidth, totalHeight]
  );

  return (
    <div
      className={cn(
        "fixed z-30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-2xl border flex transition-colors duration-200",
        "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        minHeight: totalHeight,
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
          isPointerDownOnCard.current = false;
          if (isDragging) handlePointerUp(e);
        },
        onPointerCancel: handlePointerUp,
      })}
    >
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
    </div>
  );
}
