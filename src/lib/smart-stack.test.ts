import { describe, expect, it } from "vitest";
import {
  buildSmartStackChildUpdates,
  clampSmartStackHeight,
  clampSmartStackIntervalSec,
  clampSmartStackWidth,
  isSmartStackAutoplayEnabled,
  isSmartStackChildType,
  normalizeSmartStackIndex,
  SMART_STACK_DEFAULT_AUTOPLAY,
  SMART_STACK_DEFAULT_INTERVAL_SEC,
  SMART_STACK_MIN_HEIGHT,
  SMART_STACK_MIN_WIDTH,
  stripSmartStackChildSize,
} from "./smart-stack";

describe("smart-stack helpers", () => {
  it("clamps size to allow 250×250", () => {
    expect(clampSmartStackWidth(250)).toBe(250);
    expect(clampSmartStackHeight(250)).toBe(250);
    expect(SMART_STACK_MIN_WIDTH).toBe(250);
    expect(SMART_STACK_MIN_HEIGHT).toBe(250);
    expect(clampSmartStackWidth(100)).toBe(250);
    expect(clampSmartStackHeight(999)).toBe(480);
  });

  it("clamps interval seconds", () => {
    expect(clampSmartStackIntervalSec(undefined)).toBe(SMART_STACK_DEFAULT_INTERVAL_SEC);
    expect(clampSmartStackIntervalSec(1)).toBe(3);
    expect(clampSmartStackIntervalSec(8)).toBe(8);
    expect(clampSmartStackIntervalSec(120)).toBe(60);
  });

  it("treats autoplay as on by default and off only when explicit", () => {
    expect(SMART_STACK_DEFAULT_AUTOPLAY).toBe(true);
    expect(isSmartStackAutoplayEnabled(undefined)).toBe(true);
    expect(isSmartStackAutoplayEnabled(true)).toBe(true);
    expect(isSmartStackAutoplayEnabled(false)).toBe(false);
    expect(isSmartStackAutoplayEnabled(0)).toBe(false);
    expect(isSmartStackAutoplayEnabled("false")).toBe(false);
  });

  it("normalizes slide index wrapping", () => {
    expect(normalizeSmartStackIndex(0, 3)).toBe(0);
    expect(normalizeSmartStackIndex(3, 3)).toBe(0);
    expect(normalizeSmartStackIndex(-1, 3)).toBe(2);
    expect(normalizeSmartStackIndex(5, 0)).toBe(0);
  });

  it("validates allowed child types", () => {
    expect(isSmartStackChildType("climate_card_2")).toBe(true);
    expect(isSmartStackChildType("nuts_card")).toBe(true);
    expect(isSmartStackChildType("media_card")).toBe(true);
    expect(isSmartStackChildType("calendar_card")).toBe(true);
    expect(isSmartStackChildType("trash_card")).toBe(true);
    expect(isSmartStackChildType("card_group")).toBe(false);
    expect(isSmartStackChildType("smart_stack")).toBe(false);
  });

  it("builds nested child updates without width/height", () => {
    const climate = buildSmartStackChildUpdates("climate_card_2", {
      title: "Living",
      entity_id: "climate.living",
      humidity_entity_id: "sensor.humidity",
      display_mode: "compact",
      icon: "Thermometer",
    });
    expect(climate).toMatchObject({
      title: "Living",
      entity_id: "climate.living",
      humidity_entity_id: "sensor.humidity",
      display_mode: "compact",
      icon: "Thermometer",
    });
    expect(climate).not.toHaveProperty("width");
    expect(climate).not.toHaveProperty("height");

    const nuts = buildSmartStackChildUpdates("nuts_card", {
      title: "Gas",
      entity_id: "sensor.gas",
      today_entity_id: "sensor.gas_today",
      accent: "consumption",
      period: "month",
      icon: "Fuel",
    });
    expect(nuts).toMatchObject({
      title: "Gas",
      entity_id: "sensor.gas",
      today_entity_id: "sensor.gas_today",
      accent: "consumption",
      period: "month",
      icon: "Fuel",
    });
    expect(nuts).not.toHaveProperty("width");
    expect(nuts).not.toHaveProperty("height");

    const weather = buildSmartStackChildUpdates("weather_card", {
      title: "Thuis",
      entity_id: "weather.home",
      show_icon: true,
      show_wind: false,
      show_air_quality: true,
      air_quality_entity_id: "sensor.aqi",
    });
    expect(weather).toEqual({
      title: "Thuis",
      entity_id: "weather.home",
      show_icon: true,
      show_condition: true,
      show_high_low: true,
      show_wind: false,
      show_humidity: true,
      show_air_quality: true,
      show_precipitation: true,
      air_quality_entity_id: "sensor.aqi",
    });

    const media = buildSmartStackChildUpdates("media_card", {
      title: "Speaker",
      entity_id: "media_player.kitchen",
    });
    expect(media).toEqual({ title: "Speaker", entity_id: "media_player.kitchen" });

    const match = buildSmartStackChildUpdates("teamtracker_card", {
      title: "Chelsea",
      entity_id: "sensor.team_chelsea",
      show_team_names: false,
      show_form: false,
      show_progress: true,
    });
    expect(match).toEqual({
      title: "Chelsea",
      entity_id: "sensor.team_chelsea",
      show_team_names: false,
      show_form: false,
      show_progress: true,
    });
    expect(match).not.toHaveProperty("width");

    const calendar = buildSmartStackChildUpdates("calendar_card", {
      title: "Agenda",
      entity_id: "",
      show_upcoming: false,
    });
    expect(calendar).toEqual({
      title: "Agenda",
      entity_id: "",
      show_upcoming: false,
    });

    const trash = buildSmartStackChildUpdates("trash_card", {
      title: "Afval",
      entity_id: "sensor.afvalwijzer_gft",
      date_entity_id: "sensor.afvalwijzer_next_date",
      days_entity_id: "sensor.afvalwijzer_next_in_days",
      demo_theme: "gft",
    });
    expect(trash).toMatchObject({
      title: "Afval",
      entity_id: "sensor.afvalwijzer_gft",
      date_entity_id: "sensor.afvalwijzer_next_date",
      days_entity_id: "sensor.afvalwijzer_next_in_days",
      demo_theme: "gft",
    });
    expect(trash).not.toHaveProperty("width");
    expect(trash).not.toHaveProperty("height");
  });

  it("strips width and height from nested child patches", () => {
    expect(stripSmartStackChildSize({ title: "A", width: 400, height: 300, icon: "Zap" })).toEqual({
      title: "A",
      icon: "Zap",
    });
  });
});
