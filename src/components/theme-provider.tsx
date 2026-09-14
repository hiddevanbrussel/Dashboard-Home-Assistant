"use client";

import { applyThemeAccent } from "@/lib/theme-accents";
import { useThemeStore } from "@/stores/theme-store";
import { useCallback, useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, resolved, setResolved, accent } = useThemeStore();

  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    let next: "light" | "dark" = resolved;

    if (mode === "auto") {
      next =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    } else {
      next = mode;
    }

    root.classList.remove("light", "dark");
    root.classList.add(next);
    setResolved(next);
    applyThemeAccent(accent);
  }, [mode, resolved, setResolved, accent]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  useEffect(() => {
    if (mode !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, applyTheme]);

  return (
    <div className="min-h-screen transition-theme duration-theme" data-theme={resolved}>
      {children}
    </div>
  );
}
