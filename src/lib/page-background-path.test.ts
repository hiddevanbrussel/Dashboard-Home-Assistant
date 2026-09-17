import { describe, expect, it } from "vitest";
import { hidesDashboardWallpaper } from "./page-background-path";

describe("hidesDashboardWallpaper", () => {
  it("hides the dashboard photo on the Music Assistant page", () => {
    expect(hidesDashboardWallpaper("/music")).toBe(true);
    expect(hidesDashboardWallpaper("/music/")).toBe(true);
  });

  it("keeps the photo on Energy, home, and other dashboard pages", () => {
    expect(hidesDashboardWallpaper("/energy")).toBe(false);
    expect(hidesDashboardWallpaper("/energy/")).toBe(false);
    expect(hidesDashboardWallpaper("/")).toBe(false);
    expect(hidesDashboardWallpaper("/dashboards")).toBe(false);
    expect(hidesDashboardWallpaper("/rooms")).toBe(false);
    expect(hidesDashboardWallpaper("/settings")).toBe(false);
    expect(hidesDashboardWallpaper("/vacuum")).toBe(false);
    expect(hidesDashboardWallpaper(null)).toBe(false);
  });
});
