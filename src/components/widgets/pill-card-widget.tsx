"use client";

import { MoreVertical } from "lucide-react";
import type { PillCardProps, SensorCondition } from "./widget-types";
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

export const PILL_CONDITION_COLORS = Object.keys(CONDITION_COLORS);
export const PILL_CONDITION_OPERATORS = ["eq", "neq", "gt", "gte", "lt", "lte", "contains"] as const;

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

function formatValue(state: string | undefined): string {
  if (state == null || state === "unavailable" || state === "unknown") return "—";
  const num = Number(state);
  if (!Number.isNaN(num)) {
    if (Number.isInteger(num)) return String(num);
    return String(Math.round(num * 100) / 100);
  }
  return capitalizeFirst(state);
}

const TOGGLE_DOMAINS = ["switch", "light", "input_boolean"];

/** Styling op basis van status wanneer geen voorwaarde matcht: aan = actief, uit = gedempt. */
const STATUS_STYLE = {
  on: "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
  off: "border-white/10 dark:border-white/10 bg-white/5 dark:bg-black/40 opacity-90",
  neutral: "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10",
} as const;

export function PillCardWidget({
  title = "Pill",
  entity_id,
  icon: iconName,
  conditions,
  show_state = true,
  className,
  onMoreClick,
}: PillCardProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const setStates = useEntityStateStore((s) => s.setStates);
  const state = entity?.state as string | undefined;
  const unit = (entity?.attributes?.unit_of_measurement as string) ?? "";
  const domain = entity_id.split(".")[0] ?? "";
  const canToggle = TOGGLE_DOMAINS.includes(domain);
  const isOn = state === "on";

  const IconComponent = (iconName && CARD_ICONS[iconName]) ? CARD_ICONS[iconName] : CARD_ICONS.CircleDot;
  const displayValue = canToggle ? (isOn ? "Aan" : "Uit") : formatValue(state);
  const matchedColor = matchCondition(state, conditions);
  const conditionClass = matchedColor && CONDITION_COLORS[matchedColor]
    ? CONDITION_COLORS[matchedColor]
    : canToggle
      ? (isOn ? STATUS_STYLE.on : STATUS_STYLE.off)
      : STATUS_STYLE.neutral;

  async function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (!canToggle) return;
    const nextOn = !isOn;
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id,
          domain,
          service: nextOn ? "turn_on" : "turn_off",
          service_data: { entity_id },
        }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
      }
    } catch {
      // ignore
    }
  }

  const iconOnly = !show_state;

  return (
    <div
      className={cn(
        "flex items-center h-9 rounded-full border text-sm font-medium shadow-lg backdrop-blur-xl text-white min-w-0 transition-colors duration-200",
        conditionClass,
        canToggle && "cursor-pointer hover:opacity-90 transition-opacity",
        iconOnly
          ? onMoreClick
            ? "relative w-12 h-9 px-1.5 justify-center shrink-0"
            : "relative w-9 h-9 p-0 justify-center shrink-0"
          : "gap-2 pl-0.5 pr-3",
        className
      )}
      {...(canToggle && { onClick: handleToggle, role: "button", "aria-pressed": isOn })}
      title={iconOnly ? `${title}${state != null && state !== "unavailable" ? `: ${displayValue}` : ""}` : undefined}
    >
      <div
        className={cn(
          "shrink-0 items-center justify-center rounded-full bg-white/15 text-white flex",
          iconOnly ? "h-7 w-7" : "h-7 w-7"
        )}
      >
        <IconComponent className="h-4 w-4" aria-hidden />
      </div>
      {!iconOnly && (
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <span className="truncate text-white/95">{title}</span>
          <span className="tabular-nums text-white shrink-0">
            {displayValue}
            {unit && !canToggle && <span className="text-white/70 ml-0.5">{unit}</span>}
          </span>
        </div>
      )}
      {onMoreClick && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
          className={cn(
            "rounded-full shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
            iconOnly ? "absolute -right-0.5 -top-0.5 p-0.5" : "p-1"
          )}
          aria-label="Opties"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
