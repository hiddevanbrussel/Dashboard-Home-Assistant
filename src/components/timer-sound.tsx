"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer-store";

let sharedCtx: AudioContext | null = null;

export function unlockTimerAudio() {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new AudioCtx();
  void sharedCtx.resume();
}

function playChime(ctx: AudioContext) {
  const now = ctx.currentTime;
  const notes = [880, 1174];
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + index * 0.18;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.5);
  });
}

/** Repeats a short chime while the kitchen timer is ringing. */
export function TimerSound() {
  const status = useTimerStore((s) => s.status);

  useEffect(() => {
    if (status !== "ringing") return;
    unlockTimerAudio();
    const ctx = sharedCtx;
    if (!ctx) return;
    let stopped = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const start = async () => {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
      if (stopped) return;
      playChime(ctx);
      intervalId = setInterval(() => {
        if (!stopped) playChime(ctx);
      }, 1600);
    };
    void start();

    return () => {
      stopped = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [status]);

  return null;
}
