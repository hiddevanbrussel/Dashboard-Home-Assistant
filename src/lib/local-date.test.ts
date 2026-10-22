import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { localDateKey, resolveChoreDay } from "./local-date";

const AMSTERDAM = "Europe/Amsterdam";

describe("localDateKey", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  function onAmsterdamDay(isoUtc: string): string {
    vi.setSystemTime(new Date(isoUtc));
    return localDateKey(undefined, AMSTERDAM);
  }

  it("uses 00:00, 00:30, 01:59 and 02:00 on a winter day in Amsterdam", () => {
    // CET (UTC+1). 00:00 and 00:30 are still the previous UTC day.
    expect(onAmsterdamDay("2026-01-14T23:00:00.000Z")).toBe("2026-01-15");
    expect(onAmsterdamDay("2026-01-14T23:30:00.000Z")).toBe("2026-01-15");
    expect(onAmsterdamDay("2026-01-15T00:59:00.000Z")).toBe("2026-01-15");
    expect(onAmsterdamDay("2026-01-15T01:00:00.000Z")).toBe("2026-01-15");
  });

  it("uses 00:00, 00:30, 01:59 and 02:00 on a summer day in Amsterdam", () => {
    // CEST (UTC+2). 00:00 through 01:59 are still the previous UTC day.
    expect(onAmsterdamDay("2026-07-14T22:00:00.000Z")).toBe("2026-07-15");
    expect(onAmsterdamDay("2026-07-14T22:30:00.000Z")).toBe("2026-07-15");
    expect(onAmsterdamDay("2026-07-14T23:59:00.000Z")).toBe("2026-07-15");
    expect(onAmsterdamDay("2026-07-15T00:00:00.000Z")).toBe("2026-07-15");
  });

  it("keeps the local day when clocks spring forward (last Sunday of March)", () => {
    // 2026-03-29: 02:00 CET becomes 03:00 CEST. 02:00 local does not exist.
    expect(onAmsterdamDay("2026-03-28T23:00:00.000Z")).toBe("2026-03-29"); // 00:00 CET
    expect(onAmsterdamDay("2026-03-28T23:30:00.000Z")).toBe("2026-03-29"); // 00:30 CET
    expect(onAmsterdamDay("2026-03-29T00:59:00.000Z")).toBe("2026-03-29"); // 01:59 CET
    expect(onAmsterdamDay("2026-03-29T01:00:00.000Z")).toBe("2026-03-29"); // 03:00 CEST
  });

  it("keeps the local day when clocks fall back (last Sunday of October)", () => {
    // 2026-10-25: 03:00 CEST becomes 02:00 CET, so 02:00–02:59 happen twice.
    expect(onAmsterdamDay("2026-10-24T22:00:00.000Z")).toBe("2026-10-25"); // 00:00 CEST
    expect(onAmsterdamDay("2026-10-24T22:30:00.000Z")).toBe("2026-10-25"); // 00:30 CEST
    expect(onAmsterdamDay("2026-10-24T23:59:00.000Z")).toBe("2026-10-25"); // 01:59 CEST
    expect(onAmsterdamDay("2026-10-25T00:00:00.000Z")).toBe("2026-10-25"); // 02:00 CEST
    expect(onAmsterdamDay("2026-10-25T00:30:00.000Z")).toBe("2026-10-25"); // 02:30 CEST
    expect(onAmsterdamDay("2026-10-25T01:00:00.000Z")).toBe("2026-10-25"); // 02:00 CET
    expect(onAmsterdamDay("2026-10-25T01:30:00.000Z")).toBe("2026-10-25"); // 02:30 CET
    expect(onAmsterdamDay("2026-10-25T02:00:00.000Z")).toBe("2026-10-25"); // 03:00 CET
  });

  it("rolls from 23:59 to 00:00 on the local calendar", () => {
    expect(onAmsterdamDay("2026-01-15T22:59:00.000Z")).toBe("2026-01-15"); // 23:59 CET
    expect(onAmsterdamDay("2026-01-15T23:00:00.000Z")).toBe("2026-01-16"); // 00:00 CET
    expect(onAmsterdamDay("2026-07-15T21:59:00.000Z")).toBe("2026-07-15"); // 23:59 CEST
    expect(onAmsterdamDay("2026-07-15T22:00:00.000Z")).toBe("2026-07-16"); // 00:00 CEST
  });

  it("rolls the year at local midnight in Amsterdam", () => {
    expect(onAmsterdamDay("2026-12-31T22:59:00.000Z")).toBe("2026-12-31"); // 23:59 CET
    expect(onAmsterdamDay("2026-12-31T23:00:00.000Z")).toBe("2027-01-01"); // 00:00 CET
    expect(onAmsterdamDay("2026-12-31T23:30:00.000Z")).toBe("2027-01-01"); // 00:30 CET
    expect(onAmsterdamDay("2027-01-01T00:59:00.000Z")).toBe("2027-01-01"); // 01:59 CET
    expect(onAmsterdamDay("2027-01-01T01:00:00.000Z")).toBe("2027-01-01"); // 02:00 CET
  });

  it("follows the fake clock when no date is passed", () => {
    vi.setSystemTime(new Date("2026-01-14T23:30:00.000Z"));
    expect(localDateKey(undefined, AMSTERDAM)).toBe("2026-01-15");
    vi.setSystemTime(new Date("2026-01-15T23:00:00.000Z"));
    expect(localDateKey(undefined, AMSTERDAM)).toBe("2026-01-16");
  });

  it("prefers an explicit timezone over the device timezone", () => {
    vi.setSystemTime(new Date("2026-01-14T23:30:00.000Z"));
    expect(localDateKey(new Date(), AMSTERDAM)).toBe("2026-01-15");
    expect(localDateKey(new Date(), "UTC")).toBe("2026-01-14");
  });

  it("uses the device timezone when none is passed", () => {
    vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
    const device = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(device).toBeTruthy();
    expect(localDateKey()).toBe(localDateKey(new Date(), device));
  });

  it("ignores an invalid timezone and uses the device timezone", () => {
    vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"));
    const device = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(localDateKey(new Date(), "Not/AZone")).toBe(localDateKey(new Date(), device));
    expect(localDateKey(new Date(), "   ")).toBe(localDateKey(new Date(), device));
  });

  it("falls back to Europe/Amsterdam when the device timezone is unavailable", () => {
    vi.setSystemTime(new Date("2026-07-14T22:30:00.000Z")); // 00:30 CEST
    const RealDateTimeFormat = Intl.DateTimeFormat;
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((
      locales?: Intl.LocalesArgument,
      options?: Intl.DateTimeFormatOptions,
    ) => {
      if (!options?.timeZone) {
        throw new RangeError("no time zone");
      }
      return new RealDateTimeFormat(locales, options);
    }) as typeof Intl.DateTimeFormat);

    expect(localDateKey()).toBe("2026-07-15");
  });
});

