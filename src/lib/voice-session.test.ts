import { describe, expect, it } from "vitest";
import { headerVoiceCaption, headerVoiceOpensOverlay, isVoiceSessionActive } from "./voice-session";
import { VOICE_CHIME_FREQUENCIES, VOICE_CHIME_GAIN } from "./voice-chime";

describe("voice session header", () => {
  it("treats listen/process/respond as an active turn", () => {
    expect(isVoiceSessionActive("listening")).toBe(true);
    expect(isVoiceSessionActive("processing")).toBe(true);
    expect(isVoiceSessionActive("responding")).toBe(true);
    expect(isVoiceSessionActive("idle")).toBe(false);
    expect(isVoiceSessionActive("error")).toBe(false);
  });

  it("picks a compact caption for the top bar", () => {
    expect(headerVoiceCaption({ phase: "listening" })).toBe("listening");
    expect(headerVoiceCaption({ phase: "processing" })).toBe("processing");
    expect(headerVoiceCaption({ phase: "processing", transcript: "licht aan" })).toBe("transcript");
    expect(headerVoiceCaption({ phase: "responding", speech: "Oké" })).toBe("speech");
    expect(headerVoiceCaption({ phase: "error" })).toBe("error");
    expect(headerVoiceCaption({ phase: "idle" })).toBe(null);
    expect(headerVoiceCaption({ phase: "idle", armed: true })).toBe("armed");
  });

  it("does not open the sheet during a wake-word turn", () => {
    expect(headerVoiceOpensOverlay({ source: "wake", phase: "listening" })).toBe(false);
    expect(headerVoiceOpensOverlay({ source: "wake", phase: "processing" })).toBe(false);
    expect(headerVoiceOpensOverlay({ source: "manual", phase: "listening" })).toBe(true);
    expect(headerVoiceOpensOverlay({ source: "wake", phase: "idle" })).toBe(true);
  });

  it("keeps the wake chime quiet and two notes", () => {
    expect(VOICE_CHIME_FREQUENCIES).toHaveLength(2);
    expect(VOICE_CHIME_GAIN).toBeLessThan(0.12);
  });
});
