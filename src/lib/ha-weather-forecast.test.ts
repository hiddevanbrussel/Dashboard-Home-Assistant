import { describe, expect, it } from "vitest";
import {
  formatForecastHour,
  isForecastToday,
  parseForecastItem,
  parseWeatherForecastPayload,
} from "./ha-weather-forecast";

describe("ha weather forecast", () => {
  it("reads get_forecasts service_response for an entity", () => {
    const items = parseWeatherForecastPayload(
      {
        service_response: {
          "weather.home": {
            forecast: [
              { datetime: "2026-09-17T12:00:00Z", condition: "sunny", temperature: 18, templow: 11, precipitation_probability: 10 },
            ],
          },
        },
      },
      "weather.home"
    );
    expect(items).toEqual([
      {
        datetime: "2026-09-17T12:00:00Z",
        condition: "sunny",
        temperature: 18,
        templow: 11,
        precipitationProbability: 10,
      },
    ]);
  });

  it("falls back to a legacy attributes.forecast array", () => {
    expect(
      parseWeatherForecastPayload(
        { forecast: [{ datetime: "2026-09-18T00:00:00Z", condition: "rainy", temperature: 14 }] },
        "weather.home"
      )
    ).toHaveLength(1);
    expect(parseForecastItem({ datetime: "nope" })).toEqual({
      datetime: "nope",
      condition: "",
      temperature: null,
      templow: null,
      precipitationProbability: null,
    });
  });

  it("formats an hour and detects today", () => {
    expect(formatForecastHour("2026-09-17T08:00:00", "en")).toMatch(/8/);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    expect(isForecastToday(today.toISOString())).toBe(true);
  });
});
