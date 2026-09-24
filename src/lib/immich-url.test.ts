import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  buildImmichAssetProxyUrl,
  buildImmichBaseUrl,
  isSafeImmichApiPath,
  isSafeImmichAssetId,
  isSafeImmichBaseUrl,
  joinImmichUrl,
  normalizeImmichBaseUrl,
  parseImmichEndpoint,
  pickRandomImmichAsset,
} from "./immich-url";

describe("immich-url", () => {
  const prevBase = process.env.NEXT_PUBLIC_BASE_PATH;
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
  });
  afterEach(() => {
    if (prevBase === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = prevBase;
  });
  it("turns a bare IP into http://ip:2283", () => {
    expect(normalizeImmichBaseUrl("192.168.1.50")).toBe("http://192.168.1.50:2283");
  });

  it("keeps a reverse-proxy path prefix", () => {
    expect(normalizeImmichBaseUrl("https://photos.lan/immich/")).toBe("https://photos.lan/immich");
  });

  it("parses host and default Immich port", () => {
    expect(parseImmichEndpoint("http://10.0.0.8")).toEqual({
      protocol: "http",
      host: "10.0.0.8",
      port: "2283",
    });
  });

  it("builds a https URL without default 443", () => {
    expect(buildImmichBaseUrl("photos.lan", "443", "https")).toBe("https://photos.lan");
  });

  it("rejects credentials and non-http URLs", () => {
    expect(isSafeImmichBaseUrl("http://user:pass@photos.lan:2283")).toBe(false);
    expect(isSafeImmichBaseUrl("ftp://photos.lan:2283")).toBe(false);
    expect(isSafeImmichBaseUrl("http://photos.lan:2283")).toBe(true);
    expect(isSafeImmichBaseUrl("https://photos.lan/immich")).toBe(true);
  });

  it("only allows Immich API paths used by this app", () => {
    expect(isSafeImmichApiPath("/api/server/ping")).toBe(true);
    expect(isSafeImmichApiPath("/api/albums")).toBe(true);
    expect(isSafeImmichApiPath("/api/search/random")).toBe(true);
    expect(
      isSafeImmichApiPath("/api/assets/11111111-2222-4333-8444-555555555555/thumbnail")
    ).toBe(true);
    expect(
      isSafeImmichApiPath("/api/assets/11111111-2222-4333-8444-555555555555/video/playback")
    ).toBe(true);
    expect(isSafeImmichApiPath("/api/server/config")).toBe(false);
    expect(isSafeImmichApiPath("/api/../etc/passwd")).toBe(false);
    expect(isSafeImmichApiPath("/api/assets/not-a-uuid/thumbnail")).toBe(false);
  });

  it("validates asset ids", () => {
    expect(isSafeImmichAssetId("11111111-2222-4333-8444-555555555555")).toBe(true);
    expect(isSafeImmichAssetId("not-a-uuid")).toBe(false);
  });

  it("joins a base URL and path", () => {
    expect(joinImmichUrl("http://photos.lan:2283/", "/api/server/ping")).toBe(
      "http://photos.lan:2283/api/server/ping"
    );
  });

  it("builds a same-origin asset proxy URL", () => {
    expect(
      buildImmichAssetProxyUrl({
        baseUrl: "http://photos.lan:2283",
        apiKey: "secret",
        id: "11111111-2222-4333-8444-555555555555",
        kind: "preview",
      })
    ).toBe(
      "/api/immich/asset?baseUrl=http%3A%2F%2Fphotos.lan%3A2283&apiKey=secret&id=11111111-2222-4333-8444-555555555555&kind=preview"
    );
  });

  it("picks a random asset from an Immich search payload", () => {
    const asset = pickRandomImmichAsset([
      { id: "11111111-2222-4333-8444-555555555555" },
      { id: "not-valid" },
    ]);
    expect(asset).toEqual({ id: "11111111-2222-4333-8444-555555555555" });
    expect(pickRandomImmichAsset({ assets: [] })).toBeNull();
  });
});
