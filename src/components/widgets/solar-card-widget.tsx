"use client";

import { MoreVertical, PanelTop, UtilityPole } from "lucide-react";
import type { SolarCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

function formatValue(value: number | undefined, unit: string): string {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  return unit ? `${rounded} ${unit}` : String(rounded);
}

function useEntityValue(entityId: string) {
  const entity = useEntityStateStore((s) => s.getState(entityId));
  const raw = entity?.state;
  const value = raw != null && raw !== "unavailable" && raw !== "unknown" ? Number(raw) : undefined;
  const unit = (entity?.attributes?.unit_of_measurement as string) ?? "W";
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entityId;
  return { value, unit, friendlyName };
}

export function SolarCardWidget({
  title = "Zonnepanelen",
  entity_id,
  consumption_entity_id,
  size = "md",
  className,
  onMoreClick,
}: SolarCardProps & { className?: string; onMoreClick?: () => void }) {
  const yieldData = useEntityValue(entity_id);
  const consumptionData = useEntityValue(consumption_entity_id ?? "");

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl shadow-xl backdrop-blur-2xl border",
        "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10",
        "text-gray-900 dark:text-white",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10">
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-600 dark:text-white/60 truncate">{yieldData.friendlyName}</p>
        </div>
        {onMoreClick && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
            className="p-1.5 rounded-lg shrink-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label="Opties"
          >
            <MoreVertical className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-amber-800/80 dark:text-white/60 mb-0.5">
            <PanelTop className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Yield
          </p>
          <p className="text-xl font-bold tabular-nums text-amber-700 dark:text-amber-400/95">
            {formatValue(yieldData.value, yieldData.unit)}
          </p>
        </div>
        {consumption_entity_id && (
          <div className="pt-2 border-t border-gray-200 dark:border-white/10">
            <p className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-white/60 mb-0.5">
              <UtilityPole className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Consumption
            </p>
            <p className="text-xl font-bold tabular-nums text-gray-900 dark:text-white/95">
              {formatValue(consumptionData.value, consumptionData.unit)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
