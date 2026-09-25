import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_WAKE_WORD_ID,
  WAKE_WORD_FRAME_SAMPLES,
  appendWakeWordPcm,
  resolveWakeWordId,
  shouldRunWakeWordListener,
  wakeWordModelRef,
} from "./wake-word";

describe("wake word helpers", () => {
  const prevBase = process.env.NEXT_PUBLIC_BASE_PATH;
  afterEach(() => {
    if (prevBase === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = prevBase;
  });

  it("falls back to Okay Nabu for unknown ids", () => {
    expect(resolveWakeWordId(undefined)).toBe(DEFAULT_WAKE_WORD_ID);
    expect(resolveWakeWordId("nope")).toBe("ok_nabu");
    expect(resolveWakeWordId("hey_jarvis")).toBe("hey_jarvis");
  });

  it("uses a custom URL for Okay Nabu and pretrained names otherwise", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(wakeWordModelRef("ok_nabu")).toEqual({ name: "ok_nabu", url: "/wake-word/ok_nabu.onnx" });
    expect(wakeWordModelRef("alexa")).toBe("alexa");
  });

  it("prefixes wake-word model URLs with basePath under Ingress", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    expect(wakeWordModelRef("ok_nabu")).toEqual({
      name: "ok_nabu",
      url: "/__ha_ingress__/wake-word/ok_nabu.onnx",
    });
  });

  it("only arms the listener when the satellite is idle", () => {
    expect(shouldRunWakeWordListener({ enabled: true, wakeWordEnabled: true, phase: "idle" })).toBe(true);
    expect(shouldRunWakeWordListener({ enabled: true, wakeWordEnabled: true, phase: "error" })).toBe(true);
    expect(shouldRunWakeWordListener({ enabled: true, wakeWordEnabled: true, phase: "listening" })).toBe(false);
    expect(shouldRunWakeWordListener({ enabled: true, wakeWordEnabled: true, phase: "processing" })).toBe(false);
    expect(shouldRunWakeWordListener({ enabled: true, wakeWordEnabled: false, phase: "idle" })).toBe(false);
    expect(shouldRunWakeWordListener({ enabled: false, wakeWordEnabled: true, phase: "idle" })).toBe(false);
  });

  it("splits PCM into 80 ms frames and keeps the remainder", () => {
    const incoming = new Int16Array(WAKE_WORD_FRAME_SAMPLES + 3);
    incoming[0] = 9;
    incoming[WAKE_WORD_FRAME_SAMPLES] = 4;
    incoming[WAKE_WORD_FRAME_SAMPLES + 1] = 5;
    incoming[WAKE_WORD_FRAME_SAMPLES + 2] = 6;
    const { frames, rest } = appendWakeWordPcm(new Int16Array(), incoming);
    expect(frames).toHaveLength(1);
    expect(frames[0]?.length).toBe(WAKE_WORD_FRAME_SAMPLES);
    expect(frames[0]?.[0]).toBe(9);
    expect(Array.from(rest)).toEqual([4, 5, 6]);
  });
});
