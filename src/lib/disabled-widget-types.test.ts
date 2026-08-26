import { describe, expect, it } from "vitest";
import { isWidgetTypeTemporarilyDisabled } from "./disabled-widget-types";

describe("temporarily disabled widget types", () => {
  it("hides the requested add-tile types", () => {
    expect(isWidgetTypeTemporarilyDisabled("solar_card")).toBe(true);
    expect(isWidgetTypeTemporarilyDisabled("power_usage_card")).toBe(true);
    expect(isWidgetTypeTemporarilyDisabled("device_consumption_card")).toBe(true);
    expect(isWidgetTypeTemporarilyDisabled("sensor_card")).toBe(true);
    expect(isWidgetTypeTemporarilyDisabled("nuts_card")).toBe(true);
    expect(isWidgetTypeTemporarilyDisabled("card_group")).toBe(true);
  });

  it("keeps other addable types available", () => {
    expect(isWidgetTypeTemporarilyDisabled("light_card")).toBe(false);
    expect(isWidgetTypeTemporarilyDisabled("text_card")).toBe(false);
    expect(isWidgetTypeTemporarilyDisabled("climate_card_2")).toBe(false);
  });
});
