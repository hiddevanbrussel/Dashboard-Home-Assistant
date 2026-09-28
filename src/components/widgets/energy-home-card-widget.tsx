"use client";

import { useEffect } from "react";
import { MoreVertical, Zap } from "lucide-react";
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
        "pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-white/75 sm:text-[11px]">
        {label}
      </p>
      <p className="mt-0.5 text-[1.15rem] font-semibold leading-tight tracking-tight text-white sm:text-[1.35rem]">
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
        className="absolute inset-0 h-full w-full object-cover object-[center_55%]"
        decoding="async"
        draggable={false}
      />

      {/* Soft vignette so white labels stay readable on bright sky / dark ground */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 40%, rgba(0,0,0,0.28) 100%), linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 28%, transparent 62%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Decorative flow hub (green bolt) — mockup accent, not purple glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[48%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950/90 ring-1 ring-white/15 sm:h-11 sm:w-11"
        aria-hidden
      >
        <Zap className="h-4 w-4 fill-[#3DDC97] text-[#3DDC97] sm:h-5 sm:w-5" strokeWidth={1.5} />
      </div>

      {/* Subtle flow lines: green (solar) + violet (grid) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M50 28 V46"
          fill="none"
          stroke="#3DDC97"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M50 50 H62"
          fill="none"
          stroke="#3DDC97"
          strokeWidth="0.55"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M18 52 H46"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeDasharray="1.4 1.1"
          opacity="0.75"
        />
        <path
          d="M50 54 C48 68 36 74 22 78"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeDasharray="1.4 1.1"
          opacity="0.7"
        />
      </svg>

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
