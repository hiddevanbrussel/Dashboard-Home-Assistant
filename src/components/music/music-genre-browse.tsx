"use client";

import {
  AudioLines,
  FlaskConical,
  Guitar,
  Music2,
  Radio,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { genreStyleFor, type MusicGenre, type MusicGenreStyle } from "@/lib/music-genres";

const GENRE_ICONS: Record<MusicGenreStyle, LucideIcon> = {
  music: Music2,
  pop: FlaskConical,
  dance: Radio,
  classical: AudioLines,
  experimental: FlaskConical,
  rock: Zap,
  electronic: AudioLines,
  songwriter: Guitar,
};

const WAVE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 48' preserveAspectRatio='none'><path d='M0 24 C20 8 40 40 60 24 S100 8 120 24 160 40 180 24 220 8 240 24' fill='none' stroke='white' stroke-opacity='0.28' stroke-width='1.6'/><path d='M0 30 C20 14 40 46 60 30 S100 14 120 30 160 46 180 30 220 14 240 30' fill='none' stroke='white' stroke-opacity='0.16' stroke-width='1.4'/></svg>\")";

type Props = {
  title: string;
  items: MusicGenre[];
  onSelect: (genre: MusicGenre) => void;
};

export function MusicGenreBrowse({ title, items, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="px-1">
      <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((genre) => {
          const Icon = GENRE_ICONS[genreStyleFor(genre.key)];
          return (
            <button
              key={genre.key}
              type="button"
              onClick={() => onSelect(genre)}
              className={cn(
                "flex h-12 items-center justify-between gap-3 rounded-full bg-[#00B4F5] px-5 text-left text-white shadow-sm",
                "bg-right bg-no-repeat transition-transform hover:scale-[1.015] hover:brightness-105"
              )}
              style={{ backgroundImage: WAVE, backgroundSize: "140% 100%" }}
            >
              <span className="truncate text-sm font-medium">{genre.name}</span>
              <Icon className="h-5 w-5 shrink-0 opacity-95" aria-hidden />
            </button>
          );
        })}
      </div>
    </section>
  );
}
