import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme
        page: {
          DEFAULT: "#F7F4EA",
          light: "#F7F4EA",
        },
        hero: {
          overlay: "rgba(100, 120, 140, 0.35)",
        },
        accent: {
          yellow: "#F6D25C",
          purple: "#B48BFF",
          orange: "#F2A654",
          green: "#6BE46B",
        },
        // Dark theme (used via dark:)
        dark: {
          page: "#1F2F3A",
          card: "rgba(43, 63, 75, 0.85)",
          cardSolid: "#2B3F4B",
        },
      },
      borderRadius: {
        card: "24px",
        pill: "9999px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        glass: "12px",
      },
      fontSize: {
        "hero-title": ["2.75rem", { lineHeight: "1.2" }],
        "hero-subtitle": ["1.125rem", { lineHeight: "1.4" }],
        "card-title": ["0.9375rem", { lineHeight: "1.3" }],
        "metric": ["3rem", { lineHeight: "1.1" }],
      },
      transitionProperty: {
        theme: "background-color, color, border-color, box-shadow",
      },
      transitionDuration: {
        theme: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
