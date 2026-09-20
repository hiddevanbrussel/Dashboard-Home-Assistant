const AudioContextCtor =
  typeof window !== "undefined"
    ? window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    : undefined;

let sharedCtx: AudioContext | null = null;

export const VOICE_CHIME_FREQUENCIES = [698.46, 880] as const;
export const VOICE_CHIME_GAIN = 0.07;
export const VOICE_CHIME_NOTE_SECONDS = 0.16;
export const VOICE_CHIME_GAP_SECONDS = 0.08;

export function playVoiceChime() {
  if (!AudioContextCtor) return;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioContextCtor();
  const ctx = sharedCtx;
  void ctx.resume().then(() => {
    const now = ctx.currentTime;
    VOICE_CHIME_FREQUENCIES.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + index * (VOICE_CHIME_NOTE_SECONDS + VOICE_CHIME_GAP_SECONDS);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(VOICE_CHIME_GAIN, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + VOICE_CHIME_NOTE_SECONDS);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + VOICE_CHIME_NOTE_SECONDS + 0.02);
    });
  });
}
