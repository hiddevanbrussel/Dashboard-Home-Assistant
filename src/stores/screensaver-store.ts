const STORAGE_KEY_MINUTES = "dashboard.screensaverMinutes";
const STORAGE_KEY_BACKGROUND = "dashboard.screensaverBackground";

/** Screensaver timeout in minutes. 0 = disabled. */
export function getScreensaverMinutes(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = localStorage.getItem(STORAGE_KEY_MINUTES);
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function setScreensaverMinutes(minutes: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_MINUTES, String(Math.max(0, Math.round(minutes))));
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
