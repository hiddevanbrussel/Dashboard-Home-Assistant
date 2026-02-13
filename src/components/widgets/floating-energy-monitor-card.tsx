"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { EnergyMonitorCardWidget } from "./energy-monitor-card-widget";

const STORAGE_KEY = "dashboard.floatingEnergyMonitorCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_WIDTH = 360;
const DEFAULT_HEIGHT = 260;
const MAX_WIDTH = 420;

type Position = { left: number; bottom: number };

function loadPosition(cardHeight: number): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
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

function savePosition(p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
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

export function FloatingEnergyMonitorCard({
  title,
  background_image,
  minimal = false,
  scale: scaleProp,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  title: string;
  background_image?: string;
  minimal?: boolean;
  scale?: number;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const scale = Math.min(1.5, Math.max(0.5, scaleProp ?? 1));
  const cardWidth = Math.round(dimensions.width * scale);
  const cardHeight = Math.round(dimensions.height * scale);

  const [position, setPosition] = useState<Position>(() => loadPosition(DEFAULT_HEIGHT) ?? { left: 0, bottom: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!background_image) {
      setDimensions({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
      return;
    }
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w > 0 && h > 0) {
        const scale = Math.min(1, MAX_WIDTH / w);
        const width = Math.round(w * scale);
        const height = Math.round(h * scale);
        setDimensions({ width, height });
      }
    };
    img.src = background_image;
  }, [background_image]);

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
    if (typeof window === "undefined") return;
    if (!initialized.current) {
      initialized.current = true;
      const saved = loadPosition(cardHeight);
      if (saved) {
        setPosition(snapToGrid(saved));
        return;
      }
      const p = snapToGrid(defaultPosition(cardWidth, cardHeight));
      setPosition(p);
      savePosition(p);
    }
  }, [cardWidth, cardHeight]);

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
      const raw = {
        left: dragStart.current.left + dx,
        bottom: dragStart.current.bottom - dy,
      };
      setPosition(snapToGrid(raw));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const raw = {
          left: dragStart.current.left + dx,
          bottom: dragStart.current.bottom - dy,
        };
        const next = snapToGrid(raw);
        setPosition(next);
        savePosition(next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging]
  );

  return (
    <div
      className={cn(
        "fixed z-20 rounded-2xl",
        minimal
          ? "bg-transparent overflow-visible"
          : "overflow-hidden shadow-xl bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
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
      {/* Edit-knop rechtsonder: altijd zichtbaar ongeacht schaal */}
      {editMode && onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute right-2 bottom-2 z-50 p-1.5 rounded-lg shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Opties"
        >
          <MoreVertical className="h-5 w-5" aria-hidden />
        </button>
      )}
      <div className={cn("flex flex-col h-full min-h-0 overflow-hidden rounded-2xl", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
        <EnergyMonitorCardWidget
          title={title}
          background_image={background_image}
          minimal={minimal}
          size="md"
          onMoreClick={undefined}
          className="flex-1 min-h-0"
        />
      </div>
    </div>
  );
}
