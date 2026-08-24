import { describe, expect, it } from "vitest";
import {
  buildMusicAssistantBaseUrl,
  normalizeMusicAssistantBaseUrl,
  parseMusicAssistantEndpoint,
} from "./music-assistant-url";

describe("music-assistant-url", () => {
  it("turns a bare IP into http://ip:8095", () => {
    expect(normalizeMusicAssistantBaseUrl("192.168.1.50")).toBe("http://192.168.1.50:8095");
  });

  it("keeps a full URL without a trailing slash", () => {
    expect(normalizeMusicAssistantBaseUrl("https://ma.local:8095/")).toBe("https://ma.local:8095");
  });

  it("parses host and port from a stored URL", () => {
    expect(parseMusicAssistantEndpoint("http://10.0.0.8:8095")).toEqual({
      protocol: "http",
      host: "10.0.0.8",
      port: "8095",
    });
  });

  it("builds a URL from host, port and https", () => {
    expect(buildMusicAssistantBaseUrl("music.lan", "443", "https")).toBe("https://music.lan");
  });

  it("returns empty for blank input", () => {
    expect(normalizeMusicAssistantBaseUrl("   ")).toBe("");
  });
});
