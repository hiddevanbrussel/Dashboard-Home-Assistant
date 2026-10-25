/**
 * The active UI language must be the same on the server and in the first client render,
 * or React reports a text hydration error (#278). The server cannot read localStorage,
 * so the choice is mirrored in a cookie, and `<html lang>` follows it (#284).
 */

export type Language = "en" | "nl";

export const LANGUAGE_COOKIE = "dashboard-language";
/** One year; the choice is renewed on every change. */
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseLanguage(value: unknown): Language | null {
  if (typeof value !== "string") return null;
  const lower = value.trim().toLowerCase();
  return lower === "nl" || lower === "en" ? lower : null;
}

/** Cookie first, then the runtime default (add-on option or Docker env), then English. */
export function resolveLanguage(cookieValue: string | null | undefined, envDefault: string | null | undefined): Language {
  return parseLanguage(cookieValue) ?? parseLanguage(envDefault) ?? "en";
}

export function languageCookie(language: Language): string {
  return `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=${LANGUAGE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** The language zustand persisted before the cookie existed (`{"state":{"language":"nl"}}`). */
export function readPersistedLanguage(raw: string | null | undefined): Language | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { state?: { language?: unknown } };
    return parseLanguage(parsed?.state?.language);
  } catch {
    return null;
  }
}
