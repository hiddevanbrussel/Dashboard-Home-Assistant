import { DEFAULT_SUN_ENTITY_ID } from "./sun-times";

export { DEFAULT_SUN_ENTITY_ID };
export type SkyTheme = "light" | "dark";
export type SkyPhase = "day" | "dawn" | "dusk" | "night";
export type SkyLook = "sunny" | "cloudy" | "rain" | "storm" | "snow" | "fog" | "clear-night" | "windy";
export type SkyStops = readonly [string, string, string];
export type SkySet = { readonly stops: SkyStops; readonly veilAlpha: number };
type RGB = readonly [number, number, number];
export type OKLab = readonly [number, number, number];

export const SKY_LOOKS: readonly SkyLook[] = ["sunny", "cloudy", "rain", "storm", "snow", "fog", "clear-night", "windy"];
export const SKY_PHASES: readonly SkyPhase[] = ["day", "dawn", "dusk", "night"];
export const SKY_TOKENS = {
  light: {
    sunny: { stops: ["#7DB9EE", "#B4DAF7", "#E6F3FC"], veilAlpha: 0.50 },
    cloudy: { stops: ["#B3C1D2", "#CED8E3", "#EBF0F5"], veilAlpha: 0.46 },
    rain: { stops: ["#8797AD", "#A9B7C8", "#D2DBE5"], veilAlpha: 0.70 },
    storm: { stops: ["#74809A", "#98A4B6", "#C7CED8"], veilAlpha: 0.84 },
    snow: { stops: ["#C3D1E1", "#DCE5EF", "#F5F8FB"], veilAlpha: 0.40 },
    fog: { stops: ["#C3C9D0", "#D7DBE0", "#ECEEF0"], veilAlpha: 0.44 },
    "clear-night": { stops: ["#41528A", "#7686BC", "#BCC5E3"], veilAlpha: 0.86 },
    windy: { stops: ["#8FB6DE", "#BCD3EA", "#E8F0F8"], veilAlpha: 0.52 },
  },
  dark: {
    sunny: { stops: ["#143762", "#1F5086", "#2C679C"], veilAlpha: 0.56 },
    cloudy: { stops: ["#253043", "#323F55", "#43536A"], veilAlpha: 0.48 },
    rain: { stops: ["#1B2537", "#26354B", "#34465E"], veilAlpha: 0.38 },
    storm: { stops: ["#10151F", "#1A2232", "#283144"], veilAlpha: 0.30 },
    snow: { stops: ["#2A3749", "#3A495F", "#51627A"], veilAlpha: 0.52 },
    fog: { stops: ["#282D34", "#363C44", "#474D56"], veilAlpha: 0.46 },
    "clear-night": { stops: ["#060A1A", "#0E1834", "#1B2950"], veilAlpha: 0.20 },
    windy: { stops: ["#1A3352", "#264668", "#355A80"], veilAlpha: 0.50 },
  },
} as const satisfies Record<SkyTheme, Record<SkyLook, SkySet>>;

export const SKY_TEXT = {
  light: { primary: "#1B2437", secondary: "#435066", secondaryAlpha: 1, veil: "#F7FAFD" },
  dark: { primary: "#FFFFFF", secondary: "#FFFFFF", secondaryAlpha: 0.8, veil: "#121826" },
} as const;

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function hexToRgb(hex: string): RGB {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Expected six-digit hex colour: ${hex}`);
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as unknown as RGB;
}

function rgbToHex(rgb: readonly number[]): string {
  return `#${rgb.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
}

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/** Ottosson's sRGB → linear RGB → OKLab matrices. */
export function hexToOKLab(hex: string): OKLab {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}

export function okLabToHex([L, a, b]: OKLab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return rgbToHex([
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)));
}

export function mixOKLab(from: string, to: string, factor: number): string {
  const a = hexToOKLab(from);
  const b = hexToOKLab(to);
  return okLabToHex(a.map((v, i) => lerp(v, b[i], clamp(factor, 0, 1))) as unknown as OKLab);
}

