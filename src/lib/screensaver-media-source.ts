export const SCREENSAVER_MEDIA_SOURCES = ["custom", "pexels", "immich"] as const;

export type ScreensaverMediaSource = (typeof SCREENSAVER_MEDIA_SOURCES)[number];

export function isScreensaverMediaSource(value: string | null | undefined): value is ScreensaverMediaSource {
  return value === "custom" || value === "pexels" || value === "immich";
}

/** Map a stored value (or pre-source settings) onto an explicit screensaver media source. */
export function migrateScreensaverMediaSource(input: {
  stored: string | null;
  customUrl: string;
  pexelsEnabled: boolean;
}): ScreensaverMediaSource {
  if (isScreensaverMediaSource(input.stored)) return input.stored;
  if (input.customUrl.trim()) return "custom";
  if (input.pexelsEnabled) return "pexels";
  return "custom";
}

export type ScreensaverPlayback =
  | { mode: "custom"; url: string }
  | { mode: "pexels-photo" }
  | { mode: "pexels-video" }
  | { mode: "immich-photo" }
  | { mode: "immich-video" }
  | { mode: "default" };

export function isPexelsSourceReady(enabled: boolean, apiKey: string): boolean {
  return enabled && apiKey.trim().length > 0;
}

export function isImmichSourceReady(enabled: boolean, baseUrl: string, apiKey: string): boolean {
  return enabled && baseUrl.trim().length > 0 && apiKey.trim().length > 0;
}

export function resolveScreensaverPlayback(input: {
  source: ScreensaverMediaSource;
  customUrl: string;
  pexelsEnabled: boolean;
  pexelsKey: string;
  pexelsType: "photo" | "video";
  immichEnabled: boolean;
  immichUrl: string;
  immichKey: string;
  immichType: "photo" | "video";
}): ScreensaverPlayback {
  if (input.source === "custom") {
    const url = input.customUrl.trim();
    return url ? { mode: "custom", url } : { mode: "default" };
  }
  if (input.source === "pexels") {
    if (!isPexelsSourceReady(input.pexelsEnabled, input.pexelsKey)) return { mode: "default" };
    return input.pexelsType === "video" ? { mode: "pexels-video" } : { mode: "pexels-photo" };
  }
  if (input.source === "immich") {
    if (!isImmichSourceReady(input.immichEnabled, input.immichUrl, input.immichKey)) {
      return { mode: "default" };
    }
    return input.immichType === "video" ? { mode: "immich-video" } : { mode: "immich-photo" };
  }
  return { mode: "default" };
}
