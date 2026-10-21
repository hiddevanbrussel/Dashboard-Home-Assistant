import { describe, expect, it } from "vitest";
import { assessResolvedHost, classifyOutboundUrl, fetchChecked, isBlockedIp } from "./ssrf";

describe("isBlockedIp", () => {
  it("blocks loopback, private, and link-local addresses", () => {
    expect(isBlockedIp("127.0.0.1")).toBe(true);
    expect(isBlockedIp("10.1.2.3")).toBe(true);
    expect(isBlockedIp("192.168.1.20")).toBe(true);
    expect(isBlockedIp("169.254.169.254")).toBe(true);
    expect(isBlockedIp("8.8.8.8")).toBe(false);
  });
});

describe("classifyOutboundUrl", () => {
  it("allows public https and rejects private https for feed fetches", async () => {
    const ok = await classifyOutboundUrl("https://example.com/rss", "public-https", async () => ["93.184.216.34"]);
    expect(ok.ok).toBe(true);
    const blocked = await classifyOutboundUrl("https://evil.example/rss", "public-https", async () => ["127.0.0.1"]);
    expect(blocked.ok).toBe(false);
    const http = await classifyOutboundUrl("http://example.com/rss", "public-https", async () => ["93.184.216.34"]);
    expect(http.ok).toBe(false);
  });

  it("allows local http for Home Assistant and rejects public http", async () => {
    const local = await classifyOutboundUrl("http://homeassistant.local:8123", "ha-base");
    expect(local.ok).toBe(true);
    const lan = await classifyOutboundUrl("http://192.168.1.10:8123", "ha-base");
    expect(lan.ok).toBe(true);
    const pub = await classifyOutboundUrl("http://example.com", "ha-base", async () => ["93.184.216.34"]);
    expect(pub.ok).toBe(false);
    const metadata = await classifyOutboundUrl("http://169.254.169.254/", "ha-base");
    expect(metadata.ok).toBe(false);
  });
});

describe("fetchChecked", () => {
  it("does not follow a redirect onto a private address", async () => {
    const fetchImpl = async () =>
      new Response(null, { status: 302, headers: { location: "http://169.254.169.254/latest" } });
    await expect(
      fetchChecked("https://example.com/rss", "public-https", {}, {
        resolve: async () => ["93.184.216.34"],
        fetchImpl: fetchImpl as typeof fetch,
      })
    ).rejects.toThrow(/not allowed/i);
  });
});

describe("assessResolvedHost", () => {
  it("treats a public name that resolves to a LAN address as local", () => {
    expect(assessResolvedHost("example.com", ["10.0.0.5"])).toBe("local");
    expect(assessResolvedHost("metadata.google.internal", ["169.254.169.254"])).toBe("blocked");
  });
});
