export const WAKE_WORD_IDS = ["ok_nabu", "hey_jarvis", "alexa", "hey_mycroft", "hey_rhasspy"] as const;

export type WakeWordId = (typeof WAKE_WORD_IDS)[number];

export type WakeWordStatus = "off" | "loading" | "armed" | "denied" | "error";

export const DEFAULT_WAKE_WORD_ID: WakeWordId = "ok_nabu";
export const WAKE_WORD_THRESHOLD = 0.5;
export const WAKE_WORD_COOLDOWN_MS = 2000;
export const WAKE_WORD_FRAME_SAMPLES = 1280;
export const WAKE_WORD_MODELS_BASE = "/wake-word/";

export type WakeWordModel = {
  id: WakeWordId;
  file: string;
  /** Pre-trained name understood by openwakeword-web, if any. */
  pretrained?: string;
  labelKey: string;
};

export const WAKE_WORD_MODELS: Record<WakeWordId, WakeWordModel> = {
  ok_nabu: {
    id: "ok_nabu",
    file: "ok_nabu.onnx",
    labelKey: "settings.voiceSatellite.wakeWord.okNabu",
  },
  hey_jarvis: {
    id: "hey_jarvis",
    file: "hey_jarvis_v0.1.onnx",
    pretrained: "hey_jarvis",
    labelKey: "settings.voiceSatellite.wakeWord.heyJarvis",
  },
  alexa: {
    id: "alexa",
    file: "alexa_v0.1.onnx",
    pretrained: "alexa",
    labelKey: "settings.voiceSatellite.wakeWord.alexa",
  },
  hey_mycroft: {
    id: "hey_mycroft",
    file: "hey_mycroft_v0.1.onnx",
    pretrained: "hey_mycroft",
    labelKey: "settings.voiceSatellite.wakeWord.heyMycroft",
  },
  hey_rhasspy: {
    id: "hey_rhasspy",
    file: "hey_rhasspy_v0.1.onnx",
    pretrained: "hey_rhasspy",
    labelKey: "settings.voiceSatellite.wakeWord.heyRhasspy",
  },
};

export function isWakeWordId(value: string | null | undefined): value is WakeWordId {
  return typeof value === "string" && (WAKE_WORD_IDS as readonly string[]).includes(value);
}

export function resolveWakeWordId(value: string | null | undefined): WakeWordId {
  return isWakeWordId(value) ? value : DEFAULT_WAKE_WORD_ID;
}

export function wakeWordModelRef(id: WakeWordId): string | { name: string; url: string } {
  const model = WAKE_WORD_MODELS[id];
  if (model.pretrained) return model.pretrained;
  return { name: model.id, url: `${WAKE_WORD_MODELS_BASE}${model.file}` };
}

export function shouldRunWakeWordListener(input: {
  enabled: boolean;
  wakeWordEnabled: boolean;
  phase: "idle" | "listening" | "processing" | "responding" | "error";
}): boolean {
  if (!input.enabled || !input.wakeWordEnabled) return false;
  return input.phase === "idle" || input.phase === "error";
}

export function appendWakeWordPcm(
  pending: Int16Array,
  incoming: Int16Array,
  frameSize = WAKE_WORD_FRAME_SAMPLES
): { frames: Int16Array[]; rest: Int16Array } {
  const size = Number.isFinite(frameSize) && frameSize > 0 ? Math.floor(frameSize) : WAKE_WORD_FRAME_SAMPLES;
  const merged = new Int16Array(pending.length + incoming.length);
  merged.set(pending);
  merged.set(incoming, pending.length);
  const frames: Int16Array[] = [];
  let offset = 0;
  while (offset + size <= merged.length) {
    frames.push(merged.slice(offset, offset + size));
    offset += size;
  }
  return { frames, rest: merged.slice(offset) };
}
