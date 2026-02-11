"use client";

import { useEffect, useState, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";
import { useThemeStore } from "@/stores/theme-store";
import { getScreensaverMinutes, setScreensaverMinutes, getScreensaverBackgroundImage, setScreensaverBackgroundImage } from "@/stores/screensaver-store";
import { Image, Link2, List, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsSection = "appearance" | "page-background" | "connection" | "entities";

const SECTIONS: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "page-background", label: "Page Background", icon: Image },
  { id: "connection", label: "Connection", icon: Link2 },
  { id: "entities", label: "Entities by Type", icon: List },
];

type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

const ENTITY_DOMAINS = ["automation", "climate", "light", "media_player", "weather"] as const;

const DOMAIN_LABELS: Record<(typeof ENTITY_DOMAINS)[number], string> = {
  automation: "Automation",
  climate: "Climate",
  light: "Lights",
  media_player: "Media Player",
  weather: "Weather",
};

function getDomain(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

export default function SettingsPage() {
  const [baseUrl, setBaseUrl] = useState("http://homeassistant.local:8123");
  const [token, setToken] = useState("");
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: true } | { ok: false; error: string } | null>(null);
  const [saveMessage, setSaveMessage] = useState<"success" | "error" | null>(null);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [entitiesError, setEntitiesError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [pageBackground, setPageBackground] = useState<string | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [section, setSection] = useState<SettingsSection>("appearance");
  const [screensaverMinutes, setScreensaverMinutesState] = useState(0);
  const [screensaverBackground, setScreensaverBackgroundState] = useState("");
  const [uploadingScreensaverBg, setUploadingScreensaverBg] = useState(false);

  useEffect(() => {
    setScreensaverMinutesState(getScreensaverMinutes());
    setScreensaverBackgroundState(getScreensaverBackgroundImage());
  }, []);

  useEffect(() => {
    fetch("/api/ha/connection")
      .then((r) => r.json())
      .then((d) => {
        if (d?.baseUrl) setBaseUrl(d.baseUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) setDashboardId(d.id);
        if (d?.background != null) setPageBackground(d.background);
      })
      .catch(() => {});
  }, []);

  function loadEntities() {
    setEntitiesError(null);
    setEntitiesLoading(true);
    fetch("/api/ha/entities")
      .then((r) => {
        if (!r.ok) return r.json().then((body) => ({ error: body?.error ?? "Failed to load" }));
        return r.json();
      })
      .then((data) => {
        if ("error" in data) {
          setEntitiesError(data.error);
          setEntities([]);
        } else if (Array.isArray(data)) {
          setEntities(data);
        }
      })
      .catch(() => {
        setEntitiesError("Could not load entities.");
        setEntities([]);
      })
      .finally(() => setEntitiesLoading(false));
  }

  useEffect(() => {
    loadEntities();
  }, [saveMessage]);

  const byDomain = useMemo(() => {
    const map = new Map<string, HaEntity[]>();
    for (const e of entities) {
      const domain = getDomain(e.entity_id);
      if (!ENTITY_DOMAINS.includes(domain as (typeof ENTITY_DOMAINS)[number])) continue;
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)!.push(e);
    }
    return ENTITY_DOMAINS.map((d) => [d, map.get(d) ?? []] as const).filter(
      ([, list]) => list.length > 0
    );
  }, [entities]);

  const activeDomain = selectedDomain && byDomain.some(([d]) => d === selectedDomain)
    ? selectedDomain
    : byDomain[0]?.[0] ?? null;
  const activeList = byDomain.find(([d]) => d === activeDomain)?.[1] ?? [];

  async function handleTest() {
    setTestResult(null);
    setTesting(true);
    try {
      const res = await fetch("/api/ha/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, token }),
      });
      const data = await res.json();
      if (data.ok) setTestResult({ ok: true });
      else setTestResult({ ok: false, error: data.error ?? "Connection failed" });
    } catch (err) {
      setTestResult({ ok: false, error: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    if (!token.trim()) {
      setTestResult({ ok: false, error: "Please enter a token." });
      return;
    }
    setSaveMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/ha/connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, token }),
      });
      const data = await res.json();
      if (data.connectionId) {
        setSaveMessage("success");
        setTestResult({ ok: true });
      } else {
        setSaveMessage("error");
        setTestResult({ ok: false, error: data.error ?? "Save failed" });
      }
    } catch {
      setSaveMessage("error");
      setTestResult({ ok: false, error: "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function handlePageBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !dashboardId) return;
    e.target.value = "";
    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: json.url }),
      });
      setPageBackground(json.url);
      window.dispatchEvent(new Event("page-background-changed"));
    } catch {
      // error could be shown in UI
    } finally {
      setUploadingBg(false);
    }
  }

  async function handlePageBackgroundRemove() {
    if (!dashboardId) return;
    try {
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: null }),
      });
      setPageBackground(null);
      window.dispatchEvent(new Event("page-background-changed"));
    } finally {
      setUploadingBg(false);
    }
  }

  const { mode, setMode, resolved } = useThemeStore();

  return (
    <AppShell activeTab="/settings">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 max-w-4xl">
        <nav
          className="shrink-0 sm:w-52"
          aria-label="Settings sections"
        >
          <h2 className="text-xl font-semibold mb-3 sm:mb-4">Settings</h2>
          <ul className="flex sm:flex-col gap-1 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSection(id)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap",
                    section === id
                      ? "bg-[#4D2FB2] text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          {section === "appearance" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-3">Appearance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Theme: use the sun/moon switch in the top bar to choose light or dark. Enable auto below to follow your system preference.
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mode === "auto"}
                  onChange={(e) => setMode(e.target.checked ? "auto" : resolved)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-white/20 text-accent-yellow dark:text-accent-green focus:ring-accent-yellow dark:focus:ring-accent-green"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Use system preference (auto)
                </span>
              </label>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Screensaver</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Na inactiviteit gaat een schermbeveiliging aan met klok. Aanraken of bewegen sluit hem.
                </p>
                <select
                  value={screensaverMinutes}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setScreensaverMinutesState(v);
                    setScreensaverMinutes(v);
                  }}
                  className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200"
                >
                  <option value={0}>Uit</option>
                  <option value={1}>1 minuut</option>
                  <option value={2}>2 minuten</option>
                  <option value={5}>5 minuten</option>
                  <option value={10}>10 minuten</option>
                  <option value={15}>15 minuten</option>
                  <option value={30}>30 minuten</option>
                </select>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-2">
                  Achtergrondafbeelding (optioneel)
                </p>
                {screensaverBackground && (
                  <div
                    className="mb-3 h-24 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                    style={{ backgroundImage: `url(${screensaverBackground})` }}
                  />
                )}
                <div className="flex flex-wrap gap-2 items-center">
                  <label className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:opacity-90">
                    {uploadingScreensaverBg ? "Uploaden…" : "Afbeelding uploaden"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingScreensaverBg(true);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          const json = await res.json();
                          if (json?.url) {
                            setScreensaverBackgroundState(json.url);
                            setScreensaverBackgroundImage(json.url);
                          }
                        } finally {
                          setUploadingScreensaverBg(false);
                        }
                      }}
                      disabled={uploadingScreensaverBg}
                    />
                  </label>
                  <input
                    type="url"
                    value={screensaverBackground}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setScreensaverBackgroundState(v);
                      setScreensaverBackgroundImage(v);
                    }}
                    placeholder="Of plak een afbeeldings-URL"
                    className="flex-1 min-w-[200px] rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                  />
                  {screensaverBackground && (
                    <button
                      type="button"
                      onClick={() => {
                        setScreensaverBackgroundState("");
                        setScreensaverBackgroundImage("");
                      }}
                      className="rounded-full border border-gray-300 dark:border-white/20 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Verwijderen
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {section === "page-background" && (
            dashboardId ? (
              <GlassCard>
                <h3 className="text-card-title font-medium mb-3">Page Background</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Choose an image as the background for the whole app. Shown on all pages.
                </p>
                {pageBackground && (
                  <div
                    className="mb-3 h-32 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10"
                    style={{ backgroundImage: `url(${pageBackground})` }}
                  />
                )}
                <div className="flex gap-2">
                  <label className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:opacity-90">
                    {uploadingBg ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={handlePageBackgroundUpload}
                      disabled={uploadingBg}
                    />
                  </label>
                  {pageBackground && (
                    <button
                      type="button"
                      onClick={handlePageBackgroundRemove}
                      className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </GlassCard>
            ) : (
              <GlassCard>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create or select a dashboard first to set a page background.
                </p>
              </GlassCard>
            )
          )}

          {section === "connection" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-3">Connection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter your Home Assistant instance URL and a Long-Lived Access Token.
                Create a token under Profile → Long-Lived Access Tokens in Home Assistant.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ha-baseUrl" className="block text-sm font-medium mb-1">
                    Base URL
                  </label>
                  <input
                    id="ha-baseUrl"
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://homeassistant.local:8123"
                    className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="ha-token" className="block text-sm font-medium mb-1">
                    Long-Lived Access Token
                  </label>
                  <input
                    id="ha-token"
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Token (hidden when a connection is already saved)"
                    className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                  />
                </div>
                {testResult && (
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      testResult.ok
                        ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                        : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {testResult.ok ? "Connection successful." : testResult.error}
                  </div>
                )}
                {saveMessage === "success" && (
                  <p className="text-sm text-green-600 dark:text-green-400">Connection saved.</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={testing}
                    className="rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50"
                  >
                    {testing ? "Testing…" : "Test connection"}
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !token.trim()}
                    className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {section === "entities" && (
            <GlassCard>
              <h3 className="text-card-title font-medium mb-2">Entities by Type</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Entities from your Home Assistant instance. Select a type in the tabs.
                Save a connection first to load this list.
              </p>
              {entitiesLoading ? (
                <p className="text-sm text-gray-500">Loading entities…</p>
              ) : entitiesError ? (
                <p className="text-sm text-amber-600 dark:text-amber-400">{entitiesError}</p>
              ) : byDomain.length === 0 ? (
                <p className="text-sm text-gray-500">No entities or no connection saved yet.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="flex flex-wrap gap-1 rounded-full bg-gray-100 dark:bg-white/10 p-1"
                      role="tablist"
                    >
                      {byDomain.map(([domain, list]) => (
                        <button
                          key={domain}
                          type="button"
                          role="tab"
                          aria-selected={domain === activeDomain}
                          onClick={() => setSelectedDomain(domain)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                            domain === activeDomain
                              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                          }`}
                        >
                          {DOMAIN_LABELS[domain as keyof typeof DOMAIN_LABELS] ?? domain}
                          <span className="ml-1 opacity-75">({list.length})</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={loadEntities}
                      className="text-sm text-accent-purple dark:text-accent-green hover:underline shrink-0"
                    >
                      Vernieuwen
                    </button>
                  </div>
                  <div
                    role="tabpanel"
                    className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 p-3 max-h-[50vh] overflow-auto"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 sticky top-0 bg-gray-50/95 dark:bg-white/5 py-1">
                      {activeDomain ? (DOMAIN_LABELS[activeDomain as keyof typeof DOMAIN_LABELS] ?? activeDomain) : ""}
                    </h4>
                    <ul className="space-y-1">
                      {activeList.map((e) => {
                        const name =
                          (e.attributes?.friendly_name as string) ?? e.entity_id;
                        return (
                          <li
                            key={e.entity_id}
                            className="flex items-center justify-between gap-2 text-sm py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/10"
                          >
                            <span className="truncate font-medium" title={e.entity_id}>
                              {name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                              {e.state}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </GlassCard>
          )}
        </div>
      </div>
    </AppShell>
  );
}


