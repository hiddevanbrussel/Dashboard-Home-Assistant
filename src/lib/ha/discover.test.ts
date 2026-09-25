import { describe, it, expect } from "vitest";
import {
  looksLikeHomeAssistant,
  gatewayCandidates,
  neighborScanTargets,
} from "./discover";

describe("ha/discover", () => {
  it("recognizes HA API 401 as Home Assistant", () => {
    expect(looksLikeHomeAssistant(401, "")).toBe(true);
    expect(looksLikeHomeAssistant(403, "")).toBe(true);
    expect(looksLikeHomeAssistant(200, '{"message":"API running."}')).toBe(true);
    expect(looksLikeHomeAssistant(200, "hello world")).toBe(false);
    expect(looksLikeHomeAssistant(404, "")).toBe(false);
  });

  it("builds gateway candidates from local IPs", () => {
    expect(gatewayCandidates(["192.168.1.42"])).toEqual(["http://192.168.1.1:8123"]);
    expect(gatewayCandidates(["10.0.0.5", "invalid"])).toEqual(["http://10.0.0.1:8123"]);
  });

  it("caps neighbor scan and skips self", () => {
    const urls = neighborScanTargets(["192.168.1.50"], 8123, 10);
    expect(urls).toHaveLength(10);
    expect(urls.every((u) => u.startsWith("http://192.168.1."))).toBe(true);
    expect(urls.some((u) => u.includes("192.168.1.50"))).toBe(false);
  });
});
