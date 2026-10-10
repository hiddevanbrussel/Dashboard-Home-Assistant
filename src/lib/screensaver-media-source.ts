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
  if (isScreensaverMediaSource(input.stored)) {
    // Soft upgrade: Pexels app enabled, no custom image, source still "custom"
    // (common after Docker PEXELS_API_KEY + Apps toggle without picking a source).
    if (input.stored === "custom" && input.pexelsEnabled && !input.customUrl.trim()) {
      return "pexels";
    }
    return input.stored;
  }
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

export function isPexelsSourceReady(
  enabled: boolean,
  apiKey: string,
  envConfigured = false
): boolean {
  return enabled && (apiKey.trim().length > 0 || envConfigured);
}

export function isImmichSourceReady(
  enabled: boolean,
  baseUrl: string,
  apiKey: string,
  /** True when Docker/server has IMMICH_API_KEY (client key optional). */
  envKeyConfigured = false,
  /** True when Docker/server has IMMICH_URL (client URL optional). */
  envUrlConfigured = false
): boolean {
  const hasUrl = baseUrl.trim().length > 0 || envUrlConfigured;
  const hasKey = apiKey.trim().length > 0 || envKeyConfigured;
  return enabled && hasUrl && hasKey;
}

export function resolveScreensaverPlayback(input: {
  source: ScreensaverMediaSource;
  customUrl: string;
  pexelsEnabled: boolean;
  pexelsKey: string;
  pexelsType: "photo" | "video";
  /** True when Docker/server has PEXELS_API_KEY (client key optional). */
  pexelsEnvConfigured?: boolean;
  immichEnabled: boolean;
  immichUrl: string;
  immichKey: string;
  immichType: "photo" | "video";
  /** True when Docker/server has IMMICH_API_KEY (client key optional). */
  immichEnvKeyConfigured?: boolean;
  /** True when Docker/server has IMMICH_URL (client URL optional). */
  immichEnvUrlConfigured?: boolean;
}): ScreensaverPlayback {
  if (input.source === "custom") {
    const url = input.customUrl.trim();
    return url ? { mode: "custom", url } : { mode: "default" };
  }
  if (input.source === "pexels") {
    if (!isPexelsSourceReady(input.pexelsEnabled, input.pexelsKey, input.pexelsEnvConfigured)) {
      return { mode: "default" };
    }
    return input.pexelsType === "video" ? { mode: "pexels-video" } : { mode: "pexels-photo" };
  }
  if (input.source === "immich") {
    if (
      !isImmichSourceReady(
        input.immichEnabled,
        input.immichUrl,
        input.immichKey,
        input.immichEnvKeyConfigured,
        input.immichEnvUrlConfigured
      )
    ) {
      return { mode: "default" };
    }
    return input.immichType === "video" ? { mode: "immich-video" } : { mode: "immich-photo" };
  }
  return { mode: "default" };
}
