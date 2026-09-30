/**
 * Soft UI tap/click via Web Audio (same approach as voice-chime / timer-sound).
 * Short, quiet sine tick with throttle so rapid presses stay pleasant.
 */

const AudioContextCtor =
  typeof window !== "undefined"
    ? window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    : undefined;

export const UI_CLICK_GAIN = 0.28;
export const UI_CLICK_COOLDOWN_MS = 90;
export const UI_CLICK_DURATION_SECONDS = 0.048;
export const UI_CLICK_FREQUENCY = 920;

let sharedCtx: AudioContext | null = null;
let lastPlayedAtMs = 0;
let unlocked = false;
let gestureListenersInstalled = false;
let enabledGetter: () => boolean = () => true;

/** Inject preference reader (avoids circular imports from the store). */
export function setUiClickEnabledGetter(getter: () => boolean) {
  enabledGetter = getter;
}

export function canPlayUiClick(input: {
  enabled: boolean;
  documentVisible: boolean;
  unlocked: boolean;
  nowMs: number;
  lastPlayedAtMs: number;
  cooldownMs?: number;
}): boolean {
  if (!input.enabled) return false;
  if (!input.documentVisible) return false;
  if (!input.unlocked) return false;
  const cooldown = input.cooldownMs ?? UI_CLICK_COOLDOWN_MS;
  return input.nowMs - input.lastPlayedAtMs >= cooldown;
}

function ensureGestureUnlock() {
  if (typeof window === "undefined" || gestureListenersInstalled) return;
  gestureListenersInstalled = true;
  const unlock = () => {
    unlocked = true;
    unlockUiClickAudio();
  };
  // Capture phase so we unlock before control handlers run.
  window.addEventListener("pointerdown", unlock, { capture: true, once: false, passive: true });
  window.addEventListener("keydown", unlock, { capture: true, once: false, passive: true });
  window.addEventListener("touchstart", unlock, { capture: true, once: false, passive: true });
}

export function unlockUiClickAudio() {
  if (!AudioContextCtor) return;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioContextCtor();
  void sharedCtx.resume();
  unlocked = true;
}

function playTick(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(UI_CLICK_FREQUENCY, now);
  osc.frequency.exponentialRampToValueAtTime(UI_CLICK_FREQUENCY * 0.72, now + UI_CLICK_DURATION_SECONDS);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(UI_CLICK_GAIN, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + UI_CLICK_DURATION_SECONDS);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + UI_CLICK_DURATION_SECONDS + 0.02);
}

/** Soft UI click for primary controls. Safe to call from click/tap handlers (user gesture). */
export function playUiClick() {
  if (typeof window === "undefined" || !AudioContextCtor) return;
  ensureGestureUnlock();
  // Control handlers run inside a user gesture, so unlock then play.
  unlocked = true;

  const documentVisible =
    typeof document === "undefined" ? true : document.visibilityState === "visible";
  const nowMs = typeof performance !== "undefined" ? performance.now() : Date.now();

  if (
    !canPlayUiClick({
      enabled: enabledGetter(),
      documentVisible,
      unlocked,
      nowMs,
      lastPlayedAtMs,
    })
  ) {
    return;
  }

  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioContextCtor();
  const ctx = sharedCtx;
  lastPlayedAtMs = nowMs;

  void ctx.resume().then(() => {
    try {
      playTick(ctx);
    } catch {
      // Autoplay / closed context — ignore.
    }
  });
}

/** Test helper: reset throttle / unlock state. */
export function resetUiClickForTests(options?: { unlocked?: boolean; lastPlayedAtMs?: number }) {
  lastPlayedAtMs = options?.lastPlayedAtMs ?? 0;
  unlocked = options?.unlocked ?? false;
}
