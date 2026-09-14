import { describe, expect, it } from "vitest";
import {
  buildValetudoBaseUrl,
  isSafeValetudoApiPath,
  isSafeValetudoBaseUrl,
  normalizeValetudoBaseUrl,
  parseValetudoEndpoint,
} from "./valetudo-url";

describe("valetudo-url", () => {
  it("turns a bare IP into http://ip on port 80", () => {
    expect(normalizeValetudoBaseUrl("192.168.1.40")).toBe("http://192.168.1.40");
  });

  it("keeps a custom port", () => {
    expect(normalizeValetudoBaseUrl("http://vacuum.lan:8080/")).toBe("http://vacuum.lan:8080");
  });

  it("parses host and port from a stored URL", () => {
    expect(parseValetudoEndpoint("http://10.0.0.8")).toEqual({
      protocol: "http",
      host: "10.0.0.8",
      port: "80",
    });
  });

  it("builds a https URL without default 443", () => {
    expect(buildValetudoBaseUrl("vacuum.lan", "443", "https")).toBe("https://vacuum.lan");
  });

  it("rejects credentials and non-http URLs", () => {
    expect(isSafeValetudoBaseUrl("http://user:pass@vacuum.lan")).toBe(false);
    expect(isSafeValetudoBaseUrl("ftp://vacuum.lan")).toBe(false);
    expect(isSafeValetudoBaseUrl("http://vacuum.lan")).toBe(true);
  });

  it("only allows Valetudo v2 API paths", () => {
    expect(isSafeValetudoApiPath("/api/v2/robot/state/map")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v2/robot/capabilities/MapSegmentationCapability")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v2/robot/capabilities/FanSpeedControlCapability/presets")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v2/robot/capabilities/FanSpeedControlCapability/preset")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v2/robot/capabilities/ConsumableMonitoringCapability")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v2/robot/capabilities/ConsumableMonitoringCapability/properties")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v2/robot/capabilities/ConsumableMonitoringCapability/brush/main")).toBe(true);
    expect(isSafeValetudoApiPath("/api/v1/robot")).toBe(false);
    expect(isSafeValetudoApiPath("/api/v2/../etc/passwd")).toBe(false);
  });
});
