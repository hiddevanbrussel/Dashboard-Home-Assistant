import { describe, expect, it } from "vitest";
import { hidesDashboardWallpaper, usesNeutralPageFill } from "./page-background-path";

describe("hidesDashboardWallpaper", () => {
  it("hides the dashboard photo on the Music Assistant page", () => {
    expect(hidesDashboardWallpaper("/music")).toBe(true);
    expect(hidesDashboardWallpaper("/music/")).toBe(true);
  });

  it("hides the dashboard photo on the Energy page", () => {
    expect(hidesDashboardWallpaper("/energy")).toBe(true);
    expect(hidesDashboardWallpaper("/energy/")).toBe(true);
  });

  it("keeps the photo on other dashboard pages", () => {
    expect(hidesDashboardWallpaper("/")).toBe(false);
    expect(hidesDashboardWallpaper("/dashboards")).toBe(false);
    expect(hidesDashboardWallpaper("/settings")).toBe(false);
    expect(hidesDashboardWallpaper("/vacuum")).toBe(false);
    expect(hidesDashboardWallpaper(null)).toBe(false);
  });
});

describe("usesNeutralPageFill", () => {
  it("uses a white/black fill on Energy", () => {
    expect(usesNeutralPageFill("/energy")).toBe(true);
    expect(usesNeutralPageFill("/energy/")).toBe(true);
  });

  it("keeps the themed page color elsewhere", () => {
    expect(usesNeutralPageFill("/music")).toBe(false);
    expect(usesNeutralPageFill("/")).toBe(false);
    expect(usesNeutralPageFill("/settings")).toBe(false);
    expect(usesNeutralPageFill(null)).toBe(false);
  });
});
