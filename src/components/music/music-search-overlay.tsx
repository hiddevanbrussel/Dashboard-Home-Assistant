"use client";

import type { PointerEventHandler, ReactNode, RefObject } from "react";
import Image from "next/image";
import { Disc3, Heart, Play, Radio, Search, User, X } from "lucide-react";
import { SIDEBAR_INSET } from "@/components/layout/sidebar";
import { MUSIC_IMAGE_BLUR } from "@/lib/music-item-image";
import { cn } from "@/lib/utils";

export type MusicSearchMediaType = "track" | "artist" | "album" | "radio";
export type MusicSearchFilter = "all" | MusicSearchMediaType;

export type MusicSearchResult = {
  key: string;
  name: string;
  subtitle: string;
  durationLabel: string;
  mediaType: MusicSearchMediaType;
  imageSrc: string | null;
  canPlay: boolean;
  canOpen: boolean;
  isPlayPending: boolean;
  isFavorited: boolean;
  isFavoritePending: boolean;
  onOpen?: () => void;
  onPlay: () => void;
  onFavorite?: () => void;
  longPress?: {
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
    onPointerLeave?: PointerEventHandler<HTMLElement>;
  };
};

const FILTERS: MusicSearchFilter[] = ["all", "track", "artist", "album", "radio"];

