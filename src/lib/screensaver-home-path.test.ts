import { describe, expect, it } from "vitest";
import { isMainDashboardPath } from "./screensaver-home-path";

describe("isMainDashboardPath", () => {
  it("treats home and dashboard list as the main dashboard", () => {
    expect(isMainDashboardPath("/")).toBe(true);
    expect(isMainDashboardPath("/dashboards")).toBe(true);
    expect(isMainDashboardPath("/dashboards/abc123")).toBe(true);
  });

  it("treats room dashboards and other apps as away from home", () => {
    expect(isMainDashboardPath("/dashboards/room-living")).toBe(false);
    expect(isMainDashboardPath("/music")).toBe(false);
    expect(isMainDashboardPath("/family")).toBe(false);
    expect(isMainDashboardPath("/settings")).toBe(false);
    expect(isMainDashboardPath("/energy")).toBe(false);
  });
});
