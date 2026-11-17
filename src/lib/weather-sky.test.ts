import { describe, expect, it } from "vitest";
import * as sky from "./weather-sky";
import type { SkyTheme, SkyLook, SkyPhase } from "./weather-sky";
import { buildSmartStackChildUpdates } from "./smart-stack";

// Independent design oracle from the run A specification.
const ORACLE = `
light sunny dawn #5c8abc #d0cfe3 #f5dfcb 0.62
light sunny dusk #5c8abc #c5c3e1 #f4d3bb 0.80
light sunny night #375482 #536681 #607590 0.86
light cloudy dawn #8291a8 #d6d2de #f2e5db 0.62
light cloudy dusk #8291a8 #cfcbdd #f2ded1 0.80
light cloudy night #4b5a77 #566683 #617390 0.86
light rain dawn #62718a #b8bbcb #dfdad7 0.70
light rain dusk #62718a #b3b5ca #dfd4cf 0.80
light rain night #374560 #465571 #576885 0.86
light storm dawn #535f7a #a7abbc #d4d0d0 0.84
light storm dusk #535f7a #a3a6bb #d4cccb 0.84
light storm night #2e3954 #3e4b67 #52617e 0.86
light snow dawn #8e9eb4 #dfdbe6 #f8eade 0.62
light snow dusk #8e9eb4 #d8d3e5 #f7e2d4 0.80
light snow night #52637f #5c6d8a #657794 0.86
light fog dawn #8d98a9 #dbd5dc #f1e6dc 0.62
light fog dusk #8d98a9 #d5cfdc #f1e0d4 0.80
light fog night #4f5f7b #586885 #61728f 0.86
dark sunny dawn #08234a #3a4474 #715e7a 0.56
dark sunny dusk #08234a #3c3d6f #7b5f65 0.56
dark sunny night #010b2e #021441 #051f4b 0.34
dark cloudy dawn #141e33 #393e5b #61566a 0.48
dark cloudy dusk #141e33 #3a3a57 #67565e 0.48
dark cloudy night #030a21 #071128 #0e1931 0.29
dark rain dawn #0d172a #2e3652 #4f4c62 0.44
dark rain dusk #0d172a #2f344f #544d5a 0.48
dark rain night #02061b #040c23 #09142b 0.23
dark storm dawn #040a1a #22273c #3f3b4d 0.44
dark storm dusk #040a1a #23243a #423b47 0.48
dark storm night #000113 #01051a #040a22 0.20
dark snow dawn #172438 #3e4461 #695f73 0.52
dark snow dusk #172438 #40405e #6f5f67 0.52
dark snow night #040d24 #0a152d #142038 0.31
dark fog dawn #141d2b #3a3c4d #5e515d 0.46
dark fog dusk #141d2b #3b394b #635253 0.48
dark fog night #02091f #051027 #0c172f 0.28
`;

const THEMES = ["light", "dark"] as const;
function expectHex(actual: string, expected: string) {
  const channels = sky.hexToRgb(actual);
  sky.hexToRgb(expected).forEach((channel, i) => expect(Math.abs(channels[i] - channel)).toBeLessThanOrEqual(1));
}

