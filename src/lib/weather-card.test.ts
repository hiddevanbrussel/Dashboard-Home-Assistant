import { describe, expect, it } from "vitest";
import {
  clampWeatherCardHeight,
  clampWeatherCardWidth,
  resizeWeatherCardFromBottomRight,
  weatherIconFile,
  weatherIconSrc,
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

describe("weather color icons", () => {
  it("maps Home Assistant conditions onto distinct Pixeden stems", () => {
    expect(weatherIconFile("sunny")).toBe("sunny");
    expect(weatherIconFile("clear")).toBe("sunny");
    expect(weatherIconFile("zonnig")).toBe("sunny");
    expect(weatherIconFile("clear-night")).toBe("clear-night");
    expect(weatherIconFile("partlycloudy")).toBe("partlycloudy");
    expect(weatherIconFile("cloudy")).toBe("cloudy");
    expect(weatherIconFile("fog")).toBe("fog");
    expect(weatherIconFile("mist")).toBe("fog");
    expect(weatherIconFile("rainy")).toBe("rainy");
    expect(weatherIconFile("pouring")).toBe("pouring");
    expect(weatherIconFile("hail")).toBe("hail");
    expect(weatherIconFile("snowy")).toBe("snowy");
    expect(weatherIconFile("snowy-rainy")).toBe("snowy-rainy");
    expect(weatherIconFile("lightning")).toBe("lightning");
    expect(weatherIconFile("lightning-rainy")).toBe("lightning-rainy");
    expect(weatherIconFile("windy")).toBe("windy");
    expect(weatherIconFile("windy-variant")).toBe("windy-variant");
    expect(weatherIconFile("exceptional")).toBe("exceptional");
    expect(weatherIconFile("unknown")).toBe("cloudy");
    expect(weatherIconFile("")).toBe("cloudy");
  });

  it("builds a public path under /weather-icons", () => {
    expect(weatherIconSrc("partlycloudy")).toBe("/weather-icons/partlycloudy.png");
    expect(weatherIconSrc("Sunny")).toBe("/weather-icons/sunny.png");
  });
});