export function toNight(colour: string, theme: SkyTheme): string {
  const [L, a, b] = hexToOKLab(colour);
  const hue = Math.atan2(b, a);
  const target = 268 * Math.PI / 180;
  const arc = Math.atan2(Math.sin(target - hue), Math.cos(target - hue));
  const nightHue = hue + arc * 0.6;
  const chroma = Math.max(Math.hypot(a, b) * 0.85, 0.05);
  return okLabToHex([L * (theme === "light" ? 0.58 : 0.5), chroma * Math.cos(nightHue), chroma * Math.sin(nightHue)]);
}

const CLOUD_FACTOR: Record<Exclude<SkyLook, "clear-night">, number> = {
  sunny: 1, windy: 0.8, cloudy: 0.6, snow: 0.6, fog: 0.5, rain: 0.45, storm: 0.35,
};
const HORIZON = {
  light: { dawn: ["#E4C6D3", "#FAD6B6"], dusk: ["#CFAFD0", "#F8C49E"] },
  dark: { dawn: ["#463A66", "#86586A"], dusk: ["#472D5C", "#93574A"] },
} as const;

export function deriveSky(look: SkyLook, phase: SkyPhase, theme: SkyTheme): SkySet {
  const day = SKY_TOKENS[theme][look];
  if (look === "clear-night" || phase === "day") return day;
  if (phase === "night") return {
    stops: day.stops.map((c) => toNight(c, theme)) as unknown as SkyStops,
    veilAlpha: theme === "light" ? Math.max(day.veilAlpha, 0.86) : Math.max(0.2, day.veilAlpha * 0.6),
  };
  const [a2, a3] = HORIZON[theme][phase];
  const [s1, s2, s3] = day.stops;
  const k = CLOUD_FACTOR[look];
  return {
    stops: [mixOKLab(s1, toNight(s1, theme), 0.45), mixOKLab(s2, a2, 0.55 * k), mixOKLab(s3, a3, 0.70 * k)],
    veilAlpha: Math.max(day.veilAlpha, theme === "light" ? (phase === "dawn" ? 0.62 : 0.8) : (phase === "dawn" ? 0.44 : 0.48)),
  };
}

export function skyGradient({ stops: [s1, s2, s3] }: SkySet): string {
  return `linear-gradient(180deg, ${s1} 0%, ${s2} 55%, ${s3} 100%)`;
}

export function phaseFromElevation(elevation: number, rising: boolean): SkyPhase {
  if (!Number.isFinite(elevation)) throw new Error("Elevation must be finite");
  return elevation < -6 ? "night" : elevation > 6 ? "day" : rising ? "dawn" : "dusk";
}

export function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge1 <= edge0) throw new Error("smoothstep edges must be increasing");
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function sunBlendFactors(elevation: number) {
  return { nightToTwilight: smoothstep(-8, -4, elevation), twilightToDay: smoothstep(4, 8, elevation) };
}

export function twilightGlowHeight(elevation: number): number {
  return lerp(115, 85, clamp((elevation + 6) / 12, 0, 1));
}

type SunEntity = { entity_id?: string; state?: string; attributes?: Record<string, unknown> | null };

/** The injected Date is interpreted in its local timezone, never with Date.now(). */
export function resolveSunPhase(sun: SunEntity | null | undefined, localClock: Date) {
  const elevation = sun?.attributes?.elevation;
  const minutes = localClock.getHours() * 60 + localClock.getMinutes();
  const clockRising = minutes < 720;
  if ((!sun?.entity_id || sun.entity_id === DEFAULT_SUN_ENTITY_ID) && sun?.state !== "unavailable" && sun?.state !== "unknown" && typeof elevation === "number" && Number.isFinite(elevation)) {
    const rising = typeof sun?.attributes?.rising === "boolean" ? sun.attributes.rising : clockRising;
    return { phase: phaseFromElevation(elevation, rising), rising, elevation, fallback: false };
  }
  const phase: SkyPhase = minutes >= 390 && minutes < 420 ? "dawn" : minutes >= 420 && minutes < 1140 ? "day" : minutes >= 1140 && minutes < 1170 ? "dusk" : "night";
  return { phase, rising: clockRising, elevation: null, fallback: true };
}