describe("OKLab sky derivation", () => {
  it.each(ORACLE.trim().split("\n"))("matches oracle: %s", (row) => {
    const [theme, look, phase, ...values] = row.split(/\s+/);
    const result = sky.deriveSky(look as SkyLook, phase as SkyPhase, theme as SkyTheme);
    result.stops.forEach((stop, i) => expectHex(stop, values[i]));
    expect(Math.abs(result.veilAlpha - Number(values[3]))).toBeLessThanOrEqual(0.005);
  });
  it("preserves day rows and clear-night at every phase", () => {
    for (const theme of THEMES) {
      for (const look of sky.SKY_LOOKS) expect(sky.deriveSky(look, "day", theme)).toEqual(sky.SKY_TOKENS[theme][look]);
      for (const phase of sky.SKY_PHASES) expect(sky.deriveSky("clear-night", phase, theme)).toEqual(sky.SKY_TOKENS[theme]["clear-night"]);
    }
  });
  it("round trips RGB and uses standard OKLab rather than RGB mixing", () => {
    for (const c of ["#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#435066"]) expectHex(sky.okLabToHex(sky.hexToOKLab(c)), c);
    expect(sky.hexToOKLab("#ff0000")[0]).toBeCloseTo(0.627955, 5);
    expect(sky.mixOKLab("#000000", "#ffffff", 0.5)).toBe("#636363");
    expect(sky.mixOKLab("#000000", "#ffffff", -1)).toBe("#000000");
    expect(sky.mixOKLab("#000000", "#ffffff", 2)).toBe("#ffffff");
    expect(sky.toNight("#7DB9EE", "light")).toBe("#375482");
    expect(() => sky.hexToRgb("red")).toThrow();
    expect(sky.skyGradient(sky.deriveSky("sunny", "day", "light"))).toBe("linear-gradient(180deg, #7DB9EE 0%, #B4DAF7 55%, #E6F3FC 100%)");
  });
});

