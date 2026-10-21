import { describe, expect, it } from "vitest";
import { hidesDashboardWallpaper } from "./page-background-path";

describe("hidesDashboardWallpaper", () => {
  it("hides the dashboard photo on the Music Assistant page", () => {
    expect(hidesDashboardWallpaper("/music")).toBe(true);
    expect(hidesDashboardWallpaper("/music/")).toBe(true);
    expect(hidesDashboardWallpaper("/__ha_ingress__/music")).toBe(true);
    expect(hidesDashboardWallpaper("/__ha_ingress__music")).toBe(false);
    expect(hidesDashboardWallpaper("/__ha_ingress__")).toBe(false);
  });

  it("hides the dashboard photo on Energy (uses its own page-wide art)", () => {
    expect(hidesDashboardWallpaper("/energy")).toBe(true);
    expect(hidesDashboardWallpaper("/energy/")).toBe(true);
    expect(hidesDashboardWallpaper("/__ha_ingress__/energy")).toBe(true);
    expect(hidesDashboardWallpaper("/__ha_ingress__/energy/")).toBe(true);
  });

  it("keeps the photo on home and other dashboard pages", () => {
    expect(hidesDashboardWallpaper("/")).toBe(false);
    expect(hidesDashboardWallpaper("/dashboards")).toBe(false);
    expect(hidesDashboardWallpaper("/rooms")).toBe(false);
    expect(hidesDashboardWallpaper("/settings")).toBe(false);
    expect(hidesDashboardWallpaper("/vacuum")).toBe(false);
    expect(hidesDashboardWallpaper(null)).toBe(false);
  });
});
