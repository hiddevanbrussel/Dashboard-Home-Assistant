"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, floatingPositionFromElement } from "@/lib/floating-card-grid";
import { CameraCardWidget } from "./camera-card-widget";
import { useTranslation } from "@/hooks/use-translation";

const STORAGE_KEY = "dashboard.floatingCameraCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 360;
const MIN_WIDTH = 200;
const MAX_WIDTH = 600;
const DEFAULT_CARD_HEIGHT = 270;
const MIN_HEIGHT = 150;
const MAX_HEIGHT = 450;

function clampWidth(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}

function clampHeight(w: unknown): number {
  const n = Number(w);
  if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}

type Position = { left: number; bottom: number };

function storageKeyForScope(scope: string | undefined, widgetId?: string): string {
  if (widgetId) return scope ? `${STORAGE_KEY}.${scope}.${widgetId}` : `${STORAGE_KEY}.${widgetId}`;
  return scope ? `${STORAGE_KEY}.${scope}` : STORAGE_KEY;
}

function loadPosition(scope: string | undefined, widgetId?: string): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(storageKeyForScope(scope, widgetId));
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number") return { left: p.left, bottom: p.bottom };
    if (typeof p?.left === "number" && typeof p?.top === "number") {
      return { left: p.left, bottom: window.innerHeight - p.top - DEFAULT_CARD_HEIGHT };
    }
  } catch {
    // ignore
  }
  return null;
}

function savePosition(scope: string | undefined, p: Position, widgetId?: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKeyForScope(scope, widgetId), JSON.stringify(p));
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

export function FloatingCameraCard({
  title,
  entity_id,
  refresh = 10,
  show_title = true,
  width,
  height,
  editMode = false,
  storageScope,
  widgetId,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  title: string;
  entity_id: string;
  refresh?: number;
  show_title?: boolean;
  width?: number;
  height?: number;
  editMode?: boolean;
  /** Dashboard/room id so position is stored per page. */
  storageScope?: string;
  /** Unieke id van de widget (nodig bij meerdere camera-kaarten voor aparte posities). */
  widgetId?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const { t } = useTranslation();
  const totalWidth = clampWidth(width);
  const totalHeight = clampHeight(height);
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope, widgetId) ?? { left: 0, bottom: 0 });
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
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - totalHeight - 24 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope, widgetId);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(totalWidth, totalHeight), bounds);
    setPosition(p);
    savePosition(storageScope, p, widgetId);
  }, [totalWidth, totalHeight, storageScope, widgetId]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
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
    [editMode]
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
        savePosition(storageScope, next, widgetId);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft, maxBottom, storageScope, widgetId]
  );

  return (
    <div
      className={cn(
        "card-plot-in fixed z-30 shadow-xl rounded-2xl bg-black/90 backdrop-blur-2xl",
        !editMode && "overflow-hidden",
        editMode && "relative cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
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
      <div className={cn("flex flex-col h-full min-h-0 overflow-hidden rounded-2xl", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
        <CameraCardWidget
          title={title}
          entity_id={entity_id}
          refresh={refresh}
          show_title={show_title}
          size="md"
          onMoreClick={editMode ? onEdit : undefined}
          className="flex-1 min-h-0"
        />
      </div>
      {editMode && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
          aria-label={t("editPanel.remove")}
        >
          ×
        </button>
      )}
    </div>
  );
}
