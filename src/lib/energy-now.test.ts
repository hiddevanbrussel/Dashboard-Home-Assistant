import { describe, expect, it } from "vitest";
import {
  batteryIsLinked,
  dayNightPair,
  flowDurationMs,
  flowStep,
  gridExportIsLinked,
  gridImportIsLinked,
  houseVariant,
  nowSentenceKey,
  powerIsFlowing,
  shouldAnimate,
  solarIsLinked,
} from "./energy-now";
import { emptyManualModel, parseEnergyPrefs } from "./energy-prefs";

const idle = {
  reducedMotion: false,
  glassOff: false,
  hidden: false,
  tab: "overview" as const,
  visible: true,
  flowing: true,
  screensaver: false,
};

describe("house variant", () => {
  it("picks day, night and zonder from theme, sun and linked solar or battery", () => {
    expect(houseVariant({ theme: "light", sunAboveHorizon: true, solarLinked: true, batteryLinked: true })).toBe(
      "dag-licht"
    );
    expect(houseVariant({ theme: "dark", sunAboveHorizon: false, solarLinked: true, batteryLinked: false })).toBe(
      "nacht-donker"
    );
    expect(houseVariant({ theme: "light", sunAboveHorizon: true, solarLinked: false, batteryLinked: false })).toBe(
      "zonder-licht"
    );
    expect(houseVariant({ theme: "dark", sunAboveHorizon: false, solarLinked: false, batteryLinked: false })).toBe(
      "zonder-donker"
    );
    expect(houseVariant({ theme: "light", sunAboveHorizon: false, solarLinked: false, batteryLinked: true })).toBe(
      "nacht-licht"
    );
  });

  it("preloads the other time of day and skips zonder", () => {
    expect(dayNightPair("dag-licht")).toBe("nacht-licht");
    expect(dayNightPair("nacht-donker")).toBe("dag-donker");
    expect(dayNightPair("zonder-licht")).toBeNull();
    expect(dayNightPair("zonder-donker")).toBeNull();
  });

  it("treats a manual install without sensors as unlinked", () => {
    const manual = emptyManualModel();
    expect(solarIsLinked(manual, "", "")).toBe(false);
    expect(batteryIsLinked(manual, "", "")).toBe(false);
    expect(solarIsLinked(null, "sensor.pv_power", "")).toBe(true);
    expect(batteryIsLinked(null, "", "sensor.battery_power")).toBe(true);
  });

  it("reads solar and battery links from prefs", () => {
    const model = parseEnergyPrefs({
      energy_sources: [
        { type: "solar", stat_energy_from: "sensor.solar_energy" },
        { type: "battery", stat_soc: "sensor.battery_soc" },
        { type: "grid", stat_energy_from: "sensor.grid_import", stat_energy_to: "sensor.grid_export" },
      ],
    });
    expect(solarIsLinked(model, "", "")).toBe(true);
    expect(batteryIsLinked(model, "", "")).toBe(true);
    expect(gridImportIsLinked(model, "", "")).toBe(true);
    expect(gridExportIsLinked(model, "", "")).toBe(true);
    expect(gridImportIsLinked(emptyManualModel(), "", "")).toBe(false);
  });
});

describe("shouldAnimate", () => {
  it("runs only while power flows on the visible overview", () => {
    expect(shouldAnimate(idle)).toBe(true);
    expect(shouldAnimate({ ...idle, flowing: false })).toBe(false);
    expect(shouldAnimate({ ...idle, reducedMotion: true })).toBe(false);
    expect(shouldAnimate({ ...idle, glassOff: true })).toBe(false);
    expect(shouldAnimate({ ...idle, hidden: true })).toBe(false);
    expect(shouldAnimate({ ...idle, tab: "tiles" })).toBe(false);
    expect(shouldAnimate({ ...idle, visible: false })).toBe(false);
    expect(shouldAnimate({ ...idle, screensaver: true })).toBe(false);
  });

  it("keeps the duration step stable inside a power band", () => {
    expect(flowStep(0.2)).toBe(1);
    expect(flowStep(0.8)).toBe(2);
    expect(flowStep(3)).toBe(3);
    expect(flowDurationMs(1)).toBeGreaterThan(flowDurationMs(2));
    expect(flowDurationMs(2)).toBeGreaterThan(flowDurationMs(3));
    expect(powerIsFlowing([0, null, 0.01])).toBe(false);
    expect(powerIsFlowing([null, -0.2])).toBe(true);
  });
});

describe("now sentence", () => {
  it("asks to link sensors when nothing is connected and otherwise picks one line", () => {
    expect(
      nowSentenceKey({
        solarLinked: false,
        batteryLinked: false,
        gridLinked: false,
        solarKw: null,
        batteryKw: null,
        gridKw: null,
      })
    ).toBe("energy.overview.now.sentenceSetup");
    expect(
      nowSentenceKey({
        solarLinked: true,
        batteryLinked: true,
        gridLinked: true,
        solarKw: 2.4,
        batteryKw: 0.4,
        gridKw: -0.2,
      })
    ).toBe("energy.overview.now.sentenceSolar");
    expect(
      nowSentenceKey({
        solarLinked: false,
        batteryLinked: true,
        gridLinked: true,
        solarKw: null,
        batteryKw: 1,
        gridKw: 0.4,
      })
    ).toBe("energy.overview.now.sentenceBatteryOut");
  });
});
