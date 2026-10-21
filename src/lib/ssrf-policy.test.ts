import { describe, expect, it } from "vitest";
import { isAllowedHaBaseUrl, isTrustedEmbedUrl } from "./ssrf-policy";

describe("isAllowedHaBaseUrl", () => {
  it("allows local http and public https", () => {
    expect(isAllowedHaBaseUrl("http://homeassistant.local:8123")).toBe(true);
    expect(isAllowedHaBaseUrl("http://192.168.1.10:8123")).toBe(true);
    expect(isAllowedHaBaseUrl("https://ha.example.com")).toBe(true);
  });

  it("rejects public http and link-local metadata", () => {
    expect(isAllowedHaBaseUrl("http://example.com:8123")).toBe(false);
    expect(isAllowedHaBaseUrl("http://169.254.169.254/")).toBe(false);
  });
});

describe("isTrustedEmbedUrl", () => {
  it("allows a local doorbell and an allowlisted https host", () => {
    expect(isTrustedEmbedUrl("http://192.168.1.20:1984/stream.html")).toBe(true);
    expect(isTrustedEmbedUrl("https://cams.example.com/stream", ["cams.example.com"])).toBe(true);
    expect(isTrustedEmbedUrl("https://evil.example/stream")).toBe(false);
    expect(isTrustedEmbedUrl("http://evil.example/stream", ["evil.example"])).toBe(false);
  });
});
