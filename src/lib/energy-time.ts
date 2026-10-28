/**
 * Calendar periods in a Home Assistant timezone.
 * The server process is often UTC, so every boundary goes through Intl.
 * Builds on local-date.ts; there is no second timezone check.
 */

import { FALLBACK_TIME_ZONE, isValidTimeZone, localDateKey } from "./local-date";

export type EnergyView = "day" | "week" | "month" | "year";
export type EnergyBucket = "5minute" | "hour" | "day" | "month";

export type PeriodRange = {
  view: EnergyView;
  start: Date;
  end: Date;
  bucket: "hour" | "day" | "month";
};

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const PART_OPTIONS: Intl.DateTimeFormatOptions = {
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function zoneOf(timeZone: string): string {
  const trimmed = timeZone.trim();
  return trimmed && isValidTimeZone(trimmed) ? trimmed : FALLBACK_TIME_ZONE;
}

function formatter(timeZone: string): Intl.DateTimeFormat {
  const cached = formatters.get(timeZone);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat("en-US", { ...PART_OPTIONS, timeZone });
  formatters.set(timeZone, created);
  return created;
}

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  const value = parts.find((part) => part.type === type)?.value;
  if (!value) throw new Error(`Could not resolve ${type} in ${parts.map((part) => part.value).join("")}`);
  return Number(value);
}

function zonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = formatter(timeZone).formatToParts(date);
  let hour = readPart(parts, "hour");
  if (hour === 24) hour = 0;
  return {
    year: readPart(parts, "year"),
    month: readPart(parts, "month"),
    day: readPart(parts, "day"),
    hour,
    minute: readPart(parts, "minute"),
    second: readPart(parts, "second"),
  };
}

/** Milliseconds to add to UTC to reach the wall clock in `timeZone`. */
function offsetMs(instant: Date, timeZone: string): number {
  const parts = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - instant.getTime();
}

function zonedDateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string
): Date {
  const normalized = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const y = normalized.getUTCFullYear();
  const m = normalized.getUTCMonth() + 1;
  const d = normalized.getUTCDate();
  const h = normalized.getUTCHours();
  const min = normalized.getUTCMinutes();
  const s = normalized.getUTCSeconds();
  const guess = Date.UTC(y, m - 1, d, h, min, s);
  const first = offsetMs(new Date(guess), timeZone);
  let instant = guess - first;
  const secondOffset = offsetMs(new Date(instant), timeZone);
  if (secondOffset !== first) instant = guess - secondOffset;
  return new Date(instant);
}

/** Local midnight that contains `date`. Reuses `localDateKey` for the calendar day. */
export function zonedMidnight(date: Date, timeZone: string): Date {
  const zone = zoneOf(timeZone);
  const key = localDateKey(date, zone);
  const [year, month, day] = key.split("-").map(Number);
  return zonedDateTime(year, month, day, 0, 0, 0, zone);
}

export function addZonedDays(date: Date, days: number, timeZone: string): Date {
  const zone = zoneOf(timeZone);
  const parts = zonedParts(date, zone);
  return zonedDateTime(parts.year, parts.month, parts.day + days, parts.hour, parts.minute, parts.second, zone);
}

function addZonedMonths(date: Date, months: number, timeZone: string): Date {
  const zone = zoneOf(timeZone);
  const parts = zonedParts(date, zone);
  const anchor = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1));
  const year = anchor.getUTCFullYear();
  const month = anchor.getUTCMonth() + 1;
  const dim = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(parts.day, dim);
  return zonedDateTime(year, month, day, parts.hour, parts.minute, parts.second, zone);
}

function zonedMonthStart(date: Date, timeZone: string): Date {
  const parts = zonedParts(zonedMidnight(date, timeZone), timeZone);
  return zonedDateTime(parts.year, parts.month, 1, 0, 0, 0, timeZone);
}

function zonedYearStart(date: Date, timeZone: string): Date {
  const parts = zonedParts(zonedMidnight(date, timeZone), timeZone);
  return zonedDateTime(parts.year, 1, 1, 0, 0, 0, timeZone);
}

function zonedMonday(date: Date, timeZone: string): Date {
  const midnight = zonedMidnight(date, timeZone);
  const parts = zonedParts(midnight, timeZone);
  const sundayBased = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  const sinceMonday = (sundayBased + 6) % 7;
  return addZonedDays(midnight, -sinceMonday, timeZone);
}

