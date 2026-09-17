"use client";

import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
  Wind,
  Droplets,
  MoreVertical,
} from "lucide-react";
import type { WeatherCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { WeatherConditionBackdrop } from "@/components/weather/weather-condition-backdrop";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";

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

function formatTemp(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}°`;
}

export function WeatherCardWidget({
  title = "Weather",
  entity_id,
  size = "md",
  show_icon = true,
  className,
  onMoreClick,
}: WeatherCardProps & { className?: string; onMoreClick?: () => void }) {
  const { t } = useTranslation();
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const condition = (entity?.state as string) ?? "";
  const temperature = entity?.attributes?.temperature != null
    ? Number(entity.attributes.temperature)
    : undefined;
  const humidity = entity?.attributes?.humidity != null
    ? Number(entity.attributes.humidity)
    : undefined;
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;

  return (
    <div
      className={cn(
        "relative flex w-full h-full min-h-[125px] flex-col overflow-hidden rounded-2xl text-white shadow-xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <WeatherConditionBackdrop condition={condition} className="rounded-2xl" />
      <div className="absolute inset-0 rounded-2xl bg-black/35" />
      <div className="relative flex flex-col z-10 h-full min-h-0">
        <div className="flex items-start justify-between gap-3 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {show_icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white drop-shadow-sm">
                <WeatherIcon state={condition} className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate text-white/90 drop-shadow-sm">{title}</p>
              <p className="text-xs text-white/60 truncate drop-shadow-sm">{friendlyName}</p>
            </div>
          </div>
          {humidity != null && !Number.isNaN(humidity) && (
            <div className="flex items-center gap-1.5 text-white/90 drop-shadow-sm shrink-0">
              <Droplets className="h-4 w-4" aria-hidden />
              <span>{Math.round(humidity)}%</span>
            </div>
          )}
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
              className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 drop-shadow-sm transition-colors"
              aria-label={t("common.options")}
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          )}
        </div>
        <div className="flex-1 min-h-0" />
        <div className="px-4 pb-4 pt-2 flex-shrink-0">
          <p
            className={cn(
              "font-bold tabular-nums text-white drop-shadow-md",
              size === "sm" && "text-4xl",
              size === "md" && "text-5xl",
              size === "lg" && "text-6xl"
            )}
          >
            {formatTemp(temperature)}
          </p>
        </div>
      </div>
    </div>
  );
}
