"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  SettingsAlert,
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsPillTabs,
  SettingsPrimaryButton,
  SettingsSecondaryButton,
  SettingsToggle,
} from "@/components/settings/settings-panel";
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <SettingsToggle
            checked={musicAssistant.enabled}
            onChange={musicAssistant.setEnabled}
            label={t("settings.musicAssistant.enabled")}
          />
        </div>
        <span
          className={cn(
            "self-start rounded-full px-3 py-1 text-xs font-medium sm:self-auto",
            connected
              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
              : "bg-black/5 text-gray-600 dark:bg-white/10 dark:text-gray-400"
          )}
        >
          {connected ? t("settings.musicAssistant.connected") : t("settings.musicAssistant.notConnected")}
        </span>
      </div>

      <SettingsPillTabs
        items={[
          { id: "connection", label: t("settings.musicAssistant.tabs.connection") },
          { id: "speakers", label: t("settings.musicAssistant.tabs.speakers") },
          { id: "sections", label: t("settings.musicAssistant.tabs.sections") },
          { id: "playlists", label: t("settings.musicAssistant.tabs.playlists") },
        ]}
        value={maTab}
        onChange={setMaTab}
      />

      {maTab === "connection" && (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {t("settings.musicAssistant.connectionHint")}
          </p>
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <SettingsField label={t("settings.musicAssistant.host")} htmlFor="ma-host">
              <SettingsInput
                id="ma-host"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder={t("settings.musicAssistant.hostPlaceholder")}
                autoComplete="off"
              />
            </SettingsField>
            <SettingsField label={t("settings.musicAssistant.port")} htmlFor="ma-port">
              <SettingsInput
                id="ma-port"
                type="text"
                inputMode="numeric"
                value={port}
                onChange={(e) => setPort(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="8095"
              />
            </SettingsField>
          </div>
          <SettingsToggle
            checked={https}
            onChange={setHttps}
            label={t("settings.musicAssistant.useHttps")}
          />
          <SettingsField
            label={t("settings.musicAssistant.apiKey")}
            hint={t("settings.musicAssistant.apiKeyHint")}
            htmlFor="ma-key"
          >
            <SettingsInput
              id="ma-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={t("settings.musicAssistant.apiKeyPlaceholder")}
              autoComplete="off"
            />
          </SettingsField>
          {maTestResult ? (
            <SettingsAlert tone={maTestResult === "ok" ? "ok" : "error"}>
              {maTestResult === "ok" ? t("settings.musicAssistant.testSuccess") : maTestResult}
            </SettingsAlert>
          ) : null}
          <SettingsPrimaryButton onClick={testAndConnect} disabled={maTesting}>
            {maTesting ? t("settings.musicAssistant.testing") : t("settings.musicAssistant.connect")}
          </SettingsPrimaryButton>
        </div>
      )}

      {maTab === "speakers" && (
        <div className="space-y-4">
          <SettingsToggle
            checked={musicAssistant.allowSpeakerSelection}
            onChange={musicAssistant.setAllowSpeakerSelection}
            label={t("settings.musicAssistant.allowSpeakerSelection")}
          />
          {musicAssistant.allowSpeakerSelection ? (
            <SettingsGroup
              title={t("settings.musicAssistant.allowedSpeakers")}
              description={t("settings.musicAssistant.allowedSpeakersHint")}
            >
              <SettingsSecondaryButton
                onClick={loadSpeakers}
                disabled={maPlayersLoading || !musicAssistant.baseUrl}
              >
                {maPlayersLoading ? t("settings.musicAssistant.testing") : t("settings.musicAssistant.loadSpeakers")}
              </SettingsSecondaryButton>
              {maPlayersList.length > 0 ? (
                <div className="flex max-h-48 flex-col gap-1.5 overflow-auto">
                  {maPlayersList.map((p) => {
                    const allowed = musicAssistant.allowedSpeakerIds;
                    const isChecked = allowed.length === 0 || allowed.includes(p.queue_id);
                    return (
                      <SettingsCheckRow
                        key={p.queue_id}
                        checked={isChecked}
                        onChange={() => {
                          const ids = allowed.length === 0 ? maPlayersList.map((x) => x.queue_id) : [...allowed];
                          if (isChecked) {
                            musicAssistant.setAllowedSpeakerIds(ids.filter((id) => id !== p.queue_id));
                          } else {
                            musicAssistant.setAllowedSpeakerIds([...ids, p.queue_id]);
                          }
                        }}
                        label={p.display_name ?? p.queue_id}
                      />
                    );
                  })}
                </div>
              ) : null}
            </SettingsGroup>
          ) : null}
        </div>
      )}

      {maTab === "sections" && (
        <div className="space-y-4">
          <SettingsGroup title={t("settings.musicAssistant.musicPageSections")}>
            <SettingsToggle
              checked={musicAssistant.sectionFeaturedPlaylistEnabled}
              onChange={musicAssistant.setSectionFeaturedPlaylistEnabled}
              label={t("settings.musicAssistant.sectionShowFeaturedPlaylist")}
            />
            <SettingsToggle
              checked={musicAssistant.sectionRadioEnabled}
              onChange={musicAssistant.setSectionRadioEnabled}
              label={t("settings.musicAssistant.sectionShowRadio")}
            />
            <SettingsToggle
              checked={musicAssistant.sectionRecentlyPlayedEnabled}
              onChange={musicAssistant.setSectionRecentlyPlayedEnabled}
              label={t("settings.musicAssistant.sectionShowRecentlyPlayed")}
            />
          </SettingsGroup>
          <SettingsGroup
            title={t("settings.musicAssistant.heroSlider")}
            description={t("settings.musicAssistant.heroSliderHint")}
          >
            <SettingsField label={t("settings.musicAssistant.heroSliderInterval")}>
              <div className="flex items-center gap-2">
                <SettingsInput
                  type="number"
                  min={1}
                  max={120}
                  value={Math.round(musicAssistant.heroSliderIntervalMs / 1000)}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isFinite(v) && v >= 1) musicAssistant.setHeroSliderIntervalMs(v * 1000);
                  }}
                  className="w-24"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.musicAssistant.heroSliderIntervalUnit")}
                </span>
              </div>
            </SettingsField>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {t("settings.musicAssistant.heroSliderSources")}
              </p>
              {HERO_SLIDER_SOURCE_IDS.map((id) => {
                const labelKey =
                  id === "featuredPlaylist"
                    ? "settings.musicAssistant.heroSliderSourceFeatured"
                    : id === "recentlyPlayed"
                      ? "settings.musicAssistant.heroSliderSourceRecent"
                      : "settings.musicAssistant.heroSliderSourceLibrary";
                return (
                  <SettingsCheckRow
                    key={id}
                    checked={musicAssistant.heroSliderSources.includes(id)}
                    onChange={() => musicAssistant.toggleHeroSliderSource(id)}
                    label={t(labelKey)}
                  />
                );
              })}
            </div>
          </SettingsGroup>
          <SettingsGroup title={t("settings.musicAssistant.sectionOrderHint")}>
            <div className="flex flex-col gap-1.5">
              {musicAssistant.sectionOrder.map((id, i) => {
                const labelKey =
                  id === "featuredPlaylist"
                    ? "music.recentlyAdded"
                    : id === "radio"
                      ? "music.radioStations"
                      : "music.recentlyPlayed";
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 dark:bg-white/5"
                  >
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
                      className="rounded-full p-1 text-gray-500 hover:bg-black/5 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-white/10 dark:hover:text-gray-200"
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
                      className="rounded-full p-1 text-gray-500 hover:bg-black/5 hover:text-gray-800 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-white/10 dark:hover:text-gray-200"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </SettingsGroup>
        </div>
      )}

      {maTab === "playlists" && (
        <SettingsGroup
          title={t("settings.musicAssistant.featuredPlaylistIds")}
          description={t("settings.musicAssistant.featuredPlaylistIdsHint")}
        >
          <div className="flex flex-col gap-2">
            {musicAssistant.featuredPlaylistIds.map((playlistId, i) => (
              <div key={`${playlistId}-${i}`} className="flex items-center gap-2">
                <span className="flex-1 rounded-2xl bg-white/70 px-3 py-2 text-sm text-gray-900 dark:bg-white/5 dark:text-gray-200">
                  {playlistId}
                </span>
                <button
                  type="button"
                  onClick={() => musicAssistant.removeFeaturedPlaylistId(i)}
                  className="rounded-full p-1.5 text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  aria-label={t("settings.musicAssistant.removePlaylist")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <SettingsInput
                type="text"
                value={newPlaylistId}
                onChange={(e) => setNewPlaylistId(e.target.value)}
                placeholder="30"
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
              <SettingsPrimaryButton
                onClick={() => {
                  const val = newPlaylistId.trim();
                  if (val) {
                    musicAssistant.addFeaturedPlaylistId(val);
                    setNewPlaylistId("");
                  }
                }}
                className="shrink-0"
              >
                {t("settings.musicAssistant.addPlaylist")}
              </SettingsPrimaryButton>
            </div>
          </div>
        </SettingsGroup>
      )}
    </div>
  );
}
