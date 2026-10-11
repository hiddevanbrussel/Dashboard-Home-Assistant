"use client";

import { useMemo, useState } from "react";
import {
  CloudSun,
  Copy,
  Lightbulb,
  Loader2,
  Plug,
  RefreshCw,
  Search,
  Speaker,
  Thermometer,
  ToggleLeft,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import {
  SettingsAlert,
  SettingsField,
  SettingsInput,
  SettingsPrimaryButton,
  SettingsSecondaryButton,
  SettingsToggle,
} from "@/components/settings/settings-panel";

export type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

export const ENTITY_DOMAINS = [
  "automation",
  "binary_sensor",
  "climate",
  "light",
  "media_player",
  "weather",
] as const;

export type EntityDomain = (typeof ENTITY_DOMAINS)[number];

const DOMAIN_KEYS: Record<EntityDomain, string> = {
  automation: "settings.entities.automation",
  binary_sensor: "settings.entities.binarySensor",
  climate: "settings.entities.climate",
  light: "settings.entities.light",
  media_player: "settings.entities.mediaPlayer",
  weather: "settings.entities.weather",
};

const DOMAIN_ICONS: Record<EntityDomain, LucideIcon> = {
  automation: Workflow,
  binary_sensor: ToggleLeft,
  climate: Thermometer,
  light: Lightbulb,
  media_player: Speaker,
  weather: CloudSun,
};

type EntityBucket = "active" | "idle" | "unavailable";

function getDomain(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

function entityBucket(state: string): EntityBucket {
  const s = state.toLowerCase();
  if (s === "unavailable" || s === "unknown") return "unavailable";
  if (["off", "idle", "standby", "paused", "closed", "docked", "none", "not_home"].includes(s)) {
    return "idle";
  }
  return "active";
}

function hostLabel(baseUrl: string): string {
  try {
    const u = new URL(baseUrl);
    return u.host || baseUrl;
  } catch {
    return baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") || baseUrl;
  }
}

function formatSyncedAgo(at: number | null, t: (key: string) => string): string {
  if (at == null) return t("settings.connection.syncedNever");
  const mins = Math.max(0, Math.round((Date.now() - at) / 60000));
  if (mins < 1) return t("settings.connection.syncedJustNow");
  if (mins === 1) return t("settings.connection.syncedOneMin");
  return t("settings.connection.syncedMins").replace("{n}", String(mins));
}

type DiscoveredInstance = { baseUrl: string; name: string };

type Props = {
  baseUrl: string;
  setBaseUrl: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  connectionSource: "supervisor" | "manual" | null;
  isAddon: boolean;
  testing: boolean;
  saving: boolean;
  testResult: { ok: true } | { ok: false; error: string } | null;
  saveMessage: "success" | "error" | null;
  discoveredInstances: DiscoveredInstance[];
  discovering: boolean;
  onDiscover: () => void;
  onOauthLogin: () => void;
  onUseSupervisor: () => void;
  onTest: () => void;
  onSave: () => void;
  entities: HaEntity[];
  entitiesLoading: boolean;
  entitiesError: string | null;
  entitiesSyncedAt: number | null;
  onRefreshEntities: () => void;
};

export function HaConnectionSettings({
  baseUrl,
  setBaseUrl,
  token,
  setToken,
  connectionSource,
  isAddon,
  testing,
  saving,
  testResult,
  saveMessage,
  discoveredInstances,
  discovering,
  onDiscover,
  onOauthLogin,
  onUseSupervisor,
  onTest,
  onSave,
  entities,
  entitiesLoading,
  entitiesError,
  entitiesSyncedAt,
  onRefreshEntities,
}: Props) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(connectionSource == null);
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const connected =
    connectionSource != null &&
    (entities.length > 0 || (testResult?.ok === true && !entitiesError));

  const byDomain = useMemo(() => {
    const map = new Map<string, HaEntity[]>();
    for (const e of entities) {
      const domain = getDomain(e.entity_id);
      if (!ENTITY_DOMAINS.includes(domain as EntityDomain)) continue;
      if (!map.has(domain)) map.set(domain, []);
      map.get(domain)!.push(e);
    }
    return ENTITY_DOMAINS.map((d) => [d, map.get(d) ?? []] as const).filter(
      ([, list]) => list.length > 0
    );
  }, [entities]);

  const activeDomain =
    selectedDomain && byDomain.some(([d]) => d === selectedDomain)
      ? selectedDomain
      : byDomain[0]?.[0] ?? null;

  const domainList = byDomain.find(([d]) => d === activeDomain)?.[1] ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return domainList.filter((e) => {
      if (hideUnavailable) {
        const bucket = entityBucket(e.state);
        if (bucket === "unavailable") return false;
      }
      if (!q) return true;
      const name = String(e.attributes?.friendly_name ?? "").toLowerCase();
      return e.entity_id.toLowerCase().includes(q) || name.includes(q);
    });
  }, [domainList, hideUnavailable, query]);

  const nameCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of filtered) {
      const name = String(e.attributes?.friendly_name ?? e.entity_id).toLowerCase();
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
  }, [filtered]);

  const grouped = useMemo(() => {
    const buckets: Record<EntityBucket, HaEntity[]> = {
      active: [],
      idle: [],
      unavailable: [],
    };
    for (const e of filtered) {
      buckets[entityBucket(e.state)].push(e);
    }
    for (const key of Object.keys(buckets) as EntityBucket[]) {
      buckets[key].sort((a, b) => {
        const an = String(a.attributes?.friendly_name ?? a.entity_id);
        const bn = String(b.attributes?.friendly_name ?? b.entity_id);
        return an.localeCompare(bn);
      });
    }
    return buckets;
  }, [filtered]);

  const totalInDomains = byDomain.reduce((n, [, list]) => n + list.length, 0);

  async function copyEntityId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
    } catch {
      /* ignore */
    }
  }

  function renderEntityRow(e: HaEntity) {
    const name = (e.attributes?.friendly_name as string) ?? e.entity_id;
    const bucket = entityBucket(e.state);
    const sameCount = nameCounts.get(name.toLowerCase()) ?? 1;
    const DomainIcon = DOMAIN_ICONS[(getDomain(e.entity_id) as EntityDomain) || "light"] ?? Plug;

    return (
      <div
        key={e.entity_id}
        className="flex items-center gap-3 border-t border-black/[0.06] px-3 py-2.5 first:border-t-0 dark:border-white/10"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-gray-500 dark:bg-white/10 dark:text-gray-300">
          <DomainIcon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">{name}</span>
            {sameCount > 1 ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-400/20 dark:text-amber-200">
                {t("settings.entities.sameName").replace("{n}", String(sameCount))}
              </span>
            ) : null}
          </div>
          <code className="mt-0.5 block truncate font-mono text-xs text-gray-500 dark:text-gray-400">
            {e.entity_id}
          </code>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
            bucket === "active" && "bg-sky-100 text-sky-800 dark:bg-sky-400/20 dark:text-sky-200",
            bucket === "idle" && "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
            bucket === "unavailable" &&
              "bg-orange-100 text-orange-800 dark:bg-orange-400/20 dark:text-orange-200"
          )}
        >
          {e.state}
        </span>
        <button
          type="button"
          onClick={() => void copyEntityId(e.entity_id)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-black/[0.05] hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          aria-label={t("settings.entities.copyId")}
          title={copiedId === e.entity_id ? t("settings.entities.copied") : t("settings.entities.copyId")}
        >
          <Copy className="h-4 w-4" aria-hidden />
        </button>
      </div>
    );
  }

  function renderBucket(bucket: EntityBucket, items: HaEntity[]) {
    if (items.length === 0) return null;
    const labelKey =
      bucket === "active"
        ? "settings.entities.groupActive"
        : bucket === "idle"
          ? "settings.entities.groupIdle"
          : "settings.entities.groupUnavailable";
    const dot =
      bucket === "active"
        ? "bg-sky-500"
        : bucket === "idle"
          ? "bg-gray-400"
          : "bg-orange-500";

    return (
      <div key={bucket} className="mt-3 first:mt-0">
        <div className="mb-1 flex items-center gap-2 px-1">
          <span className={cn("h-2 w-2 rounded-full", dot)} aria-hidden />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {t(labelKey)} ({items.length})
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
          {items.map(renderEntityRow)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                connected ? "bg-emerald-500" : "bg-gray-300 dark:bg-white/25"
              )}
              aria-hidden
            />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {connected ? t("settings.connection.statusConnected") : t("settings.connection.statusDisconnected")}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {connected
              ? [
                  hostLabel(baseUrl),
                  t("settings.connection.entitySummary")
                    .replace("{count}", String(totalInDomains || entities.length))
                    .replace("{types}", String(byDomain.length || ENTITY_DOMAINS.length)),
                  formatSyncedAgo(entitiesSyncedAt, t),
                ].join(" · ")
              : t("settings.connection.statusHint")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SettingsSecondaryButton
            onClick={() => {
              onRefreshEntities();
              void onTest();
            }}
            disabled={entitiesLoading || testing}
            className="gap-2"
          >
            {entitiesLoading || testing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden />
            )}
            {t("settings.entities.refresh")}
          </SettingsSecondaryButton>
          {connectionSource !== "supervisor" || editing ? (
            <SettingsPrimaryButton onClick={() => setEditing((v) => !v)}>
              {editing ? t("settings.connection.hideEdit") : t("settings.connection.edit")}
            </SettingsPrimaryButton>
          ) : (
            <SettingsPrimaryButton onClick={() => setEditing(true)}>
              {t("settings.connection.edit")}
            </SettingsPrimaryButton>
          )}
        </div>
      </div>

      {editing || !connected ? (
        <div className="space-y-4 rounded-2xl bg-black/[0.03] p-4 dark:bg-white/5">
          {connectionSource === "supervisor" ? (
            <SettingsAlert tone="ok">{t("settings.connection.supervisorLinked")}</SettingsAlert>
          ) : null}
          {isAddon && connectionSource !== "supervisor" ? (
            <div className="flex flex-wrap gap-2">
              <SettingsPrimaryButton onClick={onUseSupervisor} disabled={saving}>
                {t("settings.connection.useSupervisor")}
              </SettingsPrimaryButton>
            </div>
          ) : null}
          {connectionSource !== "supervisor" ? (
            <>
              {!isAddon ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t("settings.connection.discovered")}
                    </p>
                    <button
                      type="button"
                      onClick={onDiscover}
                      disabled={discovering}
                      className="text-xs font-medium text-gray-600 underline-offset-2 hover:underline disabled:opacity-50 dark:text-gray-300"
                    >
                      {discovering
                        ? t("settings.connection.discovering")
                        : t("settings.connection.rediscover")}
                    </button>
                  </div>
                  {discovering && discoveredInstances.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-white/15 dark:text-gray-400">
                      {t("settings.connection.discovering")}
                    </p>
                  ) : null}
                  {discoveredInstances.length > 0 ? (
                    <ul className="space-y-1">
                      {discoveredInstances.map((inst) => (
                        <li key={inst.baseUrl}>
                          <button
                            type="button"
                            onClick={() => setBaseUrl(inst.baseUrl)}
                            className={cn(
                              "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                              baseUrl === inst.baseUrl
                                ? "border-brand/40 bg-brand/10"
                                : "border-gray-200 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/5"
                            )}
                          >
                            <span className="font-medium text-gray-900 dark:text-white">{inst.name}</span>
                            <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                              {inst.baseUrl}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : !discovering ? (
                    <p className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-white/15 dark:text-gray-400">
                      {t("settings.connection.discoverEmpty")}
                    </p>
                  ) : null}
                  <SettingsPrimaryButton onClick={onOauthLogin} disabled={!baseUrl.trim()}>
                    {t("settings.connection.oauthLogin")}
                  </SettingsPrimaryButton>
                </div>
              ) : null}
              <SettingsField label={t("settings.connection.baseUrl")} htmlFor="ha-baseUrl">
                <SettingsInput
                  id="ha-baseUrl"
                  type="url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="http://homeassistant.local:8123"
                />
              </SettingsField>
              <SettingsField label={t("settings.connection.token")} htmlFor="ha-token">
                <SettingsInput
                  id="ha-token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t("settings.connection.tokenPlaceholder")}
                  autoComplete="off"
                />
              </SettingsField>
            </>
          ) : null}
          {testResult ? (
            <SettingsAlert tone={testResult.ok ? "ok" : "error"}>
              {testResult.ok ? t("settings.connection.success") : testResult.error}
            </SettingsAlert>
          ) : null}
          {saveMessage === "success" ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-300">{t("settings.connection.saved")}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <SettingsPrimaryButton onClick={onTest} disabled={testing}>
              {testing ? t("settings.connection.testing") : t("settings.connection.test")}
            </SettingsPrimaryButton>
            {connectionSource !== "supervisor" ? (
              <SettingsSecondaryButton onClick={onSave} disabled={saving || !token.trim()}>
                {saving ? t("settings.connection.saving") : t("settings.connection.save")}
              </SettingsSecondaryButton>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t("settings.entities")}</h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {t("settings.entities.browserHint")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {t("settings.entities.hideUnavailable")}
            </span>
            <SettingsToggle
              compact
              checked={hideUnavailable}
              onChange={setHideUnavailable}
              label={t("settings.entities.hideUnavailable")}
            />
          </div>
        </div>

        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <SettingsInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("settings.entities.searchPlaceholder")}
            className="pl-9"
            aria-label={t("settings.entities.searchPlaceholder")}
          />
        </label>

        {entitiesLoading && entities.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.entities.loading")}</p>
        ) : entitiesError ? (
          <SettingsAlert tone="error">{entitiesError}</SettingsAlert>
        ) : byDomain.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.entities.empty")}</p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {byDomain.map(([domain, list]) => {
                const Icon = DOMAIN_ICONS[domain];
                const on = domain === activeDomain;
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => setSelectedDomain(domain)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                      on
                        ? "bg-brand text-white shadow-sm"
                        : "bg-black/[0.04] text-gray-700 hover:bg-black/[0.07] dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {t(DOMAIN_KEYS[domain])} {list.length}
                  </button>
                );
              })}
            </div>

            <div className="max-h-[55vh] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.entities.noMatches")}
                </p>
              ) : (
                <>
                  {renderBucket("active", grouped.active)}
                  {renderBucket("idle", grouped.idle)}
                  {renderBucket("unavailable", grouped.unavailable)}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
