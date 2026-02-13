const STORAGE_KEY_DELAY = "dashboard.screensaverDelaySeconds";
const STORAGE_KEY_LEGACY_MINUTES = "dashboard.screensaverMinutes";
const STORAGE_KEY_BACKGROUND = "dashboard.screensaverBackground";

/** Screensaver timeout in seconden. 0 = disabled. */
export function getScreensaverDelaySeconds(): number {
  if (typeof window === "undefined") return 0;
  try {
    let v = localStorage.getItem(STORAGE_KEY_DELAY);
    if (v === null) {
      const legacy = localStorage.getItem(STORAGE_KEY_LEGACY_MINUTES);
      if (legacy !== null) {
        const min = parseInt(legacy, 10);
        if (Number.isFinite(min) && min >= 0) {
          const sec = min * 60;
          localStorage.setItem(STORAGE_KEY_DELAY, String(sec));
          localStorage.removeItem(STORAGE_KEY_LEGACY_MINUTES);
          return sec;
        }
      }
      return 0;
    }
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function setScreensaverDelaySeconds(seconds: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_DELAY, String(Math.max(0, Math.round(seconds))));
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}

/** Screensaver background image URL. Empty string = geen afbeelding. */
export function getScreensaverBackgroundImage(): string {
  if (typeof window === "undefined") return "";
  try {
    const v = localStorage.getItem(STORAGE_KEY_BACKGROUND);
    return typeof v === "string" ? v : "";
  } catch {
    return "";
  }
}

export function setScreensaverBackgroundImage(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_BACKGROUND, url || "");
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}

const STORAGE_KEY_CLOCK24 = "dashboard.screensaverClock24h";

/** Klok 24-uurs (true) of 12-uurs am/pm (false). Default true. */
export function getScreensaverClock24h(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_KEY_CLOCK24);
    if (v === "false") return false;
    if (v === "true") return true;
    return true;
  } catch {
    return true;
  }
}

export function setScreensaverClock24h(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_CLOCK24, value ? "true" : "false");
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}

const STORAGE_KEY_WEATHER_ENTITY = "dashboard.screensaverWeatherEntityId";

/** Weather entity voor screensaver (bijv. weather.home). Leeg = fallback naar header-temperatuurentity. */
export function getScreensaverWeatherEntityId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY_WEATHER_ENTITY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function setScreensaverWeatherEntityId(entityId: string | null): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEATHER_ENTITY, entityId ?? "");
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}

const STORAGE_KEY_PEXELS_ENABLED = "dashboard.screensaverPexelsEnabled";
const STORAGE_KEY_PEXELS_QUERY = "dashboard.screensaverPexelsQuery";
const STORAGE_KEY_PEXELS_API_KEY = "dashboard.screensaverPexelsApiKey";

/** Pexels-foto's gebruiken als screensaver-achtergrond (alleen als er geen custom afbeelding is). */
export function getScreensaverPexelsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY_PEXELS_ENABLED) === "true";
  } catch {
    return false;
  }
}

export function setScreensaverPexelsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_PEXELS_ENABLED, enabled ? "true" : "false");
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}

/** Zoekterm voor Pexels (bijv. "nature landscape", "mountains"). */
export function getScreensaverPexelsQuery(): string {
  if (typeof window === "undefined") return "nature landscape";
  try {
    const v = localStorage.getItem(STORAGE_KEY_PEXELS_QUERY);
    return typeof v === "string" && v.trim() ? v.trim() : "nature landscape";
  } catch {
    return "nature landscape";
  }
}

export function setScreensaverPexelsQuery(query: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_PEXELS_QUERY, query.trim() || "nature landscape");
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}

/** Pexels API-key (gratis op pexels.com/api). Opgeslagen lokaal, niet op de server. */
export function getScreensaverPexelsApiKey(): string {
  if (typeof window === "undefined") return "";
  try {
    const v = localStorage.getItem(STORAGE_KEY_PEXELS_API_KEY);
    return typeof v === "string" ? v : "";
  } catch {
    return "";
  }
}

export function setScreensaverPexelsApiKey(apiKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_PEXELS_API_KEY, apiKey.trim());
    window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
  } catch {
    // ignore
  }
}
