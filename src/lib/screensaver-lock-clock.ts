const WEATHER_CONDITION_KEYS = [
  "sunny",
  "clear",
  "zonnig",
  "clear-night",
  "cloudy",
  "partlycloudy",
  "rainy",
  "pouring",
  "hail",
  "snowy",
  "snowy-rainy",
  "fog",
  "mist",
  "lightning",
  "lightning-rainy",
  "windy",
  "windy-variant",
  "exceptional",
] as const;

const GENERIC_LOCATION_NAMES = new Set([
  "home",
  "thuis",
  "weer",
  "weather",
  "forecast",
  "forecast home",
  "weather home",
  "weer thuis",
]);

function firstText(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export function lockClockParts(
  date: Date,
  use24h: boolean
): { hours: string; minutes: string; period: "am" | "pm" | null } {
  const minutes = date.getMinutes().toString().padStart(2, "0");
  if (use24h) {
    return {
      hours: date.getHours().toString().padStart(2, "0"),
      minutes,
      period: null,
    };
  }
  const hour = date.getHours();
  return {
    hours: (hour % 12 || 12).toString().padStart(2, "0"),
    minutes,
    period: hour < 12 ? "am" : "pm",
  };
}

/** Compact numeric date as on the lock screen: 19.9 in Dutch, 9.19 in English. */
export function formatLockDateNumeric(date: Date, language: string): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return language === "nl" ? `${day}.${month}` : `${month}.${day}`;
}

export function formatLockWeekday(date: Date, language: string): string {
  const locale = language === "nl" ? "nl-NL" : "en-US";
  const weekday = date.toLocaleDateString(locale, { weekday: "long" });
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

export function formatLockTemperature(value: unknown): string | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return `${Math.round(n)}°`;
}

export function weatherConditionI18nKey(state: string | undefined | null): string | null {
  if (!state) return null;
  const normalized = state.toLowerCase().trim();
  return WEATHER_CONDITION_KEYS.includes(normalized as (typeof WEATHER_CONDITION_KEYS)[number])
    ? `weatherSheet.condition.${normalized}`
    : null;
}

export function isGenericLocationName(name: string): boolean {
  return GENERIC_LOCATION_NAMES.has(name.trim().toLowerCase());
}

export function weatherLocationLabel(
  weatherAttrs?: Record<string, unknown> | null,
  zoneHomeAttrs?: Record<string, unknown> | null
): string | null {
  const fromWeather = firstText(weatherAttrs?.location, weatherAttrs?.friendly_name);
  if (fromWeather && !isGenericLocationName(fromWeather)) return fromWeather;
  const fromZone = firstText(zoneHomeAttrs?.friendly_name, zoneHomeAttrs?.location);
  if (fromZone && !isGenericLocationName(fromZone)) return fromZone;
  return fromWeather ?? fromZone;
}
