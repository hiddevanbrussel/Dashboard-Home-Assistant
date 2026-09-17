import { describe, expect, it } from "vitest";
import { weatherImageBase, weatherImageSources } from "./weather-card";

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
