"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Leaf,
  MoreVertical,
  Umbrella,
  Wind,
} from "lucide-react";
import type { WeatherCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguageStore } from "@/stores/language-store";
import {
  formatPrecipitationMm,
  formatWindSummary,
  isWeatherShowFlag,
  parseAirQualityLevel,
  weatherIconSrc,
  type AirQualityLevel,
} from "@/lib/weather-card";
import {
  isForecastToday,
  parseForecastList,
  type WeatherForecastItem,
} from "@/lib/ha-weather-forecast";

/** Full stack (title + condition + temp + high/low + metrics) needs ~173px at size="md"; +8px air (4px above and below the temperature). */
export const WEATHER_FIT_METRICS_MIN_H = 184;

/**
 * Whether the wind / humidity / precipitation row fits.
 * Unknown height keeps today's full stack. Width is not part of the decision.
 */
export function weatherCardFitsMetrics(cardHeight: number | null | undefined): boolean {
  return cardHeight == null || !Number.isFinite(cardHeight) || cardHeight >= WEATHER_FIT_METRICS_MIN_H;
}

export function WeatherIcon({ state, className }: { state: string; className?: string }) {
  return (
    // 3D WebP icons (not currentColor); plain img stays crisp when scaled.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath(weatherIconSrc(state))}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("shrink-0 object-contain", className ?? "h-8 w-8")}
    />
  );
}

