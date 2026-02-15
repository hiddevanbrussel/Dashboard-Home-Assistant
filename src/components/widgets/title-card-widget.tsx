"use client";

import { cn } from "@/lib/utils";

export type TitleCardProps = {
  title: string;
  className?: string;
};

/** Categorie-/sectietitel boven kaarten. Geen achtergrond. */
export function TitleCardWidget({ title, className }: TitleCardProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center py-1",
        className
      )}
      aria-hidden
    >
      <h2 className="text-base md:text-lg font-normal text-gray-600 dark:text-gray-300 truncate w-full">
        {title}
      </h2>
    </div>
  );
}
