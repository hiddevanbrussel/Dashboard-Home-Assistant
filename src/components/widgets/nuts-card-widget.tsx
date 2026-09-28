"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, MoreVertical } from "lucide-react";
import type { NutsCardProps } from "./widget-types";
import { CARD_ICONS } from "./card-icons";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslation } from "@/hooks/use-translation";
import {
  NUTS_ACCENT_PRESETS,
  NUTS_CARD_DEFAULT_HEIGHT,
  NUTS_CARD_DEFAULT_WIDTH,
  buildNutsChartBars,
  clampNutsCardHeight,
  clampNutsCardWidth,
  computeNutsTrend,
  formatNutsParts,
  formatNutsValue,
  normalizeNutsAccent,
  normalizeNutsPeriod,
  nutsCardDensity,
  nutsChartScale,
  nutsDemoChartBars,
  nutsDemoTodayValue,
  nutsDemoTrend,
  nutsHistoryDays,
  shouldShowNutsMonthTick,
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
  period: periodProp,
  width,
  height,
  className,
  onMoreClick,
}: NutsCardProps & {
  className?: string;
  onMoreClick?: () => void;
}) {
  const { t } = useTranslation();
  const isDark = useThemeStore((s) => s.resolved) === "dark";
  const rootRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState({
    w: clampNutsCardWidth(width ?? NUTS_CARD_DEFAULT_WIDTH),
    h: clampNutsCardHeight(height ?? NUTS_CARD_DEFAULT_HEIGHT),
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: w, height: h } = entry.contentRect;
      if (w > 0 && h > 0) setMeasured({ w: Math.round(w), h: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const density = nutsCardDensity(
    width != null ? clampNutsCardWidth(width) : measured.w,
    height != null ? clampNutsCardHeight(height) : measured.h
  );
  const compact = density === "compact";

  const accent = normalizeNutsAccent(accentProp);
  const period = normalizeNutsPeriod(periodProp);
  const historyDays = nutsHistoryDays(period);
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
    queryKey: ["ha-history-nuts", entity_id, String(historyDays)],
    enabled: !!entity_id,
    queryFn: async () => {
      const res = await fetch(
        `/api/ha/history?entity_ids=${encodeURIComponent(entity_id)}&days=${historyDays}`
      );
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json() as Promise<Record<string, NutsDayPoint[]>>;
    },
    staleTime: 60_000,
  });

  const points = historyData?.[entity_id];
  const hasHistory = (points?.length ?? 0) > 0;

  const chartBars = useMemo(() => {
    if (hasHistory && points) return buildNutsChartBars(points, period);
    return nutsDemoChartBars(accent, period);
  }, [hasHistory, points, accent, period]);

  const trend = useMemo(() => {
    if (hasHistory && points) return computeNutsTrend(points, accent, period);
    return nutsDemoTrend(accent, period);
  }, [hasHistory, points, accent, period]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayFromHistory = hasHistory
    ? chartBars.find((b) => b.date === todayKey)?.value
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

  const valueParts = formatNutsParts(mainValue, unit);
  const scale = nutsChartScale(chartBars.map((b) => b.value));
  const displayTitle =
    title?.trim() ||
    (accent === "production" ? t("nutsCard.productionTitle") : t("nutsCard.consumptionTitle"));

  const trendColor = !trend
    ? "text-gray-400 dark:text-white/50"
    : trend.favorable
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";
  const TrendArrow =
    trend?.direction === "down" ? ArrowDownRight : ArrowUpRight;
  const trendLabel =
    period === "month" ? t("nutsCard.vsLastMonth") : t("nutsCard.vsLastWeek");

  const monthDense = period === "month";
  const iconBox = compact ? "h-9 w-9" : "h-12 w-12";
  const iconGlyph = compact ? "h-4 w-4" : "h-6 w-6";

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl border-0 outline-none shadow-xl backdrop-blur-2xl",
        "bg-white/85 text-gray-900",
        "dark:bg-zinc-950/85 dark:text-white",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-start gap-2",
          compact ? "px-3 pt-3" : "gap-3 px-4 pt-4"
        )}
      >
        <div
          className={cn("flex shrink-0 items-center justify-center rounded-full", iconBox)}
          style={{
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : `${iconColor}18`,
            color: iconColor,
          }}
        >
          <IconComponent className={iconGlyph} aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate font-medium text-gray-600 dark:text-white/80",
              compact ? "text-xs" : "text-sm"
            )}
          >
            {displayTitle}
          </p>
          <div
            className={cn(
              "mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-1.5 font-bold tabular-nums tracking-tight text-gray-950 dark:text-white",
              compact ? "text-xl leading-tight" : "text-2xl sm:text-[1.75rem]"
            )}
          >
            <span className="min-w-0 truncate">{valueParts.value}</span>
            {valueParts.unit ? (
              <span
                className={cn(
                  "font-semibold text-gray-500 dark:text-white/55",
                  compact ? "text-xs" : "text-base"
                )}
              >
                {valueParts.unit}
              </span>
            ) : null}
          </div>
          <p className={cn("text-gray-400 dark:text-white/45", compact ? "text-[10px]" : "text-xs")}>
            {t("nutsCard.today")}
          </p>
        </div>

        <div className="flex max-w-[38%] shrink-0 flex-col items-end gap-0.5">
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-700 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label={t("common.options")}
            >
              <MoreVertical className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
            </button>
          )}
          {trend && (
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 whitespace-nowrap rounded-full font-semibold tabular-nums",
                  "bg-black/[0.04] dark:bg-white/5",
                  compact ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-sm",
                  trendColor
                )}
              >
                <TrendArrow className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
                {trend.percent}%
              </span>
              {!compact && (
                <span className="mt-1 whitespace-nowrap text-right text-[10px] leading-tight text-gray-400 dark:text-white/40">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col",
          compact ? "mt-2 px-2.5 pb-2 pt-0.5" : "mt-3 px-3 pb-3 pt-1"
        )}
      >
        {isLoading && entity_id && !hasHistory ? (
          <div className="flex flex-1 items-center justify-center text-xs text-gray-400 dark:text-white/40">
            {t("nutsCard.loading")}
          </div>
        ) : (
          <>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <span className="mb-0.5 ml-0.5 text-[9px] text-gray-400 dark:text-white/35">
                {unit || "kWh"}
              </span>
              <div className="relative flex min-h-0 flex-1">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-0.5 pr-1">
                  {[...scale.ticks].reverse().map((tick, i) => (
                    <div key={`${tick}-${i}`} className="flex items-center gap-1">
                      <span
                        className={cn(
                          "shrink-0 text-right tabular-nums text-gray-400 dark:text-white/35",
                          compact ? "w-5 text-[8px]" : "w-6 text-[9px]"
                        )}
                      >
                        {tick}
                      </span>
                      <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
                    </div>
                  ))}
                </div>

                <div
                  className={cn(
                    "flex flex-1 items-end justify-between",
                    compact
                      ? monthDense
                        ? "ml-6 gap-px pb-4 pt-0.5"
                        : "ml-6 gap-1 pb-4 pt-0.5"
                      : monthDense
                        ? "ml-8 gap-0.5 pb-5 pt-1"
                        : "ml-8 gap-1.5 pb-5 pt-1"
                  )}
                >
                  {chartBars.map((bar) => {
                    const pct = scale.max > 0 ? Math.min(100, (bar.value / scale.max) * 100) : 0;
                    return (
                      <div
                        key={bar.date}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >
                        <div
                          className={cn(
                            "w-full rounded-t-md",
                            monthDense
                              ? compact
                                ? "max-w-[6px]"
                                : "max-w-[10px]"
                              : compact
                                ? "max-w-[18px]"
                                : "max-w-[28px]"
                          )}
                          style={{
                            height: `${Math.max(pct, bar.value > 0 ? 4 : 0)}%`,
                            background: `linear-gradient(to top, ${preset.barTo}, ${preset.barFrom})`,
                            minHeight: bar.value > 0 ? 4 : 0,
                          }}
                          title={formatNutsValue(bar.value, unit)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "flex justify-between",
                compact
                  ? monthDense
                    ? "ml-6 gap-px"
                    : "ml-6 gap-1"
                  : monthDense
                    ? "ml-8 gap-0.5"
                    : "ml-8 gap-1.5"
              )}
            >
              {chartBars.map((bar) => {
                const label =
                  period === "week"
                    ? t(WEEKDAY_KEYS[bar.tick] ?? WEEKDAY_KEYS[0])
                    : shouldShowNutsMonthTick(bar.tick, chartBars.length)
                      ? String(bar.tick)
                      : "";
                return (
                  <span
                    key={`lbl-${bar.date}`}
                    className={cn(
                      "min-w-0 flex-1 text-center text-gray-400 dark:text-white/40",
                      monthDense
                        ? compact
                          ? "text-[7px]"
                          : "text-[8px]"
                        : compact
                          ? "text-[9px]"
                          : "text-[10px]"
                    )}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
