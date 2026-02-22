"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "./card-icons";

const CARD_WIDTH = 200;
const CARD_HEIGHT = 160;
const DEFAULT_ICON_BG = "#3B82F6";
const ICON_CIRCLE_SIZE = 80;
const ICON_SIZE = 32;

export type RoomPreviewCardProps = {
  areaId: string;
  name: string;
  icon?: string | null;
  iconBackgroundColor?: string | null;
  background?: string | null;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
};

/** Kaartweergave voor de rooms-lijst: 250x200, achtergrond, icoon-badge, naam. Geen entiteiten. */
export function RoomPreviewCard({
  areaId,
  name,
  icon,
  iconBackgroundColor,
  background,
  onEdit,
  onDelete,
}: RoomPreviewCardProps) {
  const IconComponent = icon && icon in CARD_ICONS ? CARD_ICONS[icon] : CARD_ICONS.Home;

  return (
    <Link
      href={`/rooms/${encodeURIComponent(areaId)}`}
      className="group relative block w-[200px] h-[160px] overflow-hidden rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/50 shadow-lg backdrop-blur-2xl transition-all hover:ring-2 hover:ring-[#4D2FB2]/30"
    >
      {background && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/35 dark:bg-black/50" aria-hidden />
        </>
      )}
      <div
        className="absolute left-0 bottom-0 translate-x-[-20%] translate-y-[20%] flex items-center justify-center rounded-full text-white shadow-lg"
        style={{
          backgroundColor: iconBackgroundColor || DEFAULT_ICON_BG,
          width: ICON_CIRCLE_SIZE,
          height: ICON_CIRCLE_SIZE,
        }}
        aria-hidden
      >
        <span className="inline-flex items-center justify-center" style={{ width: ICON_SIZE, height: ICON_SIZE }} aria-hidden>
          <IconComponent className="h-full w-full" />
        </span>
      </div>
      <div className="relative flex h-full flex-col items-end justify-between p-4" style={{ paddingLeft: Math.max(24, ICON_CIRCLE_SIZE * 0.35) }}>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(e);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 dark:bg-black/50 text-gray-600 hover:text-[#4D2FB2] dark:text-gray-300 dark:hover:text-[#4D2FB2] shadow"
              aria-label="Bewerken"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(e);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 dark:bg-black/50 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 shadow"
              aria-label="Verwijderen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p
          className={cn(
            "text-base font-medium truncate w-full text-right drop-shadow-sm",
            background ? "text-white" : "text-gray-900 dark:text-white"
          )}
        >
          {name}
        </p>
      </div>
    </Link>
  );
}
