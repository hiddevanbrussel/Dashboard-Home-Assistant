import type { VoicePhase } from "@/stores/voice-satellite-store";

export type VoiceSessionSource = "manual" | "wake";

export type HeaderVoiceCaption = "listening" | "processing" | "responding" | "transcript" | "speech" | "error" | null;

export function isVoiceSessionActive(phase: VoicePhase): boolean {
  return phase === "listening" || phase === "processing" || phase === "responding";
}

export function headerVoiceCaption(input: {
  phase: VoicePhase;
  transcript?: string;
  speech?: string;
  error?: string | null;
}): HeaderVoiceCaption {
  if (input.phase === "listening") return "listening";
  if (input.phase === "processing") return input.transcript?.trim() ? "transcript" : "processing";
  if (input.phase === "responding") return input.speech?.trim() ? "speech" : "responding";
  if (input.phase === "error") return "error";
  return null;
}

export function headerVoiceOpensOverlay(input: {
  source: VoiceSessionSource;
  phase: VoicePhase;
}): boolean {
  if (input.source === "wake" && isVoiceSessionActive(input.phase)) return false;
  return true;
}
