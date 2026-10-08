"use client";

import { MoreVertical } from "lucide-react";
import type { StatPillCardProps, SensorCondition } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { CARD_ICONS, STAT_PILL_ICON_OPTIONS, normalizeStatPillIconKey } from "./card-icons";
import { useTranslation } from "@/hooks/use-translation";

export { STAT_PILL_ICON_OPTIONS, normalizeStatPillIconKey };

const CONDITION_COLORS: Record<string, string> = {
  red: "border-red-400/80 dark:border-red-400/60 bg-red-400/80 dark:bg-red-950/85",
  amber: "border-amber-400/80 dark:border-amber-400/60 bg-amber-400/80 dark:bg-amber-950/85",
  green: "border-green-400/80 dark:border-green-400/60 bg-green-400/80 dark:bg-green-950/85",
  emerald: "border-emerald-400/80 dark:border-emerald-400/60 bg-emerald-400/80 dark:bg-emerald-950/85",
  blue: "border-blue-400/80 dark:border-blue-400/60 bg-blue-400/80 dark:bg-blue-950/85",
  violet: "border-violet-400/80 dark:border-violet-400/60 bg-violet-400/80 dark:bg-violet-950/85",
  purple: "border-purple-400/80 dark:border-purple-400/60 bg-purple-400/80 dark:bg-purple-950/85",
  slate: "border-slate-400/80 dark:border-slate-400/60 bg-slate-400/80 dark:bg-slate-950/85",
};

const ICON_COLORS: Record<string, string> = {
  red: "text-red-700 dark:text-red-200",
  amber: "text-amber-800 dark:text-amber-200",
  green: "text-green-700 dark:text-green-200",
  emerald: "text-emerald-800 dark:text-emerald-200",
  blue: "text-blue-700 dark:text-blue-200",
  violet: "text-violet-700 dark:text-violet-200",
  purple: "text-purple-700 dark:text-purple-200",
  slate: "text-slate-700 dark:text-slate-200",
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

/** Higher opacity than before (/25→/80, dark /30→/85) so pills stay readable on energy backgrounds. */
const PILL_CLASSES: Record<"amber" | "purple" | "emerald" | "red", string> = {
  amber:
    "border-amber-400/80 dark:border-amber-400/60 bg-amber-400/80 dark:bg-amber-950/85",
  purple:
    "border-purple-400/80 dark:border-purple-400/60 bg-purple-400/80 dark:bg-purple-950/85",
  emerald:
    "border-emerald-400/80 dark:border-emerald-400/60 bg-emerald-400/80 dark:bg-emerald-950/85",
  red: "border-red-400/80 dark:border-red-400/60 bg-red-400/80 dark:bg-red-950/85",
};

const ICON_CLASSES: Record<"amber" | "purple" | "emerald" | "red", string> = {
  amber: "text-amber-800 dark:text-amber-200",
  purple: "text-purple-700 dark:text-purple-200",
  emerald: "text-emerald-800 dark:text-emerald-200",
  red: "text-red-700 dark:text-red-200",
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
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.states[entity_id]);
  useEntityStateStore((s) => s.updatedAt);
  const state = entity?.state as string | undefined;
  const { display } = useEntityValue(entity_id);
  const IconComponent =
    (iconName && CARD_ICONS[iconName]) ||
    CARD_ICONS[normalizeStatPillIconKey(iconName)] ||
    CARD_ICONS.sun;
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
        "relative inline-flex",
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
          className="absolute -right-1.5 -top-1.5 z-10 rounded-full bg-white/90 p-1 text-gray-500 shadow-sm ring-1 ring-black/5 hover:text-gray-700 dark:bg-zinc-900 dark:text-gray-300 dark:ring-white/10 dark:hover:text-white"
          aria-label={t("common.options")}
        >
          <MoreVertical className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
}
