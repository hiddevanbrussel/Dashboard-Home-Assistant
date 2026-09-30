import { describe, expect, it } from "vitest";
import {
  formatSunTime,
  languageToSunLocale,
  resolveSunTimes,
  sunTimesFromAttributes,
} from "./sun-times";

describe("sunTimesFromAttributes", () => {
  it("reads next_rising / next_setting from sun.sun", () => {
    expect(
      sunTimesFromAttributes({
        next_rising: "2026-09-30T05:42:00+00:00",
        next_setting: "2026-09-30T17:18:00+00:00",
      })
    ).toEqual({
      sunriseIso: "2026-09-30T05:42:00+00:00",
      sunsetIso: "2026-09-30T17:18:00+00:00",
    });
  });

  it("falls back to sunrise / sunset keys", () => {
    expect(
      sunTimesFromAttributes({
        sunrise: "2026-09-30T06:00:00Z",
        sunset: "2026-09-30T18:00:00Z",
      })
    ).toEqual({
      sunriseIso: "2026-09-30T06:00:00Z",
      sunsetIso: "2026-09-30T18:00:00Z",
    });
  });

  it("returns nulls for missing or invalid values", () => {
    expect(sunTimesFromAttributes(undefined)).toEqual({ sunriseIso: null, sunsetIso: null });
    expect(sunTimesFromAttributes({ next_rising: "not-a-date", next_setting: 123 })).toEqual({
      sunriseIso: null,
      sunsetIso: null,
    });
  });
});

describe("resolveSunTimes", () => {
  it("prefers sun.sun over weather attributes", () => {
    const result = resolveSunTimes(
      {
        entity_id: "sun.sun",
        attributes: {
          next_rising: "2026-09-30T05:42:00Z",
          next_setting: "2026-09-30T17:18:00Z",
        },
      },
      {
        entity_id: "weather.home",
        attributes: {
          sunrise: "2026-09-30T06:00:00Z",
          sunset: "2026-09-30T18:00:00Z",
        },
      }
    );
    expect(result.sunriseIso).toBe("2026-09-30T05:42:00Z");
    expect(result.sunsetIso).toBe("2026-09-30T17:18:00Z");
  });

  it("falls back to weather when sun entity is empty", () => {
    const result = resolveSunTimes(
      { entity_id: "sun.sun", attributes: {} },
      {
        entity_id: "weather.home",
        attributes: {
          sunrise: "2026-09-30T06:11:00Z",
          sunset: "2026-09-30T18:22:00Z",
        },
      }
    );
    expect(result.sunriseIso).toBe("2026-09-30T06:11:00Z");
    expect(result.sunsetIso).toBe("2026-09-30T18:22:00Z");
  });
});

describe("formatSunTime", () => {
  it("formats short 24h times", () => {
    // Construct a local Date so the assertion is timezone-independent.
    const local = new Date(2026, 8, 30, 7, 12, 0);
    const formatted = formatSunTime(local.toISOString(), {
      locale: "nl-NL",
      hour12: false,
    });
    expect(formatted).toMatch(/0?7:\d{2}/);
    expect(formatted).toContain("12");
  });

  it("returns null for invalid input", () => {
    expect(formatSunTime(null, { locale: "en-GB" })).toBeNull();
    expect(formatSunTime("bad", { locale: "en-GB" })).toBeNull();
  });
});

describe("languageToSunLocale", () => {
  it("maps language codes", () => {
    expect(languageToSunLocale("nl")).toBe("nl-NL");
    expect(languageToSunLocale("en")).toBe("en-GB");
  });
});
