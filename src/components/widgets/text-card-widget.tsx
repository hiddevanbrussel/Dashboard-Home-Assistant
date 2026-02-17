"use client";

import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "./card-icons";

export type TextCardProps = {
  text: string;
  type: "title" | "subtitle" | "text";
  show_icon?: boolean;
  icon?: string;
  className?: string;
  onMoreClick?: () => void;
};

/** Tekstkaart: titel, ondertitel of gewone tekst, optioneel met icoon. */
export function TextCardWidget({
  text,
  type,
  show_icon = false,
  icon = "Type",
  className,
  onMoreClick,
}: TextCardProps) {
  const IconComponent = show_icon && icon ? CARD_ICONS[icon] : null;

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 py-2 min-h-[44px] relative",
        className
      )}
      aria-hidden
    >
      {IconComponent && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 dark:bg-black/20">
          <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {type === "title" && (
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
            {text?.trim() || " "}
          </h2>
        )}
        {type === "subtitle" && (
          <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 truncate">
            {text?.trim() || " "}
          </p>
        )}
        {type === "text" && (
          <p className="text-sm md:text-base font-normal text-gray-800 dark:text-gray-200 truncate">
            {text?.trim() || " "}
          </p>
        )}
      </div>
      {onMoreClick && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.button === 0) onMoreClick();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onMoreClick();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors z-20"
          aria-label="Opties"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
