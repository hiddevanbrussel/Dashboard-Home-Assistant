"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { snapToGrid } from "@/lib/floating-card-grid";
import { MediaCardWidget } from "./media-card-widget";

const STORAGE_KEY = "dashboard.floatingMediaCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;

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

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  return {
    left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET,
    bottom: DEFAULT_OFFSET,
  };
}

export function FloatingMediaCard({
  title,
  entity_id,
  editMode = false,
  onRemove,
  onEdit,
}: {
  title: string;
  entity_id: string;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition() ?? { left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
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
  }, []);

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

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
      const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
      const raw = {
        left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
        bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom)),
      };
      setPosition(snapToGrid(raw, { maxLeft, maxBottom }));
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
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
    [isDragging]
  );

  return (
    <div
      className="fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10"
      style={{
        left: position.left,
        bottom: position.bottom,
      }}
    >
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
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Edit media card"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Remove media card"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      <div className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
        <MediaCardWidget title={title} entity_id={entity_id} size="md" />
      </div>
    </div>
  );
}
