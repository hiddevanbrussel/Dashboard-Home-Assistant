import { describe, expect, it } from "vitest";
import {
  ENERGY_CACHE_CLOSED_TTL_MS,
  ENERGY_CACHE_MAX,
  ENERGY_CACHE_RUNNING_TTL_MS,
  createEnergyCache,
  energyCacheKey,
  energyCacheTtlMs,
  hashStatisticIds,
} from "./energy-cache";

describe("energy cache", () => {
  it("expires a running period after 60 seconds and a closed period after an hour", () => {
    let now = 1_000_000;
    const cache = createEnergyCache<string>({ now: () => now });
    const runningKey = energyCacheKey("conn-a", hashStatisticIds(["sensor.grid_import"], "change"), "hour", "start-open");
    const closedKey = energyCacheKey("conn-a", hashStatisticIds(["sensor.grid_import"], "change"), "hour", "start-closed");
    cache.set(runningKey, "open", ENERGY_CACHE_RUNNING_TTL_MS);
    cache.set(closedKey, "closed", ENERGY_CACHE_CLOSED_TTL_MS);

    now += ENERGY_CACHE_RUNNING_TTL_MS - 1;
    expect(cache.get(runningKey)).toBe("open");
    expect(cache.get(closedKey)).toBe("closed");

    now += 1;
    expect(cache.get(runningKey)).toBeUndefined();
    expect(cache.get(closedKey)).toBe("closed");

    now += ENERGY_CACHE_CLOSED_TTL_MS;
    expect(cache.get(closedKey)).toBeUndefined();
  });

  it("chooses the ttl from whether the window still covers now", () => {
    const now = 5_000_000;
    expect(energyCacheTtlMs(now - 30 * 60_000, now, now)).toBe(ENERGY_CACHE_RUNNING_TTL_MS);
    expect(energyCacheTtlMs(now - 86_400_000, now - 3_600_000, now)).toBe(ENERGY_CACHE_CLOSED_TTL_MS);
  });

  it("isolates keys by connection, ids, period, and start", () => {
    const ids = hashStatisticIds(["sensor.b", "sensor.a"]);
    const otherIds = hashStatisticIds(["sensor.a"]);
    expect(hashStatisticIds(["sensor.b", "sensor.a"])).toBe(ids);
    const base = energyCacheKey("conn-a", ids, "hour", "2026-01-15T00:00:00+01:00");
    expect(energyCacheKey("conn-b", ids, "hour", "2026-01-15T00:00:00+01:00")).not.toBe(base);
    expect(energyCacheKey("conn-a", otherIds, "hour", "2026-01-15T00:00:00+01:00")).not.toBe(base);
    expect(energyCacheKey("conn-a", ids, "5minute", "2026-01-15T00:00:00+01:00")).not.toBe(base);
    expect(energyCacheKey("conn-a", ids, "hour", "2026-01-15T01:00:00+01:00")).not.toBe(base);

    let now = 0;
    const cache = createEnergyCache<string>({ now: () => now });
    cache.set(base, "a", 60_000);
    cache.set(energyCacheKey("conn-b", ids, "hour", "2026-01-15T00:00:00+01:00"), "b", 60_000);
    expect(cache.get(base)).toBe("a");
    expect(cache.get(energyCacheKey("conn-b", ids, "hour", "2026-01-15T00:00:00+01:00"))).toBe("b");
  });

  it("evicts the least recently used entry past 200", () => {
    let now = 0;
    const cache = createEnergyCache<number>({ max: ENERGY_CACHE_MAX, now: () => now });
    for (let index = 0; index < ENERGY_CACHE_MAX; index += 1) {
      cache.set(`k${index}`, index, 60_000);
    }
    expect(cache.get("k0")).toBe(0);
    cache.set("fresh", 1, 60_000);
    expect(cache.size()).toBe(ENERGY_CACHE_MAX);
    expect(cache.get("k0")).toBe(0);
    expect(cache.get("k1")).toBeUndefined();
    expect(cache.get("fresh")).toBe(1);
  });
});
