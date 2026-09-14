export type Rgb = readonly [number, number, number];

export const THEME_ACCENTS = [
  { id: "purple", rgb: [71, 0, 181] as Rgb, muted: [131, 87, 190] as Rgb },
  { id: "indigo", rgb: [67, 56, 202] as Rgb, muted: [130, 123, 214] as Rgb },
  { id: "blue", rgb: [29, 78, 216] as Rgb, muted: [107, 138, 223] as Rgb },
  { id: "teal", rgb: [15, 118, 110] as Rgb, muted: [98, 163, 158] as Rgb },
  { id: "green", rgb: [21, 128, 61] as Rgb, muted: [102, 169, 127] as Rgb },
  { id: "orange", rgb: [194, 65, 12] as Rgb, muted: [216, 135, 101] as Rgb },
  { id: "rose", rgb: [190, 18, 60] as Rgb, muted: [214, 105, 132] as Rgb },
  { id: "fuchsia", rgb: [162, 28, 175] as Rgb, muted: [196, 111, 204] as Rgb },
] as const;

export type ThemeAccentId = (typeof THEME_ACCENTS)[number]["id"];

export const DEFAULT_THEME_ACCENT: ThemeAccentId = "purple";

export function isThemeAccentId(value: unknown): value is ThemeAccentId {
  return THEME_ACCENTS.some((accent) => accent.id === value);
}

export function getThemeAccent(id: string | undefined) {
  return THEME_ACCENTS.find((accent) => accent.id === id) ?? THEME_ACCENTS[0];
}

export function themeAccentCssVars(id: string | undefined) {
  const accent = getThemeAccent(id);
  return {
    "--brand": accent.rgb.join(" "),
    "--brand-muted": accent.muted.join(" "),
  } as const;
}

export function applyThemeAccent(id: string | undefined) {
  if (typeof document === "undefined") return;
  const vars = themeAccentCssVars(id);
  const root = document.documentElement;
  root.style.setProperty("--brand", vars["--brand"]);
  root.style.setProperty("--brand-muted", vars["--brand-muted"]);
}

export function accentRgbCss(rgb: Rgb) {
  return `rgb(${rgb.join(" ")})`;
}
