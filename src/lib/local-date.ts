const FALLBACK_TIME_ZONE = "Europe/Amsterdam";

const DATE_PARTS: Intl.DateTimeFormatOptions = {
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Timezone of this device or app process. Undefined when Intl cannot provide one. */
function deviceTimeZone(): string | undefined {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim();
    if (timeZone && isValidTimeZone(timeZone)) return timeZone;
  } catch {
    return undefined;
  }
  return undefined;
}

function resolveTimeZone(timeZone?: string): string {
  const explicit = timeZone?.trim();
  if (explicit && isValidTimeZone(explicit)) return explicit;
  return deviceTimeZone() ?? FALLBACK_TIME_ZONE;
}

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  const value = parts.find((entry) => entry.type === type)?.value;
  if (!value) {
    throw new Error(`Could not resolve the local calendar ${type}`);
  }
  return value;
}

/**
 * Calendar day as `YYYY-MM-DD`.
 * Uses `timeZone` when given, otherwise the device or app timezone.
 * Falls back to Europe/Amsterdam when neither is available.
 */
export function localDateKey(date: Date = new Date(), timeZone?: string): string {
  const zone = resolveTimeZone(timeZone);
  const parts = new Intl.DateTimeFormat("en-US", { ...DATE_PARTS, timeZone: zone }).formatToParts(date);
  return `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}`;
}
