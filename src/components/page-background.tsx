"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme-store";

type BackgroundData = {
  background: string | null;
  backgroundLight: string | null;
  backgroundDark: string | null;
};

function fetchBackground(): Promise<BackgroundData> {
  return fetch("/api/dashboard")
    .then((r) => r.json())
    .then((d) => ({
      background: d?.background ?? null,
      backgroundLight: d?.backgroundLight ?? null,
      backgroundDark: d?.backgroundDark ?? null,
    }))
    .catch(() => ({ background: null, backgroundLight: null, backgroundDark: null }));
}

const PageBackgroundContext = createContext<string | null>(null);

export function usePageBackground() {
  return useContext(PageBackgroundContext);
}

export function PageBackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<BackgroundData>({
    background: null,
    backgroundLight: null,
    backgroundDark: null,
  });
  const resolved = useThemeStore((s) => s.resolved);

  useEffect(() => {
    fetchBackground().then(setData);
    const onUpdate = () => fetchBackground().then(setData);
    window.addEventListener("page-background-changed", onUpdate);
    return () => window.removeEventListener("page-background-changed", onUpdate);
  }, []);

  const url =
    (resolved === "dark" ? data.backgroundDark : data.backgroundLight) ??
    data.background ??
    null;

  return (
    <PageBackgroundContext.Provider value={url}>
      {url ? (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${url})` }}
          aria-hidden
        />
      ) : null}
      {children}
    </PageBackgroundContext.Provider>
  );
}
