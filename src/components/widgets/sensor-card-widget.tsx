"use client";

import { Info } from "lucide-react";
import type { SensorCardProps, SensorCondition } from "./widget-types";
import { cn, capitalizeFirst } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { CARD_ICONS } from "./card-icons";

const CONDITION_COLORS: Record<string, string> = {
  red: "border-red-400/50 dark:border-red-400/40 bg-red-500/25 dark:bg-red-900/30",
  amber: "border-amber-400/50 dark:border-amber-400/40 bg-amber-500/25 dark:bg-amber-900/30",
  green: "border-green-400/50 dark:border-green-400/40 bg-green-500/25 dark:bg-green-900/30",
  emerald: "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
  blue: "border-blue-400/50 dark:border-blue-400/40 bg-blue-500/25 dark:bg-blue-900/30",
  violet: "border-violet-400/50 dark:border-violet-400/40 bg-violet-500/25 dark:bg-violet-900/30",
  slate: "border-slate-400/50 dark:border-slate-400/40 bg-slate-500/25 dark:bg-slate-900/30",
};

export const SENSOR_CONDITION_COLORS = Object.keys(CONDITION_COLORS);
export const SENSOR_CONDITION_OPERATORS = ["eq", "neq", "gt", "gte", "lt", "lte", "contains"] as const;

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

export { CARD_ICON_OPTIONS as SENSOR_ICON_OPTIONS } from "./card-icons";

function formatValue(state: string | undefined): string {
  if (state == null || state === "unavailable" || state === "unknown") return "—";
  const num = Number(state);
  if (!Number.isNaN(num)) {
    if (Number.isInteger(num)) return String(num);
    return String(Math.round(num * 100) / 100);
  }
  return capitalizeFirst(state);
}

export function SensorCardWidget({
  title = "Sensor",
  entity_id,
  icon: iconName,
  size = "md",
  conditions,
  className,
}: SensorCardProps & { className?: string }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const state = entity?.state as string | undefined;
  const unit = (entity?.attributes?.unit_of_measurement as string) ?? "";
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;
  const IconComponent = (iconName && CARD_ICONS[iconName]) ? CARD_ICONS[iconName] : CARD_ICONS.Gauge;
  const displayValue = formatValue(state);
  const matchedColor = matchCondition(state, conditions);
  const conditionClass = matchedColor && CONDITION_COLORS[matchedColor] ? CONDITION_COLORS[matchedColor] : null;

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl text-white shadow-xl backdrop-blur-2xl border",
        conditionClass ?? "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
            <IconComponent className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-white/90">{title}</p>
            <p className="text-xs text-white/60 truncate">{friendlyName}</p>
          </div>
        </div>
        <div className="shrink-0 rounded-full p-1 text-white/50 hover:text-white/70" aria-label="Info">
          <Info className="h-4 w-4" aria-hidden />
        </div>
      </div>
      <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className={cn(
              "font-bold tabular-nums text-white",
              size === "sm" && "text-2xl",
              size === "md" && "text-3xl",
              size === "lg" && "text-4xl"
            )}
          >
            {displayValue}
          </span>
          {unit && (
            <span className="inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300/95">
              {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
