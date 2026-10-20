import { describe, expect, it } from "vitest";
import {
  clampWeatherCardHeight,
  clampWeatherCardWidth,
  formatPrecipitationMm,
  formatWindSummary,
  parseAirQualityLevel,
  resizeWeatherCardFromBottomRight,
  weatherIconFile,
  weatherIconSrc,
  weatherImageSources,
  windBearingLabel,
  windSpeedToBeaufort,
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
    expect(clampWeatherCardHeight(900)).toBe(420);
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
    expect(shrunk.bottom).toBe(88);
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
  it("maps conditions to curated webp packs with webp fallbacks", () => {
    expect(weatherImageSources("sunny", false)).toEqual({
      src: "/weather/light/weather_sunny.webp",
      fallback: "/weather/dark/weather_clear_night.webp",
    });
    expect(weatherImageSources("sunny", true)).toEqual({
      src: "/weather/dark/weather_clear_night.webp",
      fallback: "/weather/light/weather_sunny.webp",
    });
    expect(weatherImageSources("partlycloudy", true)).toEqual({
      src: "/weather/dark/weather_partlycloudy_night.webp",
      fallback: "/weather/light/weather_partlycloudy.webp",
    });
    expect(weatherImageSources("clear-night", false)).toEqual({
      src: "/weather/dark/weather_clear_night.webp",
      fallback: "/weather/light/weather_sunny.webp",
    });
    expect(weatherImageSources("fog", false)).toEqual({
      src: "/weather/light/weather_fog.webp",
      fallback: "/weather/light/weather_cloudy.webp",
    });
    expect(weatherImageSources("snowy", false).src).toBe("/weather/dark/weather_snowy_night.webp");
    expect(weatherImageSources("lightning-rainy", true).src).toBe(
      "/weather/dark/weather_lightning_rainy.webp"
    );
  });
});

describe("weather metrics helpers", () => {
  it("converts wind speed to Beaufort and formats a compass summary", () => {
    expect(windSpeedToBeaufort(0.2, "m/s")).toBe(0);
    expect(windSpeedToBeaufort(3, "m/s")).toBe(2);
    expect(windSpeedToBeaufort(12, "km/h")).toBe(2);
    expect(windBearingLabel(225, "nl")).toBe("ZW");
    expect(windBearingLabel(225, "en")).toBe("SW");
    expect(formatWindSummary({ speed: 3.5, bearing: 225, unit: "m/s", locale: "nl" })).toBe(
      "ZW 3 Bft"
    );
  });

  it("maps air quality states and formats precipitation", () => {
    expect(parseAirQualityLevel(42)).toBe("good");
    expect(parseAirQualityLevel("goed")).toBe("good");
    expect(parseAirQualityLevel("moderate")).toBe("moderate");
    expect(formatPrecipitationMm(0)).toBe("0 mm");
    expect(formatPrecipitationMm(1.25)).toBe("1.3 mm");
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
    expect(weatherIconSrc("partlycloudy")).toContain("/weather-icons/partlycloudy.webp");
    expect(weatherIconSrc("Sunny")).toContain("/weather-icons/sunny.webp");
    expect(weatherIconSrc("rainy")).toContain("/weather-icons/rainy.webp");
    expect(weatherIconSrc("pouring")).toContain("/weather-icons/pouring.webp");
    expect(weatherIconSrc("lightning")).toContain("/weather-icons/lightning.webp");
  });
});
