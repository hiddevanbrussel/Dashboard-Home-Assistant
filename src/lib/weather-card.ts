export const WEATHER_CARD_DEFAULT_WIDTH = 320;
export const WEATHER_CARD_DEFAULT_HEIGHT = 300;
export const WEATHER_CARD_MIN_WIDTH = 200;
export const WEATHER_CARD_MAX_WIDTH = 500;
export const WEATHER_CARD_MIN_HEIGHT = 140;
export const WEATHER_CARD_MAX_HEIGHT = 420;

export type WeatherCardDisplayOptions = {
  show_icon?: boolean;
  show_condition?: boolean;
  show_high_low?: boolean;
  show_wind?: boolean;
  show_humidity?: boolean;
  show_air_quality?: boolean;
  show_precipitation?: boolean;
};

export function isWeatherShowFlag(value: unknown, defaultValue = true): boolean {
  if (value === undefined || value === null) return defaultValue;
  return value !== false;
}

export function clampWeatherCardWidth(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return WEATHER_CARD_DEFAULT_WIDTH;
  return Math.min(WEATHER_CARD_MAX_WIDTH, Math.max(WEATHER_CARD_MIN_WIDTH, Math.round(v)));
}

export function clampWeatherCardHeight(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return WEATHER_CARD_DEFAULT_HEIGHT;
  return Math.min(WEATHER_CARD_MAX_HEIGHT, Math.max(WEATHER_CARD_MIN_HEIGHT, Math.round(v)));
}

/** Resize from the bottom-right corner while keeping the top-left of the card fixed. */
export function resizeWeatherCardFromBottomRight(input: {
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startBottom: number;
  dx: number;
  dy: number;
  viewportWidth: number;
  viewportHeight: number;
}): { width: number; height: number; left: number; bottom: number } {
  const top = input.viewportHeight - input.startBottom - input.startHeight;
  const maxWidth = Math.max(
    WEATHER_CARD_MIN_WIDTH,
    Math.min(WEATHER_CARD_MAX_WIDTH, Math.floor(input.viewportWidth - input.startLeft))
  );
  const maxHeight = Math.max(
    WEATHER_CARD_MIN_HEIGHT,
    Math.min(WEATHER_CARD_MAX_HEIGHT, Math.floor(input.viewportHeight - Math.max(0, top)))
  );
  const width = Math.min(maxWidth, clampWeatherCardWidth(input.startWidth + input.dx));
  const height = Math.min(maxHeight, clampWeatherCardHeight(input.startHeight + input.dy));
  const bottom = Math.max(0, input.viewportHeight - Math.max(0, top) - height);
  return { width, height, left: input.startLeft, bottom };
}

