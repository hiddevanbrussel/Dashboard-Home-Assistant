"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { GlassCard } from "@/components/layout/glass-card";
import { SettingsToggle } from "@/components/settings/settings-panel";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  HERO_SLIDER_SOURCE_IDS,
  useMusicAssistantStore,
} from "@/stores/music-assistant-store";
import {
  buildMusicAssistantBaseUrl,
  parseMusicAssistantEndpoint,
} from "@/lib/music-assistant-url";

type MaTab = "connection" | "speakers" | "sections" | "playlists";

export function MusicAssistantSettings() {
  const { t } = useTranslation();
  const musicAssistant = useMusicAssistantStore();
  const parsed = parseMusicAssistantEndpoint(musicAssistant.baseUrl);
  const [host, setHost] = useState(parsed.host);
  const [port, setPort] = useState(parsed.port);
  const [https, setHttps] = useState(parsed.protocol === "https");
  const [apiKey, setApiKey] = useState(musicAssistant.token);
  const [maTab, setMaTab] = useState<MaTab>(musicAssistant.enabled ? "speakers" : "connection");
  const [maTestResult, setMaTestResult] = useState<"ok" | string | null>(null);
  const [maTesting, setMaTesting] = useState(false);
  const [maPlayersList, setMaPlayersList] = useState<{ queue_id: string; display_name?: string }[]>([]);
  const [maPlayersLoading, setMaPlayersLoading] = useState(false);
  const [newPlaylistId, setNewPlaylistId] = useState("");

  useEffect(() => {
    const next = parseMusicAssistantEndpoint(musicAssistant.baseUrl);
    setHost(next.host);
    setPort(next.port);
    setHttps(next.protocol === "https");
  }, [musicAssistant.baseUrl]);

  useEffect(() => {
    setApiKey(musicAssistant.token);
  }, [musicAssistant.token]);

  function applyConnectionFields() {
    const url = buildMusicAssistantBaseUrl(host, port, https ? "https" : "http");
    if (url) musicAssistant.setBaseUrl(url);
    musicAssistant.setToken(apiKey.trim());
    return url;
  }

  async function testAndConnect() {
    setMaTestResult(null);
    const url = applyConnectionFields();
    if (!url) {
      setMaTestResult(t("settings.musicAssistant.hostRequired"));
      return;
    }
    if (!apiKey.trim()) {
      setMaTestResult(t("settings.musicAssistant.apiKeyRequired"));
      return;
    }
    setMaTesting(true);
    try {
      const res = await fetch("/api/music-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: url,
          token: apiKey.trim(),
          command: "music/recently_played_items",
          args: { limit: 1 },
        }),
      });
      const data = await res.json();
      if (res.ok && !data?.error) {
        musicAssistant.setEnabled(true);
        setMaTestResult("ok");
      } else {
        setMaTestResult(data?.error ?? t("settings.musicAssistant.testError"));
      }
    } catch (e) {
      setMaTestResult(e instanceof Error ? e.message : t("settings.musicAssistant.testError"));
    } finally {
      setMaTesting(false);
    }
  }

  async function loadSpeakers() {
    setMaPlayersLoading(true);
    setMaPlayersList([]);
    try {
      const res = await fetch("/api/music-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseUrl: musicAssistant.baseUrl,
          token: musicAssistant.token,
          command: "player_queues/all",
          args: {},
        }),
      });
      const data = await res.json();
      if ((data as { error?: string })?.error) return;
      const list = Array.isArray(data)
        ? data
        : ((data as { result?: { queue_id: string; display_name?: string }[] }).result ?? []);
      setMaPlayersList(list);
    } finally {
      setMaPlayersLoading(false);
    }
  }

  const connected = Boolean(musicAssistant.enabled && musicAssistant.baseUrl && musicAssistant.token);

  return (
    <GlassCard>
      <div className="mb-5 space-y-3">
        <SettingsToggle
          checked={musicAssistant.enabled}
          onChange={musicAssistant.setEnabled}
          label={t("settings.musicAssistant.enabled")}
        />
        <div className="flex justify-end">
          <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            connected
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400"
          )}
        >
          {connected ? t("settings.musicAssistant.connected") : t("settings.musicAssistant.notConnected")}
          </span>
        </div>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1 dark:bg-white/10" role="tablist">
        {(["connection", "speakers", "sections", "playlists"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={maTab === tab}
            onClick={() => setMaTab(tab)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              maTab === tab
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {t(`settings.musicAssistant.tabs.${tab}`)}
          </button>
        ))}
      </div>

      {maTab === "connection" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.musicAssistant.connectionHint")}</p>
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <div>
              <label htmlFor="ma-host" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                {t("settings.musicAssistant.host")}
              </label>
              <input
                id="ma-host"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder={t("settings.musicAssistant.hostPlaceholder")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="ma-port" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                {t("settings.musicAssistant.port")}
              </label>
              <input
                id="ma-port"
                type="text"
                inputMode="numeric"
                value={port}
                onChange={(e) => setPort(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="8095"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={https}
              onChange={(e) => setHttps(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#4D2FB2]"
            />
            {t("settings.musicAssistant.useHttps")}
          </label>
          <div>
            <label htmlFor="ma-key" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
              {t("settings.musicAssistant.apiKey")}
            </label>
            <input
              id="ma-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t("settings.musicAssistant.apiKeyPlaceholder")}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-white/5"
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("settings.musicAssistant.apiKeyHint")}</p>
          </div>
          {maTestResult && (
            <div
              className={cn(
                "rounded-lg p-3 text-sm",
                maTestResult === "ok"
                  ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-200"
                  : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200"
              )}
            >
              {maTestResult === "ok" ? t("settings.musicAssistant.testSuccess") : maTestResult}
            </div>
          )}
          <button
            type="button"
            onClick={testAndConnect}
            disabled={maTesting}
            className="rounded-full bg-accent-yellow px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50 dark:bg-accent-green"
          >
            {maTesting ? t("settings.musicAssistant.testing") : t("settings.musicAssistant.connect")}
          </button>
        </div>
      )}

      {maTab === "speakers" && (
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={musicAssistant.allowSpeakerSelection}
              onChange={(e) => musicAssistant.setAllowSpeakerSelection(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-accent-yellow focus:ring-accent-yellow dark:border-white/20 dark:text-accent-green dark:focus:ring-accent-green"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("settings.musicAssistant.allowSpeakerSelection")}
            </span>
          </label>
          {musicAssistant.allowSpeakerSelection && (
            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {t("settings.musicAssistant.allowedSpeakers")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("settings.musicAssistant.allowedSpeakersHint")}
              </p>
              <button
                type="button"
                onClick={loadSpeakers}
                disabled={maPlayersLoading || !musicAssistant.baseUrl}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/10"
              >
                {maPlayersLoading ? t("settings.musicAssistant.testing") : t("settings.musicAssistant.loadSpeakers")}
              </button>
              {maPlayersList.length > 0 && (
                <div className="flex max-h-48 flex-col gap-1.5 overflow-auto">
                  {maPlayersList.map((p) => {
                    const allowed = musicAssistant.allowedSpeakerIds;
                    const isChecked = allowed.length === 0 || allowed.includes(p.queue_id);
                    return (
                      <label key={p.queue_id} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const ids = allowed.length === 0 ? maPlayersList.map((x) => x.queue_id) : [...allowed];
                            if (isChecked) {
                              musicAssistant.setAllowedSpeakerIds(ids.filter((id) => id !== p.queue_id));
                            } else {
                              musicAssistant.setAllowedSpeakerIds([...ids, p.queue_id]);
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-accent-yellow dark:border-white/20 dark:text-accent-green"
                        />
                        <span className="text-gray-700 dark:text-gray-200">{p.display_name ?? p.queue_id}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {maTab === "sections" && (
        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("settings.musicAssistant.musicPageSections")}
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={musicAssistant.sectionFeaturedPlaylistEnabled}
                  onChange={(e) => musicAssistant.setSectionFeaturedPlaylistEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-accent-yellow dark:border-white/20 dark:text-accent-green"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {t("settings.musicAssistant.sectionShowFeaturedPlaylist")}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={musicAssistant.sectionRadioEnabled}
                  onChange={(e) => musicAssistant.setSectionRadioEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-accent-yellow dark:border-white/20 dark:text-accent-green"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {t("settings.musicAssistant.sectionShowRadio")}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={musicAssistant.sectionRecentlyPlayedEnabled}
                  onChange={(e) => musicAssistant.setSectionRecentlyPlayedEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-accent-yellow dark:border-white/20 dark:text-accent-green"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {t("settings.musicAssistant.sectionShowRecentlyPlayed")}
                </span>
              </label>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-white/10 dark:bg-white/5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("settings.musicAssistant.heroSlider")}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("settings.musicAssistant.heroSliderHint")}</p>
            <label className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-200">{t("settings.musicAssistant.heroSliderInterval")}</span>
              <input
                type="number"
                min={1}
                max={120}
                value={Math.round(musicAssistant.heroSliderIntervalMs / 1000)}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (Number.isFinite(v) && v >= 1) musicAssistant.setHeroSliderIntervalMs(v * 1000);
                }}
                className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-white/20 dark:bg-white/5"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("settings.musicAssistant.heroSliderIntervalUnit")}
              </span>
            </label>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {t("settings.musicAssistant.heroSliderSources")}
              </span>
              {HERO_SLIDER_SOURCE_IDS.map((id) => {
                const labelKey =
                  id === "featuredPlaylist"
                    ? "settings.musicAssistant.heroSliderSourceFeatured"
                    : id === "recentlyPlayed"
                      ? "settings.musicAssistant.heroSliderSourceRecent"
                      : "settings.musicAssistant.heroSliderSourceLibrary";
                return (
                  <label key={id} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={musicAssistant.heroSliderSources.includes(id)}
                      onChange={() => musicAssistant.toggleHeroSliderSource(id)}
                      className="h-4 w-4 rounded border-gray-300 text-accent-yellow dark:border-white/20 dark:text-accent-green"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">{t(labelKey)}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("settings.musicAssistant.sectionOrderHint")}</p>
            <div className="flex flex-col gap-1">
              {musicAssistant.sectionOrder.map((id, i) => {
                const labelKey =
                  id === "featuredPlaylist"
                    ? "music.recentlyAdded"
                    : id === "radio"
                      ? "music.radioStations"
                      : "music.recentlyPlayed";
                return (
                  <div key={id} className="flex items-center gap-2 rounded bg-white px-2 py-1.5 dark:bg-white/5">
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">{t(labelKey)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (i <= 0) return;
                        const next = [...musicAssistant.sectionOrder];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        musicAssistant.setSectionOrder(next);
                      }}
                      disabled={i === 0}
                      className="rounded p-1 text-gray-500 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:text-gray-300"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (i >= musicAssistant.sectionOrder.length - 1) return;
                        const next = [...musicAssistant.sectionOrder];
                        [next[i], next[i + 1]] = [next[i + 1], next[i]];
                        musicAssistant.setSectionOrder(next);
                      }}
                      disabled={i === musicAssistant.sectionOrder.length - 1}
                      className="rounded p-1 text-gray-500 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:hover:text-gray-300"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {maTab === "playlists" && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-white/10 dark:bg-white/5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {t("settings.musicAssistant.featuredPlaylistIds")}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("settings.musicAssistant.featuredPlaylistIdsHint")}</p>
          <div className="flex flex-col gap-2">
            {musicAssistant.featuredPlaylistIds.map((playlistId, i) => (
              <div key={`${playlistId}-${i}`} className="flex items-center gap-2">
                <span className="flex-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-white/20 dark:bg-white/5 dark:text-gray-200">
                  {playlistId}
                </span>
                <button
                  type="button"
                  onClick={() => musicAssistant.removeFeaturedPlaylistId(i)}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  aria-label={t("settings.musicAssistant.removePlaylist")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaylistId}
                onChange={(e) => setNewPlaylistId(e.target.value)}
                placeholder="30"
                className="flex-1 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-white/20 dark:bg-white/5"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = newPlaylistId.trim();
                    if (val) {
                      musicAssistant.addFeaturedPlaylistId(val);
                      setNewPlaylistId("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const val = newPlaylistId.trim();
                  if (val) {
                    musicAssistant.addFeaturedPlaylistId(val);
                    setNewPlaylistId("");
                  }
                }}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/10"
              >
                {t("settings.musicAssistant.addPlaylist")}
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
