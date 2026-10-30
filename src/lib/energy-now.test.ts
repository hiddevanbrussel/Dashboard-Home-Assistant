import { afterEach, describe, expect, it, vi } from "vitest";
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
  consumptionIsLinked,
  overviewIsLinked,
  powerIsFlowing,
  shouldAnimate,
  solarIsLinked,
  solarPillOn,
  stepHeroGates,
  stepPowerFlowing,
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

  it("does not flap the mint line when power wobbles around the threshold", () => {
    vi.useFakeTimers();
    let flowing = false;
    const noise = [0.049, 0.051, 0.045, 0.055, 0.05];
    for (const kw of noise) {
      vi.advanceTimersByTime(10_000);
      flowing = stepPowerFlowing(flowing, [kw, 0.02, null]);
    }
    expect(flowing).toBe(false);
    flowing = stepPowerFlowing(false, [0.07]);
    expect(flowing).toBe(true);
    for (const kw of [0.05, 0.041, 0.055]) {
      vi.advanceTimersByTime(10_000);
      flowing = stepPowerFlowing(flowing, [kw]);
    }
    expect(flowing).toBe(true);
    expect(stepPowerFlowing(true, [0.03])).toBe(false);
    vi.useRealTimers();
  });
});

describe("solar pill icon", () => {
  it("shows the sun from 10 W during the day and keeps the glow gate separate", () => {
    expect(solarPillOn({ night: false, solarKw: 0.01, gate: false })).toBe(true);
    expect(solarPillOn({ night: false, solarKw: 0.009, gate: false })).toBe(false);
    expect(solarPillOn({ night: false, solarKw: 0.05, gate: false })).toBe(true);
    expect(solarPillOn({ night: true, solarKw: 0.05, gate: false })).toBe(false);
    expect(solarPillOn({ night: true, solarKw: 0, gate: true })).toBe(true);
  });
});

describe("consumption link", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts a consumption sensor as linked", () => {
    expect(consumptionIsLinked("")).toBe(false);
    expect(consumptionIsLinked(" sensor.house ")).toBe(true);
    expect(overviewIsLinked({ solar: false, battery: false, grid: false, consumption: true })).toBe(true);
    expect(overviewIsLinked({ solar: false, battery: false, grid: false, consumption: false })).toBe(false);
    expect(
      nowSentenceKey({
        linked: true,
        night: false,
        solarOn: false,
        batteryOn: false,
        gridOn: false,
        solarKw: null,
        batteryKw: null,
        gridKw: null,
        houseKw: 0.7,
      })
    ).toBeNull();
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

  it("keeps the sentence type while the gate holds", () => {
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

  it("skips the solar sentence when the house figure is unknown", () => {
    expect(
      nowSentenceKey({
        linked: true,
        night: false,
        solarOn: true,
        batteryOn: false,
        gridOn: true,
        solarKw: 1.65,
        batteryKw: null,
        gridKw: 0.3,
        houseKw: null,
      })
    ).toBeNull();
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
