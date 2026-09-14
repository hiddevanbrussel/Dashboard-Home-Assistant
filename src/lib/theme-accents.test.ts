import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_ACCENT,
  getThemeAccent,
  isThemeAccentId,
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
});
