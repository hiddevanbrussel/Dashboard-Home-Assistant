import type { Language } from "./language";

/** English is opt-in; preserve the Dutch dev preview for every other query value. */
export function previewLanguage(value: string | null): Language {
  return value === "en" ? "en" : "nl";
}
