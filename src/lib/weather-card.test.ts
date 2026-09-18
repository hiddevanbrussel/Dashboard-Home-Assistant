import { describe, expect, it } from "vitest";
import {
  clampWeatherCardHeight,
  clampWeatherCardWidth,
  resizeWeatherCardFromBottomRight,
  weatherImageBase,
  weatherImageSources,
  WEATHER_CARD_DEFAULT_HEIGHT,
  WEATHER_CARD_DEFAULT_WIDTH,
  WEATHER_CARD_MIN_HEIGHT,
  WEATHER_CARD_MIN_WIDTH,
} from "./weather-card";

describe("weather-card helpers", () => {
  it("clamps width and height onto the weather card", () => {
    expect(clampWeatherCardWidth(undefined)).toBe(WEATHER_CARD_DEFAULT_WIDTH);
    expect(clampWeatherCardWidth("nope")).toBe(WEATHER_CARD_DEFAULT_WIDTH);
    expect(clampWeatherCardWidth(80)).toBe(WEATHER_CARD_MIN_WIDTH);
    expect(clampWeatherCardWidth(900)).toBe(500);
    expect(clampWeatherCardWidth(360)).toBe(360);
    expect(clampWeatherCardHeight(undefined)).toBe(WEATHER_CARD_DEFAULT_HEIGHT);
    expect(clampWeatherCardHeight(40)).toBe(WEATHER_CARD_MIN_HEIGHT);
    expect(clampWeatherCardHeight(900)).toBe(400);
    expect(clampWeatherCardHeight(220)).toBe(220);
  });

  it("resizes from the bottom-right while keeping the top-left fixed", () => {
    const start = {
      startWidth: 320,
      startHeight: 180,
      startLeft: 64,
      startBottom: 48,
      viewportWidth: 1200,
      viewportHeight: 800,
    };
    const grown = resizeWeatherCardFromBottomRight({ ...start, dx: 40, dy: 30 });
    expect(grown).toEqual({ width: 360, height: 210, left: 64, bottom: 18 });
    const shrunk = resizeWeatherCardFromBottomRight({ ...start, dx: -200, dy: -200 });
    expect(shrunk.width).toBe(WEATHER_CARD_MIN_WIDTH);
    expect(shrunk.height).toBe(WEATHER_CARD_MIN_HEIGHT);
    expect(shrunk.left).toBe(64);
    expect(shrunk.bottom).toBe(128);
    const againstViewport = resizeWeatherCardFromBottomRight({
      ...start,
      startBottom: 10,
      dx: 0,
      dy: 400,
    });
    expect(againstViewport.bottom).toBe(0);
    expect(againstViewport.height).toBe(190);
  });
});


describe("weather card images", () => {
  it("maps conditions to the same public photos as the weather card", () => {
    expect(weatherImageBase("sunny")).toBe("/weather-sunny");
    expect(weatherImageBase("clear")).toBe("/weather-sunny");
    expect(weatherImageBase("partlycloudy")).toBe("/weather-partlycloudy");
    expect(weatherImageBase("rainy")).toBe("/weather-rainy");
    expect(weatherImageBase("fog")).toBe("/weather-fog");
    expect(weatherImageBase("clear-night")).toBe("/weather-clear-night");
    expect(weatherImageBase("unknown")).toBe(null);
  });

  it("uses the night photo in dark mode and falls back to the day photo", () => {
    expect(weatherImageSources("sunny", false)).toEqual({
      src: "/weather-sunny.png",
      fallback: null,
    });
    expect(weatherImageSources("sunny", true)).toEqual({
      src: "/weather-sunny-night.png",
      fallback: "/weather-sunny.png",
    });
    expect(weatherImageSources("partlycloudy", true)).toEqual({
      src: "/weather-partlycloudy-night.png",
      fallback: "/weather-partlycloudy.png",
    });
  });
});