export function MusicSearchOverlay({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  results,
  searching,
  inputRef,
  playerLabel,
  onClose,
  onSubmit,
  t,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  filter: MusicSearchFilter;
  onFilterChange: (filter: MusicSearchFilter) => void;
  results: MusicSearchResult[];
  searching: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  playerLabel?: string | null;
  onClose: () => void;
  onSubmit: () => void;
  t: (key: string) => string;
}) {
  const artists = results.filter((item) => item.mediaType === "artist");
  const albums = results.filter((item) => item.mediaType === "album");
  const tracks = results.filter((item) => item.mediaType === "track");
  const radios = results.filter((item) => item.mediaType === "radio");
  const showGrouped = filter === "all";
  const hasQuery = Boolean(query.trim());
  const empty = results.length === 0;

  return (
    <div
      className="fixed inset-y-0 right-0 z-[100] flex flex-col bg-page-light dark:bg-dark-page"
      style={{ left: SIDEBAR_INSET }}
      role="dialog"
      aria-label={t("music.search")}
    >
      <div className="shrink-0 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
            aria-label={t("music.close")}
          >
            <X className="h-5 w-5" />
          </button>
          <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-black/5 px-4 dark:bg-white/10">
            <Search className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
                if (e.key === "Escape") onClose();
              }}
              placeholder={t("music.searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none dark:text-gray-100"
              aria-label={t("music.search")}
            />
            {query ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="rounded-full p-1 text-gray-500 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={t("music.close")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            {searching ? (
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" aria-hidden />
            ) : null}
          </label>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onFilterChange(id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                filter === id
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-black/5 text-gray-700 hover:bg-black/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
              )}
            >
              {id === "all"
                ? t("music.filterAll")
                : id === "track"
                  ? t("music.filterTrack")
                  : id === "artist"
                    ? t("music.filterArtist")
                    : id === "album"
                      ? t("music.filterAlbum")
                      : t("music.filterRadio")}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-4 pb-10 sm:px-6">
        {playerLabel ? (
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            {t("music.playOn")}: <span className="font-medium text-gray-800 dark:text-gray-200">{playerLabel}</span>
          </p>
        ) : null}

        {empty && searching ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" aria-hidden />
          </div>
        ) : empty && hasQuery ? (
          <div className="mx-auto max-w-lg py-14 text-center">
            <Search className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" aria-hidden />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t("music.noResults")} &quot;{query.trim()}&quot;. {t("music.noResultsTry")}
            </p>
          </div>
        ) : empty ? (
          <p className="mx-auto max-w-lg py-14 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("music.searchHint")}
          </p>
        ) : showGrouped ? (
          <div className="space-y-8">
            {artists.length > 0 ? (
              <SearchShelf title={t("music.filterArtist")}>
                {artists.map((item) => (
                  <SearchTile key={item.key} item={item} variant="circle" />
                ))}
              </SearchShelf>
            ) : null}
            {albums.length > 0 ? (
              <SearchShelf title={t("music.filterAlbum")}>
                {albums.map((item) => (
                  <SearchTile key={item.key} item={item} variant="square" />
                ))}
              </SearchShelf>
            ) : null}
            {tracks.length > 0 ? (
              <section>
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{t("music.filterTrack")}</h3>
                <ul className="space-y-1" role="list">
                  {tracks.map((item) => (
                    <SearchRow key={item.key} item={item} favoriteLabel={t("music.addToFavorites")} playLabel={t("music.playOn")} />
                  ))}
                </ul>
              </section>
            ) : null}
            {radios.length > 0 ? (
              <SearchShelf title={t("music.filterRadio")}>
                {radios.map((item) => (
                  <SearchTile key={item.key} item={item} variant="square" />
                ))}
              </SearchShelf>
            ) : null}
          </div>
        ) : filter === "artist" || filter === "album" || filter === "radio" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => (
              <SearchTile key={item.key} item={item} variant={filter === "artist" ? "circle" : "square"} />
            ))}
          </div>
        ) : (
          <ul className="space-y-1" role="list">
            {results.map((item) => (
              <SearchRow key={item.key} item={item} favoriteLabel={t("music.addToFavorites")} playLabel={t("music.playOn")} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SearchShelf({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">{children}</div>
    </section>
  );
}

function SearchTile({ item, variant }: { item: MusicSearchResult; variant: "square" | "circle" }) {
  const Icon = item.mediaType === "artist" ? User : item.mediaType === "radio" ? Radio : Disc3;
  return (
    <button
      type="button"
      onClick={() => (item.canOpen ? item.onOpen?.() : item.canPlay ? item.onPlay() : undefined)}
      disabled={!item.canOpen && !item.canPlay}
      className="w-28 shrink-0 text-left disabled:opacity-50 sm:w-32"
    >
      <div
        className={cn(
          "relative mx-auto aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700",
          variant === "circle" ? "rounded-full" : "rounded-xl"
        )}
      >
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="128px"
            placeholder="blur"
            blurDataURL={MUSIC_IMAGE_BLUR}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-10 w-10 text-gray-400" aria-hidden />
          </div>
        )}
      </div>
      <p className="mt-1.5 truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
      {item.subtitle ? (
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
      ) : null}
    </button>
  );
}

function SearchRow({
  item,
  favoriteLabel,
  playLabel,
}: {
  item: MusicSearchResult;
  favoriteLabel: string;
  playLabel: string;
}) {
  const Icon = item.mediaType === "artist" ? User : item.mediaType === "radio" ? Radio : Disc3;
  return (
    <li
      className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/5 dark:hover:bg-white/10"
      onPointerDown={item.longPress?.onPointerDown}
      onPointerUp={item.longPress?.onPointerUp}
      onPointerLeave={item.longPress?.onPointerLeave}
    >
      <button
        type="button"
        onClick={() => (item.canOpen ? item.onOpen?.() : item.canPlay ? item.onPlay() : undefined)}
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700"
      >
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
            placeholder="blur"
            blurDataURL={MUSIC_IMAGE_BLUR}
            unoptimized
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden />
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => (item.canOpen ? item.onOpen?.() : item.canPlay ? item.onPlay() : undefined)}
        className="min-w-0 flex-1 text-left"
      >
        <p className="truncate font-medium text-gray-900 dark:text-white">{item.name}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
      </button>
      <span className="shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400">{item.durationLabel}</span>
      {item.onFavorite ? (
        <button
          type="button"
          onClick={item.onFavorite}
          disabled={item.isFavoritePending}
          className={cn(
            "shrink-0 rounded-full p-2",
            item.isFavorited || item.isFavoritePending
              ? "text-red-500"
              : "text-gray-400 hover:text-red-500"
          )}
          aria-label={favoriteLabel}
        >
          <Heart className={cn("h-4 w-4", (item.isFavorited || item.isFavoritePending) && "fill-current")} />
        </button>
      ) : null}
      <button
        type="button"
        onClick={item.onPlay}
        disabled={!item.canPlay || item.isPlayPending}
        className="shrink-0 rounded-full bg-gray-900 p-2 text-white hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-gray-900"
        aria-label={playLabel}
      >
        {item.isPlayPending ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>
    </li>
  );
}
