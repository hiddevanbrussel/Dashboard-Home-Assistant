"use client";

import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { mode, setMode, resolved } = useThemeStore();

  const effective = mode === "auto" ? resolved : mode;

  function handleToggle() {
    setMode(effective === "light" ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex items-center rounded-full bg-gray-100 p-0.5 dark:bg-white/10 transition-colors",
        className
      )}
      aria-label={effective === "light" ? "Switch to dark mode" : "Switch to light mode"}
      title={effective === "light" ? "Dark mode" : "Light mode"}
    >
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          effective === "light"
            ? "bg-white text-amber-600 shadow-sm dark:bg-white/20 dark:text-amber-400"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </span>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          effective === "dark"
            ? "bg-white text-indigo-500 shadow-sm dark:bg-white/20 dark:text-indigo-300"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Moon className="h-4 w-4" aria-hidden />
      </span>
    </button>
  );
}
