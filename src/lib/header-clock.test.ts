import { describe, expect, it } from "vitest";
import { formatHeaderClock, headerClockLocale, msUntilNextMinute } from "./header-clock";

/** Intl may put a (narrow) no-break space before AM/PM. */
const norm = (s: string) => s.replace(/[  ]/g, " ");
const at = (h: number, m: number, s = 0, ms = 0) => new Date(2026, 9, 23, h, m, s, ms);

describe("headerClockLocale", () => {
  it("maps the app language", () => {
    expect(headerClockLocale("nl")).toBe("nl-NL");
    expect(headerClockLocale("en")).toBe("en-US");
  });
});

describe("formatHeaderClock", () => {
  it("shows hh:mm in 24 h, without seconds", () => {
    expect(formatHeaderClock(at(14, 5, 59), "nl", true)).toBe("14:05");
    expect(formatHeaderClock(at(14, 5, 59), "en", true)).toBe("14:05");
  });

  it("pads the hour in 24 h", () => {
    expect(formatHeaderClock(at(9, 7), "nl", true)).toBe("09:07");
  });

  it("shows h:mm with a period in 12 h", () => {
    expect(norm(formatHeaderClock(at(14, 5, 30), "en", false))).toBe("2:05 PM");
    expect(formatHeaderClock(at(14, 5, 30), "nl", false)).toMatch(/^2:05\s?p\.?m\.?$/i);
  });

  it("handles midnight and noon", () => {
    expect(formatHeaderClock(at(0, 0), "nl", true)).toBe("00:00");
    expect(formatHeaderClock(at(12, 0), "nl", true)).toBe("12:00");
    expect(norm(formatHeaderClock(at(0, 0), "en", false))).toBe("12:00 AM");
    expect(norm(formatHeaderClock(at(12, 0), "en", false))).toBe("12:00 PM");
  });

  it("never contains seconds", () => {
    for (const lang of ["nl", "en"]) {
      for (const use24h of [true, false]) {
        expect(norm(formatHeaderClock(at(23, 59, 42), lang, use24h))).not.toMatch(/\d{1,2}:\d{2}:\d{2}/);
      }
    }
  });
});

describe("msUntilNextMinute", () => {
  it("counts down to the next :00", () => {
    expect(msUntilNextMinute(at(14, 5, 0, 0))).toBe(60_000);
    expect(msUntilNextMinute(at(14, 5, 30, 0))).toBe(30_000);
    expect(msUntilNextMinute(at(14, 5, 59, 750))).toBe(250);
  });

  it("is at least 1 ms", () => {
    expect(msUntilNextMinute(at(14, 5, 59, 999))).toBe(1);
  });
});
