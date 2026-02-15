"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/stores/theme-store";

type BackgroundData = {
  background: string | null;
  backgroundLight: string | null;
  backgroundDark: string | null;
};

function fetchDashboardBackground(): Promise<BackgroundData> {
  return fetch("/api/dashboard")
    .then((r) => r.json())
    .then((d) => ({
      background: d?.background ?? null,
      backgroundLight: d?.backgroundLight ?? null,
      backgroundDark: d?.backgroundDark ?? null,
    }))
    .catch(() => ({ background: null, backgroundLight: null, backgroundDark: null }));
}

function fetchRoomBackground(areaId: string): Promise<BackgroundData> {
  return fetch(`/api/room-dashboards/${encodeURIComponent(areaId)}`)
    .then((r) => r.json())
    .then((d) => ({
      background: d?.background ?? null,
      backgroundLight: null,
      backgroundDark: null,
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
  const pathname = usePathname();
  const [data, setData] = useState<BackgroundData>({
    background: null,
    backgroundLight: null,
    backgroundDark: null,
  });
  const resolved = useThemeStore((s) => s.resolved);

  const roomMatch = pathname?.match(/^\/rooms\/([^/]+)$/);
  const areaId = roomMatch?.[1];

  useEffect(() => {
    async function load() {
      if (areaId) {
        const d = await fetchRoomBackground(decodeURIComponent(areaId));
        setData(d);
      } else {
        const d = await fetchDashboardBackground();
        setData(d);
      }
    }
    load();
  }, [areaId]);

  useEffect(() => {
    const onUpdate = () => {
      if (areaId) {
        fetchRoomBackground(decodeURIComponent(areaId)).then(setData);
      } else {
        fetchDashboardBackground().then(setData);
      }
    };
    window.addEventListener("page-background-changed", onUpdate);
    return () => window.removeEventListener("page-background-changed", onUpdate);
  }, [areaId]);

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