describe("resolveChoreDay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  function asUtcServer() {
    vi.stubEnv("TZ", "UTC");
    const RealDateTimeFormat = Intl.DateTimeFormat;
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((
      locales?: Intl.LocalesArgument,
      options?: Intl.DateTimeFormatOptions,
    ) => {
      const real = new RealDateTimeFormat(locales, options);
      if (options?.timeZone) return real;
      const resolved = real.resolvedOptions();
      return Object.assign(real, {
        resolvedOptions: () => ({ ...resolved, timeZone: "UTC" }),
      });
    }) as typeof Intl.DateTimeFormat);
  }

  it("at 00:30 Amsterdam time ignores a UTC server timezone", () => {
    // 00:30 CEST is still the previous UTC day.
    vi.setSystemTime(new Date("2026-07-14T22:30:00.000Z"));
    asUtcServer();

    expect(process.env.TZ).toBe("UTC");
    expect(localDateKey()).toBe("2026-07-14");
    expect(resolveChoreDay()).toBe("2026-07-15");
  });

  it("prefers the client day, then the client zone, then the HA zone", () => {
    vi.setSystemTime(new Date("2026-07-14T22:30:00.000Z"));
    asUtcServer();

    expect(resolveChoreDay({ date: "2026-07-16", timeZone: "UTC", haTimeZone: "UTC" })).toBe("2026-07-16");
    expect(resolveChoreDay({ date: "2026-02-31" })).toBe("2026-07-15");
    expect(resolveChoreDay({ timeZone: "UTC", haTimeZone: "Europe/Amsterdam" })).toBe("2026-07-14");
    expect(resolveChoreDay({ haTimeZone: "America/New_York" })).toBe("2026-07-14");
    expect(resolveChoreDay({ haTimeZone: "Not/AZone" })).toBe("2026-07-15");
  });
});
