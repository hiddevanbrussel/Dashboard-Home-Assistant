import { describe, expect, it } from "vitest";
import {
  clampSmartStackHeight,
  clampSmartStackIntervalSec,
  clampSmartStackWidth,
  isSmartStackAutoplayEnabled,
  isSmartStackChildType,
  normalizeSmartStackIndex,
  SMART_STACK_DEFAULT_AUTOPLAY,
  SMART_STACK_DEFAULT_INTERVAL_SEC,
  SMART_STACK_MIN_HEIGHT,
  SMART_STACK_MIN_WIDTH,
} from "./smart-stack";

describe("smart-stack helpers", () => {
  it("clamps size to allow 250×250", () => {
    expect(clampSmartStackWidth(250)).toBe(250);
    expect(clampSmartStackHeight(250)).toBe(250);
    expect(SMART_STACK_MIN_WIDTH).toBe(250);
    expect(SMART_STACK_MIN_HEIGHT).toBe(250);
    expect(clampSmartStackWidth(100)).toBe(250);
    expect(clampSmartStackHeight(999)).toBe(480);
  });

  it("clamps interval seconds", () => {
    expect(clampSmartStackIntervalSec(undefined)).toBe(SMART_STACK_DEFAULT_INTERVAL_SEC);
    expect(clampSmartStackIntervalSec(1)).toBe(3);
    expect(clampSmartStackIntervalSec(8)).toBe(8);
    expect(clampSmartStackIntervalSec(120)).toBe(60);
  });

  it("treats autoplay as on by default and off only when explicit", () => {
    expect(SMART_STACK_DEFAULT_AUTOPLAY).toBe(true);
    expect(isSmartStackAutoplayEnabled(undefined)).toBe(true);
    expect(isSmartStackAutoplayEnabled(true)).toBe(true);
    expect(isSmartStackAutoplayEnabled(false)).toBe(false);
    expect(isSmartStackAutoplayEnabled(0)).toBe(false);
    expect(isSmartStackAutoplayEnabled("false")).toBe(false);
  });

  it("normalizes slide index wrapping", () => {
    expect(normalizeSmartStackIndex(0, 3)).toBe(0);
    expect(normalizeSmartStackIndex(3, 3)).toBe(0);
    expect(normalizeSmartStackIndex(-1, 3)).toBe(2);
    expect(normalizeSmartStackIndex(5, 0)).toBe(0);
  });

  it("validates allowed child types", () => {
    expect(isSmartStackChildType("climate_card_2")).toBe(true);
    expect(isSmartStackChildType("nuts_card")).toBe(true);
    expect(isSmartStackChildType("media_card")).toBe(true);
    expect(isSmartStackChildType("card_group")).toBe(false);
    expect(isSmartStackChildType("smart_stack")).toBe(false);
  });
});
