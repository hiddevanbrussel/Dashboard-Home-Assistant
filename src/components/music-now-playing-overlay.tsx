"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Disc3, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { callMusicAssistant } from "@/lib/music-assistant";
import { getMaItemParams } from "@/lib/ma-item-params";
import {
  activeLyricIndex,
  extractTrackLyrics,
  parseLyricsText,
  type LyricLine,
} from "@/lib/lrc-lyrics";
import { MUSIC_IMAGE_BLUR, type MASearchItemImage } from "@/lib/music-item-image";
import { cn } from "@/lib/utils";

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
  currentItem: MASearchItemImage | null | undefined;
  baseUrl: string;
  token: string;
  labels: {
    close: string;
    play: string;
    pause: string;
    previous: string;
    next: string;
    lyrics: string;
    noLyrics: string;
    lyricsLoading: string;
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
  currentItem,
  baseUrl,
  token,
  labels,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricLines, setLyricLines] = useState<LyricLine[]>([]);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);
  const itemKey = useMemo(() => {
    if (!currentItem) return "";
    const uri = (currentItem as { uri?: string }).uri ?? "";
    const id = (currentItem as { item_id?: string | number }).item_id ?? "";
    return `${uri}|${id}|${title}`;
  }, [currentItem, title]);

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

  useEffect(() => {
    if (!open) return;
    const fromItem = extractTrackLyrics(currentItem);
    const initial = parseLyricsText(fromItem.lrc || fromItem.plain);
    if (initial.length > 0) {
      setLyricLines(initial);
      setLyricsLoading(false);
      return;
    }
    if (!currentItem || !baseUrl) {
      setLyricLines([]);
      setLyricsLoading(false);
      return;
    }
    const params = getMaItemParams(currentItem as { uri?: string; item_id?: string | number; provider?: string });
    if (!params) {
      setLyricLines([]);
      setLyricsLoading(false);
      return;
    }
    let cancelled = false;
    setLyricsLoading(true);
    callMusicAssistant(baseUrl, token, "music/tracks/get", {
      item_id: params.item_id,
      provider_instance_id_or_domain: params.provider_instance_id_or_domain,
    })
      .then((data: unknown) => {
        if (cancelled) return;
        const root = data as Record<string, unknown>;
        const track = (root.result && typeof root.result === "object" ? root.result : root) as Record<string, unknown>;
        const extracted = extractTrackLyrics(track);
        setLyricLines(parseLyricsText(extracted.lrc || extracted.plain));
      })
      .catch(() => {
        if (!cancelled) setLyricLines([]);
      })
      .finally(() => {
        if (!cancelled) setLyricsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, itemKey, baseUrl, token, currentItem]);

  const activeIdx = useMemo(() => activeLyricIndex(lyricLines, position), [lyricLines, position]);
  const synced = lyricLines.some((l) => l.time != null);

  useEffect(() => {
    if (!open || activeIdx < 0) return;
    activeLineRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIdx, open]);

  if (!mounted || !open) return null;

  const art = coverSrc || (title ? null : null);

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex flex-col text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${artist}`}
    >
      {/* Blurred album backdrop */}
      <div className="absolute inset-0 overflow-hidden bg-gray-950" aria-hidden>
        {art ? (
          <Image src={art} alt="" fill className="scale-125 object-cover blur-3xl brightness-[0.45] saturate-150" sizes="100vw" unoptimized priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/60 to-gray-950" />
        )}
        <div className="absolute inset-0 bg-black/35" />
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

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-8 px-5 pb-8 pt-2 lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-12">
        {/* Vinyl + cover */}
        <div className="flex w-full flex-col items-center gap-5 lg:w-auto lg:shrink-0">
          <div className="relative mx-auto aspect-square w-[min(78vw,22rem)] sm:w-[min(70vw,26rem)]">
            {/* Vinyl peeking from behind cover */}
            <div
              className="absolute left-[18%] top-1/2 z-0 h-[92%] w-[92%] -translate-y-1/2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
              style={{
                background: `
                  radial-gradient(circle at center, #1a1a1a 0%, #1a1a1a 14%, #0d0d0d 15%, #0d0d0d 16%,
                    #151515 17%, #111 38%, #1c1c1c 39%, #111 40%, #111 58%, #1c1c1c 59%, #0f0f0f 60%, #0a0a0a 100%),
                  repeating-radial-gradient(circle at center, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)
                `,
              }}
              aria-hidden
            >
              <div className="absolute left-1/2 top-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 ring-2 ring-black/40" />
              <div className="absolute left-1/2 top-1/2 h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
            </div>
            {/* Sleeve / cover */}
            <button
              type="button"
              onClick={onPlayPause}
              className="absolute left-0 top-0 z-10 aspect-square w-[78%] overflow-hidden rounded-md shadow-[0_24px_60px_rgba(0,0,0,0.65)] ring-1 ring-white/10 transition-transform active:scale-[0.98]"
              aria-label={isPlaying ? labels.pause : labels.play}
            >
              {art ? (
                <Image src={art} alt="" fill className="object-cover" sizes="360px" placeholder="blur" blurDataURL={MUSIC_IMAGE_BLUR} unoptimized priority />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-white/10">
                  <Disc3 className="h-16 w-16 text-white/50" aria-hidden />
                </span>
              )}
            </button>
          </div>

          <div className="w-full max-w-md text-center lg:text-left">
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

        {/* Lyrics */}
        <section className="flex min-h-0 w-full flex-1 flex-col lg:max-w-xl lg:self-stretch">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{labels.lyrics}</h3>
          <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl bg-black/25 px-5 py-5 backdrop-blur-md scrollbar-hide">
            {lyricsLoading ? (
              <div className="flex h-40 flex-col items-center justify-center gap-3 text-sm text-white/60">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/70 border-t-transparent" aria-hidden />
                {labels.lyricsLoading}
              </div>
            ) : lyricLines.length === 0 ? (
              <p className="py-10 text-center text-sm text-white/50">{labels.noLyrics}</p>
            ) : (
              <div className="space-y-3 pb-16 pt-4">
                {lyricLines.map((line, index) => {
                  const active = synced && index === activeIdx;
                  const near = synced && activeIdx >= 0 && Math.abs(index - activeIdx) === 1;
                  return (
                    <p
                      key={`${index}-${line.text}`}
                      ref={active ? activeLineRef : undefined}
                      className={cn(
                        "text-lg leading-snug transition-all duration-300 sm:text-xl",
                        active
                          ? "scale-[1.02] font-semibold text-white"
                          : near
                            ? "text-white/55"
                            : synced
                              ? "text-white/30"
                              : "text-white/80"
                      )}
                    >
                      {line.text}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </section>
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