describe("static sky helpers (run B)", () => {
  it("preserves each motion choice in smart-stack weather form updates", () => {
    for (const motion of ["on", "calm", "off"] as const) {
      expect(buildSmartStackChildUpdates("weather_card", { sky_motion: motion }).sky_motion).toBe(motion);
    }
    const legacy = buildSmartStackChildUpdates("weather_card", {});
    expect(legacy).not.toHaveProperty("sky_motion");
    expect(sky.normalizeSkyMotion(legacy.sky_motion)).toBe("on");
  });
  it.each([undefined, null, "", "invalid", "ON", false, 0, {}, []])("defaults invalid motion %s to on", (value) => {
    expect(sky.normalizeSkyMotion(value)).toBe("on");
  });
  it.each(["on", "calm", "off"] as const)("preserves motion %s", (value) => {
    expect(sky.normalizeSkyMotion(value)).toBe(value);
  });
  it.each([
    ["sunny", 1, 0.55], ["cloudy", 4, 0.9], ["rain", 4, 0.9], ["storm", 5, 1],
    ["snow", 3, 0.8], ["fog", 2, 0.5], ["clear-night", 0, 1], ["windy", 3, 0.75],
  ] as const)("lays out %s clouds without randomness", (look, count, scale) => {
    const large = sky.skyClouds(look, "day", "light", true);
    const compact = sky.skyClouds(look, "day", "light", false);
    expect(large).toHaveLength(count);
    expect(large).toEqual(sky.skyClouds(look, "day", "light", true));
    large.forEach((cloud, i) => {
      expect(cloud.width).toBeGreaterThanOrEqual(70 * scale);
      expect(cloud.width).toBeLessThanOrEqual(110 * scale);
      expect(cloud.height).toBeCloseTo(cloud.width * 0.42);
      expect(compact[i].width).toBeCloseTo(cloud.width * 0.8);
      expect(cloud.background.match(/radial-gradient/g)).toHaveLength(3);
    });
    expect(large.map(({ x, y }) => [x, y])).toEqual([[78, 18], [30, 8], [96, 46], [55, 30], [12, 40]].slice(0, count));
  });
  it("applies twilight, night and partlycloudy cloud overrides", () => {
    expect(sky.skyClouds("cloudy", "night", "dark", true)).toHaveLength(3);
    for (const phase of ["dawn", "dusk"] as const) expect(sky.skyClouds("sunny", phase, "light", true)).toHaveLength(2);
    expect(sky.skyClouds("sunny", "day", "light", true, "PARTLYCLOUDY")).toHaveLength(3);
    expect(sky.skyClouds("clear-night", "night", "dark", true, "partlycloudy")).toHaveLength(2);
    expect(sky.skyClouds("rain", "night", "light", true)[0].colour).toBe("rgba(120,135,158,.40)");
    expect(sky.skyClouds("storm", "dawn", "dark", true)[0].colour).toBe("rgba(120,132,155,.30)");
    expect(sky.skyClouds("cloudy", "night", "dark", true)[0].colour).toBe("rgba(150,165,200,.14)");
    expect(sky.skyClouds("sunny", "dawn", "light", true)[0].colour).toBe("rgba(255,240,240,.62)");
  });
  it("seeds 34/20 clear-night stars and 10 cloudy stars in their height bands", () => {
    const stars = sky.skyStars("clear-night", "night", true);
    expect(stars).toHaveLength(34);
    expect(sky.skyStars("clear-night", "night", false)).toHaveLength(20);
    expect(stars).toEqual(sky.skyStars("clear-night", "night", true));
    expect(stars.filter((star) => star.size === 1.6)).toHaveLength(5);
    for (const star of stars) {
      expect(star.y).toBeLessThanOrEqual(78);
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(100);
      expect(star.alpha).toBeGreaterThanOrEqual(0.35);
      expect(star.alpha).toBeLessThanOrEqual(0.9);
    }
    for (const large of [true, false]) {
      const cloudy = sky.skyStars("cloudy", "night", large);
      expect(cloudy).toHaveLength(10);
      expect(cloudy.every((star) => star.y <= 40)).toBe(true);
    }
    for (const look of sky.SKY_LOOKS) {
      for (const phase of ["day", "dawn", "dusk"] as const) expect(sky.skyStars(look, phase, true)).toEqual([]);
      if (look !== "clear-night" && look !== "cloudy") expect(sky.skyStars(look, "night", true)).toEqual([]);
    }
  });
  it("selects glow by look, phase and theme without sun or moon discs", () => {
    expect(sky.skyGlow("sunny", "day", "light", 7)).toBe("radial-gradient(60% 55% at 80% 30%, rgba(255,236,170,.75) 0%, transparent 70%)");
    expect(sky.skyGlow("cloudy", "day", "dark", 7)).toContain("rgba(255,214,140,.28)");
    expect(sky.skyGlow("snow", "day", "dark", 7)).toContain("rgba(255,255,255,.10)");
    for (const look of ["rain", "storm", "fog", "windy", "clear-night"] as const) expect(sky.skyGlow(look, "day", "light", 7)).toBeNull();
    for (const look of sky.SKY_LOOKS) {
      expect(sky.skyGlow(look, "dawn", "light", 0)).toContain("72% 100%, rgba(255,214,170,.9)");
      expect(sky.skyGlow(look, "dusk", "dark", null)).toContain("78% 108%, rgba(255,140,90,.38)");
      expect(sky.skyGlow(look, "night", "dark", -7)).toContain("79% 34%, rgba(170,190,255,.16)");
    }
  });
  it("adds exactly three fog bands only to fog", () => {
    for (const look of sky.SKY_LOOKS) {
      for (const theme of ["light", "dark"] as const) expect(sky.skyFogBands(look, theme)).toHaveLength(look === "fog" ? 3 : 0);
    }
    expect(sky.skyFogBands("fog", "light")).toEqual([
      "radial-gradient(120% 22% at 30% 30%, rgba(255,255,255,0.45) 0%, transparent 100%)",
      "radial-gradient(120% 22% at 55% 56%, rgba(255,255,255,0.6) 0%, transparent 100%)",
      "radial-gradient(120% 22% at 80% 82%, rgba(255,255,255,0.7) 0%, transparent 100%)",
    ]);
    expect(sky.skyFogBands("fog", "dark")[2]).toContain("rgba(190,198,210,0.28)");
  });
});

describe("HA look mapping", () => {
  it.each([
    ["sunny", "sunny"], ["clear-night", "clear-night"], ["partlycloudy", "sunny"],
    ["cloudy", "cloudy"], ["rainy", "rain"], ["pouring", "rain"],
    ["lightning", "storm"], ["lightning-rainy", "storm"], ["snowy", "snow"],
    ["snowy-rainy", "snow"], ["hail", "snow"], ["fog", "fog"], ["windy", "windy"],
    ["windy-variant", "cloudy"], ["exceptional", "cloudy"], ["unavailable", "cloudy"],
    ["unknown", "cloudy"], ["", "cloudy"], ["clear", "sunny"], ["zonnig", "sunny"], ["mist", "fog"],
  ] as const)("maps %s to %s case-insensitively", (state, look) => {
    expect(sky.weatherSkyLook(state, "day")).toBe(look);
    expect(sky.weatherSkyLook(` ${state.toUpperCase()} `, "day")).toBe(look);
  });
  it("keeps partlycloudy on the day side until night", () => {
    expect(sky.weatherSkyLook("partlycloudy", "night")).toBe("clear-night");
    for (const phase of ["day", "dawn", "dusk"] as const) expect(sky.weatherSkyLook("partlycloudy", phase)).toBe("sunny");
  });
});

