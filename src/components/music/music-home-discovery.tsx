"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, Disc3, Play, Radio, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MUSIC_IMAGE_BLUR } from "@/lib/music-item-image";

export type MusicHomeTile = {
  key: string;
  title: string;
  subtitle?: string;
  imageSrc: string | null;
  disabled?: boolean;
  onClick: () => void;
};

export type MusicHomeSpotlight = {
  key: string;
  kicker: string;
  title: string;
  subtitle?: string;
  imageSrc: string | null;
  disabled?: boolean;
  onPlay: () => void;
  onOpen?: () => void;
};

export type MusicHomeShelf = {
  id: string;
  title: string;
  variant: "square" | "circle" | "station";
  loading?: boolean;
  items: MusicHomeTile[];
  onSeeAll?: () => void;
};

type Props = {
  greeting: string;
  listenNow: string;
  playLabel: string;
  seeAllLabel: string;
  jumpBackTitle: string;
  jumpBackIn: MusicHomeTile[];
  onJumpBackSeeAll?: () => void;
  spotlights: MusicHomeSpotlight[];
  spotlightIntervalMs?: number;
  shelves: MusicHomeShelf[];
  banner?: string | null;
  emptyLabel?: string | null;
};

export function MusicHomeDiscovery({
  greeting,
  listenNow,
  playLabel,
  seeAllLabel,
  jumpBackTitle,
  jumpBackIn,
  onJumpBackSeeAll,
  spotlights,
  spotlightIntervalMs = 8000,
  shelves,
  banner,
  emptyLabel,
}: Props) {
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightKeys = spotlights.map((slide) => slide.key).join("|");
  const spotlightCount = spotlights.length;
  const spotlight = spotlightCount > 0 ? spotlights[spotlightIndex % spotlightCount] : null;

  useEffect(() => {
    setSpotlightIndex(0);
  }, [spotlightKeys]);

  useEffect(() => {
    if (spotlightCount <= 1) return;
    const interval = Math.max(3000, spotlightIntervalMs);
    const id = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % spotlightCount);
    }, interval);
    return () => window.clearInterval(id);
  }, [spotlightCount, spotlightIntervalMs]);

  const hasContent =
    jumpBackIn.length > 0 || spotlightCount > 0 || shelves.some((shelf) => shelf.loading || shelf.items.length > 0);

  return (
    <div className="space-y-8 pb-10 pt-2">
      <header className="px-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">{listenNow}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          {greeting}
        </h1>
      </header>

      {banner ? (
        <p className="rounded-2xl bg-black/[0.04] px-4 py-3 text-sm text-gray-600 dark:bg-white/8 dark:text-gray-300">
          {banner}
        </p>
      ) : null}

      {jumpBackIn.length > 0 ? (
        <section>
          <SectionHeading
            title={jumpBackTitle}
            seeAllLabel={seeAllLabel}
            onSeeAll={onJumpBackSeeAll}
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {jumpBackIn.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                disabled={item.disabled}
                className="group flex min-w-0 items-center gap-3 rounded-2xl bg-black/[0.04] p-2 text-left transition-colors hover:bg-black/[0.07] disabled:opacity-50 dark:bg-white/8 dark:hover:bg-white/12"
              >
                <Cover imageSrc={item.imageSrc} className="h-14 w-14 shrink-0 rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </span>
                  {item.subtitle ? (
                    <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                      {item.subtitle}
                    </span>
                  ) : null}
                </span>
                <span className="mr-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white group-hover:flex group-focus-visible:flex">
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {spotlight ? (
        <section className="relative overflow-hidden rounded-3xl bg-gray-900 min-h-[220px] sm:min-h-[260px]">
          {spotlights.map((slide, index) => {
            const active = index === spotlightIndex % spotlightCount;
            return (
              <div
                key={slide.key}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-out",
                  active ? "opacity-100 z-10" : "pointer-events-none opacity-0 z-0"
                )}
                aria-hidden={!active}
              >
                {slide.imageSrc ? (
                  <Image
                    src={slide.imageSrc}
                    alt=""
                    fill
                    className="object-cover scale-105"
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL={MUSIC_IMAGE_BLUR}
                    unoptimized
                    priority={index === 0}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand to-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
              </div>
            );
          })}
          <div className="relative z-20 flex min-h-[220px] items-end gap-5 p-5 sm:min-h-[260px] sm:p-8">
            {spotlight.imageSrc ? (
              <button
                type="button"
                onClick={spotlight.onOpen ?? spotlight.onPlay}
                className="relative hidden h-36 w-36 shrink-0 overflow-hidden rounded-2xl shadow-2xl sm:block"
                aria-label={spotlight.title}
              >
                <Image
                  src={spotlight.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="144px"
                  placeholder="blur"
                  blurDataURL={MUSIC_IMAGE_BLUR}
                  unoptimized
                />
              </button>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{spotlight.kicker}</p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{spotlight.title}</h2>
              {spotlight.subtitle ? (
                <p className="mt-1 max-w-xl text-sm text-white/80 sm:text-base">{spotlight.subtitle}</p>
              ) : null}
              <button
                type="button"
                onClick={spotlight.onPlay}
                disabled={spotlight.disabled}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-lg transition-transform hover:scale-[1.03] disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden />
                {playLabel}
              </button>
            </div>
          </div>
          {spotlightCount > 1 ? (
            <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
              {spotlights.map((slide, index) => (
                <button
                  key={slide.key}
                  type="button"
                  onClick={() => setSpotlightIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === spotlightIndex % spotlightCount ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={slide.title}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {shelves.map((shelf) => {
        if (!shelf.loading && shelf.items.length === 0) return null;
        return (
          <section key={shelf.id}>
            <SectionHeading title={shelf.title} seeAllLabel={seeAllLabel} onSeeAll={shelf.onSeeAll} />
            {shelf.loading && shelf.items.length === 0 ? (
              <div className="flex gap-4 overflow-hidden px-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-36 w-36 shrink-0 animate-pulse bg-black/[0.06] dark:bg-white/10",
                      shelf.variant === "circle" ? "rounded-full" : "rounded-2xl"
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="music-h-scroll flex gap-4 overflow-x-auto overflow-y-hidden pb-2 pr-4 scroll-smooth snap-x snap-proximity scrollbar-hide overscroll-x-contain touch-pan-x">
                {shelf.items.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className="group w-36 shrink-0 snap-start text-left disabled:opacity-50 sm:w-40"
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden bg-gray-200 dark:bg-gray-800",
                        shelf.variant === "circle" ? "rounded-full" : "rounded-2xl",
                        "aspect-square"
                      )}
                    >
                      <Cover
                        imageSrc={item.imageSrc}
                        circle={shelf.variant === "circle"}
                        station={shelf.variant === "station"}
                        className="h-full w-full"
                      />
                      {shelf.variant !== "circle" ? (
                        <span className="absolute bottom-2 right-2 hidden h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg group-hover:flex group-focus-visible:flex">
                          <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden />
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                    {item.subtitle ? (
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {!hasContent && emptyLabel ? (
        <p className="px-1 text-sm text-gray-500 dark:text-gray-400">{emptyLabel}</p>
      ) : null}
    </div>
  );
}

function SectionHeading({
  title,
  seeAllLabel,
  onSeeAll,
}: {
  title: string;
  seeAllLabel: string;
  onSeeAll?: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      {onSeeAll ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="flex min-w-0 items-center gap-1 text-left text-xl font-bold text-gray-900 hover:opacity-80 dark:text-white"
        >
          <span className="truncate">{title}</span>
          <ChevronRight className="h-5 w-5 shrink-0 opacity-60" aria-hidden />
        </button>
      ) : (
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      )}
      {onSeeAll ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {seeAllLabel}
        </button>
      ) : null}
    </div>
  );
}

function Cover({
  imageSrc,
  className,
  circle,
  station,
}: {
  imageSrc: string | null;
  className?: string;
  circle?: boolean;
  station?: boolean;
}) {
  return (
    <span className={cn("relative block overflow-hidden bg-gray-200 dark:bg-gray-800", className)}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="160px"
          placeholder="blur"
          blurDataURL={MUSIC_IMAGE_BLUR}
          unoptimized
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-gray-400">
          {circle ? (
            <User className="h-10 w-10" aria-hidden />
          ) : station ? (
            <Radio className="h-10 w-10" aria-hidden />
          ) : (
            <Disc3 className="h-10 w-10" aria-hidden />
          )}
        </span>
      )}
    </span>
  );
}
