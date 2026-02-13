"use client";

import { MoreVertical } from "lucide-react";
import type { NutsCardProps } from "./widget-types";
import { CARD_ICONS } from "./card-icons";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";

function useEntityValue(entityId: string) {
  const entity = useEntityStateStore((s) => s.getState(entityId));
  if (!entity) return { value: undefined, unit: "" };
  const raw = entity.state;
  const value =
    raw != null && raw !== "unavailable" && raw !== "unknown"
      ? Number(raw)
      : undefined;
  const unit = (entity.attributes?.unit_of_measurement as string) ?? "";
  return { value, unit };
}

function formatValue(value: number | undefined, unit: string): string {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 100) / 100;
  return unit ? `${rounded} ${unit}` : String(rounded);
}

const DEFAULT_ICON_COLOR = "#3B82F6";

export function NutsCardWidget({
  title = "Gas",
  entity_id,
  current_entity_id,
  icon = "Fuel",
  icon_background_color,
  max_value = 10,
  className,
  onMoreClick,
}: NutsCardProps & { className?: string; onMoreClick?: () => void }) {
  const dailyData = useEntityValue(entity_id);
  const currentData = useEntityValue(current_entity_id ?? "");

  const currentVal = currentData.value ?? 0;
  const dailyVal = dailyData.value ?? 0;
  const unit = dailyData.unit || currentData.unit || "";

  const barPercent = max_value > 0 ? Math.min(100, (currentVal / max_value) * 100) : 0;

  const IconComponent = CARD_ICONS[icon] ?? CARD_ICONS.Fuel;
  const iconBg = icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(icon_background_color) ? icon_background_color : DEFAULT_ICON_COLOR;

  return (
    <div
      className={cn(
        "flex w-full flex-1 min-h-0 overflow-hidden rounded-2xl min-h-[130px]",
        "bg-white/10 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10",
        className
      )}
    >
      <div className="flex flex-1 min-w-0 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-2">
            <div
              className="flex shrink-0 items-center justify-center h-10 w-10 rounded-xl"
              style={{ backgroundColor: `${iconBg}20`, color: iconBg }}
            >
              <IconComponent className="h-5 w-5" aria-hidden />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white truncate max-w-full">{title}</p>
          </div>
          {onMoreClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="p-1.5 rounded-lg shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            aria-label="Opties"
          >
            <MoreVertical className="h-5 w-5" aria-hidden />
          </button>
        )}
        </div>
        <p className="text-sm text-gray-600 dark:text-white/70 tabular-nums mt-1">
          {formatValue(currentVal, unit)} • {formatValue(dailyVal, unit)}
        </p>
      </div>
      <div className="relative shrink-0 self-center w-5 h-[110px] my-3 mx-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300"
          style={{
            height: `${barPercent}%`,
            minHeight: barPercent > 0 ? 4 : 0,
            backgroundColor: iconBg,
          }}
        />
      </div>
    </div>
  );
}
