import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mintLine, samplePolyline } from "./energy-house-anchors";
import { getTranslations } from "./i18n";
import {
  activeHouseLights,
  batteryIsLinked,
  dayNightPair,
  EMPTY_HOUSE_LIGHTING,
  FLOW_DOT_EDGE_OPACITY,
  FLOW_DOT_OPACITY,
  FLOW_LINE_OPACITY,
  flowDotDelayMs,
  flowDotFrames,
  flowDurationMs,
  flowStep,
  formatLivePower,
  gridExportIsLinked,
  gridImportIsLinked,
  HOUSE_LIGHT_TINT,
  HOUSE_LIGHT_ZONES,
  houseAssetPath,
  houseLightTint,
  houseLightZonesForSide,
  houseVariant,
  nowSentenceKey,
  parseHouseLighting,
  parseLightEntityId,
  consumptionIsLinked,
  overviewIsLinked,
  powerIsFlowing,
  shouldAnimate,
  solarIsLinked,
  solarPillOn,
  stepHeroGates,
  stepPowerFlowing,
  type FlowPoint,
  type HeroGates,
} from "./energy-now";
import { emptyManualModel, parseEnergyPrefs } from "./energy-prefs";

function arcLengths(points: readonly FlowPoint[]): number[] {
  const lengths = [0];
  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1] as FlowPoint;
    const next = points[index] as FlowPoint;
    lengths.push((lengths[index - 1] ?? 0) + Math.hypot(next.x - prev.x, next.y - prev.y));
  }
  return lengths;
}

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

  it("points the front and the back at their own renders", () => {
    expect(houseAssetPath("dag-licht", "webp", "front")).toBe("/energy/house/huis-dag-licht.webp");
    expect(houseAssetPath("dag-licht", "avif")).toBe("/energy/house/huis-dag-licht.avif");
    expect(houseAssetPath("nacht-donker", "webp", "back")).toBe("/energy/house/achter-nacht-donker.webp");
    expect(houseAssetPath("zonder-licht", "avif", "back")).toBe("/energy/house/achter-zonder-licht.avif");
    expect(houseAssetPath("zonder-donker", "webp", "front")).toBe("/energy/house/huis-zonder-donker.webp");
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
    expect(flowDurationMs(1)).toBe(8400);
    expect(flowDurationMs(2)).toBe(4800);
    expect(flowDurationMs(3)).toBe(2800);
    expect(flowDurationMs(1)).toBeGreaterThan(flowDurationMs(2));
    expect(flowDurationMs(2)).toBeGreaterThan(flowDurationMs(3));
    expect(FLOW_DOT_OPACITY).toBe(0.55);
    expect(FLOW_DOT_EDGE_OPACITY).toBe(0.19);
    expect(FLOW_LINE_OPACITY).toBe(0.52);
    const layers = readFileSync(path.join(process.cwd(), "src/components/energy/overview/now-hero-layers.tsx"), "utf8");
    expect(layers).toContain("energy-label-flow");
    expect(layers).toContain("strokeWidth={1.5}");
    expect(layers.match(/<circle/g)).toHaveLength(1);
    expect(layers).toContain("data-now-ridge");
    expect(layers).not.toContain("function cycle");
    expect(layers).not.toContain("opacity: 0.35");
    expect(layers).not.toContain("opacity={0.95}");
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

describe("solar flow dots", () => {
  it("walks every keyframe forward along the path and never back to the roof", () => {
    const path = samplePolyline(mintLine("dag-licht"), 16);
    const frames = flowDotFrames(path);
    expect(path.length).toBeGreaterThan(2);
    expect(frames).toHaveLength(path.length);
    const lengths = arcLengths(path);
    expect(lengths[lengths.length - 1]).toBeGreaterThan(0);
    let previous = -1;
    frames.forEach((frame, index) => {
      const point = path[index] as FlowPoint;
      expect(frame.x).toBe(point.x);
      expect(frame.y).toBe(point.y);
      expect(frame.offset).toBeCloseTo(index / (path.length - 1));
      const distance = lengths[index] ?? 0;
      expect(distance).toBeGreaterThanOrEqual(previous);
      previous = distance;
    });
    const start = path[0] as FlowPoint;
    const end = path[path.length - 1] as FlowPoint;
    expect(end.x === start.x && end.y === start.y).toBe(false);
    expect(frames[frames.length - 1]).toMatchObject({ x: end.x, y: end.y });
    expect(frames.some((frame, index) => index > 0 && frame.x === start.x && frame.y === start.y)).toBe(false);
    const wrapped = [...path, start];
    const returnJump = Math.hypot(start.x - end.x, start.y - end.y);
    expect(returnJump).toBeGreaterThan(0);
    expect(wrapped).toHaveLength(path.length + 1);
    expect(frames).toHaveLength(path.length);

    const bend: FlowPoint[] = [
      { x: 0, y: 0 },
      { x: 10, y: 4 },
      { x: 8, y: 12 },
      { x: 3, y: 20 },
    ];
    const bent = flowDotFrames(bend);
    expect(bent.map((frame) => frame.x)).toEqual([0, 10, 8, 3]);
    const bentLengths = arcLengths(bent);
    for (let index = 1; index < bentLengths.length; index += 1) {
      expect(bentLengths[index]).toBeGreaterThan(bentLengths[index - 1] ?? 0);
    }
    expect(bent[2]?.x).toBeLessThan(bent[1]?.x ?? 0);

    expect(frames[0]?.opacity).toBeCloseTo(FLOW_DOT_EDGE_OPACITY);
    expect(frames[frames.length - 1]?.opacity).toBeCloseTo(FLOW_DOT_EDGE_OPACITY);
    expect(frames[Math.floor(frames.length / 2)]?.opacity).toBeCloseTo(FLOW_DOT_OPACITY);

    const fade = flowDotFrames(Array.from({ length: 11 }, (_, index) => ({ x: index, y: 0 })));
    expect(fade[0]?.opacity).toBeCloseTo(FLOW_DOT_EDGE_OPACITY);
    expect(fade[1]?.offset).toBeCloseTo(0.1);
    expect(fade[1]?.opacity).toBeCloseTo(FLOW_DOT_OPACITY);
    expect(fade[9]?.offset).toBeCloseTo(0.9);
    expect(fade[9]?.opacity).toBeCloseTo(FLOW_DOT_OPACITY);
    expect(fade[10]?.opacity).toBeCloseTo(FLOW_DOT_EDGE_OPACITY);
    const halfway = flowDotFrames(Array.from({ length: 21 }, (_, index) => ({ x: index, y: 0 })));
    expect(halfway[1]?.offset).toBeCloseTo(0.05);
    expect(halfway[1]?.opacity).toBeCloseTo(
      FLOW_DOT_EDGE_OPACITY + (FLOW_DOT_OPACITY - FLOW_DOT_EDGE_OPACITY) * 0.5
    );

    expect(flowDotDelayMs(0, 8, flowDurationMs(1))).toBe(0);
    expect(flowDotDelayMs(3, 8, flowDurationMs(1))).toBeCloseTo(-(3 / 8) * 8400);
    expect(flowDotDelayMs(7, 8, flowDurationMs(2))).toBeLessThan(0);
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
        houseKw: 0.8,
        consumptionOnly: true,
      })
    ).toBe("energy.overview.now.sentenceHouse");
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

describe("house light tint", () => {
  it("uses the full tint when the light is off", () => {
    expect(houseLightTint({ state: "off" })).toBe(1);
    expect(houseLightTint({ state: "off", attributes: { brightness: 255, brightness_pct: 100 } })).toBe(1);
  });

  it("scales an on light with brightness and prefers brightness_pct", () => {
    expect(houseLightTint({ state: "on", attributes: { brightness: 0 } })).toBe(1);
    expect(houseLightTint({ state: "on", attributes: { brightness: 128 } })).toBeCloseTo(1 - 128 / 255, 10);
    expect(houseLightTint({ state: "on", attributes: { brightness: 255 } })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: { brightness_pct: 50, brightness: 255 } })).toBe(0.5);
    expect(houseLightTint({ state: "on", attributes: { brightness_pct: 0 } })).toBe(1);
    expect(houseLightTint({ state: "on", attributes: { brightness_pct: 100 } })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: { brightness: 400 } })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: { brightness_pct: -20 } })).toBe(1);
  });

  it("falls back to brightness when brightness_pct is not a finite number", () => {
    expect(houseLightTint({ state: "on", attributes: { brightness_pct: null, brightness: 128 } })).toBeCloseTo(
      1 - 128 / 255,
      10
    );
    expect(houseLightTint({ state: "on", attributes: { brightness: 0 } })).toBe(1);
  });

  it("draws no tint for a non-dimmable on light or a value that is not a number", () => {
    expect(houseLightTint({ state: "on" })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: {} })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: { brightness: Number.NaN } })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: { brightness_pct: "50" } })).toBe(0);
    expect(houseLightTint({ state: "on", attributes: { brightness: "128" } })).toBe(0);
  });

  it("skips unavailable, unknown and a missing entity", () => {
    expect(houseLightTint({ state: "unavailable", attributes: { brightness: 0 } })).toBeNull();
    expect(houseLightTint({ state: "unknown" })).toBeNull();
    expect(houseLightTint(null)).toBeNull();
    expect(houseLightTint(undefined)).toBeNull();
    expect(houseLightTint({ state: "" })).toBeNull();
  });

  it("keeps one polygon set per side and the theme opacities from the brief", () => {
    expect(HOUSE_LIGHT_ZONES.front.livingRoom).toHaveLength(2);
    expect(HOUSE_LIGHT_ZONES.front.upstairs).toHaveLength(3);
    expect(HOUSE_LIGHT_ZONES.front.kitchen).toBeUndefined();
    expect(HOUSE_LIGHT_ZONES.front.livingRoom?.[0]?.[0]).toEqual([21.5, 51]);
    expect(HOUSE_LIGHT_ZONES.front.upstairs?.[2]?.[1]).toEqual([69.8, 43]);
    expect(HOUSE_LIGHT_ZONES.back.kitchen).toHaveLength(1);
    expect(HOUSE_LIGHT_ZONES.back.bathroom).toHaveLength(1);
    expect(HOUSE_LIGHT_ZONES.back.study).toHaveLength(1);
    expect(HOUSE_LIGHT_ZONES.back.livingRoom).toBeUndefined();
    expect(HOUSE_LIGHT_ZONES.back.kitchen?.[0]).toEqual([
      [51.1, 54.1],
      [69.6, 49],
      [69.6, 66.5],
      [51.1, 72.0],
    ]);
    expect(HOUSE_LIGHT_ZONES.back.bathroom?.[0]).toEqual([
      [46.9, 35.5],
      [48.9, 35.1],
      [48.9, 41.8],
      [46.9, 42.3],
    ]);
    expect(HOUSE_LIGHT_ZONES.back.upstairs).toHaveLength(1);
    expect(HOUSE_LIGHT_ZONES.back.upstairs?.[0]?.[0]).toEqual([30.0, 18.3]);
    expect(HOUSE_LIGHT_ZONES.back.study?.[0]?.[2]).toEqual([66, 39.6]);
    expect(HOUSE_LIGHT_TINT.light.multiply).toEqual({ fill: "#1f2a44", opacity: 0.62 });
    expect(HOUSE_LIGHT_TINT.light.screen).toEqual({ fill: "#3b4a6b", opacity: 0.14 });
    expect(HOUSE_LIGHT_TINT.dark.multiply).toEqual({ fill: "#0b1020", opacity: 0.78 });
    expect(HOUSE_LIGHT_TINT.dark.screen).toEqual({ fill: "#3b4a6b", opacity: 0.18 });
  });
});

