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
  Star,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";
import type { WeatherCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { WeatherConditionBackdrop } from "@/components/weather/weather-condition-backdrop";
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
  if (s === "sunny" || s === "clear" || s === "zonnig") return <Sun className={iconClass} aria-hidden />;
  if (s === "clear-night") return <Moon className={iconClass} aria-hidden />;
  if (s === "fog" || s === "mist") return <CloudFog className={iconClass} aria-hidden />;
  if (s === "rainy" || s === "pouring" || s === "hail") return <CloudRain className={iconClass} aria-hidden />;
  if (s === "snowy" || s === "snowy-rainy") return <CloudSnow className={iconClass} aria-hidden />;
  if (s === "lightning" || s === "lightning-rainy") return <CloudLightning className={iconClass} aria-hidden />;
  if (s === "windy" || s === "windy-variant") return <Wind className={iconClass} aria-hidden />;
  if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return <Cloud className={iconClass} aria-hidden />;
  return <Cloud className={iconClass} aria-hidden />;
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

function MetricCell({
  icon,
  value,
  label,
  iconClassName,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1 text-center">
      <span className={cn("text-white/90", iconClassName)}>{icon}</span>
      <p className="w-full truncate text-[13px] font-semibold leading-tight text-white drop-shadow-sm">
        {value}
      </p>
      <p className="w-full truncate text-[10px] font-medium leading-tight text-white/55">{label}</p>
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
      node: (
        <MetricCell
          icon={<Wind className="h-4 w-4" aria-hidden />}
          value={windText}
          label={t("weatherCard.metric.wind")}
        />
      ),
    });
  }
  if (showHumidity && humidity != null) {
    metrics.push({
      key: "humidity",
      node: (
        <MetricCell
          icon={<Droplets className="h-4 w-4" aria-hidden />}
          value={`${Math.round(humidity)}%`}
          label={t("weatherCard.metric.humidity")}
        />
      ),
    });
  }
  if (showAirQuality && aqiText) {
    metrics.push({
      key: "aqi",
      node: (
        <MetricCell
          icon={<Leaf className="h-4 w-4" aria-hidden />}
          value={aqiText}
          label={t("weatherCard.metric.airQuality")}
          iconClassName="text-emerald-400"
        />
      ),
    });
  }
  if (showPrecipitation && precipText) {
    metrics.push({
      key: "precip",
      node: (
        <MetricCell
          icon={<Umbrella className="h-4 w-4" aria-hidden />}
          value={precipText}
          label={t("weatherCard.metric.precipitation")}
        />
      ),
    });
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[140px] w-full flex-col overflow-hidden rounded-[1.35rem] text-white shadow-xl",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <WeatherConditionBackdrop condition={condition} className="rounded-[1.35rem]" />
      <div className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-b from-black/45 via-black/20 to-black/55" />

      <div className="relative z-10 flex h-full min-h-0 flex-col px-4 pb-3 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p
                className={cn(
                  "truncate font-semibold tracking-tight text-white drop-shadow-md",
                  size === "sm" && "text-lg",
                  size === "md" && "text-xl",
                  size === "lg" && "text-2xl"
                )}
              >
                {title}
              </p>
              {showIcon ? (
                <Star
                  className="h-3.5 w-3.5 shrink-0 fill-sky-300 text-sky-300 drop-shadow-sm"
                  aria-hidden
                />
              ) : null}
            </div>
            {showCondition && condition ? (
              <p className="mt-0.5 truncate text-sm font-medium text-white/75 drop-shadow-sm">
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
              className="shrink-0 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end pb-2 pt-3">
          <p
            className={cn(
              "font-semibold tabular-nums leading-none tracking-tight text-white drop-shadow-md",
              size === "sm" && "text-5xl",
              size === "md" && "text-6xl",
              size === "lg" && "text-7xl"
            )}
          >
            {formatTemp(temperature)}
          </p>
          {showHighLow ? (
            <div className="mt-2 flex items-center gap-3 text-sm font-medium text-white/85 drop-shadow-sm">
              <span className="inline-flex items-center gap-0.5">
                <ArrowUp className="h-3.5 w-3.5 opacity-80" aria-hidden />
                {formatTemp(high)}
              </span>
              <span className="inline-flex items-center gap-0.5">
                <ArrowDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
                {formatTemp(low)}
              </span>
            </div>
          ) : null}
        </div>

        {metrics.length > 0 ? (
          <div className="mt-2 flex shrink-0 items-stretch rounded-2xl bg-black/45 px-1 py-2 backdrop-blur-[2px]">
            {metrics.map((m, i) => (
              <div key={m.key} className="flex min-w-0 flex-1 items-stretch">
                {i > 0 ? <div className="w-px self-stretch bg-white/15" aria-hidden /> : null}
                {m.node}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