describe("sun phase", () => {
  it.each([-7, -6, 0, 6, 7])("classifies elevation %s", (elevation) => {
    for (const rising of [true, false]) expect(sky.phaseFromElevation(elevation, rising)).toBe(elevation < -6 ? "night" : elevation > 6 ? "day" : rising ? "dawn" : "dusk");
  });
  it("clamps smoothstep and glow height", () => {
    expect([-9, -8, -6, -4, -3].map((e) => sky.smoothstep(-8, -4, e))).toEqual([0, 0, 0.5, 1, 1]);
    expect(sky.sunBlendFactors(6)).toEqual({ nightToTwilight: 1, twilightToDay: 0.5 });
    expect(sky.sunBlendFactors(9)).toEqual({ nightToTwilight: 1, twilightToDay: 1 });
    expect(() => sky.smoothstep(1, 1, 0)).toThrow();
    expect(() => sky.phaseFromElevation(NaN, true)).toThrow();
    expect([-10, -6, 0, 6, 10].map(sky.twilightGlowHeight)).toEqual([115, 115, 100, 85, 85]);
  });
  it.each([
    [6, 0, "night", true], [6, 30, "dawn", true], [6, 45, "dawn", true],
    [7, 0, "day", true], [12, 0, "day", false], [19, 0, "dusk", false],
    [19, 15, "dusk", false], [19, 30, "night", false], [22, 0, "night", false],
  ] as const)("falls back to injected local clock %s:%s", (hour, minute, phase, rising) => {
    const clock = new Date(2026, 0, 2, hour, minute);
    for (const sun of [null, { state: "unavailable", attributes: { elevation: 20 } }, { attributes: {} }, { attributes: { elevation: NaN } }, { attributes: { elevation: "2" } }]) expect(sky.resolveSunPhase(sun, clock)).toEqual({ phase, rising, elevation: null, fallback: true });
  });
  it("prefers sun.sun attributes over the clock", () => {
    expect(sky.resolveSunPhase({ entity_id: sky.DEFAULT_SUN_ENTITY_ID, state: "above_horizon", attributes: { elevation: 2, rising: true } }, new Date(2026, 0, 2, 22))).toEqual({ phase: "dawn", rising: true, elevation: 2, fallback: false });
  });
  it("exports continuous OKLab blending without animation", () => {
    for (const theme of THEMES) {
      for (const rising of [true, false]) {
        for (const [elevation, phase] of [[-8, "night"], [0, rising ? "dawn" : "dusk"], [8, "day"]] as const) {
          const actual = sky.blendSky("sunny", elevation, rising, theme);
          const expected = sky.deriveSky("sunny", phase, theme);
          actual.stops.forEach((c, i) => expectHex(c, expected.stops[i]));
          expect(actual.veilAlpha).toBeCloseTo(expected.veilAlpha);
        }
        const night = sky.deriveSky("sunny", "night", theme);
        const twilight = sky.deriveSky("sunny", rising ? "dawn" : "dusk", theme);
        expect(sky.blendSky("sunny", -6, rising, theme).stops[0]).toBe(sky.mixOKLab(night.stops[0], twilight.stops[0], 0.5));
      }
      expect(sky.blendSky("clear-night", 0, true, theme)).toEqual(sky.SKY_TOKENS[theme]["clear-night"]);
    }
  });
});

