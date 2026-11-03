"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

const ARM_MS = 150;
const FIRE_MS = 500;
const SLOP_PX = 10;

export type LongPressPoint = { x: number; y: number };

type Tracking = {
  id: number;
  x: number;
  y: number;
  local: LongPressPoint;
  fired: boolean;
  pressing: boolean;
};

type Options = {
  blocked: boolean;
  onTap: (point: LongPressPoint) => void;
  onFire: (point: LongPressPoint) => void;
};

function localPoint(event: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>): LongPressPoint {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Press 150 ms for feedback, 500 ms to fire. A release before that is a tap.
 * Movement, a second finger, scroll, or a blocked frame cancels both.
 */
export function useLongPress({ blocked, onTap, onFire }: Options) {
  const onTapRef = useRef(onTap);
  const onFireRef = useRef(onFire);
  onTapRef.current = onTap;
  onFireRef.current = onFire;
  const tracking = useRef<Tracking | null>(null);
  const timers = useRef<number[]>([]);
  const suppressClick = useRef(false);
  const touchActive = useRef(false);
  const [pressPoint, setPressPoint] = useState<LongPressPoint | null>(null);

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }

  function stopVisual(current: Tracking | null) {
    if (!current?.pressing) return;
    current.pressing = false;
    setPressPoint(null);
  }

  const cancelRef = useRef<() => void>(() => undefined);
  cancelRef.current = () => {
    const current = tracking.current;
    if (!current) return;
    clearTimers();
    stopVisual(current);
    tracking.current = null;
    touchActive.current = false;
    suppressClick.current = true;
  };

  useEffect(() => {
    if (blocked) cancelRef.current();
  }, [blocked]);

  useEffect(() => {
    const cancel = () => cancelRef.current();
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("scroll", cancel, true);
    return () => {
      clearTimers();
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("scroll", cancel, true);
    };
  }, []);

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (blocked || event.button !== 0) return;
    if (tracking.current) {
      cancelRef.current();
      return;
    }
    const point = localPoint(event);
    const current: Tracking = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      local: point,
      fired: false,
      pressing: false,
    };
    tracking.current = current;
    touchActive.current = event.pointerType === "touch";
    timers.current.push(
      window.setTimeout(() => {
        if (tracking.current !== current || current.fired) return;
        current.pressing = true;
        setPressPoint(current.local);
      }, ARM_MS)
    );
    timers.current.push(
      window.setTimeout(() => {
        if (tracking.current !== current || current.fired) return;
        current.fired = true;
        stopVisual(current);
        suppressClick.current = true;
        navigator.vibrate?.(10);
        onFireRef.current(current.local);
      }, FIRE_MS)
    );
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const current = tracking.current;
    if (!current || event.pointerId !== current.id || current.fired) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (dx * dx + dy * dy > SLOP_PX * SLOP_PX) cancelRef.current();
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    const current = tracking.current;
    if (!current || event.pointerId !== current.id) {
      suppressClick.current = true;
      return;
    }
    const fired = current.fired;
    clearTimers();
    stopVisual(current);
    tracking.current = null;
    touchActive.current = false;
    suppressClick.current = true;
    if (fired || blocked) return;
    onTapRef.current(localPoint(event));
  }

  function onPointerCancel() {
    cancelRef.current();
  }

  function onPointerLeave() {
    const current = tracking.current;
    if (!current || current.fired) return;
    cancelRef.current();
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (suppressClick.current) {
      suppressClick.current = false;
      event.preventDefault();
      return;
    }
    if (blocked) return;
    onTapRef.current({ x: 0, y: 0 });
  }

  function onContextMenu(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    if (touchActive.current || blocked) return;
    onFireRef.current(localPoint(event));
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (blocked) return;
    if (event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey)) {
      event.preventDefault();
      onFireRef.current({ x: 0, y: 0 });
      return;
    }
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      suppressClick.current = true;
      onTapRef.current({ x: 0, y: 0 });
    }
  }

  return {
    pressPoint,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onClick,
    onContextMenu,
    onKeyDown,
  };
}
