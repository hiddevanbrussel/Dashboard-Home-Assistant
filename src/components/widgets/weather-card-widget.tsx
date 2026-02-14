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
import { useState, useEffect } from "react";
import type { WeatherCardProps } from "./widget-types";
import { cn } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";

function WeatherIcon({ state, className }: { state: string; className?: string }) {
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

/** Achtergrondgradient per weertoestand (fallback als er geen afbeelding is). */
function getWeatherBackground(condition: string) {
  const s = condition?.toLowerCase() ?? "";
  switch (s) {
    case "sunny":
    case "clear":
    case "zonnig":
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

/** Basisbestandsnaam voor custom achtergrond per weertoestand (zonder .png, in public/). */
function getWeatherImageBase(condition: string): string | null {
  const s = condition?.toLowerCase() ?? "";
  switch (s) {
    case "fog":
    case "mist":
      return "/weather-fog";
    case "sunny":
    case "clear":
    case "zonnig":
      return "/weather-sunny";
    case "clear-night":
      return "/weather-clear-night";
    case "rainy":
    case "pouring":
    case "hail":
      return "/weather-rainy";
    case "cloudy":
    case "partlycloudy":
    case "exceptional":
      return "/weather-partlycloudy";
    case "snowy":
    case "snowy-rainy":
      return "/weather-snowy";
    case "lightning":
    case "lightning-rainy":
      return "/weather-lightning";
    case "windy":
    case "windy-variant":
      return "/weather-windy";
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
  const { resolved: theme } = useThemeStore();
  const condition = (entity?.state as string) ?? "";
  const temperature = entity?.attributes?.temperature != null
    ? Number(entity.attributes.temperature)
    : undefined;
  const humidity = entity?.attributes?.humidity != null
    ? Number(entity.attributes.humidity)
    : undefined;
  const isNight = theme === "dark";
  const bgGradient = getWeatherBackground(condition);
  const base = getWeatherImageBase(condition);
  const bgImage = base ? `${base}${isNight ? "-night" : ""}.png` : null;
  const fallbackImage = base && isNight ? `${base}.png` : null;
  const [imageError, setImageError] = useState(false);
  const effectiveBgImage = imageError && fallbackImage ? fallbackImage : bgImage;
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;

  useEffect(() => {
    setImageError(false);
  }, [bgImage]);

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
      {/* Gradient als fallback / basis */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b rounded-2xl",
          bgGradient
        )}
      />
      {/* Custom achtergrondafbeelding: dag- of nacht-variant (bijv. weather-sunny.png / weather-sunny-night.png) */}
      {effectiveBgImage && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <img
            src={effectiveBgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={fallbackImage ? () => setImageError(true) : undefined}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/25 dark:bg-black/50 rounded-2xl" />
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
              aria-label="Opties"
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
