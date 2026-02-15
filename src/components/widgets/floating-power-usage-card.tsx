"use client";

import { useRef, useCallback } from "react";
import { PowerUsageCardWidget } from "./power-usage-card-widget";

const LONG_PRESS_MS = 500;

export function FloatingPowerUsageCard({
  title,
  entity_id,
  device_entity_ids = [],
  cost_per_kwh,
  editMode = false,
  onRemove,
  onEdit,
  onEnterEditMode,
}: {
  title: string;
  entity_id?: string;
  device_entity_ids?: string[];
  cost_per_kwh?: number;
  editMode?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
  onEnterEditMode?: () => void;
}) {
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

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(96vw,400px)] z-30"
      onPointerDown={startLongPress}
      onPointerUp={endLongPress}
      onPointerLeave={endLongPress}
      onPointerCancel={endLongPress}
      style={{ touchAction: "none" }}
    >
      <PowerUsageCardWidget
        title={title}
        entity_id={entity_id}
        device_entity_ids={device_entity_ids}
        cost_per_kwh={cost_per_kwh}
        onMoreClick={editMode ? onEdit : undefined}
        className="relative"
      />
    </div>
  );
}
