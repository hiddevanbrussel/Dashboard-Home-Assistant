import { describe, expect, it } from "vitest";
import {
  DEFAULT_DOORBELL_COOLDOWN_MS,
  defaultDoorbellSettings,
  doorbellUsesWebRtc,
  isDoorbellInCooldown,
  isDoorbellRingState,
  isDoorbellRingTransition,
  parseDoorbellSettings,
  shouldTriggerDoorbell,
} from "./doorbell";

describe("isDoorbellRingState", () => {
  it("accepts on / pressed / detected", () => {
    expect(isDoorbellRingState("on")).toBe(true);
    expect(isDoorbellRingState("ON")).toBe(true);
    expect(isDoorbellRingState("pressed")).toBe(true);
    expect(isDoorbellRingState("detected")).toBe(true);
  });

  it("rejects off and idle", () => {
    expect(isDoorbellRingState("off")).toBe(false);
    expect(isDoorbellRingState("idle")).toBe(false);
    expect(isDoorbellRingState("")).toBe(false);
    expect(isDoorbellRingState(null)).toBe(false);
  });
});

describe("isDoorbellRingTransition", () => {
  it("fires on off → on", () => {
    expect(
      isDoorbellRingTransition({
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "off",
        toState: "on",
      })
    ).toBe(true);
  });

  it("fires on idle → pressed", () => {
    expect(
      isDoorbellRingTransition({
        sensorEntityId: "binary_sensor.front_visitor",
        fromState: "idle",
        toState: "pressed",
      })
    ).toBe(true);
  });

  it("does not fire without previous state", () => {
    expect(
      isDoorbellRingTransition({
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "",
        toState: "on",
      })
    ).toBe(false);
  });

  it("does not fire on on → on or off → off", () => {
    expect(
      isDoorbellRingTransition({
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "on",
        toState: "on",
      })
    ).toBe(false);
    expect(
      isDoorbellRingTransition({
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "off",
        toState: "off",
      })
    ).toBe(false);
  });

  it("does not fire without sensor id", () => {
    expect(
      isDoorbellRingTransition({
        sensorEntityId: "",
        fromState: "off",
        toState: "on",
      })
    ).toBe(false);
  });
});

describe("isDoorbellInCooldown", () => {
  it("blocks within cooldown window", () => {
    expect(isDoorbellInCooldown(1000, 30_000, 10_000)).toBe(true);
    expect(isDoorbellInCooldown(1000, 30_000, 31_000)).toBe(false);
  });

  it("allows when never rung", () => {
    expect(isDoorbellInCooldown(null, DEFAULT_DOORBELL_COOLDOWN_MS, 5000)).toBe(false);
  });
});

describe("shouldTriggerDoorbell", () => {
  const base = {
    ...defaultDoorbellSettings(),
    enabled: true,
    sensorEntityId: "binary_sensor.doorbell_visitor",
    cameraEntityId: "camera.doorbell",
  };

  it("triggers when enabled and transition matches", () => {
    expect(
      shouldTriggerDoorbell({
        settings: base,
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "off",
        toState: "on",
        lastRingAtMs: null,
        nowMs: 10_000,
      })
    ).toBe(true);
  });

  it("ignores wrong entity", () => {
    expect(
      shouldTriggerDoorbell({
        settings: base,
        sensorEntityId: "binary_sensor.other",
        fromState: "off",
        toState: "on",
        lastRingAtMs: null,
        nowMs: 10_000,
      })
    ).toBe(false);
  });

  it("respects disabled and cooldown", () => {
    expect(
      shouldTriggerDoorbell({
        settings: { ...base, enabled: false },
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "off",
        toState: "on",
        lastRingAtMs: null,
        nowMs: 10_000,
      })
    ).toBe(false);
    expect(
      shouldTriggerDoorbell({
        settings: base,
        sensorEntityId: "binary_sensor.doorbell_visitor",
        fromState: "off",
        toState: "on",
        lastRingAtMs: 9000,
        nowMs: 10_000,
      })
    ).toBe(false);
  });
});

describe("parseDoorbellSettings", () => {
  it("returns defaults for invalid input", () => {
    expect(parseDoorbellSettings(null)).toEqual(defaultDoorbellSettings());
    expect(parseDoorbellSettings("x")).toEqual(defaultDoorbellSettings());
  });

  it("parses partial objects", () => {
    const parsed = parseDoorbellSettings({
      enabled: true,
      sensorEntityId: " binary_sensor.v ",
      cameraEntityId: "camera.front",
      webrtcStreamUrl: " http://ha:1984/stream.html?src=cam ",
      playChime: false,
      cooldownMs: 12_000.7,
    });
    expect(parsed.enabled).toBe(true);
    expect(parsed.sensorEntityId).toBe("binary_sensor.v");
    expect(parsed.cameraEntityId).toBe("camera.front");
    expect(parsed.webrtcStreamUrl).toBe("http://ha:1984/stream.html?src=cam");
    expect(parsed.playChime).toBe(false);
    expect(parsed.cooldownMs).toBe(12_001);
  });
});

describe("doorbellUsesWebRtc", () => {
  it("detects non-empty stream URL", () => {
    expect(doorbellUsesWebRtc({ webrtcStreamUrl: "" })).toBe(false);
    expect(doorbellUsesWebRtc({ webrtcStreamUrl: "  " })).toBe(false);
    expect(doorbellUsesWebRtc({ webrtcStreamUrl: "http://x/stream.html" })).toBe(true);
  });
});
