"use client";

import { createContext, useContext, useEffect, useState } from "react";

function fetchBackground(): Promise<string | null> {
  return fetch("/api/dashboard")
    .then((r) => r.json())
    .then((d) => d?.background ?? null)
    .catch(() => null);
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
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBackground().then(setUrl);
    const onUpdate = () => fetchBackground().then(setUrl);
    window.addEventListener("page-background-changed", onUpdate);
    return () => window.removeEventListener("page-background-changed", onUpdate);
  }, []);

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
