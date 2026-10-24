import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { clampPointsBalance } from "./points-balance";

describe("clampPointsBalance", () => {
  it("stays at zero when undo or restore would spend more than was earned", () => {
    expect(clampPointsBalance(0, 5)).toBe(0);
    expect(clampPointsBalance(3, 10)).toBe(0);
    expect(clampPointsBalance(4, 4)).toBe(0);
  });

  it("keeps a positive saldo", () => {
    expect(clampPointsBalance(10, 4)).toBe(6);
    expect(clampPointsBalance(2, 0)).toBe(2);
  });

  it("treats non-finite input as zero", () => {
    expect(clampPointsBalance(Number.NaN, 1)).toBe(0);
    expect(clampPointsBalance(Number.POSITIVE_INFINITY, 1)).toBe(0);
  });

  it("is what the balance route returns", () => {
    const source = readFileSync(new URL("../app/api/reward-claims/balances/route.ts", import.meta.url), "utf8");
    expect(source).toContain("clampPointsBalance");
    expect(source).not.toContain("earned - spent");
  });
});
