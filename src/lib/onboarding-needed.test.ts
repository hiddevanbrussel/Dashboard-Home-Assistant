import { describe, expect, it } from "vitest";
import {
  isPristineDashboard,
  needsSoftOnboarding,
  parseDashboardWidgets,
} from "./onboarding-needed";

describe("onboarding-needed", () => {
  it("parses widget payloads", () => {
    expect(parseDashboardWidgets([])).toEqual([]);
    expect(parseDashboardWidgets("[]")).toEqual([]);
    expect(parseDashboardWidgets('[{"id":"a"}]')).toEqual([{ id: "a" }]);
    expect(parseDashboardWidgets("not-json")).toEqual([]);
    expect(parseDashboardWidgets(null)).toEqual([]);
  });

  it("treats empty default Home as pristine", () => {
    expect(isPristineDashboard({ id: "1", name: "Home", theme: "auto", widgets: "[]" })).toBe(
      true
    );
    expect(isPristineDashboard({ id: "1", name: "Thuis", theme: "auto", widgets: [] })).toBe(true);
    expect(isPristineDashboard({ id: "1", name: "Home", theme: "auto", widgets: null })).toBe(
      true
    );
  });

  it("does not treat customized dashboards as pristine", () => {
    expect(
      isPristineDashboard({
        id: "1",
        name: "Living room",
        theme: "auto",
        widgets: "[]",
      })
    ).toBe(false);
    expect(
      isPristineDashboard({
        id: "1",
        name: "Home",
        theme: "auto",
        widgets: '[{"id":"w1","type":"light_card"}]',
      })
    ).toBe(false);
  });

  it("needs soft onboarding for missing or pristine dashboards", () => {
    expect(needsSoftOnboarding(null)).toBe(true);
    expect(needsSoftOnboarding(undefined)).toBe(true);
    expect(needsSoftOnboarding({ id: "1", name: "Home", theme: "auto", widgets: "[]" })).toBe(
      true
    );
    expect(
      needsSoftOnboarding({
        id: "1",
        name: "Home",
        theme: "auto",
        widgets: '[{"id":"w1"}]',
      })
    ).toBe(false);
  });
});
