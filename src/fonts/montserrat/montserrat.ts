import localFont from "next/font/local";

/**
 * Latin Montserrat variable file, byte-identical to the woff2 Google Fonts
 * serves for this subset. One file is preloaded.
 *
 * Separate faces for 500, 600, 800 and 900 — the weights the clock, the
 * screensaver and the settings previews actually use (medium, the 12-hour
 * suffix, extrabold, black). Weight 700 is not a face, so font-bold still
 * resolves to 800. latin-ext, vietnamese, cyrillic and cyrillic-ext are not
 * shipped; NL/EN text stays inside the latin unicode-range.
 */
export const montserrat = localFont({
  src: [
    { path: "./montserrat-latin-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-latin-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "./montserrat-latin-wght-normal.woff2", weight: "800", style: "normal" },
    { path: "./montserrat-latin-wght-normal.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});
