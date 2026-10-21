import { describe, expect, it } from "vitest";
import { assertHaServiceCall, isCameraEntityId } from "./ha-service-policy";

describe("Home Assistant service policy", () => {
  it("allows ordinary domains and blocks shell and path injection", () => {
    expect(assertHaServiceCall("light", "turn_on")).toEqual({ ok: true });
    expect(assertHaServiceCall("shell_command", "run").ok).toBe(false);
    expect(assertHaServiceCall("hassio", "addon_start").ok).toBe(false);
    expect(assertHaServiceCall("../api", "states").ok).toBe(false);
  });

  it("accepts only camera entity ids", () => {
    expect(isCameraEntityId("camera.front_door")).toBe(true);
    expect(isCameraEntityId("camera.front_door/../../api/states")).toBe(false);
    expect(isCameraEntityId("light.kitchen")).toBe(false);
  });
});
