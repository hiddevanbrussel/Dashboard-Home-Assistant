import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_ACCENT,
  darkPrimaryForeground,
  getThemeAccent,
  isThemeAccentId,
  mixRgb,
  SCREENSAVER_CLOCK_WARM,
  screensaverClockPairRgb,
  screensaverClockRgb,
  THEME_ACCENTS,
  themeAccentCssVars,
  type Rgb,
} from "./theme-accents";

const SETTINGS_CARD: Rgb = [27, 26, 33];

function channel(c: number) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function contrast(a: Rgb, b: Rgb) {
  const lum = (rgb: Rgb) => 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
  const hi = Math.max(lum(a), lum(b));
  const lo = Math.min(lum(a), lum(b));
  return (hi + 0.05) / (lo + 0.05);
}

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
      "--brand-on-muted": "17 24 39",
    });
  });

  it("keeps dark primary text at 4.5:1 and the button at 3:1 on the card", () => {
    for (const accent of THEME_ACCENTS) {
      const text = darkPrimaryForeground(accent.id);
      expect(contrast(text, accent.muted), accent.id).toBeGreaterThanOrEqual(4.5);
      expect(contrast(accent.muted, SETTINGS_CARD), accent.id).toBeGreaterThanOrEqual(3);
      expect(themeAccentCssVars(accent.id)["--brand-on-muted"]).toBe(text.join(" "));
    }
    expect(darkPrimaryForeground("purple")).toEqual([255, 255, 255]);
    expect(darkPrimaryForeground("teal")).toEqual([17, 24, 39]);
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

  it("makes hours paler than minutes", () => {
    const { hours, minutes } = screensaverClockPairRgb("purple");
    expect(hours).not.toEqual(minutes);
    expect(hours[0] + hours[1] + hours[2]).toBeGreaterThan(minutes[0] + minutes[1] + minutes[2]);
    expect(hours[2]).toBeGreaterThan(minutes[2]);
  });
});
