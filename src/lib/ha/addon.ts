/**
 * Home Assistant Supervisor / App (addon) helpers.
 * When installed via the HA App Store with homeassistant_api: true,
 * Supervisor injects SUPERVISOR_TOKEN and the Core API is reachable at
 * http://supervisor/core (same paths as a normal HA base URL: /api/...).
 */

export const SUPERVISOR_CORE_URL = "http://supervisor/core";

export type AddonHaConfig = {
  baseUrl: string;
  token: string;
};

export function getSupervisorToken(): string | null {
  const token =
    process.env.HA_SUPERVISOR_TOKEN?.trim() ||
    process.env.SUPERVISOR_TOKEN?.trim() ||
    "";
  return token || null;
}

/** True when running inside the Home Assistant addon container. */
export function isHaAddon(): boolean {
  return process.env.HA_ADDON === "1" || process.env.HA_ADDON === "true";
}

export function isSupervisorBaseUrl(baseUrl: string): boolean {
  const u = baseUrl.trim().replace(/\/+$/, "").toLowerCase();
  return u === SUPERVISOR_CORE_URL || u === "http://supervisor/core/api";
}

/** Live credentials from the Supervisor environment, or null. */
export function getAddonHaConfig(): AddonHaConfig | null {
  if (!isHaAddon()) return null;
  const token = getSupervisorToken();
  if (!token) return null;
  return { baseUrl: SUPERVISOR_CORE_URL, token };
}
