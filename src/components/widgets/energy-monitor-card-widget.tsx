"use client";

import { MoreVertical } from "lucide-react";
import type { EnergyMonitorCardProps, ImageCondition } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useThemeStore } from "@/stores/theme-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";

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

/** Bare image card: no title, border, or glass background — image only. */
export function EnergyMonitorCardWidget({
  entity_id,
  background_image,
  background_image_dark,
  image_conditions,
  className,
  onMoreClick,
}: EnergyMonitorCardProps & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
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
        "relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-transparent",
        className
      )}
    >
      {effectiveImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={withBasePath(effectiveImage)}
          alt=""
          className="absolute inset-0 h-full w-full rounded-2xl object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/10 text-xs text-gray-500 dark:bg-white/5 dark:text-gray-400"
          aria-hidden
        >
          {/* Empty placeholder — no chrome frame */}
        </div>
      )}

      {onMoreClick ? (
        <div className="absolute right-0.5 top-0.5 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick();
            }}
            className="rounded-md p-0.5 shrink-0 text-white/80 hover:bg-black/30 hover:text-white transition-colors"
            aria-label={t("common.options")}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
