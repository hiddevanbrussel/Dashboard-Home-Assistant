"use client";

import { cn } from "@/lib/utils";

export type TitleCardProps = {
  title: string;
  subtitle?: string;
  mode?: "title" | "subtitle" | "both";
  className?: string;
};

/** Categorie-/sectietitel voor groepering op het bord. Geen achtergrond. */
export function TitleCardWidget({ title, subtitle, mode = "title", className }: TitleCardProps) {
  const showTitle = (mode === "title" || mode === "both") && title?.trim();
  const showSubtitle = (mode === "subtitle" || mode === "both") && (subtitle?.trim() ?? title?.trim());

  return (
    <div
      className={cn(
        "flex w-full flex-col justify-center py-1 min-h-0",
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
    </div>
  );
}
