import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bucketStarts,
  isoWithOffset,
  partialUntil,
  periodRange,
  zonedHourStart,
  zonedMidnight,
} from "./energy-time";

const AMSTERDAM = "Europe/Amsterdam";
const FIXTURES = path.join(process.cwd(), "src/lib/ha/__fixtures__/energy");

function readFixture(name: string): { timeZone: string; hours: number; starts: string[] } {
  return JSON.parse(readFileSync(path.join(FIXTURES, name), "utf8")) as {
    timeZone: string;
    hours: number;
    starts: string[];
  };
}

function asUtcServer() {
  vi.stubEnv("TZ", "UTC");
  const RealDateTimeFormat = Intl.DateTimeFormat;
  vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((
    locales?: Intl.LocalesArgument,
    options?: Intl.DateTimeFormatOptions
  ) => {
    const real = new RealDateTimeFormat(locales, options);
    if (options?.timeZone) return real;
    const resolved = real.resolvedOptions();
    return Object.assign(real, {
      resolvedOptions: () => ({ ...resolved, timeZone: "UTC" }),
    });
  }) as typeof Intl.DateTimeFormat);
}

describe("energy time", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("builds 25 hour buckets on the 2026-10-25 fall-back day", () => {
    const fixture = readFixture("stats-dst-2026-10-25.json");
    const now = new Date("2026-10-26T12:00:00.000Z");
    const range = periodRange("day", 1, AMSTERDAM, now);
    const starts = bucketStarts(range, "hour", AMSTERDAM).map((start) => isoWithOffset(start, AMSTERDAM));
    expect(starts).toHaveLength(fixture.hours);
    expect(starts).toEqual(fixture.starts);
  });

  it("builds 23 hour buckets on the 2027-03-28 spring-forward day", () => {
    const fixture = readFixture("stats-dst-2027-03-28.json");
    const now = new Date("2027-03-29T12:00:00.000Z");
    const range = periodRange("day", 1, AMSTERDAM, now);
    const starts = bucketStarts(range, "hour", AMSTERDAM).map((start) => isoWithOffset(start, AMSTERDAM));
    expect(starts).toHaveLength(fixture.hours);
    expect(starts).toEqual(fixture.starts);
  });

  it("uses the Home Assistant timezone when the process timezone is UTC", () => {
    asUtcServer();
    const now = new Date("2026-01-14T23:30:00.000Z");
    const amsterdam = periodRange("day", 0, AMSTERDAM, now);
    const utc = periodRange("day", 0, "UTC", now);
    expect(amsterdam.start.toISOString()).toBe("2026-01-14T23:00:00.000Z");
    expect(isoWithOffset(amsterdam.start, AMSTERDAM)).toBe("2026-01-15T00:00:00+01:00");
    expect(utc.start.toISOString()).toBe("2026-01-14T00:00:00.000Z");
    expect(isoWithOffset(zonedMidnight(now, AMSTERDAM), AMSTERDAM)).toBe("2026-01-15T00:00:00+01:00");
    expect(isoWithOffset(zonedMidnight(now, "UTC"), "UTC")).toBe("2026-01-14T00:00:00+00:00");
  });

  it("starts a week on Monday and keeps the same wall clock for partialUntil", () => {
    const now = new Date("2026-10-28T12:00:00.000Z");
    const week = periodRange("week", 0, AMSTERDAM, now);
    expect(isoWithOffset(week.start, AMSTERDAM)).toBe("2026-10-26T00:00:00+01:00");
    expect(bucketStarts(week, "day", AMSTERDAM)).toHaveLength(3);

    const summer = new Date("2026-07-15T12:30:00.000Z");
    expect(partialUntil("day", summer, AMSTERDAM)?.toISOString()).toBe("2026-07-14T12:30:00.000Z");
    expect(partialUntil("week", summer, AMSTERDAM)?.toISOString()).toBe("2026-07-08T12:30:00.000Z");
    expect(partialUntil("month", summer, AMSTERDAM)).toBeNull();
    expect(partialUntil("year", summer, AMSTERDAM)).toBeNull();

    const fallback = new Date("2026-10-25T12:30:00.000Z");
    expect(partialUntil("day", fallback, AMSTERDAM)?.toISOString()).toBe("2026-10-24T11:30:00.000Z");
  });

  it("picks the repeated local hour that contains the instant", () => {
    expect(zonedHourStart(new Date("2026-10-25T00:30:00.000Z"), AMSTERDAM).toISOString()).toBe("2026-10-25T00:00:00.000Z");
    expect(zonedHourStart(new Date("2026-10-25T01:30:00.000Z"), AMSTERDAM).toISOString()).toBe("2026-10-25T01:00:00.000Z");
    expect(isoWithOffset(new Date("2026-10-25T00:30:00.000Z"), AMSTERDAM)).toBe("2026-10-25T02:30:00+02:00");
    expect(isoWithOffset(new Date("2026-10-25T01:30:00.000Z"), AMSTERDAM)).toBe("2026-10-25T02:30:00+01:00");
  });

  it("uses months for a year and days for a month", () => {
    const now = new Date("2026-10-28T12:00:00.000Z");
    const year = periodRange("year", 0, AMSTERDAM, now);
    expect(bucketStarts(year, "month", AMSTERDAM)).toHaveLength(10);
    const previous = periodRange("year", 1, AMSTERDAM, now);
    expect(bucketStarts(previous, "month", AMSTERDAM)).toHaveLength(12);
    const month = periodRange("month", 0, AMSTERDAM, now);
    expect(isoWithOffset(month.start, AMSTERDAM)).toBe("2026-10-01T00:00:00+02:00");
    expect(bucketStarts(month, "day", AMSTERDAM)).toHaveLength(28);
  });
});
