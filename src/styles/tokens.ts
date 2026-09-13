/**
 * Design tokens aligned with omnidocs.com color usage:
 * electric purple surfaces, cool lavender page, near-black CTAs.
 */

export const tokens = {
  colors: {
    light: {
      pageBg: "#F2F0FE",
      heroOverlay: "rgba(71, 0, 181, 0.28)",
      brand: "#4700B5",
      accentYellow: "#F6D25C",
      accentPurple: "#B59ED8",
      accentOrange: "#F2A654",
      glassBorder: "rgba(255, 255, 255, 0.6)",
    },
    dark: {
      pageBg: "#0A0014",
      cardBg: "rgba(71, 0, 181, 0.28)",
      cardSolid: "#1C0A3A",
      accentGreen: "#6BE46B",
      accentOrange: "#F2A654",
      glassBorder: "rgba(255, 255, 255, 0.10)",
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
    glass: "0 8px 32px rgba(71, 0, 181, 0.08)",
    glassDark: "0 8px 32px rgba(0, 0, 0, 0.35)",
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
