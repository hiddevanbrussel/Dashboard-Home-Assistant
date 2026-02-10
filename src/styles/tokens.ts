/**
 * Design tokens for Home Assistant Dashboard Builder.
 * Matches reference images: light (warm off-white, yellow/purple/orange) and dark (blue-green, neon green/orange).
 */

export const tokens = {
  colors: {
    light: {
      pageBg: "#F7F4EA",
      heroOverlay: "rgba(100, 120, 140, 0.35)",
      accentYellow: "#F6D25C",
      accentPurple: "#B48BFF",
      accentOrange: "#F2A654",
      glassBorder: "rgba(255, 255, 255, 0.6)",
    },
    dark: {
      pageBg: "#1F2F3A",
      cardBg: "rgba(43, 63, 75, 0.85)",
      cardSolid: "#2B3F4B",
      accentGreen: "#6BE46B",
      accentOrange: "#F2A654",
      glassBorder: "rgba(255, 255, 255, 0.08)",
    },
  },
  radius: {
    card: 24,
    cardMin: 22,
    cardMax: 28,
    pill: 9999,
  },
  blur: {
    glass: 12,
  },
  shadow: {
    glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
    glassDark: "0 8px 32px rgba(0, 0, 0, 0.25)",
  },
  typography: {
    heroTitle: { fontSize: "44px", fontWeight: 700 },
    heroTitleMin: 40,
    heroTitleMax: 48,
    subtitle: { fontSize: "20px", lineHeight: 1.4 },
    subtitleMin: 18,
    subtitleMax: 22,
    cardTitle: { fontSize: "15px", fontWeight: 500 },
    cardTitleMin: 14,
    cardTitleMax: 16,
    metric: { fontSize: "52px", fontWeight: 700 },
    metricMin: 44,
    metricMax: 64,
  },
  transition: {
    theme: "300ms ease",
    hover: "150ms ease",
  },
} as const;

export type ThemeMode = "light" | "dark" | "auto";
