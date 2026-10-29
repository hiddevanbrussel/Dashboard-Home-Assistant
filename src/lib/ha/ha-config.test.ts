import { afterEach, describe, expect, it, vi } from "vitest";
import { FALLBACK_TIME_ZONE } from "../local-date";
import { clearHaTimeZoneCache, getHaTimeZone } from "./ha-config";

const TOKEN = "ha-timezone-token-do-not-leak";

describe("getHaTimeZone", () => {
  afterEach(() => {
    clearHaTimeZoneCache();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("reads time_zone from /api/config and caches it for an hour", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
      return new Response(JSON.stringify({ time_zone: "Pacific/Auckland" }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const config = { baseUrl: "http://ha.local:8123/", token: TOKEN };
    await expect(getHaTimeZone(config, 0)).resolves.toBe("Pacific/Auckland");
    await expect(getHaTimeZone(config, 60 * 60 * 1000 - 1)).resolves.toBe("Pacific/Auckland");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await expect(getHaTimeZone(config, 60 * 60 * 1000)).resolves.toBe("Pacific/Auckland");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe("http://ha.local:8123/api/config");
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get("authorization")).toBe(`Bearer ${TOKEN}`);
  });

  it("falls back to Europe/Amsterdam and does not cache a failure", async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(new Response(JSON.stringify({ time_zone: "Not/AZone" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ time_zone: "UTC" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const config = { baseUrl: "http://supervisor/core", token: TOKEN };
    await expect(getHaTimeZone(config, 0)).resolves.toBe(FALLBACK_TIME_ZONE);
    await expect(getHaTimeZone(config, 1)).resolves.toBe(FALLBACK_TIME_ZONE);
    await expect(getHaTimeZone(config, 2)).resolves.toBe("UTC");
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe("http://supervisor/core/api/config");
  });

  it("returns only the timezone", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ time_zone: "Europe/Amsterdam", access_token: TOKEN }), { status: 200 }))
    );
    const zone = await getHaTimeZone({ baseUrl: "http://supervisor/core", token: TOKEN }, 10);
    expect(zone).toBe("Europe/Amsterdam");
    expect(zone).not.toContain(TOKEN);
  });

  it("keeps a cached timezone when a later read fails", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ time_zone: "Pacific/Auckland" }), { status: 200 }))
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    const config = { baseUrl: "http://ha.local:8123", token: TOKEN };
    await expect(getHaTimeZone(config, 0)).resolves.toBe("Pacific/Auckland");
    await expect(getHaTimeZone(config, 60 * 60 * 1000)).resolves.toBe("Pacific/Auckland");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
