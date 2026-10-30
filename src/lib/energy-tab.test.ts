import { describe, expect, it } from "vitest";
import { parseEnergyTab } from "./energy-tab";

describe("energy tab", () => {
  it("defaults to overview and treats a corrupt value as the default", () => {
    expect(parseEnergyTab(null)).toBe("overview");
    expect(parseEnergyTab(undefined)).toBe("overview");
    expect(parseEnergyTab("")).toBe("overview");
    expect(parseEnergyTab("tiles ")).toBe("overview");
    expect(parseEnergyTab("overview")).toBe("overview");
    expect(parseEnergyTab("tiles")).toBe("tiles");
  });
});
