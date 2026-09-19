"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, floatingPositionFromElement } from "@/lib/floating-card-grid";
import { WeatherCardWidget } from "./weather-card-widget";
import { WeatherBottomSheet } from "@/components/weather/weather-bottom-sheet";
import { isVacuumCardTap } from "@/lib/vacuum-card";
import {
  clampWeatherCardHeight,
  clampWeatherCardWidth,
  resizeWeatherCardFromBottomRight,
} from "@/lib/weather-card";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY = "dashboard.floatingWeatherCardPosition";
const DEFAULT_OFFSET = 24;

type Position = { left: number; bottom: number };

function storageKeyForScope(scope: string | undefined): string {
  return scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY;
}

function loadPosition(scope: string | undefined): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKeyForScope(scope));
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

function savePosition(scope: string | undefined, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKeyForScope(scope), JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(cardWidth: number, cardHeight: number): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - cardWidth;
  const maxBottom = window.innerHeight - cardHeight - 24;
  return { left: maxLeft / 2, bottom: maxBottom / 2 };
}

const LONG_PRESS_MS = 500;
const TAP_MOVE_PX = 16;

export function FloatingWeatherCard({
  title,
  entity_id,
  show_icon = true,
  width,
  height,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
  onResize,
}: {
  title: string;
  entity_id: string;
  show_icon?: boolean;
  width?: number;
  height?: number;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
  onResize?: (size: { width: number; height: number }) => void;
}) {
  const { t } = useTranslation();
  const cardWidth = clampWeatherCardWidth(width);
  const cardHeight = clampWeatherCardHeight(height);
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const totalWidth = liveSize?.width ?? cardWidth;
  const totalHeight = liveSize?.height ?? cardHeight;
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope) ?? { left: 0, bottom: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFiredRef = useRef(false);
  const movedRef = useRef(false);
  const pressStart = useRef({ x: 0, y: 0 });
  const [sheetOpen, setSheetOpen] = useState(false);

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

  const endLongPress = useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      clearLongPress();
    },
    [clearLongPress]
  );

  function handleCardClick() {
    if (editMode || sheetOpen) return;
    if (!isVacuumCardTap({ longPressFired: longPressFiredRef.current, moved: movedRef.current })) return;
    setSheetOpen(true);
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(totalWidth, totalHeight), bounds);
    setPosition(p);
    savePosition(storageScope, p);
  }, [totalWidth, totalHeight, storageScope]);

  useEffect(() => {
    if (!initialized.current || isResizing) return;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;
    setPosition((prev) =>
      snapToGrid(
        {
          left: Math.max(0, Math.min(prev.left, maxLeft)),
          bottom: Math.max(0, Math.min(prev.bottom, maxBottom)),
        },
        { maxLeft, maxBottom }
      )
    );
  }, [cardWidth, cardHeight, totalWidth, totalHeight, isResizing]);

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
    [position, editMode, isResizing]
  );

  const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
  const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, maxLeft, maxBottom]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
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
    [isDragging, maxLeft, maxBottom, storageScope]
  );

  const applyResizeDelta = useCallback((clientX: number, clientY: number) => {
    const start = resizeStart.current;
    const next = resizeWeatherCardFromBottomRight({
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
    [editMode, totalWidth, totalHeight, position.left, position.bottom]
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
        savePosition(storageScope, { left: next.left, bottom: next.bottom });
        onResize?.({ width: next.width, height: next.height });
        if (!onResize) setLiveSize(null);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isResizing, applyResizeDelta, storageScope, onResize]
  );

  return (
    <div
      className={cn(
        "card-plot-in fixed z-30",
        !editMode && "cursor-pointer",
        editMode && !isResizing && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && !isResizing && "animate-edit-wiggle"
      )}
      data-no-page-swipe={editMode || sheetOpen ? true : undefined}
      aria-haspopup="dialog"
      aria-expanded={sheetOpen}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
        height: totalHeight,
        ...(!editMode && !sheetOpen ? { touchAction: "pan-y" } : {}),
      }}
      {...(!editMode && {
        onPointerDown: startLongPress,
        onPointerMove: handlePressMove,
        onPointerUp: endLongPress,
        onPointerCancel: endLongPress,
        onClick: handleCardClick,
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
          "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white/10 shadow-xl backdrop-blur-2xl dark:bg-black/50",
          editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"
        )}
      >
        <WeatherCardWidget
          title={title}
          entity_id={entity_id}
          show_icon={show_icon}
          size="md"
          onMoreClick={editMode ? onEdit : undefined}
          className="flex-1 min-h-0"
        />
      </div>
      {editMode ? (
        <button
          type="button"
          aria-label={t("weatherCard.resize")}
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
      <WeatherBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} entityId={entity_id} />
    </div>
  );
}
