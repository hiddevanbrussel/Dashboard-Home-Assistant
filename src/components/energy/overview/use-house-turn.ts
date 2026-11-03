"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { HouseSide } from "@/lib/energy-now";

/** Back returns to the front after two minutes without a pointer, key or wheel. */
export const HOUSE_BACK_IDLE_MS = 120_000;

const SPIN_OUT_MS = 160;
const SPIN_IN_MS = 160;
const FADE_OUT_MS = 80;
const FADE_IN_MS = 150;
const CROSSFADE_HALF_MS = 100;

const REST_STYLE: CSSProperties = { transformStyle: "preserve-3d" };

type MotionFlags = {
  reducedMotion: boolean;
  hidden: boolean;
  screensaver: boolean;
};

/**
 * Local front/back state. Nothing is stored.
 * A full turn is 550 ms: labels out, rotate to the edge, swap, rotate back, labels in.
 * Reduced motion is a 200 ms opacity crossfade and never sets rotateY.
 */
export function useHouseTurn(frameRef: RefObject<HTMLElement | null>, motion: MotionFlags) {
  const [side, setSide] = useState<HouseSide>("front");
  const [busy, setBusy] = useState(false);
  const [overlays, setOverlays] = useState<"in" | "out">("in");
  const [frameStyle, setFrameStyle] = useState<CSSProperties>(REST_STYLE);
  const [flip, setFlip] = useState(0);
  const [fadeIn, setFadeIn] = useState(0);
  const sideRef = useRef<HouseSide>("front");
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);
  const generation = useRef(0);
  const reducedRef = useRef(motion.reducedMotion);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocus = useRef(false);
  const pendingFocus = useRef(false);
  const phase = useRef<"idle" | "swap">("idle");
  const turnToRef = useRef<(next: HouseSide) => void>(() => undefined);
  const snapFrontRef = useRef<() => void>(() => undefined);
  reducedRef.current = motion.reducedMotion;

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  function later(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }

  function applySide(next: HouseSide) {
    sideRef.current = next;
    setSide(next);
  }

  function restFrame() {
    const node = frameRef.current;
    if (node) {
      node.style.transition = "none";
      node.style.transform = "";
      node.style.opacity = "";
    }
    setFrameStyle(REST_STYLE);
    setOverlays("in");
  }

  function finishTurn() {
    phase.current = "idle";
    restFrame();
    busyRef.current = false;
    setBusy(false);
    if (restoreFocus.current) pendingFocus.current = true;
  }

  function snapFront() {
    generation.current += 1;
    phase.current = "idle";
    clearTimers();
    applySide("front");
    restFrame();
    restoreFocus.current = false;
    pendingFocus.current = false;
    busyRef.current = false;
    setBusy(false);
  }

  function turnTo(next: HouseSide, viaButton = false) {
    if (busyRef.current || next === sideRef.current) return;
    const reduced = reducedRef.current;
    generation.current += 1;
    const generationAtStart = generation.current;
    busyRef.current = true;
    const hadFocus = document.activeElement === buttonRef.current;
    restoreFocus.current = hadFocus || viaButton;
    setBusy(true);
    clearTimers();

    if (reduced) {
      setOverlays("in");
      setFrameStyle({ transformStyle: "preserve-3d", opacity: 0, transition: "opacity 100ms linear" });
      later(CROSSFADE_HALF_MS, () => {
        if (generation.current !== generationAtStart) return;
        phase.current = "swap";
        applySide(next);
        setFadeIn((value) => value + 1);
      });
      later(CROSSFADE_HALF_MS * 2, () => {
        if (generation.current !== generationAtStart) return;
        finishTurn();
      });
      return;
    }

    setOverlays("out");
    later(FADE_OUT_MS, () => {
      if (generation.current !== generationAtStart) return;
      setFrameStyle({
        transformStyle: "preserve-3d",
        transform: "rotateY(-90deg)",
        transition: `transform ${SPIN_OUT_MS}ms ease-in`,
      });
    });
    later(FADE_OUT_MS + SPIN_OUT_MS, () => {
      if (generation.current !== generationAtStart) return;
      phase.current = "swap";
      applySide(next);
      setFlip((value) => value + 1);
    });
    later(FADE_OUT_MS + SPIN_OUT_MS + SPIN_IN_MS, () => {
      if (generation.current !== generationAtStart) return;
      setOverlays("in");
    });
    later(FADE_OUT_MS + SPIN_OUT_MS + SPIN_IN_MS + FADE_IN_MS, () => {
      if (generation.current !== generationAtStart) return;
      finishTurn();
    });
  }

  function activate() {
    if (busyRef.current) return;
    turnTo(sideRef.current === "front" ? "back" : "front", true);
  }

  turnToRef.current = turnTo;
  snapFrontRef.current = snapFront;

  useEffect(() => {
    if (busy || !pendingFocus.current) return;
    pendingFocus.current = false;
    restoreFocus.current = false;
    buttonRef.current?.focus();
  }, [busy]);

  useLayoutEffect(() => {
    if (flip === 0 || phase.current !== "swap") return;
    const node = frameRef.current;
    if (!node || reducedRef.current) return;
    node.style.transition = "none";
    node.style.transform = "rotateY(90deg)";
    void node.offsetHeight;
    if (phase.current !== "swap") return;
    node.style.transition = `transform ${SPIN_IN_MS}ms ease-out`;
    node.style.transform = "rotateY(0deg)";
    setFrameStyle({
      transformStyle: "preserve-3d",
      transform: "rotateY(0deg)",
      transition: `transform ${SPIN_IN_MS}ms ease-out`,
    });
  }, [flip, frameRef]);

  useLayoutEffect(() => {
    if (fadeIn === 0 || phase.current !== "swap") return;
    const node = frameRef.current;
    if (!node) return;
    node.style.transition = "none";
    node.style.transform = "";
    node.style.opacity = "0";
    void node.offsetHeight;
    if (phase.current !== "swap") return;
    node.style.transition = "opacity 100ms linear";
    node.style.opacity = "1";
    setFrameStyle({ transformStyle: "preserve-3d", opacity: 1, transition: "opacity 100ms linear" });
  }, [fadeIn, frameRef]);

  useEffect(() => {
    if (side !== "back") return;
    let timer = window.setTimeout(() => turnToRef.current("front"), HOUSE_BACK_IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => turnToRef.current("front"), HOUSE_BACK_IDLE_MS);
    };
    const onHide = () => {
      if (document.hidden) snapFrontRef.current();
    };
    document.addEventListener("pointerdown", reset);
    document.addEventListener("keydown", reset);
    document.addEventListener("wheel", reset);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", reset);
      document.removeEventListener("keydown", reset);
      document.removeEventListener("wheel", reset);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [side]);

  useEffect(() => {
    if (side === "back" && (motion.hidden || motion.screensaver)) snapFrontRef.current();
  }, [motion.hidden, motion.screensaver, side]);

  useEffect(() => () => clearTimers(), []);

  return { side, busy, busyRef, overlays, frameStyle, turnTo, activate, buttonRef };
}
