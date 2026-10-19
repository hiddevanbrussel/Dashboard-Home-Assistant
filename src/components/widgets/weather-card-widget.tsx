"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Leaf,
  Moon,
  MoreVertical,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";
import type { WeatherCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguageStore } from "@/stores/language-store";
import {
  formatPrecipitationMm,
  formatWindSummary,
  isWeatherShowFlag,
  parseAirQualityLevel,
  type AirQualityLevel,
} from "@/lib/weather-card";
import {
  isForecastToday,
  parseForecastList,
  type WeatherForecastItem,
} from "@/lib/ha-weather-forecast";

export function WeatherIcon({ state, className }: { state: string; className?: string }) {
  const s = state?.toLowerCase() ?? "";
  const iconClass = cn("shrink-0", className ?? "h-8 w-8");
  if (s === "sunny" || s === "clear" || s === "zonnig") {
    return <Sun className={cn(iconClass, "text-amber-400")} aria-hidden />;
  }
  if (s === "clear-night") return <Moon className={cn(iconClass, "text-[#6B7C93]")} aria-hidden />;
  if (s === "fog" || s === "mist") return <CloudFog className={cn(iconClass, "text-[#8A97A8]")} aria-hidden />;
  if (s === "rainy" || s === "pouring" || s === "hail") {
    return <CloudRain className={cn(iconClass, "text-[#6B8CBA]")} aria-hidden />;
  }
  if (s === "snowy" || s === "snowy-rainy") {
    return <CloudSnow className={cn(iconClass, "text-[#8A97A8]")} aria-hidden />;
  }
  if (s === "lightning" || s === "lightning-rainy") {
    return <CloudLightning className={cn(iconClass, "text-[#6B7C93]")} aria-hidden />;
  }
  if (s === "windy" || s === "windy-variant") {
    return <Wind className={cn(iconClass, "text-[#6B8CBA]")} aria-hidden />;
  }
  if (s === "partlycloudy") {
    return (
      <span className={cn("relative inline-flex", iconClass)} aria-hidden>
        <Sun className="absolute -right-0.5 -top-0.5 h-[55%] w-[55%] text-amber-400" />
        <Cloud className="h-full w-full text-[#8EB4D8]" />
      </span>
    );
  }
  return <Cloud className={cn(iconClass, "text-[#8EB4D8]")} aria-hidden />;
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
    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 text-[#5B6B82] dark:text-white/60">
      <span className="shrink-0 opacity-80">{icon}</span>
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
}: WeatherCardProps & { className?: string; onMoreClick?: () => void }) {
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
      node: <MetricInline icon={<Wind className="h-4 w-4" aria-hidden />} value={windText} />,
    });
  }
  if (showHumidity && humidity != null) {
    metrics.push({
      key: "humidity",
      node: (
        <MetricInline
          icon={<Droplets className="h-4 w-4" aria-hidden />}
          value={`${Math.round(humidity)}%`}
        />
      ),
    });
  }
  if (showAirQuality && aqiText) {
    metrics.push({
      key: "aqi",
      node: <MetricInline icon={<Leaf className="h-4 w-4" aria-hidden />} value={aqiText} />,
    });
  }
  if (showPrecipitation && precipText) {
    metrics.push({
      key: "precip",
      node: <MetricInline icon={<Umbrella className="h-4 w-4" aria-hidden />} value={precipText} />,
    });
  }

  return (
    <div
      className={cn(
        "glass-surface relative flex h-full min-h-[140px] w-full flex-col overflow-hidden rounded-[1.35rem] text-[#1B2437] shadow-[0_12px_36px_rgba(15,23,42,0.08)] dark:text-white dark:shadow-[0_12px_36px_rgba(0,0,0,0.35)]",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="relative z-10 flex h-full min-h-0 flex-col px-4 pb-3.5 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate font-semibold tracking-tight text-[#1B2437] dark:text-white",
                size === "sm" && "text-[1.05rem]",
                size === "md" && "text-[1.15rem]",
                size === "lg" && "text-xl"
              )}
            >
              {title}
            </p>
            {showCondition && condition ? (
              <p className="mt-0.5 truncate text-sm font-medium text-[#7A879C] dark:text-white/50">
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
              className="shrink-0 rounded-lg p-1.5 text-[#1B2437]/35 transition-colors hover:bg-black/5 hover:text-[#1B2437]/65 dark:text-white/35 dark:hover:bg-white/10 dark:hover:text-white/70"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex min-h-0 flex-1 items-center gap-3">
          {showIcon ? (
            <WeatherIcon
              state={condition}
              className={cn(
                size === "sm" && "h-12 w-12",
                size === "md" && "h-14 w-14",
                size === "lg" && "h-16 w-16"
              )}
            />
          ) : null}
          <div className="min-w-0">
            <p
              className={cn(
                "font-semibold tabular-nums leading-none tracking-tight text-[#1B2437] dark:text-white",
                size === "sm" && "text-4xl",
                size === "md" && "text-5xl",
                size === "lg" && "text-6xl"
              )}
            >
              {formatTemp(temperature)}
            </p>
            {showHighLow ? (
              <div className="mt-1.5 flex items-center gap-3 text-sm font-medium text-[#3D4A63] dark:text-white/70">
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
        </div>

        {metrics.length > 0 ? (
          <div className="mt-3 flex shrink-0 items-center border-t border-[#1B2437]/08 pt-3 dark:border-white/10">
            {metrics.map((m) => (
              <div key={m.key} className="min-w-0 flex-1">
                {m.node}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
