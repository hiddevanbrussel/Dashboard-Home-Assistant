export const GLASS_DENSITIES = ["off", "low", "medium", "high"] as const;

export type GlassDensity = (typeof GLASS_DENSITIES)[number];

export const DEFAULT_GLASS_DENSITY: GlassDensity = "medium";

export const GLASS_DENSITY_ATTR = "data-glass-density";

/** CSS custom-property values per density level (blur / opacity / saturation). */
export const GLASS_DENSITY_VARS: Record<
  GlassDensity,
  { blur: string; opacity: string; opacityDark: string; saturation: string }
> = {
  off: {
    blur: "0px",
    opacity: "0.92",
    opacityDark: "0.94",
    saturation: "100%",
  },
  low: {
    blur: "8px",
    opacity: "0.45",
    opacityDark: "0.5",
    saturation: "120%",
  },
  medium: {
    blur: "24px",
    opacity: "0.7",
    opacityDark: "0.72",
    saturation: "140%",
  },
  high: {
    blur: "40px",
    opacity: "0.82",
    opacityDark: "0.86",
    saturation: "180%",
  },
};

export function isGlassDensity(value: unknown): value is GlassDensity {
  return typeof value === "string" && (GLASS_DENSITIES as readonly string[]).includes(value);
}

export function getGlassDensityOrDefault(value: unknown): GlassDensity {
  return isGlassDensity(value) ? value : DEFAULT_GLASS_DENSITY;
}

/** Apply density CSS vars + attribute on documentElement. */
export function applyGlassDensity(density: GlassDensity) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const vars = GLASS_DENSITY_VARS[density];
  root.setAttribute(GLASS_DENSITY_ATTR, density);
  root.style.setProperty("--glass-blur", vars.blur);
  root.style.setProperty("--glass-opacity", vars.opacity);
  root.style.setProperty("--glass-opacity-dark", vars.opacityDark);
  root.style.setProperty("--glass-saturation", vars.saturation);
}
