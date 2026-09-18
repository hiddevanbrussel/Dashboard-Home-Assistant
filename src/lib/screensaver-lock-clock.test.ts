import { describe, expect, it } from "vitest";
import {
  formatLockDateNumeric,
  formatLockTemperature,
  formatLockWeekday,
  isGenericLocationName,
  lockClockParts,
  weatherConditionI18nKey,
  weatherLocationLabel,
} from "./screensaver-lock-clock";

describe("screensaver lock clock", () => {
  it("splits a 24-hour clock into padded hour and minute blocks", () => {
    expect(lockClockParts(new Date(2026, 8, 19, 0, 49, 0), true)).toEqual({
      hours: "00",
      minutes: "49",
      period: null,
    });
  });

  it("splits a 12-hour clock and keeps a two-digit hour", () => {
    expect(lockClockParts(new Date(2026, 8, 19, 13, 5, 0), false)).toEqual({
      hours: "01",
      minutes: "05",
      period: "pm",
    });
  });

  it("formats the compact date in locale order", () => {
    const date = new Date(2026, 8, 19, 0, 49, 0);
    expect(formatLockDateNumeric(date, "nl")).toBe("19.9");
    expect(formatLockDateNumeric(date, "en")).toBe("9.19");
  });

  it("capitalizes the weekday", () => {
    const date = new Date(2026, 8, 19, 0, 49, 0);
    expect(formatLockWeekday(date, "nl")).toBe("Zaterdag");
    expect(formatLockWeekday(date, "en")).toBe("Saturday");
  });

  it("rounds temperature and adds a degree sign", () => {
    expect(formatLockTemperature(14.4)).toBe("14°");
    expect(formatLockTemperature("9.6")).toBe("10°");
    expect(formatLockTemperature("nope")).toBeNull();
  });

  it("maps Home Assistant weather states to i18n keys", () => {
    expect(weatherConditionI18nKey("cloudy")).toBe("weatherSheet.condition.cloudy");
    expect(weatherConditionI18nKey("partlycloudy")).toBe("weatherSheet.condition.partlycloudy");
    expect(weatherConditionI18nKey("clear-night")).toBe("weatherSheet.condition.clear-night");
    expect(weatherConditionI18nKey("unknown")).toBeNull();
  });

  it("prefers a city-like weather name over Home", () => {
    expect(
      weatherLocationLabel({ friendly_name: "Rijssen" }, { friendly_name: "Home" })
    ).toBe("Rijssen");
    expect(
      weatherLocationLabel({ friendly_name: "Home" }, { friendly_name: "Rijssen" })
    ).toBe("Rijssen");
    expect(weatherLocationLabel({ friendly_name: "Home" })).toBe("Home");
    expect(isGenericLocationName("Weer")).toBe(true);
  });
});
