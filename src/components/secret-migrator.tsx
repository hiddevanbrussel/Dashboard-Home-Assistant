"use client";

import { useEffect, useState, type ReactNode } from "react";

const LEGACY = [
  {
    kind: "music-assistant",
    tokenKey: "dashboard.musicAssistant.token",
    urlKey: "dashboard.musicAssistant.baseUrl",
    secretField: "token",
  },
  {
    kind: "immich",
    tokenKey: "dashboard.immich.apiKey",
    urlKey: "dashboard.immich.baseUrl",
    secretField: "apiKey",
  },
  {
    kind: "pexels",
    tokenKey: "dashboard.screensaverPexelsApiKey",
    secretField: "apiKey",
  },
  {
    kind: "valetudo",
    tokenKey: "dashboard.valetudo.password",
    urlKey: "dashboard.valetudo.baseUrl",
    userKey: "dashboard.valetudo.username",
    secretField: "password",
  },
] as const;

async function migrateLegacySecrets(): Promise<void> {
  for (const item of LEGACY) {
    let secret = "";
    let baseUrl = "";
    let username = "";
    try {
      secret = localStorage.getItem(item.tokenKey) ?? "";
      baseUrl = "urlKey" in item && item.urlKey ? localStorage.getItem(item.urlKey) ?? "" : "";
      username = "userKey" in item && item.userKey ? localStorage.getItem(item.userKey) ?? "" : "";
    } catch {
      continue;
    }
    if (!secret.trim()) continue;
    const body: Record<string, string> = { kind: item.kind, [item.secretField]: secret };
    if (baseUrl) body.baseUrl = baseUrl;
    if (username) body.username = username;
    const res = await fetch("/api/integration-credentials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) continue;
    try {
      localStorage.removeItem(item.tokenKey);
    } catch {
      /* ignore */
    }
  }
}

export function SecretMigrator({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login" || path.endsWith("/login")) {
      setReady(true);
      return;
    }
    migrateLegacySecrets()
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;
  return children;
}
