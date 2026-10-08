import { describe, expect, it } from "vitest";
import {
  DEFAULT_GLASS_DENSITY,
  GLASS_DENSITIES,
  GLASS_DENSITY_VARS,
  getGlassDensityOrDefault,
  isGlassDensity,
} from "./glass-density";

describe("glass-density", () => {
  it("accepts known levels", () => {
    for (const level of GLASS_DENSITIES) {
      expect(isGlassDensity(level)).toBe(true);
      expect(GLASS_DENSITY_VARS[level].blur).toMatch(/\d+px/);
    }
  });

  it("rejects unknown values and falls back", () => {
    expect(isGlassDensity("ultra")).toBe(false);
    expect(getGlassDensityOrDefault(undefined)).toBe(DEFAULT_GLASS_DENSITY);
    expect(getGlassDensityOrDefault("nope")).toBe(DEFAULT_GLASS_DENSITY);
  });
});
