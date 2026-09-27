"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, MoreVertical } from "lucide-react";
import type { NutsCardProps } from "./widget-types";
import { CARD_ICONS } from "./card-icons";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  NUTS_ACCENT_PRESETS,
  buildNutsWeekBars,
  computeNutsMonthTrend,
  formatNutsValue,
  normalizeNutsAccent,
  nutsChartScale,
  nutsDemoTodayValue,
  nutsDemoTrend,
  nutsDemoWeekBars,
  type NutsDayPoint,
} from "@/lib/nuts-card";

const WEEKDAY_KEYS = [
  "nutsCard.weekday.mon",
  "nutsCard.weekday.tue",
  "nutsCard.weekday.wed",
  "nutsCard.weekday.thu",
  "nutsCard.weekday.fri",
  "nutsCard.weekday.sat",
  "nutsCard.weekday.sun",
] as const;

function useEntityValue(entityId: string | undefined) {
  const entity = useEntityStateStore((s) => (entityId ? s.getState(entityId) : undefined));
  if (!entityId || !entity) return { value: undefined as number | undefined, unit: "" };
  const raw = entity.state;
  const value =
    raw != null && raw !== "unavailable" && raw !== "unknown" ? Number(raw) : undefined;
  const unit = (entity.attributes?.unit_of_measurement as string) ?? "";
  return {
    value: value != null && !Number.isNaN(value) ? value : undefined,
    unit,
  };
}

export function NutsCardWidget({
  title,
  entity_id,
  today_entity_id,
  current_entity_id,
  icon,
  icon_background_color,
  accent: accentProp,
  className,
  onMoreClick,
}: NutsCardProps & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const accent = normalizeNutsAccent(accentProp);
  const preset = NUTS_ACCENT_PRESETS[accent];
  const iconName = icon || preset.icon;
  const IconComponent = CARD_ICONS[iconName] ?? CARD_ICONS.Zap ?? CARD_ICONS.Fuel;
  const iconColor =
    icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(icon_background_color)
      ? icon_background_color
      : preset.iconColor;

  const todayEntity = today_entity_id || current_entity_id;
  const todayLive = useEntityValue(todayEntity);
  const primaryLive = useEntityValue(entity_id);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["ha-history-nuts", entity_id, "35"],
    enabled: !!entity_id,
    queryFn: async () => {
      const res = await fetch(
        `/api/ha/history?entity_ids=${encodeURIComponent(entity_id)}&days=35`
      );
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json() as Promise<Record<string, NutsDayPoint[]>>;
    },
    staleTime: 60_000,
  });

  const points = historyData?.[entity_id];
  const hasHistory = (points?.length ?? 0) > 0;

  const weekBars = useMemo(() => {
    if (hasHistory && points) return buildNutsWeekBars(points);
    return nutsDemoWeekBars(accent);
  }, [hasHistory, points, accent]);

  const trend = useMemo(() => {
    if (hasHistory && points) return computeNutsMonthTrend(points, accent);
    return nutsDemoTrend(accent);
  }, [hasHistory, points, accent]);

  const todayFromHistory = hasHistory
    ? weekBars.find((b) => b.date === new Date().toISOString().slice(0, 10))?.value
    : undefined;

  const mainValue =
    todayLive.value ??
    todayFromHistory ??
    (hasHistory ? undefined : nutsDemoTodayValue(accent)) ??
    primaryLive.value;

  const unit =
    todayLive.unit ||
    primaryLive.unit ||
    (hasHistory || !entity_id ? "kWh" : "");

  const scale = nutsChartScale(weekBars.map((b) => b.value));
  const displayTitle =
    title?.trim() ||
    (accent === "production" ? t("nutsCard.productionTitle") : t("nutsCard.consumptionTitle"));

  const trendColor = !trend
    ? "text-white/50"
    : trend.favorable
      ? "text-emerald-400"
      : "text-rose-400";
  const TrendArrow =
    trend?.direction === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <div
      className={cn(
        "flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl",
        "bg-zinc-900/90 text-white shadow-xl backdrop-blur-2xl",
        "dark:bg-zinc-950/85",
        className
      )}
    >
      <div className="flex shrink-0 items-start gap-3 px-4 pt-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            boxShadow: `0 0 20px ${preset.glow}`,
            color: iconColor,
          }}
        >
          <IconComponent className="h-6 w-6" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white/80">{displayTitle}</p>
          <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-white sm:text-[1.75rem]">
            {formatNutsValue(mainValue, unit)}
          </p>
          <p className="text-xs text-white/45">{t("nutsCard.today")}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </button>
          )}
          {trend && (
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full bg-white/5 px-2 py-0.5 text-sm font-semibold tabular-nums",
                  trendColor
                )}
              >
                <TrendArrow className="h-3.5 w-3.5" aria-hidden />
                {trend.percent}%
              </span>
              <span className="mt-1 max-w-[5.5rem] text-right text-[10px] leading-tight text-white/40">
                {t("nutsCard.vsLastMonth")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-3 flex min-h-0 flex-1 flex-col px-3 pb-3 pt-1">
        {isLoading && entity_id && !hasHistory ? (
          <div className="flex flex-1 items-center justify-center text-xs text-white/40">
            {t("nutsCard.loading")}
          </div>
        ) : (
          <>
            <div className="relative flex min-h-[7.5rem] flex-1 flex-col">
              <span className="mb-0.5 ml-0.5 text-[9px] text-white/35">{unit || "kWh"}</span>
              <div className="relative flex min-h-0 flex-1">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-0.5 pr-1">
                {[...scale.ticks].reverse().map((tick, i) => (
                  <div key={`${tick}-${i}`} className="flex items-center gap-1.5">
                    <span className="w-6 shrink-0 text-right text-[9px] tabular-nums text-white/35">
                      {tick}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>
                ))}
              </div>

              <div className="ml-8 flex flex-1 items-end justify-between gap-1.5 pb-5 pt-1">
                {weekBars.map((bar) => {
                  const pct = scale.max > 0 ? Math.min(100, (bar.value / scale.max) * 100) : 0;
                  return (
                    <div
                      key={bar.date}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <div
                        className="w-full max-w-[28px] rounded-t-md"
                        style={{
                          height: `${Math.max(pct, bar.value > 0 ? 4 : 0)}%`,
                          background: `linear-gradient(to top, ${preset.barTo}, ${preset.barFrom})`,
                          minHeight: bar.value > 0 ? 4 : 0,
                        }}
                        title={`${formatNutsValue(bar.value, unit)}`}
                      />
                    </div>
                  );
                })}
              </div>
              </div>
            </div>

            <div className="ml-8 flex justify-between gap-1.5">
              {weekBars.map((bar) => (
                <span
                  key={`lbl-${bar.date}`}
                  className="min-w-0 flex-1 text-center text-[10px] text-white/40"
                >
                  {t(WEEKDAY_KEYS[bar.weekday])}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
