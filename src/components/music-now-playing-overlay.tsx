"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Disc3, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { MUSIC_IMAGE_BLUR } from "@/lib/music-item-image";

const SEEK_KEY_DEBOUNCE_MS = 300;
const SEEK_STEP_SECONDS = 1;
const SEEK_PAGE_STEPS = 10;

type SeekKey =
  | "ArrowLeft"
  | "ArrowRight"
  | "ArrowUp"
  | "ArrowDown"
  | "Home"
  | "End"
  | "PageUp"
  | "PageDown";

function isSeekKey(key: string): key is SeekKey {
  switch (key) {
    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown":
    case "Home":
    case "End":
    case "PageUp":
    case "PageDown":
      return true;
    default:
      return false;
  }
}

function clampSeek(value: number, duration: number): number {
  if (!(duration > 0) || !Number.isFinite(value)) return 0;
  return Math.min(duration, Math.max(0, value));
}

function seekKeyPosition(key: SeekKey, current: number, duration: number): number {
  switch (key) {
    case "ArrowRight":
    case "ArrowUp":
      return clampSeek(current + SEEK_STEP_SECONDS, duration);
    case "ArrowLeft":
    case "ArrowDown":
      return clampSeek(current - SEEK_STEP_SECONDS, duration);
    case "PageUp":
      return clampSeek(current + SEEK_STEP_SECONDS * SEEK_PAGE_STEPS, duration);
    case "PageDown":
      return clampSeek(current - SEEK_STEP_SECONDS * SEEK_PAGE_STEPS, duration);
    case "Home":
      return 0;
    case "End":
      return duration > 0 ? duration : 0;
    default: {
      const exhaustive: never = key;
      return exhaustive;
    }
  }
}

function positionsMatch(reported: number, committed: number): boolean {
  return Number.isFinite(reported) && Math.round(reported) === Math.round(committed);
}

function trackPercent(value: number, duration: number): number {
  if (!(duration > 0)) return 0;
  return Math.min(100, (value / duration) * 100);
}

type SeekProps = {
  position: number;
  duration: number;
  seekDisabled: boolean;
  label: string;
  onSeek: (positionSeconds: number) => void;
};

