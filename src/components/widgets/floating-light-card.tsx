"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { LightCardWidget } from "./light-card-widget";

const STORAGE_KEY = "dashboard.floatingLightCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 280;
const PILL_BAR_WIDTH = 44;

type Position = { left: number; bottom: number };

function loadPosition(): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
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

function savePosition(p: Position) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

function defaultPosition(totalWidth: number): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  return {
    left: window.innerWidth - totalWidth - DEFAULT_OFFSET,
    bottom: DEFAULT_OFFSET,
  };
}

export type LightCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  icon?: string;
};

export function FloatingLightCard({
  widgets: widgetsProp,
  editMode = false,
  onRemove,
  onEdit,
}: {
  widgets: LightCardWidgetItem[];
  editMode?: boolean;
  onRemove?: (widgetId: string) => void;
  onEdit?: (widgetId: string) => void;
}) {
  const widgets = widgetsProp ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (widgets.length === 0) return;
    setSelectedId((prev) => {
      const stillValid = prev != null && widgets.some((w) => w.id === prev);
      if (stillValid) return prev;
      return widgets[0]?.id ?? null;
    });
  }, [widgets]);

  const effectiveSelectedId = selectedId ?? widgets[0]?.id ?? null;
  const selected = widgets.find((w) => w.id === effectiveSelectedId) ?? widgets[0];

  const [position, setPosition] = useState<Position>(() => loadPosition() ?? { left: 0, bottom: DEFAULT_OFFSET });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);

  const hasPills = widgets.length > 1;
  const totalWidth = hasPills ? CARD_WIDTH + PILL_BAR_WIDTH : CARD_WIDTH;

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition();
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(totalWidth), bounds);
    setPosition(p);
    savePosition(p);
  }, [totalWidth]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        left: position.left,
        bottom: position.bottom,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, editMode]
  );

  const maxLeft = typeof window !== "undefined" ? window.innerWidth - totalWidth : 400;

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
        savePosition(next);
      }
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft]
  );

  if (widgets.length === 0) return null;

  return (
    <div
      className="fixed z-30 shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10 flex"
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
      }}
    >
      {hasPills && (
        <div className="w-[44px] shrink-0 flex flex-col border-r border-white/10 py-2 gap-1">
          {widgets.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setSelectedId(w.id)}
              className={cn(
                "w-8 h-8 mx-auto rounded-full text-xs font-medium transition-colors flex items-center justify-center truncate",
                w.id === effectiveSelectedId
                  ? "bg-white/25 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white/80"
              )}
              title={w.title}
            >
              <span className="truncate max-w-full" style={{ fontSize: "0.65rem" }}>
                {w.title.slice(0, 2)}
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="w-[280px] shrink-0 flex flex-col">
        {editMode && (
          <div className="flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2">
            <div
              role="button"
              tabIndex={0}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={(e) => {
                if (isDragging) handlePointerUp(e);
              }}
              className="select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing"
              aria-label="Drag to move"
            >
              Sleep om te verplaatsen
            </div>
            {onEdit && selected && (
              <button
                type="button"
                onClick={() => selected.id && onEdit(selected.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Edit light card"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onRemove && selected && (
              <button
                type="button"
                onClick={() => selected.id && onRemove(selected.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Remove light card"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
        <div className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
          {selected && (
            <LightCardWidget
              title={selected.title}
              entity_id={selected.entity_id}
              icon={selected.icon}
              size="md"
              onMoreClick={editMode ? () => selected.id && onEdit?.(selected.id) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
