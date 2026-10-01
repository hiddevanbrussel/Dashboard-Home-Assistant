import { describe, it, expect, vi } from "vitest";
import {
  buildPexelsCuratedUrl,
  buildPexelsSearchUrl,
  classifyPexelsHttpStatus,
  fetchPexelsRandomPage,
  pickPexelsPage,
  pickRandomItem,
  resolvePexelsApiKey,
} from "./pexels";

describe("resolvePexelsApiKey", () => {
  it("prefers the env/Docker key over a browser header key", () => {
    expect(
      resolvePexelsApiKey({ envKey: " env-key ", headerKey: "browser-key" })
    ).toEqual({ apiKey: "env-key", source: "env" });
  });

  it("uses the browser header when no env key is set", () => {
    expect(resolvePexelsApiKey({ envKey: "", headerKey: " browser " })).toEqual({
      apiKey: "browser",
      source: "header",
    });
  });

  it("returns null when neither key is set", () => {
    expect(resolvePexelsApiKey({ envKey: "  ", headerKey: null })).toEqual({
      apiKey: "",
      source: null,
    });
  });
});

describe("pickPexelsPage", () => {
  it("stays on page 1 when there are no results", () => {
    expect(pickPexelsPage(0, 40, () => 0.99)).toBe(1);
  });

  it("never exceeds the available page count", () => {
    // 50 results / 40 per page = 2 pages — random must not pick 3–10
    const pages = new Set<number>();
    for (let i = 0; i < 40; i++) {
      pages.add(pickPexelsPage(50, 40, () => i / 40));
    }
    expect([...pages].sort((a, b) => a - b)).toEqual([1, 2]);
  });

  it("supports a single full page of results", () => {
    expect(pickPexelsPage(40, 40, () => 0.5)).toBe(1);
  });
});

describe("pickRandomItem", () => {
  it("returns null for empty lists", () => {
    expect(pickRandomItem([])).toBeNull();
  });

  it("picks within bounds", () => {
    expect(pickRandomItem(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickRandomItem(["a", "b", "c"], () => 0.99)).toBe("c");
  });
});

describe("classifyPexelsHttpStatus", () => {
  it("maps auth and rate-limit statuses", () => {
    expect(classifyPexelsHttpStatus(401)).toBe("unauthorized");
    expect(classifyPexelsHttpStatus(403)).toBe("unauthorized");
    expect(classifyPexelsHttpStatus(429)).toBe("rate_limited");
    expect(classifyPexelsHttpStatus(500)).toBe("upstream");
  });
});

describe("buildPexelsSearchUrl", () => {
  it("builds photo and video landscape search URLs", () => {
    expect(buildPexelsSearchUrl({ kind: "photo", query: "nature landscape", page: 2, perPage: 40 })).toBe(
      "https://api.pexels.com/v1/search?query=nature%20landscape&per_page=40&page=2&orientation=landscape"
    );
    expect(buildPexelsSearchUrl({ kind: "video", query: "ocean", page: 1, perPage: 20 })).toBe(
      "https://api.pexels.com/videos/search?query=ocean&per_page=20&page=1&orientation=landscape"
    );
  });

  it("builds curated photo URLs", () => {
    expect(buildPexelsCuratedUrl(3, 40)).toBe("https://api.pexels.com/v1/curated?per_page=40&page=3");
  });
});

describe("fetchPexelsRandomPage", () => {
  it("falls back to page 1 when a higher page is empty", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes("page=1")) {
        return {
          ok: true,
          json: async () => ({
            total_results: 100,
            photos: [{ id: 1 }, { id: 2 }],
          }),
        } as Response;
      }
      return {
        ok: true,
        json: async () => ({ total_results: 100, photos: [] }),
      } as Response;
    });

    const result = await fetchPexelsRandomPage({
      kind: "photo",
      apiKey: "k",
      query: "mountains",
      perPage: 40,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      random: () => 0.9, // → page 3 of ceil(100/40)=3
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.page).toBe(1);
      expect(result.data.photos).toHaveLength(2);
    }
  });

  it("returns unauthorized for 401 from Pexels", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 401,
      text: async () => "Invalid API key",
    })) as unknown as typeof fetch;

    const result = await fetchPexelsRandomPage({
      kind: "photo",
      apiKey: "bad",
      query: "nature",
      perPage: 40,
      fetchImpl,
    });

    expect(result).toMatchObject({ ok: false, kind: "unauthorized", status: 401 });
  });

  it("returns empty when the first page has no photos", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ total_results: 0, photos: [] }),
    })) as unknown as typeof fetch;

    const result = await fetchPexelsRandomPage({
      kind: "photo",
      apiKey: "k",
      query: "xyzzy-no-results",
      perPage: 40,
      fetchImpl,
    });

    expect(result).toEqual({ ok: false, kind: "empty" });
  });
});
