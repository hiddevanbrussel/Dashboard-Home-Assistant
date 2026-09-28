"use client";

import { useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import {
  ENERGY_PAGE_BG_DARK,
  ENERGY_PAGE_BG_LIGHT,
  parseHaNumber,
  toKwh,
} from "@/lib/energy-dashboard";
import {
  clampEnergyHomeCardHeight,
  clampEnergyHomeCardWidth,
  computeEnergyHomeMetrics,
  formatEnergyHomeCost,
  formatEnergyHomeKwh,
  formatEnergyHomeSelfSufficiency,
  ENERGY_HOME_CARD_DEFAULT_HEIGHT,
  ENERGY_HOME_CARD_DEFAULT_WIDTH,
} from "@/lib/energy-home-card";
import { useTranslation } from "@/hooks/use-translation";
import { useEnergyStore, hydrateEnergyStore } from "@/stores/energy-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";
import type { EnergyHomeCardProps } from "./widget-types";

function useEntityKwh(entityId: string | undefined): number | undefined {
  const entity = useEntityStateStore((s) => (entityId ? s.getState(entityId) : undefined));
  if (!entityId || !entity) return undefined;
  const raw = parseHaNumber(entity.state);
  if (raw == null) return undefined;
  const unit = (entity.attributes?.unit_of_measurement as string | undefined) ?? "";
  return toKwh(raw, unit);
}

function Metric({
  label,
  value,
  align = "left",
  className,
}: {
  label: string;
  value: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className
      )}
    >
      <p className="text-[11px] font-medium text-white/80 sm:text-xs">{label}</p>
      <p className="mt-0.5 text-[1.2rem] font-semibold leading-tight tracking-tight text-white sm:text-[1.4rem]">
        {value}
      </p>
    </div>
  );
}

/**
 * House illustration card with five floating day metrics.
 * Uses Settings → Energy entities when widget entity fields are empty;
 * falls back to mockup demo numbers when nothing is linked.
 */
export function EnergyHomeCardWidget({
  title,
  entity_id,
  yield_entity_id_today,
  grid_entity_id,
  consumption_entity_id,
  cost_per_kwh,
  width,
  height,
  className,
  onMoreClick,
}: EnergyHomeCardProps & {
  className?: string;
  onMoreClick?: () => void;
}) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.resolved) === "dark";
  const storeEntities = useEnergyStore((s) => s.entities);
  const storeCost = useEnergyStore((s) => s.costPerKwh);

  useEffect(() => {
    hydrateEnergyStore();
  }, []);

  const generationId =
    yield_entity_id_today?.trim() ||
    entity_id?.trim() ||
    storeEntities.solarYieldTodayEntityId ||
    "";
  const exportId = grid_entity_id?.trim() || storeEntities.gridExportEntityId || "";
  const importId = consumption_entity_id?.trim() || "";

  const generationKwh = useEntityKwh(generationId || undefined);
  const exportKwh = useEntityKwh(exportId || undefined);
  const gridImportKwh = useEntityKwh(importId || undefined);
  const costRate =
    cost_per_kwh != null && cost_per_kwh > 0 ? cost_per_kwh : storeCost;

  const metrics = computeEnergyHomeMetrics({
    generationKwh,
    exportKwh,
    gridImportKwh,
    costPerKwh: costRate,
  });

  const cardW = clampEnergyHomeCardWidth(width ?? ENERGY_HOME_CARD_DEFAULT_WIDTH);
  const cardH = clampEnergyHomeCardHeight(height ?? ENERGY_HOME_CARD_DEFAULT_HEIGHT);
  const bgSrc = withBasePath(isDark ? ENERGY_PAGE_BG_DARK : ENERGY_PAGE_BG_LIGHT);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl shadow-xl",
        "ring-1 ring-black/10 dark:ring-white/10",
        className
      )}
      style={{ width: cardW, height: cardH, maxWidth: "100%" }}
      data-energy-home-card
      data-demo={metrics.usingDemo ? "true" : "false"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_48%]"
        decoding="async"
        draggable={false}
      />

      {/* Soft edge wash so white labels stay readable without hiding the house */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 22%, transparent 68%, rgba(0,0,0,0.32) 100%)",
        }}
      />

      {/* Metrics — positions match mockup */}
      <div className="absolute inset-0 p-3 sm:p-4">
        <Metric
          label={t("energy.home.generation")}
          value={formatEnergyHomeKwh(metrics.generationKwh)}
          className="absolute left-3 top-3 sm:left-4 sm:top-4"
        />
        <Metric
          label={t("energy.home.selfSufficiency")}
          value={formatEnergyHomeSelfSufficiency(
            metrics.selfConsumedKwh,
            metrics.selfSufficiencyPct
          )}
          align="right"
          className="absolute right-3 top-3 sm:right-4 sm:top-4"
        />
        <Metric
          label={t("energy.home.grid")}
          value={formatEnergyHomeKwh(metrics.gridImportKwh)}
          className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4"
        />
        <Metric
          label={t("energy.home.cost")}
          value={formatEnergyHomeCost(metrics.costEur)}
          align="center"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-4"
        />
        <Metric
          label={t("energy.home.export")}
          value={formatEnergyHomeKwh(metrics.exportKwh)}
          align="right"
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4"
        />
      </div>

      {onMoreClick ? (
        <button
          type="button"
          data-no-drag
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick();
          }}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-black/35 text-white/90 backdrop-blur-sm hover:bg-black/50"
          aria-label={t("editPanel.editTile")}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ) : null}

      {/* Visually hidden title for a11y / edit list */}
      <span className="sr-only">{title}</span>
    </div>
  );
}
