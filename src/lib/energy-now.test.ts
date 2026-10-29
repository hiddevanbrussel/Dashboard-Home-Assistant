import { describe, expect, it } from "vitest";
import {
  batteryIsLinked,
  dayNightPair,
  flowDurationMs,
  flowStep,
  formatLivePower,
  gridExportIsLinked,
  gridImportIsLinked,
  houseVariant,
  nowSentenceKey,
  powerIsFlowing,
  roundSentenceKw,
  shouldAnimate,
  solarIsLinked,
  stepHeroGates,
  type HeroGates,
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

describe("formatLivePower", () => {
  it("uses watts below 1 kW and two decimals above", () => {
    expect(formatLivePower(0.7, "nl")).toBe("700 W");
    expect(formatLivePower(1.65, "nl")).toBe("1,65 kW");
    expect(formatLivePower(0, "nl")).toBe("0 W");
    expect(formatLivePower(1.65, "en")).toBe("1.65 kW");
  });
});

describe("now sentence", () => {
  it("asks to link sensors when nothing is connected and otherwise picks one line", () => {
    expect(
      nowSentenceKey({
        linked: false,
        night: false,
        solarOn: false,
        batteryOn: false,
        gridOn: false,
        solarKw: null,
        batteryKw: null,
        gridKw: null,
        houseKw: null,
      })
    ).toBe("energy.overview.now.sentenceSetup");
    expect(
      nowSentenceKey({
        linked: true,
        night: false,
        solarOn: true,
        batteryOn: true,
        gridOn: true,
        solarKw: 1.65,
        batteryKw: -0.7,
        gridKw: -0.25,
        houseKw: 0.7,
      })
    ).toBe("energy.overview.now.sentenceCoverExport");
    expect(
      nowSentenceKey({
        linked: true,
        night: true,
        solarOn: false,
        batteryOn: true,
        gridOn: true,
        solarKw: 0,
        batteryKw: 0.7,
        gridKw: 0.15,
        houseKw: 0.85,
      })
    ).toBe("energy.overview.now.sentenceBatteryOut");
  });

  it("rounds sentence figures to 50 W and keeps the type while the gate holds", () => {
    expect(roundSentenceKw(0.73)).toBe(0.75);
    expect(roundSentenceKw(0.02)).toBe(0);
    expect(roundSentenceKw(1.65)).toBe(1.65);
    expect(roundSentenceKw(0.045)).toBe(0.05);
    expect(roundSentenceKw(0.055)).toBe(0.05);
    const base = {
      linked: true,
      night: false,
      solarOn: true,
      batteryOn: false,
      gridOn: false,
      batteryKw: 0,
      gridKw: 0,
      houseKw: 1.2,
    };
    expect(nowSentenceKey({ ...base, solarKw: 0.045 })).toBe("energy.overview.now.sentenceSolar");
    expect(nowSentenceKey({ ...base, solarKw: 0.055 })).toBe(nowSentenceKey({ ...base, solarKw: 0.045 }));
    expect(nowSentenceKey({ ...base, solarOn: false, solarKw: 0.045 })).toBeNull();
  });
});

describe("hero gates", () => {
  const off: HeroGates = { solar: false, grid: false, battery: false };

  it("does not flip while power wobbles inside the band", () => {
    let gates = off;
    for (const solarKw of [0.05, 0.055, 0.041, 0.05]) {
      gates = stepHeroGates(gates, { solarKw, gridKw: 0.05, batteryKw: 0.006 });
    }
    expect(gates).toEqual(off);
    gates = { solar: true, grid: true, battery: true };
    for (const solarKw of [0.05, 0.041, 0.055]) {
      gates = stepHeroGates(gates, { solarKw, gridKw: -0.05, batteryKw: 0.006 });
    }
    expect(gates).toEqual({ solar: true, grid: true, battery: true });
  });

  it("turns the battery on at 10 W and keeps it on down to 5 W", () => {
    let gates = stepHeroGates(off, { solarKw: 0, gridKw: 0, batteryKw: 0.009 });
    expect(gates.battery).toBe(false);
    gates = stepHeroGates(gates, { solarKw: 0, gridKw: 0, batteryKw: 0.01 });
    expect(gates.battery).toBe(true);
    gates = stepHeroGates(gates, { solarKw: 0, gridKw: 0, batteryKw: 0.006 });
    expect(gates.battery).toBe(true);
    gates = stepHeroGates(gates, { solarKw: 0, gridKw: 0, batteryKw: 0.004 });
    expect(gates.battery).toBe(false);
  });
});