function bucketKind(view: EnergyView): PeriodRange["bucket"] {
  switch (view) {
    case "day":
      return "hour";
    case "week":
    case "month":
      return "day";
    case "year":
      return "month";
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}

/**
 * The window for a dashboard view.
 * Day is the hours of that local day, week starts Monday 00:00, month is days, year is months.
 * Offset 0 ends at `now`. Older offsets are closed periods.
 */
export function periodRange(view: EnergyView, offset: number, timeZone: string, now: Date): PeriodRange {
  const zone = zoneOf(timeZone);
  const shift = Number.isFinite(offset) ? Math.max(0, Math.trunc(offset)) : 0;
  const bucket = bucketKind(view);
  switch (view) {
    case "day": {
      const start = addZonedDays(zonedMidnight(now, zone), -shift, zone);
      const end = shift === 0 ? now : addZonedDays(start, 1, zone);
      return { view, start, end, bucket };
    }
    case "week": {
      const start = addZonedDays(zonedMonday(now, zone), -7 * shift, zone);
      const end = shift === 0 ? now : addZonedDays(start, 7, zone);
      return { view, start, end, bucket };
    }
    case "month": {
      const start = addZonedMonths(zonedMonthStart(now, zone), -shift, zone);
      const end = shift === 0 ? now : addZonedMonths(start, 1, zone);
      return { view, start, end, bucket };
    }
    case "year": {
      const start = addZonedMonths(zonedYearStart(now, zone), -12 * shift, zone);
      const end = shift === 0 ? now : addZonedMonths(start, 12, zone);
      return { view, start, end, bucket };
    }
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}

export function advanceBucket(start: Date, period: EnergyBucket, timeZone: string): Date {
  const zone = zoneOf(timeZone);
  switch (period) {
    case "5minute":
      return new Date(start.getTime() + 5 * 60 * 1000);
    case "hour":
      return new Date(start.getTime() + 60 * 60 * 1000);
    case "day":
      return addZonedDays(zonedMidnight(start, zone), 1, zone);
    case "month":
      return addZonedMonths(zonedMonthStart(start, zone), 1, zone);
    default: {
      const neverPeriod: never = period;
      return neverPeriod;
    }
  }
}

/** Bucket starts in `[range.start, range.end)`. Hour steps are real hours, so a local day can have 23, 24, or 25. */
export function bucketStarts(range: { start: Date; end: Date }, period: EnergyBucket, timeZone: string): Date[] {
  const zone = zoneOf(timeZone);
  const out: Date[] = [];
  let cursor = range.start;
  for (let guard = 0; guard < 20000 && cursor.getTime() < range.end.getTime(); guard += 1) {
    out.push(cursor);
    const next = advanceBucket(cursor, period, zone);
    if (next.getTime() <= cursor.getTime()) break;
    cursor = next;
  }
  return out;
}

/** Start of the local hour that contains `date`, including the repeated hour on a fall-back day. */
export function zonedHourStart(date: Date, timeZone: string): Date {
  const zone = zoneOf(timeZone);
  const midnight = zonedMidnight(date, zone);
  if (date.getTime() <= midnight.getTime()) return midnight;
  const hours = bucketStarts({ start: midnight, end: new Date(date.getTime() + 1) }, "hour", zone);
  return hours[hours.length - 1] ?? midnight;
}

function offsetLabel(date: Date, timeZone: string): string {
  const minutes = Math.round(offsetMs(date, timeZone) / 60000);
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const mins = String(abs % 60).padStart(2, "0");
  return `${sign}${hours}:${mins}`;
}

/** ISO-8601 with the numeric offset of `timeZone`. Never uses the process zone. */
export function isoWithOffset(date: Date, timeZone: string): string {
  const zone = zoneOf(timeZone);
  const parts = zonedParts(date, zone);
  const year = String(parts.year).padStart(4, "0");
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  const hour = String(parts.hour).padStart(2, "0");
  const minute = String(parts.minute).padStart(2, "0");
  const second = String(parts.second).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetLabel(date, zone)}`;
}

/**
 * Cutoff for a partial comparison.
 * Day: the same wall-clock time yesterday. Week: the same wall-clock time seven days ago.
 * Month and year have no partial cutoff.
 */
export function partialUntil(view: EnergyView, now: Date, timeZone: string): Date | null {
  switch (view) {
    case "day":
      return addZonedDays(now, -1, timeZone);
    case "week":
      return addZonedDays(now, -7, timeZone);
    case "month":
    case "year":
      return null;
    default: {
      const neverView: never = view;
      return neverView;
    }
  }
}
