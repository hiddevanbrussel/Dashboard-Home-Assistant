/** Home Assistant sun / weather sunrise–sunset helpers for the header chrome. */

export const DEFAULT_SUN_ENTITY_ID = "sun.sun";

export type SunTimes = {
  sunriseIso: string | null;
  sunsetIso: string | null;
};

type EntityLike = {
  entity_id?: string;
  attributes?: Record<string, unknown> | null;
} | null | undefined;

function asIsoString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const t = new Date(trimmed).getTime();
  return Number.isNaN(t) ? null : trimmed;
}

function pickAttr(attrs: Record<string, unknown> | null | undefined, keys: string[]): string | null {
  if (!attrs) return null;
  for (const key of keys) {
    const iso = asIsoString(attrs[key]);
    if (iso) return iso;
  }
  return null;
}

/** Read sunrise/sunset ISO timestamps from a HA entity's attributes. */
export function sunTimesFromAttributes(attrs: Record<string, unknown> | null | undefined): SunTimes {
  return {
    sunriseIso: pickAttr(attrs, ["next_rising", "rising", "sunrise", "next_dawn"]),
    sunsetIso: pickAttr(attrs, ["next_setting", "setting", "sunset", "next_dusk"]),
  };
}

/**
 * Prefer `sun.sun` (next_rising / next_setting). Fall back to weather (or other)
 * entity attributes when the sun entity is missing.
 */
export function resolveSunTimes(sunEntity: EntityLike, weatherEntity?: EntityLike): SunTimes {
  const fromSun = sunTimesFromAttributes(sunEntity?.attributes ?? undefined);
  if (fromSun.sunriseIso || fromSun.sunsetIso) return fromSun;
  return sunTimesFromAttributes(weatherEntity?.attributes ?? undefined);
}

export type FormatSunTimeOptions = {
  locale: string;
  hour12?: boolean;
};

/** Format an ISO timestamp as a short local time (e.g. 07:12). */
export function formatSunTime(
  iso: string | null | undefined,
  { locale, hour12 = false }: FormatSunTimeOptions
): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  }).format(date);
}

export function languageToSunLocale(language: string): string {
  return language === "nl" ? "nl-NL" : "en-GB";
}
