import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_ACCENT,
  getThemeAccent,
  isThemeAccentId,
  mixRgb,
  SCREENSAVER_CLOCK_WARM,
  screensaverClockRgb,
  THEME_ACCENTS,
  themeAccentCssVars,
} from "./theme-accents";

describe("theme accents", () => {
  it("defaults to the Omnidocs purple", () => {
    expect(DEFAULT_THEME_ACCENT).toBe("purple");
    expect(getThemeAccent(undefined).id).toBe("purple");
    expect(getThemeAccent("not-a-color").rgb).toEqual([71, 0, 181]);
  });

  it("exposes a fixed set of accent ids", () => {
    expect(THEME_ACCENTS.map((accent) => accent.id)).toEqual([
      "purple",
      "indigo",
      "blue",
      "teal",
      "green",
      "orange",
      "rose",
      "fuchsia",
    ]);
  });

  it("writes brand CSS variables as RGB channels", () => {
    expect(themeAccentCssVars("blue")).toEqual({
      "--brand": "29 78 216",
      "--brand-muted": "107 138 223",
    });
  });

  it("narrows stored accent ids", () => {
    expect(isThemeAccentId("teal")).toBe(true);
    expect(isThemeAccentId("yellow")).toBe(false);
  });

  it("mixes RGB channels toward a second color", () => {
    expect(mixRgb([100, 0, 0], [0, 100, 0], 0.5)).toEqual([50, 50, 0]);
    expect(mixRgb([10, 10, 10], [20, 20, 20], 2)).toEqual([20, 20, 20]);
  });

  it("keeps the screensaver clock warm and tints it with the accent", () => {
    const purple = screensaverClockRgb("purple");
    const orange = screensaverClockRgb("orange");
    expect(purple).not.toEqual(SCREENSAVER_CLOCK_WARM);
    expect(purple).not.toEqual(orange);
    expect(orange[2]).toBeLessThan(purple[2]);
    expect(purple[0]).toBeGreaterThan(210);
    expect(purple[1]).toBeGreaterThan(150);
  });
});
