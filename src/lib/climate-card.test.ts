import { describe, expect, it } from "vitest";
import {
  clampClimateCardHeight,
  clampClimateCardWidth,
  climateHvacModesFromAttributes,
  climateRingTone,
  climateStatusKind,
  climateStatusLabelKey,
  climateTempsDiffer,
  climateTileEnabled,
  climateTileFromHvacMode,
  CLIMATE_CARD_DEFAULT_HEIGHT,
  CLIMATE_CARD_DEFAULT_WIDTH,
  CLIMATE_CARD_MIN_HEIGHT,
  isClimateOn,
  parseClimateTemp,
  preferredClimateOnMode,
  resolveHvacModeForTile,
} from "./climate-card";

describe("climate-card helpers", () => {
  it("clamps width and height onto the air-quality-sized card", () => {
    expect(clampClimateCardWidth(undefined)).toBe(CLIMATE_CARD_DEFAULT_WIDTH);
    expect(clampClimateCardWidth("nope")).toBe(CLIMATE_CARD_DEFAULT_WIDTH);
    expect(clampClimateCardWidth(180)).toBe(240);
    expect(clampClimateCardWidth(900)).toBe(500);
    expect(clampClimateCardHeight(180)).toBe(CLIMATE_CARD_MIN_HEIGHT);
    expect(clampClimateCardHeight(undefined)).toBe(CLIMATE_CARD_DEFAULT_HEIGHT);
    expect(clampClimateCardHeight(900)).toBe(480);
  });

  it("parses temperatures and ignores unavailable values", () => {
    expect(parseClimateTemp(21.5)).toBe(21.5);
    expect(parseClimateTemp("20")).toBe(20);
    expect(parseClimateTemp("21.5°C")).toBe(21.5);
    expect(parseClimateTemp("unknown")).toBeUndefined();
    expect(parseClimateTemp("unavailable")).toBeUndefined();
    expect(parseClimateTemp(null)).toBeUndefined();
  });

  it("treats a quarter degree as a real current/target gap", () => {
    expect(climateTempsDiffer(21, 21)).toBe(false);
    expect(climateTempsDiffer(21, 21.1)).toBe(false);
    expect(climateTempsDiffer(20, 21)).toBe(true);
    expect(climateTempsDiffer(21, undefined)).toBe(false);
  });

  it("maps Home Assistant modes onto Auto / Heat / Cool tiles", () => {
    expect(resolveHvacModeForTile("auto", ["off", "heat_cool", "heat"])).toBe("heat_cool");
    expect(resolveHvacModeForTile("auto", ["auto", "heat", "cool"])).toBe("auto");
    expect(resolveHvacModeForTile("heat", ["heat", "cool"])).toBe("heat");
    expect(resolveHvacModeForTile("cool", [])).toBe("cool");
    expect(climateTileFromHvacMode("heat_cool")).toBe("auto");
    expect(climateTileFromHvacMode("heating")).toBe("heat");
    expect(climateTileFromHvacMode("cool")).toBe("cool");
    expect(climateTileFromHvacMode("off")).toBeNull();
  });

  it("enables tiles from hvac_modes and keeps a preview when HA is missing", () => {
    expect(climateTileEnabled("auto", [])).toBe(true);
    expect(climateTileEnabled("heat", [])).toBe(true);
    expect(climateTileEnabled("auto", ["heat", "off"])).toBe(false);
    expect(climateTileEnabled("auto", ["heat_cool", "heat"])).toBe(true);
    expect(climateTileEnabled("cool", ["heat", "cool"])).toBe(true);
    expect(climateHvacModesFromAttributes({ hvac_modes: ["auto", 1, "heat"] })).toEqual(["auto", "heat"]);
  });

  it("picks a sensible mode when turning the climate back on", () => {
    expect(preferredClimateOnMode(["off", "heat", "cool"])).toBe("heat");
    expect(preferredClimateOnMode(["cool", "off"])).toBe("cool");
    expect(preferredClimateOnMode(["heat_cool"])).toBe("heat_cool");
    expect(preferredClimateOnMode([])).toBe("auto");
  });

  it("treats off / unknown as powered down", () => {
    expect(isClimateOn("heat")).toBe(true);
    expect(isClimateOn("idle", "auto")).toBe(true);
    expect(isClimateOn("off")).toBe(false);
    expect(isClimateOn("heat", "off")).toBe(false);
    expect(isClimateOn("unavailable")).toBe(false);
    expect(isClimateOn("")).toBe(false);
  });

  it("derives status pills and ring colour from hvac_action", () => {
    expect(climateStatusKind({ hvacAction: "heating", hvacMode: "auto", state: "heat" })).toBe("heating");
    expect(climateStatusKind({ hvacAction: "cooling", state: "cool" })).toBe("cooling");
    expect(climateStatusKind({ hvacAction: "idle", hvacMode: "auto", state: "auto" })).toBe("idle");
    expect(climateStatusKind({ state: "off" })).toBe("off");
    expect(climateStatusKind({ hvacMode: "heat", state: "heat" })).toBe("heat");
    expect(climateRingTone("heating")).toBe("amber");
    expect(climateRingTone("cooling")).toBe("sky");
    expect(climateRingTone("idle")).toBe("teal");
    expect(climateRingTone("off")).toBe("gray");
    expect(climateStatusLabelKey("heating")).toBe("climateCard.heating");
    expect(climateStatusLabelKey("idle")).toBe("climateCard.idle");
  });
});
