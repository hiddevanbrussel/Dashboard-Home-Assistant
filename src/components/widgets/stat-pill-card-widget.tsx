"use client";

import { MoreVertical } from "lucide-react";
import type { StatPillCardProps, SensorCondition } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { CARD_ICONS } from "./card-icons";

const CONDITION_COLORS: Record<string, string> = {
  red: "border-red-400/50 dark:border-red-400/40 bg-red-500/25 dark:bg-red-900/30",
  amber: "border-amber-400/50 dark:border-amber-400/40 bg-amber-500/25 dark:bg-amber-900/30",
  green: "border-green-400/50 dark:border-green-400/40 bg-green-500/25 dark:bg-green-900/30",
  emerald: "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
  blue: "border-blue-400/50 dark:border-blue-400/40 bg-blue-500/25 dark:bg-blue-900/30",
  violet: "border-violet-400/50 dark:border-violet-400/40 bg-violet-500/25 dark:bg-violet-900/30",
  purple: "border-purple-400/50 dark:border-purple-400/40 bg-purple-500/25 dark:bg-purple-900/30",
  slate: "border-slate-400/50 dark:border-slate-400/40 bg-slate-500/25 dark:bg-slate-900/30",
};

const ICON_COLORS: Record<string, string> = {
  red: "text-red-600 dark:text-red-300",
  amber: "text-amber-600 dark:text-amber-400",
  green: "text-green-600 dark:text-green-300",
  emerald: "text-emerald-600 dark:text-emerald-300",
  blue: "text-blue-600 dark:text-blue-300",
  violet: "text-violet-600 dark:text-violet-300",
  purple: "text-purple-600 dark:text-purple-300",
  slate: "text-slate-600 dark:text-slate-300",
};

function matchCondition(state: string | undefined, conditions: SensorCondition[] | undefined): string | null {
  if (state == null || state === "unavailable" || state === "unknown" || !conditions?.length) return null;
  const numState = Number(state);
  const isNumeric = !Number.isNaN(numState);
  for (const c of conditions) {
    const condValue = c.value.trim();
    if (!condValue) continue;
    const numCond = Number(condValue);
    const isNumericCond = condValue !== "" && !Number.isNaN(numCond);
    if (isNumeric && isNumericCond) {
      switch (c.operator) {
        case "gt": if (numState > numCond) return c.color; break;
        case "gte": if (numState >= numCond) return c.color; break;
        case "lt": if (numState < numCond) return c.color; break;
        case "lte": if (numState <= numCond) return c.color; break;
        case "eq": if (numState === numCond) return c.color; break;
        case "neq": if (numState !== numCond) return c.color; break;
        default: break;
      }
    } else {
      const s = String(state).toLowerCase();
      const v = condValue.toLowerCase();
      switch (c.operator) {
        case "eq": if (s === v) return c.color; break;
        case "neq": if (s !== v) return c.color; break;
        case "contains": if (s.includes(v) || v.includes(s)) return c.color; break;
        case "gt":
        case "gte":
        case "lt":
        case "lte":
          if (isNumeric && isNumericCond) {
            if (c.operator === "gt" && numState > numCond) return c.color;
            if (c.operator === "gte" && numState >= numCond) return c.color;
            if (c.operator === "lt" && numState < numCond) return c.color;
            if (c.operator === "lte" && numState <= numCond) return c.color;
          }
          break;
        default: break;
      }
    }
  }
  return null;
}

/** Abonneert op entity + updatedAt om betrouwbaar te re-renderen bij store-updates. */
function useEntityValue(entityId: string) {
  const entity = useEntityStateStore((s) => s.states[entityId]);
  useEntityStateStore((s) => s.updatedAt);
  const raw = entity?.state;
  const unit = (entity?.attributes?.unit_of_measurement as string) ?? "";
  if (raw == null || raw === "unavailable" || raw === "unknown") {
    return { display: "—" };
  }
  const num = Number(raw);
  if (!Number.isNaN(num)) {
    const rounded = Math.round(num * 10) / 10;
    return { display: unit ? `${rounded} ${unit}` : String(rounded) };
  }
  const str = String(raw);
  return { display: str.charAt(0).toUpperCase() + str.slice(1) };
}

const PILL_CLASSES: Record<"amber" | "purple" | "emerald" | "red", string> = {
  amber:
    "border-amber-400/50 dark:border-amber-400/40 bg-amber-500/25 dark:bg-amber-900/30",
  purple:
    "border-purple-400/50 dark:border-purple-400/40 bg-purple-500/25 dark:bg-purple-900/30",
  emerald:
    "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
  red: "border-red-400/50 dark:border-red-400/40 bg-red-500/25 dark:bg-red-900/30",
};

const ICON_CLASSES: Record<"amber" | "purple" | "emerald" | "red", string> = {
  amber: "text-amber-600 dark:text-amber-400",
  purple: "text-purple-600 dark:text-purple-300",
  emerald: "text-emerald-600 dark:text-emerald-300",
  red: "text-red-600 dark:text-red-300",
};

export const STAT_PILL_CONDITION_COLORS = Object.keys(CONDITION_COLORS);
export { SENSOR_CONDITION_OPERATORS } from "./sensor-card-widget";

export function StatPillCardWidget({
  title = "Stat",
  entity_id,
  label,
  icon: iconName,
  color = "amber",
  conditions,
  size = "md",
  className,
  onMoreClick,
}: StatPillCardProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.states[entity_id]);
  useEntityStateStore((s) => s.updatedAt);
  const state = entity?.state as string | undefined;
  const { display } = useEntityValue(entity_id);
  const IconComponent =
    iconName && CARD_ICONS[iconName] ? CARD_ICONS[iconName] : CARD_ICONS.Sun;
  const matchedColor = matchCondition(state, conditions);
  const pillClass = matchedColor && CONDITION_COLORS[matchedColor]
    ? CONDITION_COLORS[matchedColor]
    : PILL_CLASSES[color];
  const iconClass = matchedColor && ICON_COLORS[matchedColor]
    ? ICON_COLORS[matchedColor]
    : ICON_CLASSES[color];
  const iconClassName = cn("h-3.5 w-3.5 shrink-0", iconClass);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-4",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border backdrop-blur-xl shadow-lg px-3 py-1.5",
          "text-gray-900 dark:text-white",
          pillClass
        )}
      >
        <IconComponent className={iconClassName} aria-hidden />
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-xs font-bold tabular-nums leading-none text-inherit">
            {display}
          </span>
          <span className="text-[9px] font-medium leading-none opacity-80">
            {label ?? title}
          </span>
        </div>
      </div>
      {onMoreClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick();
          }}
          className="absolute right-2 bottom-2 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Opties"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
