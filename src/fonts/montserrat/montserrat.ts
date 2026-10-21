import localFont from "next/font/local";

/**
 * Self-hosted Montserrat variable files, the same woff2 files Google Fonts
 * served for weights 500, 600, 800 and 900. Each weight is its own @font-face
 * so font-weight 700 still resolves to 800, matching that CSS.
 * Latin is listed first for each weight so Latin glyphs come from the latin
 * subset. Other subset files cover the remaining Google unicode ranges.
 * Only one family is registered, under --font-montserrat.
 */
export const montserrat = localFont({
  src: [
    { path: "./montserrat-latin-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-latin-ext-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-vietnamese-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-cyrillic-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-cyrillic-ext-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-latin-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-latin-ext-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-vietnamese-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-cyrillic-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-cyrillic-ext-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-latin-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "./montserrat-latin-ext-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "./montserrat-vietnamese-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "./montserrat-cyrillic-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "./montserrat-cyrillic-ext-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "./montserrat-latin-wght-normal.woff2", weight: "900", style: "normal" },
    { path: "./montserrat-latin-ext-wght-normal.woff2", weight: "900", style: "normal" },
    { path: "./montserrat-vietnamese-wght-normal.woff2", weight: "900", style: "normal" },
    { path: "./montserrat-cyrillic-wght-normal.woff2", weight: "900", style: "normal" },
    { path: "./montserrat-cyrillic-ext-wght-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});