function assertContrast(stop: string, alpha: number, theme: SkyTheme) {
  const result = sky.skyContrast(stop, alpha, theme);
  expect(result.primary, "primary WCAG").toBeGreaterThanOrEqual(4.5);
  expect(result.secondary, "secondary WCAG").toBeGreaterThanOrEqual(4.5);
  expect(result.ui, "metric icon WCAG").toBeGreaterThanOrEqual(3);
  // Visual design floors are verified manually in later runs, not against this flat compositing formula.
}

describe("WCAG contrast thresholds", () => {
  for (const theme of THEMES) for (const look of sky.SKY_LOOKS) for (const phase of sky.SKY_PHASES) for (const index of [0, 1, 2]) {
    it(`${theme} ${look} ${phase} s${index + 1}`, () => {
      const set = sky.deriveSky(look, phase, theme);
      assertContrast(set.stops[index], set.veilAlpha, theme);
    });
  }
  for (const theme of THEMES) {
    const stops = theme === "light" ? ["#F7FAFD", "#EEF4FA", "#E4EDF6"] : ["#243044", "#161E2E"];
    it.each(stops)(`current ${theme} tile %s`, (stop) => assertContrast(stop, 0, theme));
  }
  it("composites in sRGB before WCAG linearization, including text alpha", () => {
    expect(sky.compositeHex("#ffffff", "#000000", 0.5)).toBe("#808080");
    expect(sky.relativeLuminance("#000000")).toBe(0);
    expect(sky.relativeLuminance("#ffffff")).toBe(1);
    expect(sky.contrastRatio("#ffffff", "#000000")).toBe(21);
    const result = sky.skyContrast("#243044", 0, "dark");
    expect(result.secondary).toBe(sky.contrastRatio(sky.compositeHex("#ffffff", "#243044", 0.8), "#243044"));
    expect(result.ui).toBe(sky.contrastRatio(sky.compositeHex("#ffffff", "#243044", 0.68), "#243044"));
  });
});

