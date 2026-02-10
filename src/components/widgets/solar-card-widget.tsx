"use client";

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
}: SolarCardProps & { className?: string }) {
  const yieldData = useEntityValue(entity_id);
  const consumptionData = useEntityValue(consumption_entity_id ?? "");

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate text-white/90">{title}</p>
          <p className="text-xs text-white/60 truncate">{yieldData.friendlyName}</p>
        </div>
      </div>
      <div className="px-4 pb-4 pt-0 space-y-3">
        <div>
          <p className="text-xs text-white/60 mb-0.5">Yield</p>
          <p className="text-xl font-bold tabular-nums text-amber-400/95">
            {formatValue(yieldData.value, yieldData.unit)}
          </p>
        </div>
        {consumption_entity_id && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-white/60 mb-0.5">Consumption</p>
            <p className="text-xl font-bold tabular-nums text-white/95">
              {formatValue(consumptionData.value, consumptionData.unit)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