function formatTemp(value: number | undefined | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}°`;
}

function conditionLabel(condition: string, t: (key: string) => string): string {
  if (!condition) return "";
  const key = `weatherSheet.condition.${condition.toLowerCase()}`;
  const label = t(key);
  return label === key ? condition : label;
}

function airQualityLabel(level: AirQualityLevel, t: (key: string) => string): string {
  if (level === "unknown") return "—";
  return t(`weatherCard.aqi.${level}`);
}

function parseAttrNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function loadDailyForecast(entityId: string): Promise<WeatherForecastItem[]> {
  try {
    const res = await fetch(
      `/api/ha/weather-forecast?entity_id=${encodeURIComponent(entityId)}&type=daily`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { forecast?: WeatherForecastItem[] };
    return Array.isArray(data.forecast) ? data.forecast : [];
  } catch {
    return [];
  }
}

function MetricInline({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 text-[#6B7A90] dark:text-white/55">
      <span className="shrink-0 opacity-75">{icon}</span>
      <span className="truncate text-[13px] font-medium tabular-nums tracking-tight">{value}</span>
    </div>
  );
}

export function WeatherCardWidget({
  title = "Weather",
  entity_id,
  size = "md",
  show_icon = true,
  show_condition = true,
  show_high_low = true,
  show_wind = true,
  show_humidity = true,
  show_air_quality = false,
  show_precipitation = true,
  air_quality_entity_id,
  className,
  onMoreClick,
  height,
}: WeatherCardProps & {
  className?: string;
  onMoreClick?: () => void;
  /** Known card height (floating card `totalHeight`). Seeds the first paint before ResizeObserver runs. */
  height?: number;
}) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const locale = language === "nl" ? "nl" : "en";
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const aqiEntity = useEntityStateStore((s) =>
    air_quality_entity_id ? s.getState(air_quality_entity_id) : undefined
  );

  const condition = (entity?.state as string) ?? "";
  const temperature = parseAttrNumber(entity?.attributes?.temperature);
  const humidity = parseAttrNumber(entity?.attributes?.humidity);
  const windSpeed = parseAttrNumber(entity?.attributes?.wind_speed);
  const windBearing = parseAttrNumber(entity?.attributes?.wind_bearing);
  const windUnit =
    typeof entity?.attributes?.wind_speed_unit === "string"
      ? entity.attributes.wind_speed_unit
      : null;
  const precipAttr = parseAttrNumber(
    entity?.attributes?.precipitation ?? entity?.attributes?.rain
  );

  const showIcon = isWeatherShowFlag(show_icon, true);
  const showCondition = isWeatherShowFlag(show_condition, true);
  const showHighLow = isWeatherShowFlag(show_high_low, true);
  const showWind = isWeatherShowFlag(show_wind, true);
  const showHumidity = isWeatherShowFlag(show_humidity, true);
  const showAirQuality = isWeatherShowFlag(show_air_quality, false);
  const showPrecipitation = isWeatherShowFlag(show_precipitation, true);

  /** Measure the card so the metrics row drops out before it collides. */
  const shellRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState<number | null>(() =>
    typeof height === "number" && Number.isFinite(height) && height > 0 ? Math.round(height) : null
  );
  useEffect(() => {
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const h = Math.round(entries[0]?.contentRect.height ?? 0);
      if (h > 0) setCardH((prev) => (prev === h ? prev : h));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Below 184px card height the metrics row drops out; everything else stays.
  const fitMetrics = weatherCardFitsMetrics(cardH);

  const [daily, setDaily] = useState<WeatherForecastItem[]>(() =>
    parseForecastList(entity?.attributes?.forecast)
  );

  useEffect(() => {
    const fromAttrs = parseForecastList(entity?.attributes?.forecast);
    if (fromAttrs.length > 0) {
      setDaily(fromAttrs);
      return;
    }
    if (!entity_id || (!showHighLow && !showPrecipitation)) return;
    let cancelled = false;
    loadDailyForecast(entity_id).then((items) => {
      if (!cancelled && items.length > 0) setDaily(items);
    });
    return () => {
      cancelled = true;
    };
  }, [entity_id, entity?.attributes?.forecast, showHighLow, showPrecipitation]);

  const today = daily.find((item) => isForecastToday(item.datetime)) ?? daily[0];
  const high = today?.temperature ?? temperature;
  const low = today?.templow ?? undefined;

  const windText = formatWindSummary({
    speed: windSpeed,
    bearing: windBearing,
    unit: windUnit,
    locale,
  });
  const aqiLevel = parseAirQualityLevel(aqiEntity?.state ?? null);
  const aqiText =
    aqiEntity?.state != null && String(aqiEntity.state).trim() !== ""
      ? aqiLevel === "unknown"
        ? String(aqiEntity.state)
        : airQualityLabel(aqiLevel, t)
      : null;
  const precipMm = precipAttr ?? today?.precipitation ?? 0;
  const precipText = formatPrecipitationMm(showPrecipitation ? precipMm : null);

  const metrics: { key: string; node: ReactNode }[] = [];
  if (showWind && windText) {
    metrics.push({
      key: "wind",
      node: <MetricInline icon={<Wind className="h-4 w-4" strokeWidth={1.75} aria-hidden />} value={windText} />,
    });
  }
  if (showHumidity && humidity != null) {
    metrics.push({
      key: "humidity",
      node: (
        <MetricInline
          icon={<Droplets className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          value={`${Math.round(humidity)}%`}
        />
      ),
    });
  }
  if (showAirQuality && aqiText) {
    metrics.push({
      key: "aqi",
      node: (
        <MetricInline icon={<Leaf className="h-4 w-4" strokeWidth={1.75} aria-hidden />} value={aqiText} />
      ),
    });
  }
  if (showPrecipitation && precipText) {
    metrics.push({
      key: "precip",
      node: (
        <MetricInline
          icon={<Umbrella className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
          value={precipText}
        />
      ),
    });
  }

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative flex h-full min-h-[140px] w-full flex-col overflow-hidden rounded-[1.75rem]",
        "bg-[linear-gradient(165deg,#F7FAFD_0%,#EEF4FA_42%,#E4EDF6_100%)]",
        "shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
        "dark:bg-[linear-gradient(165deg,rgba(36,48,68,0.92)_0%,rgba(22,30,46,0.94)_100%)]",
        "dark:shadow-[0_14px_40px_rgba(0,0,0,0.4)]",
        "text-[#1B2437] dark:text-white",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      {/* Soft cloud atmosphere (matches mockup wash) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_78%_28%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0)_62%)] dark:bg-[radial-gradient(90%_70%_at_78%_28%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-2 h-[72%] w-[58%] opacity-[0.22] dark:opacity-[0.12]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath(weatherIconSrc("exceptional"))}
          alt=""
          draggable={false}
          className="h-full w-full scale-125 object-contain blur-[1px]"
        />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col px-5 pb-3.5 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate font-semibold tracking-tight text-[#1B2437] dark:text-white",
                size === "sm" && "text-[1.05rem]",
                size === "md" && "text-[1.2rem]",
                size === "lg" && "text-xl"
              )}
            >
              {title}
            </p>
            {showCondition && condition ? (
              <p className="mt-0.5 truncate text-[0.95rem] font-medium text-[#8A96A8] dark:text-white/45">
                {conditionLabel(condition, t)}
              </p>
            ) : null}
          </div>
          {onMoreClick ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
              className="tile-kebab-hit shrink-0 rounded-lg p-1.5 text-[#1B2437]/30 transition-colors hover:bg-black/5 hover:text-[#1B2437]/60 dark:text-white/30 dark:hover:bg-white/10 dark:hover:text-white/65"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="relative mt-2 flex min-h-0 flex-1 items-center">
          <div className="relative z-10 min-w-0 pr-[38%]">
            <p
              className={cn(
                "font-semibold tabular-nums leading-none tracking-tight text-[#1B2437] dark:text-white",
                size === "sm" && "text-[2.75rem]",
                size === "md" && "text-[3.5rem]",
                size === "lg" && "text-[4rem]"
              )}
            >
              {formatTemp(temperature)}
            </p>
            {showHighLow ? (
              <div className="mt-2 flex items-center gap-3.5 text-[0.95rem] font-medium text-[#6B7A90] dark:text-white/60">
                <span className="inline-flex items-center gap-0.5">
                  <ArrowUp className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  {formatTemp(high)}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <ArrowDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  {formatTemp(low)}
                </span>
              </div>
            ) : null}
          </div>

          {showIcon ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[48%] items-center justify-center">
              <WeatherIcon
                state={condition}
                className={cn(
                  "drop-shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]",
                  size === "sm" && "h-[5.5rem] w-[5.5rem]",
                  size === "md" && "h-[7.25rem] w-[7.25rem]",
                  size === "lg" && "h-[8.5rem] w-[8.5rem]"
                )}
              />
            </div>
          ) : null}
        </div>

        {metrics.length > 0 && fitMetrics ? (
          <div className="mt-2 flex shrink-0 items-center border-t border-[#1B2437]/08 pt-3 dark:border-white/10">
            {metrics.map((m, index) => (
              <div
                key={m.key}
                className={cn(
                  "min-w-0 flex-1",
                  index > 0 && "border-l border-[#1B2437]/08 dark:border-white/10"
                )}
              >
                {m.node}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
