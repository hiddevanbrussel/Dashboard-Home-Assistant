"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { MoreVertical } from "lucide-react";
import { PillCardWidget } from "./pill-card-widget";
import type { WidgetConfig } from "@/stores/onboarding-store";

const STORAGE_KEY_PREFIX = "dashboard.floatingCardGroupPosition.";
const DEFAULT_OFFSET = 24;
const CARD_MIN_WIDTH = 200;
const CARD_MIN_HEIGHT = 80;
/** Extra marge links/onder zodat de kaart tot aan de rand geplaatst kan worden. Rechts/boven geen overflow zodat de kaart niet uit het scherm kan. */
const DRAG_OVERFLOW_LEFT_BOTTOM = 24;

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

function defaultPosition(widgetIndex: number): Position {
  if (typeof window === "undefined") return { left: DEFAULT_OFFSET, bottom: DEFAULT_OFFSET };
  return {
    left: DEFAULT_OFFSET + widgetIndex * 80,
    bottom: DEFAULT_OFFSET,
  };
}

const JUSTIFY_MAP = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

const LONG_PRESS_MS = 500;

export function FloatingCardGroup({
  group,
  widgetIndex = 0,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  group: WidgetConfig & { children?: WidgetConfig[] };
  widgetIndex?: number;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const alignment = (group.alignment as keyof typeof JUSTIFY_MAP) ?? "start";
  const children = group.children ?? [];
  const [position, setPosition] = useState<Position>(() => loadPosition(group.id) ?? { left: 0, bottom: DEFAULT_OFFSET });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0, width: CARD_MIN_WIDTH, height: CARD_MIN_HEIGHT });
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
    const w = typeof window !== "undefined" ? window.innerWidth : 400;
    const h = typeof window !== "undefined" ? window.innerHeight : 400;
    const maxLeft = w - CARD_MIN_WIDTH;
    const maxBottom = h - CARD_MIN_HEIGHT;
    const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
    const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
    const bounds = { maxLeft, maxBottom, minLeft, minBottom };
    const saved = loadPosition(group.id);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(widgetIndex), bounds);
    setPosition(p);
    savePosition(group.id, p);
  }, [group.id, widgetIndex]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement).closest?.("[data-group-opts]")) return;
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: position.left,
        bottom: position.bottom,
        width: el.offsetWidth,
        height: el.offsetHeight,
      };
      el.setPointerCapture?.(e.pointerId);
      setIsDragging(true);
    },
    [position, editMode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const w = typeof window !== "undefined" ? window.innerWidth : 400;
      const h = typeof window !== "undefined" ? window.innerHeight : 400;
      const maxLeft = w - dragStart.current.width;
      const maxBottom = h - dragStart.current.height;
      const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
      const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
      setPosition(
        snapToGrid(
          {
            left: Math.max(minLeft, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(minBottom, Math.min(dragStart.current.bottom - dy, maxBottom)),
          },
          { maxLeft, maxBottom, minLeft, minBottom }
        )
      );
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const w = typeof window !== "undefined" ? window.innerWidth : 400;
        const h = typeof window !== "undefined" ? window.innerHeight : 400;
        const maxLeft = w - dragStart.current.width;
        const maxBottom = h - dragStart.current.height;
        const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
        const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
        const next = snapToGrid(
          {
            left: Math.max(minLeft, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(minBottom, Math.min(dragStart.current.bottom - dy, maxBottom)),
          },
          { maxLeft, maxBottom, minLeft, minBottom }
        );
        setPosition(next);
        savePosition(group.id, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, group.id]
  );

  return (
    <div
      className={cn(
        "fixed z-30 w-max max-w-[90vw] shadow-xl rounded-2xl overflow-hidden relative",
        editMode && "bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      style={{
        left: position.left,
        bottom: position.bottom,
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
      {editMode && onEdit && (
        <button
          type="button"
          data-group-opts
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="absolute right-2 top-2 z-10 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Opties"
          title="Bewerken of verwijderen"
        >
          <MoreVertical className="h-5 w-5" aria-hidden />
        </button>
      )}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-2 min-h-[52px]",
          JUSTIFY_MAP[alignment] ?? "justify-start"
        )}
      >
        {children
          .filter((c): c is WidgetConfig & { type: "pill_card" } => c.type === "pill_card")
          .map((child) => (
            <PillCardWidget
              key={child.id}
              title={child.title ?? "Pill"}
              entity_id={child.entity_id ?? ""}
              icon={child.icon}
              conditions={child.conditions}
              show_state={child.show_state !== false}
              onMoreClick={undefined}
            />
          ))}
        {editMode && children.length === 0 && (
          <button
            type="button"
            data-group-opts
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="text-sm text-white/60 hover:text-white/90 border border-dashed border-white/30 rounded-lg px-3 py-2"
          >
            + Kaart toevoegen
          </button>
        )}
      </div>
    </div>
  );
}