describe("future particle parameters (data only)", () => {
  it.each([[0, "light"], [0.49, "light"], [0.5, "medium"], [2, "medium"], [2.01, "heavy"]] as const)("classifies %s mm/h", (mm, intensity) => {
    expect(sky.precipitationIntensity(mm)).toBe(intensity);
    expect(sky.precipitationIntensity(mm, "POURING")).toBe("heavy");
    expect(sky.precipitationIntensity(mm, "lightning-rainy")).toBe("heavy");
  });
  it("locks counts, timings and speeds", () => {
    expect(sky.PARTICLE_PARAMETERS.rain).toEqual({ counts: [40, 90, 160], speeds: [620, 820, 1050], speedVariation: 0.2, strokeLengths: [18, 18, 22], lineWidths: [1, 1.25, 1.5], fps: 30 });
    expect(sky.PARTICLE_PARAMETERS.snow).toEqual({ counts: [30, 60, 100], speeds: [28, 40, 58], radius: [1.4, 3.5], sway: [6, 14], sidewaysWindFactor: 0.3, fps: 24 });
    expect(sky.PARTICLE_PARAMETERS.hail).toEqual({ counts: [40, 40, 60], radius: [2.5, 3.5], speed: 380, angle: 0, fps: 30 });
    expect(sky.PARTICLE_PARAMETERS.fog).toEqual({ bands: 3, speeds: [8, 14], direction: "horizontal", fps: "compositor" });
    expect(sky.PARTICLE_PARAMETERS.lightning).toEqual({ intervalSeconds: [10, 16], rainyIntervalSeconds: [6, 12], minimumIntervalSeconds: 6, pulseMs: 180, doublePulse: true, peakOpacity: { light: 0.30, dark: 0.24 } });
    expect(sky.PARTICLE_PARAMETERS.wind).toEqual({ counts: [4, 6, 8], lengths: [50, 120], speedBase: 120, speedPerKmh: 6, fps: 30 });
    expect(sky.PARTICLE_PARAMETERS.prewarm).toBe(true);
    expect(sky.PARTICLE_COLOURS.light.rain).toBe("rgba(40,62,98,.42)");
    expect(sky.PARTICLE_COLOURS.dark.snow).toBe("rgba(235,242,255,.95)");
  });
  it("uses the moderate hail count for light hail, including compact tiles", () => {
    const [light, moderate] = sky.PARTICLE_PARAMETERS.hail.counts;
    expect(light).toBe(40);
    expect(light).toBe(moderate);
    expect(sky.particleCount(light, 320 * 160, true)).toBe(21);
  });
  it("converts HA wind units", () => {
    expect(sky.windSpeedKmh(10)).toBe(36);
    for (const unit of ["km/h", "kmh", "kph", "KM / H"]) expect(sky.windSpeedKmh(10, unit)).toBe(10);
    expect(sky.windSpeedKmh(10, "mph")).toBeCloseTo(16.09344);
    for (const unit of ["kn", "kt", "knots"]) expect(sky.windSpeedKmh(10, unit)).toBeCloseTo(18.519984);
    expect(sky.windSpeedKmh(-1)).toBe(0);
    expect(sky.windSpeedKmh(NaN)).toBe(0);
  });
  it("scales the shared tile and overflow budget", () => {
    expect([0, 96000, 960000].map(sky.areaFactor)).toEqual([0.6, 1, 3]);
    expect(sky.particleCount(100, 96000)).toBe(100);
    expect(sky.particleCount(100, 96000, true)).toBe(53);
    expect(sky.particleCount(160, 96000)).toBe(160);
    expect(sky.particleCount(160, 960000)).toBe(200);
    expect(sky.particleCount(160, 960000, true)).toBe(85);
    expect(sky.particleCount(400, 320 * 160, true)).toBe(200);
    expect(sky.particleCount(100, 0)).toBe(60);
  });
  it.each([[160, 85], [90, 48], [40, 21]])("uses fixed compact scaling for rain count %s", (base, expected) => {
    expect(sky.particleCount(base, 320 * 160, true)).toBe(expected);
  });
  it("caps rain angle and lee overflow; HA bearing is wind source", () => {
    expect([0, 10, 100].map(sky.rainAngle)).toEqual([0, 6, 25]);
    expect(sky.overflowMargins(25, 90)).toEqual({ top: 0, bottom: 40, left: 24, right: 8, fullStrength: 12, fade: 28 });
    expect(sky.overflowMargins(25, 270).right).toBe(24);
    expect(sky.overflowMargins(25, 0).left).toBe(8);
    expect(sky.overflowMargins(25, 180).right).toBe(8);
    expect(sky.overflowMargins(10, 90).left).toBeCloseTo(Math.tan(Math.PI / 18) * 40 + 6);
    expect(sky.overflowMargins(0, 90).left).toBe(8);
  });
  it("keeps effect types distinct and unknown weather static", () => {
    expect(sky.weatherEffects("lightning")).toMatchObject({ lightning: true, rain: false });
    expect(sky.weatherEffects("lightning-rainy")).toMatchObject({ lightning: true, rain: true, intensity: "heavy" });
    expect(sky.weatherEffects("hail")).toMatchObject({ hail: true, snow: false });
    expect(sky.weatherEffects("snowy-rainy", 10)).toMatchObject({ rainShare: 0.4, snowShare: 0.6, intensity: "medium" });
    for (const state of ["exceptional", "unknown", "unavailable", ""]) expect(sky.weatherEffects(state, 10, 100)).toMatchObject({ rain: false, snow: false, hail: false, fog: false, lightning: false, windStreaks: 0 });
    expect([19, 20, 35].map((wind) => sky.weatherEffects("windy", 0, wind).windStreaks)).toEqual([4, 6, 8]);
    expect(sky.weatherEffects("windy-variant", 0, 20)).toMatchObject({ cloudDriftMultiplier: 2, windSpeed: 240 });
    expect(sky.weatherEffects("partlycloudy", 0, 0, "night").cloudCount).toBe(2);
    expect(sky.weatherEffects("partlycloudy").cloudCount).toBe(3);
    expect(sky.weatherEffects("sunny").cloudCount).toBe(1);
  });
});
