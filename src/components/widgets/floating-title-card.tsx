"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";

const STORAGE_KEY_PREFIX = "dashboard.floatingWelcomeCardPosition.";
const DEFAULT_OFFSET = 24;
const PANEL_WIDTH = 280;

type Position = { left: number; bottom: number };

function loadPosition(widgetId: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - 120 };
    }
  } catch {
    // ignore
  }
  return null;
}

function savePosition(widgetId: string, p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - PANEL_WIDTH;
  const maxBottom = window.innerHeight - 120;
  return { left: maxLeft / 2, bottom: maxBottom / 2 };
}

export type TitleCardWidgetItem = {
  id: string;
  title: string;
};

const LONG_PRESS_MS = 500;

export type WelcomeCardMode = "title" | "subtitle" | "both";

export function FloatingTitleCard({
  welcomeTitle,
  welcomeSubtitle,
  widgetId,
  mode = "both",
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  widgetId: string;
  /** "title" = alleen titel, "subtitle" = alleen ondertitel, "both" = beide */
  mode?: WelcomeCardMode;
  editMode?: boolean;
  onRemove?: (widgetId: string) => void;
  onEdit?: (widgetId: string) => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition(widgetId) ?? { left: 0, bottom: DEFAULT_OFFSET });
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
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - PANEL_WIDTH : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(widgetId);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(), bounds);
    setPosition(p);
    savePosition(widgetId, p);
  }, [widgetId]);

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

  const maxLeft = typeof window !== "undefined" ? window.innerWidth - PANEL_WIDTH : 400;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging, maxLeft]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(widgetId, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft, widgetId]
  );

  const showTitle = (mode === "title" || mode === "both") && welcomeTitle?.trim();
  const showSubtitle = (mode === "subtitle" || mode === "both") && welcomeSubtitle?.trim();
  const hasContent = Boolean(showTitle || showSubtitle);

  return (
    <div
      className={cn(
        "fixed z-30 flex flex-col rounded-2xl overflow-hidden shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10",
        hasContent ? "bg-white/10 dark:bg-black/50" : "bg-white/5 dark:bg-black/30",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
        width: PANEL_WIDTH,
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
      <div className="p-4 flex flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {showTitle && (
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                {welcomeTitle?.trim()}
              </p>
            )}
            {showSubtitle && (
              <p className={cn(
                "font-normal text-gray-600 dark:text-gray-300 truncate",
                showTitle && "mt-1",
                "text-base md:text-lg"
              )}>
                {welcomeSubtitle?.trim()}
              </p>
            )}
          </div>
          {editMode && onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(widgetId); }}
              className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400"
              aria-label="Opties"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