describe("house lighting parser", () => {
  it("keeps a trimmed light id and drops everything else", () => {
    expect(parseLightEntityId("  light.woonkamer  ")).toBe("light.woonkamer");
    expect(parseLightEntityId("light.")).toBe("light.");
    expect(parseLightEntityId("sensor.woonkamer")).toBe("");
    expect(parseLightEntityId("Light.woonkamer")).toBe("");
    expect(parseLightEntityId("")).toBe("");
    expect(parseLightEntityId("   ")).toBe("");
    expect(parseLightEntityId(12)).toBe("");
    expect(parseLightEntityId(null)).toBe("");
    expect(
      parseHouseLighting({
        livingRoomEntityId: " light.woonkamer ",
        upstairsEntityId: "sensor.overloop",
        outdoorEntityId: "light.buiten",
        extra: "light.ignored",
      })
    ).toEqual({
      livingRoomEntityId: "light.woonkamer",
      kitchenEntityId: "",
      bathroomEntityId: "",
      studyEntityId: "",
      upstairsEntityId: "",
      outdoorEntityId: "light.buiten",
    });
    expect(parseHouseLighting(null)).toEqual(EMPTY_HOUSE_LIGHTING);
    expect(parseHouseLighting("light.woonkamer")).toEqual(EMPTY_HOUSE_LIGHTING);
    expect(parseHouseLighting(["light.woonkamer"])).toEqual(EMPTY_HOUSE_LIGHTING);
    expect(parseHouseLighting({ livingRoomEntityId: 4 })).toEqual(EMPTY_HOUSE_LIGHTING);
  });

  it("reports on and off zones and skips a zone without a known state", () => {
    const lighting = parseHouseLighting({
      livingRoomEntityId: "light.woonkamer",
      upstairsEntityId: "light.boven",
      outdoorEntityId: "light.buiten",
    });
    expect(
      activeHouseLights(lighting, {
        "light.woonkamer": { state: "on", attributes: { brightness_pct: 50 } },
        "light.boven": { state: "off" },
        "light.buiten": { state: "unavailable" },
      })
    ).toEqual([
      { id: "livingRoom", factor: 0.5, spoken: "on" },
      { id: "upstairs", factor: 1, spoken: "off" },
    ]);
    expect(activeHouseLights(EMPTY_HOUSE_LIGHTING, { "light.woonkamer": { state: "off" } })).toEqual([]);
  });

  it("reads an older lighting record, the new rooms, and drops a non-light id", () => {
    expect(
      parseHouseLighting({
        livingRoomEntityId: "light.woonkamer",
        upstairsEntityId: "light.boven",
      })
    ).toEqual({
      ...EMPTY_HOUSE_LIGHTING,
      livingRoomEntityId: "light.woonkamer",
      upstairsEntityId: "light.boven",
    });
    expect(
      parseHouseLighting({
        kitchenEntityId: "switch.keuken",
        bathroomEntityId: " light.bad ",
        studyEntityId: "light.werk",
      })
    ).toEqual({
      ...EMPTY_HOUSE_LIGHTING,
      bathroomEntityId: "light.bad",
      studyEntityId: "light.werk",
    });
    const lighting = parseHouseLighting({
      livingRoomEntityId: "light.woonkamer",
      kitchenEntityId: "light.keuken",
      bathroomEntityId: "light.bad",
      studyEntityId: "light.werk",
    });
    expect(
      activeHouseLights(lighting, {
        "light.woonkamer": { state: "on" },
        "light.keuken": { state: "off" },
        "light.bad": { state: "on", attributes: { brightness_pct: 40 } },
        "light.werk": { state: "unavailable" },
      })
    ).toEqual([
      { id: "livingRoom", factor: 0, spoken: "on" },
      { id: "kitchen", factor: 1, spoken: "off" },
      { id: "bathroom", factor: 0.6, spoken: "on" },
    ]);
    expect(houseLightZonesForSide("front")).toEqual(["livingRoom", "upstairs"]);
    expect(houseLightZonesForSide("back")).toEqual(["kitchen", "bathroom", "study", "upstairs"]);
  });

  it("uses only the agreed Dutch and English copy", () => {
    const nl = getTranslations("nl");
    const en = getTranslations("en");
    expect(nl["settings.energy.lights.title"]).toBe("Verlichting op het huis");
    expect(en["settings.energy.lights.title"]).toBe("Lights on the house");
    expect(nl["settings.energy.lights.description"]).toBe(
      "Kies per ruimte een lamp. Is de lamp uit, dan wordt die ruimte op het huis donker getoond."
    );
    expect(en["settings.energy.lights.description"]).toBe(
      "Pick a light per room. When it's off, that room is shown dark on the house."
    );
    expect(nl["settings.energy.lights.zone.livingRoom"]).toBe("Woonkamer");
    expect(en["settings.energy.lights.zone.livingRoom"]).toBe("Living room");
    expect(nl["settings.energy.lights.zone.upstairs"]).toBe("Boven");
    expect(en["settings.energy.lights.zone.upstairs"]).toBe("Upstairs");
    expect(nl["settings.energy.lights.zone.outside"]).toBe("Buiten");
    expect(en["settings.energy.lights.zone.outside"]).toBe("Outside");
    expect(nl["settings.energy.lights.later"]).toBe("Later");
    expect(en["settings.energy.lights.later"]).toBe("Later");
    expect(nl["settings.energy.lights.emptyHint"]).toBe(
      "Geen lamp gekozen: het huis wordt gewoon getoond, zonder verlichtingslaag."
    );
    expect(en["settings.energy.lights.emptyHint"]).toBe(
      "No light chosen: the house is shown as is, without a lighting layer."
    );
    expect(nl["energy.house.lightOn"]).toBe("{zone}, licht aan");
    expect(en["energy.house.lightOn"]).toBe("{zone}, light on");
    expect(nl["energy.house.lightOff"]).toBe("{zone}, licht uit");
    expect(en["energy.house.lightOff"]).toBe("{zone}, light off");
    expect(nl["settings.energy.lights.zone.kitchen"]).toBe("Keuken");
    expect(en["settings.energy.lights.zone.kitchen"]).toBe("Kitchen");
    expect(nl["settings.energy.lights.zone.bathroom"]).toBe("Badkamer");
    expect(en["settings.energy.lights.zone.bathroom"]).toBe("Bathroom");
    expect(nl["settings.energy.lights.zone.study"]).toBe("Werkkamer");
    expect(en["settings.energy.lights.zone.study"]).toBe("Study");
    expect(nl["settings.energy.airconEnergy"]).toBe("Airco (energie)");
    expect(en["settings.energy.airconEnergy"]).toBe("Air conditioning (energy)");
    expect(nl["energy.overview.house.back"]).toBe("Achterkant");
    expect(en["energy.overview.house.back"]).toBe("Back");
    expect(nl["energy.overview.house.front"]).toBe("Voorkant");
    expect(en["energy.overview.house.front"]).toBe("Front");
    expect(nl["energy.overview.house.turnToBack"]).toBe("Draai naar de achterkant");
    expect(en["energy.overview.house.turnToBack"]).toBe("Turn to the back");
    expect(nl["energy.overview.house.turnToFront"]).toBe("Draai naar de voorkant");
    expect(en["energy.overview.house.turnToFront"]).toBe("Turn to the front");
    expect(nl["energy.story.aircon"]).toBe("Airco");
    expect(en["energy.story.aircon"]).toBe("Air conditioning");
    expect(nl["energy.overview.now.airconToday"]).toBe("vandaag");
    expect(en["energy.overview.now.airconToday"]).toBe("today");
    expect(nl["settings.energy.entityNone"]).toBe("Niet ingesteld");
    expect(Object.values(nl)).not.toContain("Komt later.");
    expect(Object.values(en)).not.toContain("Komt later.");
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
