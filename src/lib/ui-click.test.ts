import { describe, expect, it } from "vitest";
import { canPlayUiClick, UI_CLICK_COOLDOWN_MS } from "./ui-click";

describe("canPlayUiClick", () => {
  it("allows a click when enabled, visible, unlocked, and cooled down", () => {
    expect(
      canPlayUiClick({
        enabled: true,
        documentVisible: true,
        unlocked: true,
        nowMs: 1000,
        lastPlayedAtMs: 0,
      })
    ).toBe(true);
  });

  it("blocks when preference is off", () => {
    expect(
      canPlayUiClick({
        enabled: false,
        documentVisible: true,
        unlocked: true,
        nowMs: 1000,
        lastPlayedAtMs: 0,
      })
    ).toBe(false);
  });

  it("blocks when the tab is hidden", () => {
    expect(
      canPlayUiClick({
        enabled: true,
        documentVisible: false,
        unlocked: true,
        nowMs: 1000,
        lastPlayedAtMs: 0,
      })
    ).toBe(false);
  });

  it("blocks until a user gesture has unlocked audio", () => {
    expect(
      canPlayUiClick({
        enabled: true,
        documentVisible: true,
        unlocked: false,
        nowMs: 1000,
        lastPlayedAtMs: 0,
      })
    ).toBe(false);
  });

  it("throttles rapid presses within the cooldown window", () => {
    expect(
      canPlayUiClick({
        enabled: true,
        documentVisible: true,
        unlocked: true,
        nowMs: 50,
        lastPlayedAtMs: 0,
        cooldownMs: UI_CLICK_COOLDOWN_MS,
      })
    ).toBe(false);
    expect(
      canPlayUiClick({
        enabled: true,
        documentVisible: true,
        unlocked: true,
        nowMs: UI_CLICK_COOLDOWN_MS,
        lastPlayedAtMs: 0,
        cooldownMs: UI_CLICK_COOLDOWN_MS,
      })
    ).toBe(true);
  });
});
