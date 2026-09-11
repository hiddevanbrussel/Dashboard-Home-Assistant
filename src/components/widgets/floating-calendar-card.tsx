"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { CalendarCardWidget } from "./calendar-card-widget";

/** Right-hand activity panel: one third of the viewport, at least 20rem. */
export const CALENDAR_PANEL_WIDTH = "max(20rem, 33.333vw)";

const LONG_PRESS_MS = 500;

export function FloatingCalendarCard({
  widget,
  editMode = false,
  open = false,
  onClose,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  widget: { id: string; title?: string };
  widgetIndex?: number;
  editMode?: boolean;
  open?: boolean;
  onClose?: () => void;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const { t } = useTranslation();
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const clearLongPress = useCallback(() => {
    if (longPressTimerRef.current != null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback((e: React.PointerEvent) => {
    if (editMode || !onEnterEditMode) return;
    const target = e.target as HTMLElement;
    if (target?.closest?.("button,a") ?? false) return;
    clearLongPress();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      onEnterEditMode?.();
      onEdit?.();
    }, LONG_PRESS_MS);
  }, [editMode, onEnterEditMode, onEdit, clearLongPress]);

  if (!mounted) return null;

  return createPortal(
    <aside
      className={cn(
        "fixed z-40 flex flex-col overflow-hidden rounded-3xl border shadow-2xl",
        "top-20 bottom-4 right-4",
        "bg-white/90 dark:bg-gray-950/90 border-black/[0.06] dark:border-white/10 backdrop-blur-2xl",
        "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        open ? "translate-x-0" : "pointer-events-none translate-x-[calc(100%+1.25rem)]",
        editMode && open && "animate-edit-wiggle"
      )}
      style={{ width: CALENDAR_PANEL_WIDTH }}
      aria-label={t("calendar.activity")}
      aria-hidden={!open}
      {...(!editMode && onEnterEditMode && {
        onPointerDown: startLongPress,
        onPointerUp: clearLongPress,
        onPointerLeave: clearLongPress,
        onPointerCancel: clearLongPress,
      })}
    >
      {editMode && onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute left-3 top-3 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
          aria-label={t("editPanel.remove")}
        >
          ×
        </button>
      )}
      <CalendarCardWidget
        title={widget.title}
        onMoreClick={editMode ? onEdit : undefined}
      />
    </aside>,
    document.body
  );
}
