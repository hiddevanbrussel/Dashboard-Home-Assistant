"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Disc3, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { MUSIC_IMAGE_BLUR } from "@/lib/music-item-image";

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
  labels: {
    close: string;
    play: string;
    pause: string;
    previous: string;
    next: string;
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

        {duration > 0 ? (
          <div className="flex w-full max-w-md items-center gap-3 text-xs tabular-nums text-white/60">
            <span className="w-10 shrink-0">{formatClock(position)}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/80 transition-[width] duration-300"
                style={{ width: `${Math.min(100, (position / duration) * 100)}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right">{formatClock(duration)}</span>
          </div>
        ) : null}
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