/** Pure continuous blend for later rendering; no clocks or animation work. */
export function blendSky(look: SkyLook, elevation: number, rising: boolean, theme: SkyTheme): SkySet {
  if (look === "clear-night") return SKY_TOKENS[theme][look];
  const night = deriveSky(look, "night", theme);
  const twilight = deriveSky(look, rising ? "dawn" : "dusk", theme);
  const day = deriveSky(look, "day", theme);
  const { nightToTwilight, twilightToDay } = sunBlendFactors(elevation);
  const from = elevation < 0 ? night : twilight;
  const to = elevation < 0 ? twilight : day;
  const t = elevation < 0 ? nightToTwilight : twilightToDay;
  return { stops: from.stops.map((c, i) => mixOKLab(c, to.stops[i], t)) as unknown as SkyStops, veilAlpha: lerp(from.veilAlpha, to.veilAlpha, t) };
}

const normalizeState = (state: string) => state.trim().toLowerCase();
export function weatherSkyLook(state: string, phase: SkyPhase): SkyLook {
  switch (normalizeState(state)) {
    case "sunny": case "clear": case "zonnig": return "sunny";
    case "clear-night": return "clear-night";
    case "partlycloudy": return phase === "night" ? "clear-night" : "sunny";
    case "rainy": case "pouring": return "rain";
    case "lightning": case "lightning-rainy": return "storm";
    case "snowy": case "snowy-rainy": case "hail": return "snow";
    case "fog": case "mist": return "fog";
    case "windy": return "windy";
    default: return "cloudy";
  }
}

export type PrecipitationIntensity = "light" | "medium" | "heavy";
export const PARTICLE_CAP = 200;
export const PARTICLE_PARAMETERS = {
  rain: { counts: [40, 90, 160], speeds: [620, 820, 1050], speedVariation: 0.2, strokeLengths: [18, 18, 22], lineWidths: [1, 1.25, 1.5], fps: 30 },
  snow: { counts: [30, 60, 100], speeds: [28, 40, 58], radius: [1.4, 3.5], sway: [6, 14], sidewaysWindFactor: 0.3, fps: 24 },
  hail: { counts: [40, 40, 60], radius: [2.5, 3.5], speed: 380, angle: 0, fps: 30 },
  fog: { bands: 3, speeds: [8, 14], direction: "horizontal", fps: "compositor" },
  lightning: { intervalSeconds: [10, 16], rainyIntervalSeconds: [6, 12], minimumIntervalSeconds: 6, pulseMs: 180, doublePulse: true, peakOpacity: { light: 0.30, dark: 0.24 } },
  wind: { counts: [4, 6, 8], lengths: [50, 120], speedBase: 120, speedPerKmh: 6, fps: 30 },
  prewarm: true, // Later renderers randomize initial phase; no runtime particles here.
} as const;
export const PARTICLE_COLOURS = {
  light: { rain: "rgba(40,62,98,.42)", snow: "#FFFFFF", snowEdge: "rgba(120,140,170,.25)" },
  dark: { rain: "rgba(210,225,255,.38)", snow: "rgba(235,242,255,.95)" },
} as const;

export function precipitationIntensity(precipitation: number, state = ""): PrecipitationIntensity {
  if (["pouring", "lightning-rainy"].includes(normalizeState(state))) return "heavy";
  return precipitation > 2 ? "heavy" : precipitation >= 0.5 ? "medium" : "light";
}

export function windSpeedKmh(speed: number, unit?: string | null): number {
  if (!Number.isFinite(speed) || speed < 0) return 0;
  const u = (unit ?? "m/s").toLowerCase().replace(/\s/g, "");
  if (["km/h", "kmh", "kph"].includes(u)) return speed;
  if (u === "mph") return speed * 1.609344;
  if (["kn", "kt", "knots"].includes(u)) return speed * 0.514444 * 3.6;
  return speed * 3.6;
}

export function areaFactor(area: number): number {
  return clamp(Number.isFinite(area) ? area / 96000 : 1, 0.6, 3);
}

/** Area includes any future overflow zone; the cap is shared, never per layer. */
export function particleCount(base: number, area: number, compact = false): number {
  // Compact counts use a fixed scale instead of the large-tile area factor.
  const scale = compact ? 0.53 : areaFactor(area);
  return Math.min(PARTICLE_CAP, Math.round(Math.max(0, base) * scale));
}

