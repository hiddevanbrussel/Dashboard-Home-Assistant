export const WEATHER_CARD_DEFAULT_WIDTH = 320;
export const WEATHER_CARD_DEFAULT_HEIGHT = 180;
export const WEATHER_CARD_MIN_WIDTH = 200;
export const WEATHER_CARD_MAX_WIDTH = 500;
export const WEATHER_CARD_MIN_HEIGHT = 100;
export const WEATHER_CARD_MAX_HEIGHT = 400;

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

/** Public path stem for a condition photo, without `.png`. */
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

export function weatherImageSources(
  condition: string,
  isNight: boolean
): { src: string | null; fallback: string | null } {
  const base = weatherImageBase(condition);
  if (!base) return { src: null, fallback: null };
  return {
    src: `${base}${isNight ? "-night" : ""}.png`,
    fallback: isNight ? `${base}.png` : null,
  };
}
