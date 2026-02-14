"use client";

import { MoreVertical, Sun } from "lucide-react";
import type { EnergyMonitorCardProps, ImageCondition } from "./widget-types";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";
import { useEntityStateStore } from "@/stores/entity-state-store";

function matchImageCondition(
  state: string | undefined,
  conditions: ImageCondition[] | undefined
): ImageCondition | null {
  if (state == null || state === "unavailable" || state === "unknown" || !conditions?.length) return null;
  const numState = Number(state);
  const isNumeric = !Number.isNaN(numState);
  for (const c of conditions) {
    const condValue = c.value.trim();
    if (!condValue || !c.image?.trim()) continue;
    const numCond = Number(condValue);
    const isNumericCond = condValue !== "" && !Number.isNaN(numCond);
    if (isNumeric && isNumericCond) {
      switch (c.operator) {
        case "gt": if (numState > numCond) return c; break;
        case "gte": if (numState >= numCond) return c; break;
        case "lt": if (numState < numCond) return c; break;
        case "lte": if (numState <= numCond) return c; break;
        case "eq": if (numState === numCond) return c; break;
        case "neq": if (numState !== numCond) return c; break;
        default: break;
      }
    } else {
      const s = String(state).toLowerCase();
      const v = condValue.toLowerCase();
      switch (c.operator) {
        case "eq": if (s === v) return c; break;
        case "neq": if (s !== v) return c; break;
        case "contains": if (s.includes(v) || v.includes(s)) return c; break;
        case "gt":
        case "gte":
        case "lt":
        case "lte":
          if (isNumeric && isNumericCond) {
            if (c.operator === "gt" && numState > numCond) return c;
            if (c.operator === "gte" && numState >= numCond) return c;
            if (c.operator === "lt" && numState < numCond) return c;
            if (c.operator === "lte" && numState <= numCond) return c;
          }
          break;
        default: break;
      }
    }
  }
  return null;
}

export function EnergyMonitorCardWidget({
  title = "Afbeeldingskaart",
  entity_id,
  background_image,
  background_image_dark,
  image_conditions,
  minimal = false,
  size = "md",
  className,
  onMoreClick,
}: EnergyMonitorCardProps & { className?: string; onMoreClick?: () => void }) {
  const { resolved: theme } = useThemeStore();
  const isDark = theme === "dark";
  const entity = useEntityStateStore((s) => (entity_id ? s.states[entity_id] : undefined));
  useEntityStateStore((s) => s.updatedAt);
  const state = entity?.state as string | undefined;
  const matched = entity_id && image_conditions?.length
    ? matchImageCondition(state, image_conditions)
    : null;
  const condImage = matched
    ? (isDark && matched.image_dark ? matched.image_dark : matched.image)
    : null;
  const effectiveImage = condImage ?? (isDark && background_image_dark ? background_image_dark : background_image);

  return (
    <div
      className={cn(
        "relative flex w-full min-h-[200px] flex-col overflow-hidden rounded-2xl text-white",
        !minimal && "shadow-xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      {/* Achtergrond: afbeelding of gradient */}
      {effectiveImage ? (
        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center",
            !minimal && "bg-slate-900"
          )}
        >
          <img
            src={effectiveImage}
            alt=""
            className="w-full h-full object-contain object-center"
          />
        </div>
      ) : (
        !minimal && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl"
            aria-hidden
          />
        )
      )}
      {!minimal && (
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40 rounded-2xl" />
      )}

      <div className="relative flex flex-col z-10 flex-1 min-h-0">
        {!minimal ? (
          <div className="flex items-center justify-between gap-2 flex-shrink-0 px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/30 text-amber-400">
                <Sun className="h-5 w-5" aria-hidden />
              </div>
              <p className="font-semibold text-white/95">{title}</p>
            </div>
            {onMoreClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoreClick();
                }}
                className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Opties"
              >
                <MoreVertical className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        ) : onMoreClick ? (
          <div className="absolute right-2 top-2 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Opties"
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