export function rainAngle(windKmh: number): number {
  return clamp(windKmh * 0.6, 0, 25);
}

/** HA bearing is where wind comes FROM (90° east → lee on the left). */
export function overflowMargins(angleDegrees: number, windBearing: number) {
  const lee = Math.min(24, Math.tan(clamp(Math.abs(angleDegrees), 0, 25) * Math.PI / 180) * 40 + 6);
  const horizontal = Math.sin(windBearing * Math.PI / 180);
  return { top: 0, bottom: 40, left: horizontal > 1e-10 ? Math.max(8, lee) : 8, right: horizontal < -1e-10 ? Math.max(8, lee) : 8, fullStrength: 12, fade: 28 };
}

/** Effects describe future rendering only; unknown/exceptional states stay static. */
export function weatherEffects(state: string, precipitation = 0, windKmh = 0, phase: SkyPhase = "day") {
  const s = normalizeState(state);
  const intensity = s === "snowy-rainy" ? "medium" : precipitationIntensity(precipitation, s);
  const rain = ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(s);
  const snow = ["snowy", "snowy-rainy"].includes(s);
  const wind = ["windy", "windy-variant"].includes(s);
  const windBand = windKmh >= 35 ? 2 : windKmh >= 20 ? 1 : 0;
  return {
    intensity, rain, snow, hail: s === "hail", fog: s === "fog" || s === "mist",
    lightning: s === "lightning" || s === "lightning-rainy",
    rainShare: s === "snowy-rainy" ? 0.4 : rain ? 1 : 0,
    snowShare: s === "snowy-rainy" ? 0.6 : snow ? 1 : 0,
    windStreaks: wind ? PARTICLE_PARAMETERS.wind.counts[windBand] : 0,
    windSpeed: wind ? 120 + Math.max(0, windKmh) * 6 : 0,
    cloudDriftMultiplier: wind ? 2 : 1,
    cloudCount: s === "partlycloudy" ? (phase === "night" ? 2 : 3) : s === "sunny" ? 1 : 0,
  };
}

/** CSS source-over in non-linear sRGB; round before WCAG linearization. */
export function compositeHex(source: string, destination: string, alpha: number): string {
  const src = hexToRgb(source);
  const dst = hexToRgb(destination);
  return rgbToHex(src.map((v, i) => lerp(dst[i], v, clamp(alpha, 0, 1))));
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function skyContrast(stop: string, veilAlpha: number, theme: SkyTheme) {
  const text = SKY_TEXT[theme];
  const background = compositeHex(text.veil, stop, veilAlpha);
  return {
    primary: contrastRatio(text.primary, background),
    secondary: contrastRatio(compositeHex(text.secondary, background, text.secondaryAlpha), background),
    ui: contrastRatio(compositeHex(text.secondary, background, text.secondaryAlpha * 0.85), background),
  };
}

export type SkyMotion = "on" | "calm" | "off";

/** Movement is reserved for run C; every mode currently renders a static sky. */
export function normalizeSkyMotion(value: unknown): SkyMotion {
  return value === "calm" || value === "off" ? value : "on";
}

export function skyGlow(look: SkyLook, phase: SkyPhase, theme: SkyTheme, elevation: number | null): string | null {
  const light = theme === "light";
  if (phase === "night") {
    const colour = light ? "rgba(200,210,255,.30)" : "rgba(170,190,255,.16)";
    return `radial-gradient(45% 40% at 79% 34%, ${colour} 0%, transparent 70%)`;
  }
  if (phase === "dawn" || phase === "dusk") {
    const x = phase === "dawn" ? 72 : 78;
    const y = elevation == null ? 108 : twilightGlowHeight(elevation);
    const colour = phase === "dawn"
      ? (light ? "rgba(255,214,170,.9)" : "rgba(255,170,140,.35)")
      : (light ? "rgba(255,170,110,.75)" : "rgba(255,140,90,.38)");
    return `radial-gradient(90% 55% at ${x}% ${y}%, ${colour} 0%, transparent 70%)`;
  }
  if (look === "snow") {
    const colour = light ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.10)";
    return `radial-gradient(60% 50% at 80% 25%, ${colour} 0%, transparent 70%)`;
  }
  if (look === "sunny" || look === "cloudy") {
    const colour = light ? "rgba(255,236,170,.75)" : "rgba(255,214,140,.28)";
    return `radial-gradient(60% 55% at 80% 30%, ${colour} 0%, transparent 70%)`;
  }
  return null;
}

