/**
 * Distinctive two-tone doorbell chime via Web Audio
 * (same approach as voice-chime / timer-sound).
 */

const AudioContextCtor =
  typeof window !== "undefined"
    ? window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    : undefined;

export const DOORBELL_CHIME_FREQUENCIES = [523.25, 659.25] as const; // C5, E5
export const DOORBELL_CHIME_GAIN = 0.22;
export const DOORBELL_CHIME_NOTE_SECONDS = 0.42;
export const DOORBELL_CHIME_GAP_SECONDS = 0.12;

let sharedCtx: AudioContext | null = null;

export function unlockDoorbellAudio() {
  if (!AudioContextCtor) return;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioContextCtor();
  void sharedCtx.resume();
}

function playNotes(ctx: AudioContext) {
  const now = ctx.currentTime;
  DOORBELL_CHIME_FREQUENCIES.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + index * (DOORBELL_CHIME_NOTE_SECONDS + DOORBELL_CHIME_GAP_SECONDS);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(DOORBELL_CHIME_GAIN, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + DOORBELL_CHIME_NOTE_SECONDS);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + DOORBELL_CHIME_NOTE_SECONDS + 0.03);
  });
}

/** Play the doorbell ding-dong. Safe to call outside a user gesture (may be silent until unlocked). */
export function playDoorbellChime() {
  if (typeof window === "undefined" || !AudioContextCtor) return;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioContextCtor();
  const ctx = sharedCtx;
  void ctx.resume().then(() => {
    try {
      playNotes(ctx);
    } catch {
      /* autoplay / closed context */
    }
  });
}
