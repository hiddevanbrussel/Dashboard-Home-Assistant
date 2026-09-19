import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: {
          DEFAULT: "#F2F0FE",
          light: "#F2F0FE",
        },
        hero: {
          overlay: "rgb(var(--brand) / 0.28)",
        },
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          muted: "rgb(var(--brand-muted) / <alpha-value>)",
          faint: "#F2F0FE",
        },
        accent: {
          yellow: "#F6D25C",
          purple: "#B59ED8",
          orange: "#F2A654",
          green: "#6BE46B",
        },
        dark: {
          page: "#0A0014",
          card: "rgb(var(--brand) / 0.28)",
          cardSolid: "#1C0A3A",
        },
      },
      borderRadius: {
        card: "24px",
        pill: "9999px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(71, 0, 181, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.35)",
      },
      backdropBlur: {
        glass: "12px",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
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