/** Small deterministic integer hash; no render-time randomness or browser APIs. */
function skySeed(index: number, salt: number): number {
  let value = Math.imul(index + 1, 0x45d9f3b) ^ salt;
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 0x100000000;
}

export function skyStars(look: SkyLook, phase: SkyPhase, large: boolean) {
  const count = phase !== "night" ? 0 : look === "clear-night" ? (large ? 34 : 20) : look === "cloudy" ? 10 : 0;
  const topLimit = look === "cloudy" ? 40 : 78;
  return Array.from({ length: count }, (_, index) => ({
    x: 2 + skySeed(index, 17) * 96,
    y: 2 + skySeed(index, 911) * (topLimit - 2),
    size: index % 7 === 0 ? 1.6 : 1,
    alpha: 0.35 + skySeed(index, 413) * 0.55,
  }));
}

const SKY_CLOUDS = {
  sunny: [1, 0.55], cloudy: [4, 0.9], rain: [4, 0.9], storm: [5, 1],
  snow: [3, 0.8], fog: [2, 0.5], "clear-night": [0, 1], windy: [3, 0.75],
} as const;
const CLOUD_CENTRES = [[78, 18], [30, 8], [96, 46], [55, 30], [12, 40]] as const;

export function skyClouds(look: SkyLook, phase: SkyPhase, theme: SkyTheme, large: boolean, state = "") {
  let count: number = SKY_CLOUDS[look][0];
  if (look === "cloudy" && phase === "night") count = 3;
  if (look === "sunny" && (phase === "dawn" || phase === "dusk")) count = 2;
  if (normalizeState(state) === "partlycloudy") {
    count = phase === "night" ? 2 : phase === "day" ? 3 : 2;
  }
  const light = theme === "light";
  const colour = look === "storm" ? (light ? "rgba(70,80,100,.42)" : "rgba(120,132,155,.30)")
    : look === "rain" ? (light ? "rgba(120,135,158,.40)" : "rgba(150,165,190,.20)")
    : phase === "night" ? (light ? "rgba(170,180,210,.30)" : "rgba(150,165,200,.14)")
    : phase === "dawn" || phase === "dusk" ? (light ? "rgba(255,240,240,.62)" : "rgba(240,190,200,.16)")
    : light ? "rgba(255,255,255,.78)" : "rgba(185,200,225,.18)";
  // Partly cloudy at night has clouds on the otherwise cloud-free clear-night set.
  const scale = look === "clear-night" && count > 0 ? 0.55 : SKY_CLOUDS[look][1];
  return Array.from({ length: count }, (_, index) => {
    const width = (70 + skySeed(index, 73) * 40) * scale * (large ? 1 : 0.8);
    const [x, y] = CLOUD_CENTRES[index];
    const blob = (cx: number, cy: number) => `radial-gradient(ellipse 27% 38% at ${cx}% ${cy}%, ${colour} 0%, ${colour} 45%, transparent 100%)`;
    return { x, y, width, height: width * 0.42, colour,
      background: `${blob(28, 62)}, ${blob(52, 40)}, ${blob(73, 62)}` };
  });
}

export function skyFogBands(look: SkyLook, theme: SkyTheme): string[] {
  if (look !== "fog") return [];
  const alphas = theme === "light" ? [0.45, 0.60, 0.70] : [0.16, 0.22, 0.28];
  return alphas.map((alpha, index) => {
    const colour = theme === "light" ? `rgba(255,255,255,${alpha})` : `rgba(190,198,210,${alpha})`;
    return `radial-gradient(120% 22% at ${30 + index * 25}% ${30 + index * 26}%, ${colour} 0%, transparent 100%)`;
  });
}
