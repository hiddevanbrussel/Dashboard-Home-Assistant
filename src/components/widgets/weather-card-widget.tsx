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
import { useEntityStateStore } from "@/stores/entity-state-store";

function WeatherIcon({ state, className }: { state: string; className?: string }) {
  const s = state?.toLowerCase() ?? "";
  const iconClass = cn("shrink-0", className ?? "h-8 w-8");
  if (s === "sunny" || s === "clear") return <Sun className={iconClass} aria-hidden />;
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

/** Achtergrondgradient per weertoestand (fallback als er geen afbeelding is). */
function getWeatherBackground(condition: string) {
  const s = condition?.toLowerCase() ?? "";
  switch (s) {
    case "sunny":
    case "clear":
      return "from-amber-300/50 via-yellow-200/30 to-sky-300/40";
    case "clear-night":
      return "from-indigo-950/70 via-slate-900/60 to-indigo-950/80";
    case "cloudy":
    case "partlycloudy":
    case "exceptional":
      return "from-slate-400/40 via-slate-300/30 to-slate-500/40";
    case "rainy":
    case "pouring":
    case "hail":
      return "from-slate-500/50 via-sky-700/40 to-slate-600/50";
    case "snowy":
    case "snowy-rainy":
      return "from-sky-200/40 via-white/30 to-slate-300/40";
    case "fog":
    case "mist":
      return "from-slate-400/35 to-slate-500/40";
    case "lightning":
    case "lightning-rainy":
      return "from-slate-800/60 via-slate-900/50 to-slate-950/70";
    case "windy":
    case "windy-variant":
      return "from-slate-300/35 via-sky-400/30 to-slate-400/35";
    default:
      return "from-sky-400/35 via-sky-500/30 to-sky-600/40";
  }
}

/** Pad naar custom achtergrondafbeelding per weertoestand (in public/). */
function getWeatherBackgroundImage(condition: string): string | null {
  const s = condition?.toLowerCase() ?? "";
  switch (s) {
    case "fog":
    case "mist":
      return "/weather-fog.png";
    case "sunny":
    case "clear":
      return "/weather-sunny.png";
    case "rainy":
    case "pouring":
    case "hail":
      return "/weather-rainy.png";
    case "cloudy":
    case "partlycloudy":
    case "exceptional":
      return "/weather-partlycloudy.png";
    default:
      return null;
  }
}

export function WeatherCardWidget({
  title = "Weather",
  entity_id,
  size = "md",
  show_icon = true,
  className,
  onMoreClick,
}: WeatherCardProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const condition = (entity?.state as string) ?? "";
  const temperature = entity?.attributes?.temperature != null
    ? Number(entity.attributes.temperature)
    : undefined;
  const humidity = entity?.attributes?.humidity != null
    ? Number(entity.attributes.humidity)
    : undefined;
  const bgGradient = getWeatherBackground(condition);
  const bgImage = getWeatherBackgroundImage(condition);
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;

  return (
    <div
      className={cn(
        "relative flex w-full min-h-[125px] flex-col overflow-hidden rounded-2xl text-white shadow-xl border border-white/20 dark:border-white/10",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      {/* Gradient als fallback / basis */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b rounded-2xl",
          bgGradient
        )}
      />
      {/* Custom achtergrondafbeelding voor fog, sunny, rainy */}
      {bgImage && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/25 dark:bg-black/50 rounded-2xl" />
      <div className="relative flex flex-col z-10">
        <div className="flex items-start justify-between gap-3 px-4 py-3">
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
              aria-label="Opties"
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          )}
        </div>
        <div className="px-4 pb-4 pt-1">
          <p className="text-3xl font-bold tabular-nums text-white drop-shadow-md">
            {formatTemp(temperature)}
          </p>
        </div>
      </div>
    </div>
  );
}