/** Gradient fallback when a condition has no photo. */
export function weatherBackgroundGradient(condition: string): string {
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

const LIGHT = (name: string) => `/weather/light/${name}.webp`;
const DARK = (name: string) => `/weather/dark/${name}.webp`;

/** Public path stem for a legacy condition photo, without `.png`. */
export function weatherImageBase(condition: string): string | null {
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

/** Curated WebP pack (light/dark folders), with legacy PNG fallback. */
export function weatherImageSources(
  condition: string,
  isNight: boolean
): { src: string | null; fallback: string | null } {
  const s = condition?.toLowerCase() ?? "";
  switch (s) {
    case "sunny":
    case "clear":
    case "zonnig":
      return isNight
        ? { src: DARK("weather_clear_night"), fallback: LIGHT("weather_sunny") }
        : { src: LIGHT("weather_sunny"), fallback: "/weather-sunny.png" };
    case "clear-night":
      return { src: DARK("weather_clear_night"), fallback: LIGHT("weather_sunny") };
    case "partlycloudy":
      return isNight
        ? { src: DARK("weather_partlycloudy_night"), fallback: LIGHT("weather_partlycloudy") }
        : { src: LIGHT("weather_partlycloudy"), fallback: "/weather-partlycloudy.png" };
    case "cloudy":
    case "exceptional":
      return { src: LIGHT("weather_cloudy"), fallback: "/weather-partlycloudy.png" };
    case "fog":
    case "mist":
      return { src: LIGHT("weather_fog"), fallback: "/weather-fog.png" };
    case "windy":
    case "windy-variant":
      return { src: LIGHT("weather_windy"), fallback: "/weather-partlycloudy.png" };
    case "rainy":
    case "pouring":
    case "hail":
      return {
        src: DARK("weather_rainy"),
        fallback: isNight ? "/weather-rainy-night.png" : "/weather-rainy.png",
      };
    case "snowy":
    case "snowy-rainy":
      return isNight
        ? { src: DARK("weather_snowy_night"), fallback: "/weather-snowy-night.png" }
        : { src: "/weather-snowy.png", fallback: DARK("weather_snowy_night") };
    case "lightning":
    case "lightning-rainy":
      return { src: DARK("weather_lightning_rainy"), fallback: null };
    default: {
      const base = weatherImageBase(s);
      if (!base) return { src: null, fallback: null };
      return {
        src: `${base}${isNight ? "-night" : ""}.png`,
        fallback: isNight ? `${base}.png` : null,
      };
    }
  }
}

/** 3D condition-icon stems in `/public/weather-icons` (WebP, black punched). */
export const WEATHER_ICON_FILES = [
  "sunny",
  "clear-night",
  "cloudy",
  "partlycloudy",
  "fog",
  "rainy",
  "pouring",
  "hail",
  "snowy",
  "snowy-rainy",
  "lightning",
  "lightning-rainy",
  "windy",
  "windy-variant",
  "exceptional",
] as const;

export type WeatherIconFile = (typeof WEATHER_ICON_FILES)[number];

const WEATHER_ICONS_CACHE_BUST = "20261019c";

/** Map a Home Assistant weather condition to a 3D icon file stem. */
export function weatherIconFile(condition: string): WeatherIconFile {
  const s = condition?.toLowerCase() ?? "";
  switch (s) {
    case "sunny":
    case "clear":
    case "zonnig":
      return "sunny";
    case "clear-night":
      return "clear-night";
    case "partlycloudy":
      return "partlycloudy";
    case "fog":
    case "mist":
      return "fog";
    case "rainy":
      return "rainy";
    case "pouring":
      return "pouring";
    case "hail":
      return "hail";
    case "snowy":
      return "snowy";
    case "snowy-rainy":
      return "snowy-rainy";
    case "lightning":
      return "lightning";
    case "lightning-rainy":
      return "lightning-rainy";
    case "windy":
      return "windy";
    case "windy-variant":
      return "windy-variant";
    case "exceptional":
      return "exceptional";
    case "cloudy":
    default:
      return "cloudy";
  }
}

export function weatherIconSrc(condition: string): string {
  return `/weather-icons/${weatherIconFile(condition)}.webp?v=${WEATHER_ICONS_CACHE_BUST}`;
}

/** Convert wind speed to Beaufort (0–12). Unit is typically m/s, km/h, mph, or kn. */
export function windSpeedToBeaufort(speed: number, unit?: string | null): number {
  if (!Number.isFinite(speed) || speed < 0) return 0;
  const u = (unit ?? "m/s").toLowerCase().replace(/\s/g, "");
  let ms = speed;
  if (u === "km/h" || u === "kmh" || u === "kph") ms = speed / 3.6;
  else if (u === "mph") ms = speed * 0.44704;
  else if (u === "kn" || u === "kt" || u === "knots") ms = speed * 0.514444;
  // else assume m/s
  const thresholds = [0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7];
  let bft = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (ms >= thresholds[i]) bft = i + 1;
  }
  return Math.min(12, bft);
}

const BEARING_EN = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
const BEARING_NL = ["N", "NO", "O", "ZO", "Z", "ZW", "W", "NW"] as const;

/** Compass abbreviation from degrees (0–360). */
export function windBearingLabel(bearing: number, locale: "en" | "nl" = "en"): string {
  if (!Number.isFinite(bearing)) return "—";
  const normalized = ((bearing % 360) + 360) % 360;
  const idx = Math.round(normalized / 45) % 8;
  return (locale === "nl" ? BEARING_NL : BEARING_EN)[idx];
}

export function formatWindSummary(input: {
  speed?: number | null;
  bearing?: number | null;
  unit?: string | null;
  locale?: "en" | "nl";
}): string | null {
  if (input.speed == null || Number.isNaN(input.speed)) return null;
  const bft = windSpeedToBeaufort(input.speed, input.unit);
  const dir =
    input.bearing != null && !Number.isNaN(input.bearing)
      ? windBearingLabel(input.bearing, input.locale ?? "en")
      : null;
  return dir ? `${dir} ${bft} Bft` : `${bft} Bft`;
}

export type AirQualityLevel = "good" | "fair" | "moderate" | "poor" | "very_poor" | "unknown";

/** Map AQI / categorical sensor state to a coarse air-quality level. */
export function parseAirQualityLevel(state: string | number | null | undefined): AirQualityLevel {
  if (state == null || state === "") return "unknown";
  if (typeof state === "number" || (typeof state === "string" && /^-?\d+(\.\d+)?$/.test(state.trim()))) {
    const n = typeof state === "number" ? state : Number(state);
    if (!Number.isFinite(n)) return "unknown";
    if (n <= 50) return "good";
    if (n <= 100) return "fair";
    if (n <= 150) return "moderate";
    if (n <= 200) return "poor";
    return "very_poor";
  }
  const s = String(state).toLowerCase().trim();
  if (["good", "goed", "excellent", "uitstekend", "1", "green"].includes(s)) return "good";
  if (["fair", "redelijk", "satisfactory", "2"].includes(s)) return "fair";
  if (["moderate", "matig", "ok", "3", "yellow"].includes(s)) return "moderate";
  if (["poor", "slecht", "unhealthy", "4", "orange"].includes(s)) return "poor";
  if (
    ["very_poor", "very poor", "zeer slecht", "hazardous", "very_unhealthy", "5", "6", "red", "purple"].includes(
      s
    )
  ) {
    return "very_poor";
  }
  return "unknown";
}

export function formatPrecipitationMm(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded} mm` : `${rounded.toFixed(1)} mm`;
}
