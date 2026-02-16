"use client";

import { cn } from "@/lib/utils";

export type TitleCardProps = {
  title: string;
  subtitle?: string;
  mode?: "title" | "subtitle" | "text" | "both";
  className?: string;
};

/** Categorie-/sectietitel of gewone tekst voor groepering op het bord. Geen achtergrond. */
export function TitleCardWidget({ title, subtitle, mode = "title", className }: TitleCardProps) {
  const showTitle = (mode === "title" || mode === "both") && title?.trim();
  const showSubtitle = (mode === "subtitle" || mode === "both") && (subtitle?.trim() ?? title?.trim());
  const showText = mode === "text" && title?.trim();

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center py-1 min-h-[44px]",
        className
      )}
      aria-hidden
    >
      {showTitle && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight truncate w-full">
          {title?.trim()}
        </h2>
      )}
      {showSubtitle && (
        <p className={cn(
          "font-normal text-gray-600 dark:text-gray-300 truncate w-full",
          showTitle && "mt-1",
          "text-base md:text-lg"
        )}>
          {mode === "subtitle" ? title?.trim() : subtitle?.trim()}
        </p>
      )}
      {showText && (
        <p className="text-base md:text-lg font-normal text-gray-800 dark:text-gray-200 truncate w-full">
          {title?.trim()}
        </p>
      )}
    </div>
  );
}
