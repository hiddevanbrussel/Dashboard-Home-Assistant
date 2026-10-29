/**
 * LRU cache for recorder statistics.
 * A period that still contains "now" lives for 60 seconds. A closed period lives for an hour.
 * The key is connection id, a hash of the statistic ids, the period, and the start.
 */

import { createHash } from "node:crypto";

export const ENERGY_CACHE_MAX = 200;
export const ENERGY_CACHE_RUNNING_TTL_MS = 60_000;
export const ENERGY_CACHE_CLOSED_TTL_MS = 3_600_000;

type Entry<T> = { value: T; expiresAt: number };

export type EnergyCache<T> = {
  get(key: string): T | undefined;
  set(key: string, value: T, ttlMs: number): void;
  size(): number;
  clear(): void;
};

export function createEnergyCache<T>(options?: { max?: number; now?: () => number }): EnergyCache<T> {
  const max = options?.max ?? ENERGY_CACHE_MAX;
  const now = options?.now ?? Date.now;
  const map = new Map<string, Entry<T>>();

  return {
    get(key: string): T | undefined {
      const hit = map.get(key);
      if (!hit) return undefined;
      if (hit.expiresAt <= now()) {
        map.delete(key);
        return undefined;
      }
      map.delete(key);
      map.set(key, hit);
      return hit.value;
    },
    set(key: string, value: T, ttlMs: number) {
      if (map.has(key)) map.delete(key);
      map.set(key, { value, expiresAt: now() + ttlMs });
      while (map.size > max) {
        const oldest = map.keys().next().value;
        if (oldest === undefined) break;
        map.delete(oldest);
      }
    },
    size() {
      return map.size;
    },
    clear() {
      map.clear();
    },
  };
}

export function hashStatisticIds(ids: readonly string[], extra = ""): string {
  const ordered = [...ids].sort();
  return createHash("sha256").update(`${extra}\n${ordered.join("\n")}`).digest("hex");
}

export function energyCacheKey(connectionId: string, idsHash: string, period: string, start: string): string {
  return `${connectionId}\n${idsHash}\n${period}\n${start}`;
}

/**
 * 60 seconds while the requested window still covers now, otherwise an hour.
 * `endMs` equal to now still counts as running: that request is the open hour.
 */
export function energyCacheTtlMs(startMs: number, endMs: number, nowMs: number): number {
  const running = startMs <= nowMs && endMs >= nowMs - 1000;
  return running ? ENERGY_CACHE_RUNNING_TTL_MS : ENERGY_CACHE_CLOSED_TTL_MS;
}

export const energyStatisticsCache = createEnergyCache<unknown>({ max: ENERGY_CACHE_MAX });

export function clearEnergyStatisticsCache(): void {
  energyStatisticsCache.clear();
}
