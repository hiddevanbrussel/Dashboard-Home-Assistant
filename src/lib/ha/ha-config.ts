/**
 * Home Assistant timezone from GET /api/config.
 * Cached per base URL for one hour. A failure falls back to Europe/Amsterdam.
 * Also works for the add-on base URL http://supervisor/core.
 * Server-side only: the token stays on the Authorization header.
 */

import { FALLBACK_TIME_ZONE, isValidTimeZone } from "../local-date";

const CACHE_MS = 60 * 60 * 1000;

type CacheHit = { zone: string; at: number };

const cache = new Map<string, CacheHit>();

export type HaTimeZoneConfig = { baseUrl: string; token: string };

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, "");
}

export function clearHaTimeZoneCache(): void {
  cache.clear();
}

export async function getHaTimeZone(config: HaTimeZoneConfig, now = Date.now()): Promise<string> {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const hit = cache.get(baseUrl);
  if (hit && now - hit.at < CACHE_MS) return hit.zone;

  try {
    const response = await fetch(`${baseUrl}/api/config`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) return hit?.zone ?? FALLBACK_TIME_ZONE;
    const body = (await response.json()) as { time_zone?: unknown };
    const zone = typeof body.time_zone === "string" ? body.time_zone.trim() : "";
    if (!zone || !isValidTimeZone(zone)) return hit?.zone ?? FALLBACK_TIME_ZONE;
    cache.set(baseUrl, { zone, at: now });
    return zone;
  } catch {
    return hit?.zone ?? FALLBACK_TIME_ZONE;
  }
}
