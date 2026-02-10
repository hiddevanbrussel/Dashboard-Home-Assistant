import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Eerste letter hoofdletter, rest kleine letters (voor statussen zoals "returning" → "Returning"). */
export function capitalizeFirst(s: string | undefined): string {
  if (s == null || s === "") return s ?? "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
