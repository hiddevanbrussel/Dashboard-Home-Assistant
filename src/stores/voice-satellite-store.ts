"use client";

import { create } from "zustand";
import { DEFAULT_WAKE_WORD_ID, resolveWakeWordId, type WakeWordId, type WakeWordStatus } from "@/lib/wake-word";

const STORAGE_KEY_ENABLED = "dashboard.voiceSatellite.enabled";
const STORAGE_KEY_PIPELINE = "dashboard.voiceSatellite.pipelineId";
const STORAGE_KEY_WAKE_WORD = "dashboard.voiceSatellite.wakeWordEnabled";
const STORAGE_KEY_WAKE_WORD_ID = "dashboard.voiceSatellite.wakeWordId";

function getStored(key: string, fallback: string | boolean): string | boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v == null) return fallback;
    if (key === STORAGE_KEY_ENABLED || key === STORAGE_KEY_WAKE_WORD) return v === "true";
    return v;
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: string | boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(value));
    window.dispatchEvent(new Event("voice-satellite-setting-changed"));
  } catch {
    // ignore
  }
}

export type VoicePhase = "idle" | "listening" | "processing" | "responding" | "error";

export type VoiceSatelliteStore = {
  enabled: boolean;
  pipelineId: string;
  wakeWordEnabled: boolean;
  wakeWordId: WakeWordId;
  wakeWordStatus: WakeWordStatus;
  wakeWordError: string | null;
  wakeListenId: number;
  open: boolean;
  phase: VoicePhase;
  transcript: string;
  speech: string;
  error: string | null;
  conversationId: string | null;
  setEnabled: (v: boolean) => void;
  setPipelineId: (id: string) => void;
  setWakeWordEnabled: (v: boolean) => void;
  setWakeWordId: (id: string) => void;
  setWakeWordStatus: (status: WakeWordStatus, error?: string | null) => void;
  triggerWakeListen: () => void;
  setOpen: (open: boolean) => void;
  setPhase: (phase: VoicePhase) => void;
  setTurn: (turn: { transcript?: string; speech?: string; error?: string | null; conversationId?: string | null }) => void;
  resetTurn: () => void;
};

export const useVoiceSatelliteStore = create<VoiceSatelliteStore>((set) => ({
  enabled: getStored(STORAGE_KEY_ENABLED, false) as boolean,
  pipelineId: getStored(STORAGE_KEY_PIPELINE, "") as string,
  wakeWordEnabled: getStored(STORAGE_KEY_WAKE_WORD, false) as boolean,
  wakeWordId: resolveWakeWordId(getStored(STORAGE_KEY_WAKE_WORD_ID, DEFAULT_WAKE_WORD_ID) as string),
  wakeWordStatus: "off",
  wakeWordError: null,
  wakeListenId: 0,
  open: false,
  phase: "idle",
  transcript: "",
  speech: "",
  error: null,
  conversationId: null,
  setEnabled: (v) => {
    setStored(STORAGE_KEY_ENABLED, v);
    set((state) => ({ enabled: v, open: v ? state.open : false }));
  },
  setPipelineId: (id) => {
    setStored(STORAGE_KEY_PIPELINE, id);
    set({ pipelineId: id });
  },
  setWakeWordEnabled: (v) => {
    setStored(STORAGE_KEY_WAKE_WORD, v);
    set({ wakeWordEnabled: v, wakeWordStatus: v ? "loading" : "off", wakeWordError: null });
  },
  setWakeWordId: (id) => {
    const wakeWordId = resolveWakeWordId(id);
    setStored(STORAGE_KEY_WAKE_WORD_ID, wakeWordId);
    set({ wakeWordId });
  },
  setWakeWordStatus: (status, error = null) => set({ wakeWordStatus: status, wakeWordError: error }),
  triggerWakeListen: () => set((state) => ({ open: true, wakeListenId: state.wakeListenId + 1 })),
  setOpen: (open) => set({ open }),
  setPhase: (phase) => set({ phase }),
  setTurn: (turn) =>
    set((state) => ({
      transcript: turn.transcript ?? state.transcript,
      speech: turn.speech ?? state.speech,
      error: turn.error !== undefined ? turn.error : state.error,
      conversationId: turn.conversationId !== undefined ? turn.conversationId : state.conversationId,
    })),
  resetTurn: () => set({ phase: "idle", transcript: "", speech: "", error: null }),
}));

export function hydrateVoiceSatelliteStore() {
  useVoiceSatelliteStore.setState({
    enabled: getStored(STORAGE_KEY_ENABLED, false) as boolean,
    pipelineId: getStored(STORAGE_KEY_PIPELINE, "") as string,
    wakeWordEnabled: getStored(STORAGE_KEY_WAKE_WORD, false) as boolean,
    wakeWordId: resolveWakeWordId(getStored(STORAGE_KEY_WAKE_WORD_ID, DEFAULT_WAKE_WORD_ID) as string),
  });
}
