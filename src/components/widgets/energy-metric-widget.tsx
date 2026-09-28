"use client";

import { MoreVertical } from "lucide-react";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  ENERGY_METRIC_DEFAULT_COLOR,
  resolveEnergyMetricValue,
} from "@/lib/energy-metric";
import { cn } from "@/lib/utils";
import type { EnergyMetricProps } from "./widget-types";

/**
 * Loose floating metric: small title above, large value + unit below.
 * Transparent — sits on the energy illustration like the mockup labels.
 */
export function EnergyMetricWidget({
  title,
  entity_id,
  unit,
  manual_value,
  secondary,
  color,
  unit_as_prefix,
  className,
  onMoreClick,
}: EnergyMetricProps & {
  className?: string;
  onMoreClick?: () => void;
}) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) =>
    entity_id ? s.states[entity_id] : undefined
  );
  useEntityStateStore((s) => s.updatedAt);

  const entityUnit =
    (entity?.attributes?.unit_of_measurement as string | undefined) ?? "";
  const { display } = resolveEnergyMetricValue({
    entityState: entity?.state,
    entityUnit,
    manualValue: manual_value,
    unitOverride: unit,
    secondary,
    unitAsPrefix: unit_as_prefix,
  });

  const textColor = color?.trim() || ENERGY_METRIC_DEFAULT_COLOR;

  return (
    <div
      className={cn(
        "relative select-none bg-transparent",
        "drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]",
        className
      )}
      data-energy-metric
      style={{ color: textColor }}
    >
      <p
        className="text-[0.7rem] font-medium leading-tight tracking-wide opacity-80 sm:text-xs"
        style={{ color: textColor }}
      >
        {title || t("cardType.energy_metric")}
      </p>
      <p
        className="mt-0.5 text-[1.35rem] font-semibold leading-tight tracking-tight sm:text-[1.5rem]"
        style={{ color: textColor }}
      >
        {display}
      </p>

      {onMoreClick ? (
        <button
          type="button"
          data-no-drag
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick();
          }}
          className="absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-black/35 text-white/90 backdrop-blur-sm hover:bg-black/50"
          aria-label={t("editPanel.editTile")}
        >
          <MoreVertical className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
