"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Pencil, X, Thermometer, Snowflake, Flame, Wind, Sun, Home, AirVent } from "lucide-react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { ClimateCardWidget } from "./climate-card-widget";
import { ClimateCard2Widget } from "./climate-card-2-widget";

const CLIMATE_ICONS: Record<string, React.ReactNode> = {
  AirVent: <AirVent className="h-3.5 w-3.5" aria-hidden />,
  Thermometer: <Thermometer className="h-3.5 w-3.5" aria-hidden />,
  Snowflake: <Snowflake className="h-3.5 w-3.5" aria-hidden />,
  Flame: <Flame className="h-3.5 w-3.5" aria-hidden />,
  Wind: <Wind className="h-3.5 w-3.5" aria-hidden />,
  Sun: <Sun className="h-3.5 w-3.5" aria-hidden />,
  Home: <Home className="h-3.5 w-3.5" aria-hidden />,
};

/** Beschikbare iconen voor climate-card tab; te gebruiken in de edit-modal met zoekfunctie. */
export const CLIMATE_ICON_OPTIONS = Object.keys(CLIMATE_ICONS).sort();

const STORAGE_KEY = "dashboard.floatingClimateCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
const PILL_BAR_WIDTH = 52;

type Position = { left: number; bottom: number };

function loadPosition(): Position | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    const p = JSON.parse(s) as Position & { top?: number };
    if (typeof p?.left === "number" && typeof p?.bottom === "number")
      return { left: p.left, bottom: p.bottom };
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

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  return {
    left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET - 344,
    bottom: DEFAULT_OFFSET,
  };
}

export type ClimateCardWidgetItem = {
  id: string;
  title: string;
  entity_id: string;
  humidity_entity_id?: string;
  icon?: string;
  type?: "climate_card" | "climate_card_2";
};

export function FloatingClimateCard({
  widgets: widgetsProp,
  title: titleProp,
  entity_id: entityIdProp,
  editMode = false,
  onRemove,
  onEdit,
}: {
  /** Meerdere climate widgets: toont pillbox om te wisselen. Bij één widget mag je title + entity_id gebruiken. */
  widgets?: ClimateCardWidgetItem[];
  title?: string;
  entity_id?: string;
  editMode?: boolean;
  onRemove?: (widgetId: string) => void;
  onEdit?: (widgetId: string) => void;
}) {
  const widgets = widgetsProp ?? (titleProp != null && entityIdProp != null ? [{ id: "", title: titleProp, entity_id: entityIdProp, type: "climate_card" as const }] : []);
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

  const [position, setPosition] = useState<Position>(() =>
    loadPosition() ?? { left: 0, bottom: DEFAULT_OFFSET }
  );
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
    const p = snapToGrid(defaultPosition(), bounds);
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
      const maxBottom =
        typeof window !== "undefined" ? window.innerHeight - 120 : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(
          0,
          Math.min(dragStart.current.bottom - dy, maxBottom)
        ),
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
        const maxBottom =
          typeof window !== "undefined" ? window.innerHeight - 120 : 400;
        const raw = {
          left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
          bottom: Math.max(
            0,
            Math.min(dragStart.current.bottom - dy, maxBottom)
          ),
        };
        const next = snapToGrid(raw, { maxLeft, maxBottom });
        setPosition(next);
        savePosition(next);
      }
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, maxLeft]
  );

  return (
    <div
      className="fixed z-30 flex shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10"
      style={{
        left: position.left,
        bottom: position.bottom,
        width: totalWidth,
      }}
    >
      {hasPills && (
        <div className="flex flex-col gap-0.5 py-2 pl-2 pr-1.5 border-r border-white/10 shrink-0 w-[52px]">
          {widgets.map((w) => {
            const isSelected = w.id === effectiveSelectedId;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedId(w.id)}
                className={cn(
                  "flex items-center justify-center rounded-lg p-2 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-[#4D2FB2] text-white shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                aria-label={w.title || "Climate"}
                title={w.title || "Climate"}
              >
                {w.icon && CLIMATE_ICONS[w.icon] ? (
                  <span className="flex shrink-0">{CLIMATE_ICONS[w.icon]}</span>
                ) : (
                  <span>{w.title?.charAt(0)?.toUpperCase() || "—"}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <div className="flex flex-col min-w-0 flex-1 w-[320px]">
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
              aria-label="Sleep om te verplaatsen"
            >
              Sleep om te verplaatsen
            </div>
            {onEdit && selected && (
              <button
                type="button"
                onClick={() => onEdit(selected.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Edit climate card"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onRemove && selected && (
              <button
                type="button"
                onClick={() => onRemove(selected.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Remove climate card"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
        <div className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
          {selected && selected.type === "climate_card_2" ? (
            <ClimateCard2Widget
              title={selected.title}
              entity_id={selected.entity_id}
              humidity_entity_id={selected.humidity_entity_id}
              size="md"
              onMoreClick={editMode ? () => selected.id && onEdit?.(selected.id) : undefined}
            />
          ) : selected ? (
            <ClimateCardWidget title={selected.title} entity_id={selected.entity_id} size="md" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
