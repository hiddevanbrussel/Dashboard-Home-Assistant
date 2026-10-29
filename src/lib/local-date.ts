export const FALLBACK_TIME_ZONE = "Europe/Amsterdam";

const DATE_PARTS: Intl.DateTimeFormatOptions = {
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export function isValidTimeZone(timeZone: string): boolean {
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
 * Uses `timeZone` when given, otherwise the device timezone (the browser).
 * Falls back to Europe/Amsterdam when neither is available.
 * The server must not call this without a zone: Docker and the HA add-on are usually UTC.
 */
export function localDateKey(date: Date = new Date(), timeZone?: string): string {
  const zone = resolveTimeZone(timeZone);
  const parts = new Intl.DateTimeFormat("en-US", { ...DATE_PARTS, timeZone: zone }).formatToParts(date);
  return `${part(parts, "year")}-${part(parts, "month")}-${part(parts, "day")}`;
}

const CALENDAR_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

function isCalendarDay(value: string): boolean {
  const match = CALENDAR_DAY.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day;
}

export type ChoreDayInput = {
  /** `YYYY-MM-DD` sent by the client. */
  date?: string | null;
  /** IANA zone sent by the client. */
  timeZone?: string | null;
  /** Zone already read from Home Assistant config. This app does not store one. */
  haTimeZone?: string | null;
  now?: Date;
};

/**
 * Day used to filter and store chore completions.
 * Ignores the server process timezone.
 * 1. Calendar day or timezone sent by the client.
 * 2. Home Assistant timezone, when the caller already has it.
 * 3. Europe/Amsterdam.
 */
export function resolveChoreDay(input: ChoreDayInput = {}): string {
  const date = input.date?.trim();
  if (date && isCalendarDay(date)) return date;

  const now = input.now ?? new Date();
  const clientZone = input.timeZone?.trim();
  if (clientZone && isValidTimeZone(clientZone)) return localDateKey(now, clientZone);

  const haZone = input.haTimeZone?.trim();
  if (haZone && isValidTimeZone(haZone)) return localDateKey(now, haZone);

  return localDateKey(now, FALLBACK_TIME_ZONE);
}
