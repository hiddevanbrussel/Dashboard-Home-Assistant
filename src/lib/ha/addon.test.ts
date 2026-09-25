import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  SUPERVISOR_CORE_URL,
  getAddonHaConfig,
  getSupervisorToken,
  isHaAddon,
  isSupervisorBaseUrl,
} from "./addon";

describe("ha/addon", () => {
  const envKeys = ["HA_ADDON", "HA_SUPERVISOR_TOKEN", "SUPERVISOR_TOKEN"] as const;
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of envKeys) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of envKeys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("reads HA_SUPERVISOR_TOKEN over SUPERVISOR_TOKEN", () => {
    process.env.SUPERVISOR_TOKEN = "old";
    process.env.HA_SUPERVISOR_TOKEN = "new";
    expect(getSupervisorToken()).toBe("new");
  });

  it("getAddonHaConfig returns supervisor core URL", () => {
    process.env.HA_ADDON = "1";
    process.env.SUPERVISOR_TOKEN = "tok";
    expect(getAddonHaConfig()).toEqual({
      baseUrl: SUPERVISOR_CORE_URL,
      token: "tok",
    });
  });

  it("getAddonHaConfig is null without addon flag", () => {
    process.env.SUPERVISOR_TOKEN = "tok";
    expect(getAddonHaConfig()).toBeNull();
  });

  it("getAddonHaConfig is null without token", () => {
    process.env.HA_ADDON = "1";
    expect(getAddonHaConfig()).toBeNull();
  });

  it("isHaAddon respects HA_ADDON flag", () => {
    expect(isHaAddon()).toBe(false);
    process.env.HA_ADDON = "1";
    expect(isHaAddon()).toBe(true);
  });

  it("isSupervisorBaseUrl matches core URL", () => {
    expect(isSupervisorBaseUrl("http://supervisor/core")).toBe(true);
    expect(isSupervisorBaseUrl("http://supervisor/core/")).toBe(true);
    expect(isSupervisorBaseUrl("http://homeassistant:8123")).toBe(false);
  });
});
