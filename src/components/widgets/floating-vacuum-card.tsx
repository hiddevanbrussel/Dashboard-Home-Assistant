"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { snapToGrid, floatingPositionFromElement } from "@/lib/floating-card-grid";
import { VacuumCardWidget } from "./vacuum-card-widget";
import { VacuumBottomSheet } from "@/components/vacuum/vacuum-bottom-sheet";
import { isVacuumCardTap } from "@/lib/vacuum-card";

const STORAGE_KEY = "dashboard.floatingVacuumCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;

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

function defaultPosition(): Position {
  if (typeof window === "undefined") return { left: 100, bottom: DEFAULT_OFFSET };
  const maxLeft = window.innerWidth - CARD_WIDTH;
  const maxBottom = window.innerHeight - 120;
  return { left: maxLeft / 2, bottom: maxBottom / 2 };
}

const LONG_PRESS_MS = 500;
const TAP_MOVE_PX = 16;

export function FloatingVacuumCard({
  title,
  entity_id,
  script_ids = [],
  script_names = {},
  cleaned_area_entity_id,
  icon,
  editMode = false,
  storageScope,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  title: string;
  entity_id: string;
  script_ids?: string[];
  script_names?: Record<string, string>;
  cleaned_area_entity_id?: string;
  icon?: string;
  editMode?: boolean;
  storageScope?: string;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
  const [position, setPosition] = useState<Position>(() => loadPosition(storageScope) ?? { left: 0, bottom: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
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

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (editMode || sheetOpen) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      if (
        !isVacuumCardTap({
          longPressFired: longPressFiredRef.current,
          moved: movedRef.current,
        })
      ) {
        return;
      }
      e.preventDefault();
      setSheetOpen(true);
    },
    [editMode, sheetOpen]
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - CARD_WIDTH : 400;
    const maxBottom = typeof window !== "undefined" ? window.innerHeight - 120 : 400;
    const bounds = { maxLeft, maxBottom };
    const saved = loadPosition(storageScope);
    if (saved) {
      setPosition(snapToGrid(saved, bounds));
      return;
    }
    const p = snapToGrid(defaultPosition(), bounds);
    setPosition(p);
    savePosition(storageScope, p);
  }, [storageScope]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editMode) return;
      if ((e.target as HTMLElement).closest?.("button")) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      const measured = floatingPositionFromElement(e.currentTarget as HTMLElement);
      dragStart.current = { x: e.clientX, y: e.clientY, left: measured.left, bottom: measured.bottom };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
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
        savePosition(storageScope, next);
      }
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    },
    [isDragging, storageScope]
  );

  return (
    <div
      className={cn(
        "card-plot-in fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/90 dark:bg-black/50 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10",
        !editMode && "cursor-pointer",
        editMode && "cursor-grab touch-none active:cursor-grabbing",
        editMode && !isDragging && "animate-edit-wiggle"
      )}
      data-no-page-swipe={editMode || sheetOpen ? true : undefined}
      aria-haspopup="dialog"
      aria-expanded={sheetOpen}
      style={{
        left: position.left,
        bottom: position.bottom,
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
      <div className={cn(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none")}>
        <VacuumCardWidget title={title} entity_id={entity_id} script_ids={script_ids} script_names={script_names} cleaned_area_entity_id={cleaned_area_entity_id} icon={icon} size="md" onMoreClick={editMode ? onEdit : undefined} />
      </div>
      <VacuumBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