function NowPlayingSeek({ position, duration, seekDisabled, label, onSeek }: SeekProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSeekRef = useRef(onSeek);
  const positionRef = useRef(position);
  const durationRef = useRef(duration);
  const localRef = useRef<number | null>(null);
  const gestureRef = useRef(0);
  const sawInputRef = useRef(false);
  const draggingRef = useRef(false);
  const committedRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const sawBusyRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishDragRef = useRef<() => void>(() => {});
  const [local, setLocal] = useState<number | null>(null);

  onSeekRef.current = onSeek;
  positionRef.current = position;
  durationRef.current = duration;

  function remember(seconds: number) {
    localRef.current = seconds;
    gestureRef.current = seconds;
    setLocal(seconds);
  }

  function clearDebounce() {
    if (debounceRef.current == null) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = null;
  }

  function commitSeek(seconds: number) {
    const clamped = clampSeek(seconds, durationRef.current);
    pendingRef.current = clamped;
    sawBusyRef.current = false;
    remember(clamped);
    onSeekRef.current(clamped);
  }

  function beginDrag(event?: ReactPointerEvent<HTMLInputElement>) {
    if (!(durationRef.current > 0) || draggingRef.current) return;
    clearDebounce();
    draggingRef.current = true;
    committedRef.current = false;
    sawInputRef.current = false;
    const start = localRef.current ?? clampSeek(positionRef.current, durationRef.current);
    gestureRef.current = start;
    remember(start);
    const el = event?.currentTarget;
    if (el && typeof event?.pointerId === "number") {
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is missing in some test environments; pointerup still commits.
      }
    }
  }

  function valueAtRelease(): number {
    const limit = durationRef.current;
    if (sawInputRef.current) return clampSeek(gestureRef.current, limit);
    const el = inputRef.current;
    const fromDom = el ? Number(el.value) : gestureRef.current;
    return clampSeek(Number.isFinite(fromDom) ? fromDom : gestureRef.current, limit);
  }

  function finishDrag() {
    if (!draggingRef.current || committedRef.current) return;
    draggingRef.current = false;
    committedRef.current = true;
    clearDebounce();
    commitSeek(valueAtRelease());
  }

  finishDragRef.current = finishDrag;

  function onSliderInput(event: ChangeEvent<HTMLInputElement>) {
    const next = clampSeek(Number(event.target.value), durationRef.current);
    sawInputRef.current = true;
    remember(next);
  }

  function onSliderKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!isSeekKey(event.key) || !(durationRef.current > 0)) return;
    event.preventDefault();
    draggingRef.current = false;
    committedRef.current = true;
    const current = localRef.current ?? clampSeek(positionRef.current, durationRef.current);
    const next = seekKeyPosition(event.key, current, durationRef.current);
    sawInputRef.current = true;
    remember(next);
    clearDebounce();
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      commitSeek(localRef.current ?? next);
    }, SEEK_KEY_DEBOUNCE_MS);
  }

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const onNativeChange = () => {
      if (!draggingRef.current) return;
      finishDragRef.current();
    };
    el.addEventListener("change", onNativeChange);
    return () => el.removeEventListener("change", onNativeChange);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current != null) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (draggingRef.current || debounceRef.current != null) return;
    if (localRef.current == null || pendingRef.current == null) return;
    if (positionsMatch(position, pendingRef.current)) {
      pendingRef.current = null;
      sawBusyRef.current = false;
      localRef.current = null;
      setLocal(null);
      return;
    }
    if (seekDisabled) {
      sawBusyRef.current = true;
      return;
    }
    // Seek finished without the reported position landing on the commit.
    if (!sawBusyRef.current) return;
    pendingRef.current = null;
    sawBusyRef.current = false;
    localRef.current = null;
    setLocal(null);
  }, [position, seekDisabled]);

  const shown = clampSeek(local ?? position, duration);
  const percent = trackPercent(shown, duration);

  return (
    <div className="flex w-full max-w-md items-center gap-3 text-xs tabular-nums text-white/60">
      <span className="w-10 shrink-0">{formatClock(shown)}</span>
      <div className="relative flex h-11 min-w-0 flex-1 items-center">
        <input
          ref={inputRef}
          type="range"
          min={0}
          max={duration || 100}
          value={shown}
          step={SEEK_STEP_SECONDS}
          disabled={!(duration > 0)}
          aria-busy={seekDisabled ? true : undefined}
          aria-label={label}
          onPointerDown={beginDrag}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onTouchStart={() => beginDrag()}
          onTouchEnd={finishDrag}
          onChange={onSliderInput}
          onKeyDown={onSliderKeyDown}
          className="peer absolute inset-0 h-11 w-full cursor-pointer appearance-none opacity-0 disabled:cursor-default"
        />
        <div className="pointer-events-none absolute inset-x-0 h-1 overflow-hidden rounded-full bg-white/40" aria-hidden>
          <div className="h-full rounded-full bg-white" style={{ width: `${percent}%` }} />
        </div>
        <span
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow peer-focus-visible:ring-2 ring-white ring-offset-2 ring-offset-black/40"
          style={{ left: `${percent}%` }}
          aria-hidden
        />
      </div>
      <span className="w-10 shrink-0 text-right">{formatClock(duration)}</span>
    </div>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  coverSrc: string | null;
  title: string;
  artist: string;
  isPlaying: boolean;
  position: number;
  duration: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (positionSeconds: number) => void;
  seekDisabled?: boolean;
  labels: {
    close: string;
    play: string;
    pause: string;
    previous: string;
    next: string;
    position: string;
  };
};

export function MusicNowPlayingOverlay({
  open,
  onClose,
  coverSrc,
  title,
  artist,
  isPlaying,
  position,
  duration,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  seekDisabled = false,
  labels,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex flex-col text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${artist}`}
    >
      <div className="absolute inset-0 overflow-hidden bg-gray-950" aria-hidden>
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt=""
            fill
            className="scale-125 object-cover blur-3xl brightness-[0.45] saturate-150"
            sizes="100vw"
            unoptimized
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/60 to-gray-950" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex items-center justify-end px-4 pt-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          aria-label={labels.close}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-5 pb-10">
        <button
          type="button"
          onClick={onPlayPause}
          className="relative aspect-square w-[min(78vw,22rem)] overflow-hidden rounded-2xl shadow-[0_28px_70px_rgba(0,0,0,0.65)] ring-1 ring-white/15 transition-transform active:scale-[0.98] sm:w-[min(60vw,26rem)]"
          aria-label={isPlaying ? labels.pause : labels.play}
        >
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt=""
              fill
              className="object-cover"
              sizes="420px"
              placeholder="blur"
              blurDataURL={MUSIC_IMAGE_BLUR}
              unoptimized
              priority
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-white/10">
              <Disc3 className="h-16 w-16 text-white/50" aria-hidden />
            </span>
          )}
        </button>

        <div className="w-full max-w-md text-center">
          <h2 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title || "—"}</h2>
          <p className="mt-1 truncate text-base text-white/70 sm:text-lg">{artist || "—"}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevious}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label={labels.previous}
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onPlayPause}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-transform active:scale-[0.96]"
            aria-label={isPlaying ? labels.pause : labels.play}
          >
            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label={labels.next}
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <NowPlayingSeek
          position={position}
          duration={duration}
          seekDisabled={seekDisabled}
          label={labels.position}
          onSeek={onSeek}
        />
      </div>
    </div>,
    document.body
  );
}

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
