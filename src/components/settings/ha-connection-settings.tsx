"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  CircleCheck,
  CloudSun,
  Copy,
  Eye,
  EyeOff,
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
import {
  SettingsBlockLabel,
  SettingsDisclosure,
  SettingsGroup,
} from "@/components/settings/settings-chrome";

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
  const [showToken, setShowToken] = useState(false);
  const [entitiesOpen, setEntitiesOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
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
  const entityTypeCount = new Set(entities.map((e) => getDomain(e.entity_id)).filter(Boolean)).size;
  const statusDetail = connected
    ? [
        connectionSource === "supervisor" ? t("settings.connection.viaSupervisor") : null,
        hostLabel(baseUrl),
      ]
        .filter(Boolean)
        .join(" · ")
    : t("settings.connection.statusHint");
  const showManualFields = connectionSource !== "supervisor";

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
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-white" title={name}>{name}</span>
            {sameCount > 1 ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-400/20 dark:text-amber-200">
                {t("settings.entities.sameName").replace("{n}", String(sameCount))}
              </span>
            ) : null}
          </div>
          <code className="mt-0.5 block truncate font-mono text-xs text-gray-500 dark:text-gray-400" title={e.entity_id}>
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
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#4b5563] hover:bg-black/[0.05] dark:text-[#c4c4cc] dark:hover:bg-white/10"
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
      <div>
        <SettingsBlockLabel>{t("settings.connection.statusHeading")}</SettingsBlockLabel>
        <SettingsGroup>
          <div className="flex min-h-[68px] items-center gap-4 px-5 py-3">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                connected
                  ? "bg-[rgba(22,163,74,0.12)] text-[#15803d] dark:text-[#4ade80]"
                  : "bg-[rgba(17,24,39,0.05)] text-[#6b7280] dark:bg-white/10 dark:text-[#a1a1aa]"
              )}
            >
              <CircleCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
                {connected ? t("settings.connection.statusConnected") : t("settings.connection.statusDisconnected")}
              </span>
              <span className="mt-0.5 block break-words text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]" title={statusDetail}>
                {statusDetail}
              </span>
            </span>
          </div>
          <div className="flex min-h-[68px] items-center gap-2 border-t border-[rgba(17,24,39,0.08)] px-5 py-3 dark:border-white/10">
            <button
              type="button"
              aria-expanded={entitiesOpen}
              onClick={() => setEntitiesOpen((v) => !v)}
              className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
                  {t("settings.connection.entitySummary")
                    .replace("{count}", String(entities.length || totalInDomains))
                    .replace("{types}", String(entityTypeCount || byDomain.length))}
                </span>
                <span className="mt-0.5 block text-sm text-[#4b5563] dark:text-[#c4c4cc]">
                  {formatSyncedAgo(entitiesSyncedAt, t)}
                </span>
              </span>
              <ChevronRight
                className={cn("h-5 w-5 shrink-0 text-[#6b7280] dark:text-[#a1a1aa]", entitiesOpen && "rotate-90")}
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={() => {
                onRefreshEntities();
                void onTest();
              }}
              disabled={entitiesLoading || testing}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-[15px] font-semibold text-[#111827] disabled:opacity-40 dark:text-[#f3f4f6]"
            >
              {entitiesLoading || testing ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden />
              )}
              {t("settings.entities.refresh")}
            </button>
          </div>
        </SettingsGroup>
      </div>

      {editing || !connected ? (
        <div>
          <SettingsBlockLabel>{t("settings.connection.edit")}</SettingsBlockLabel>
          <SettingsGroup>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {connectionSource === "supervisor" ? (
                <div className="sm:col-span-2">
                  <SettingsAlert tone="ok">{t("settings.connection.supervisorLinked")}</SettingsAlert>
                </div>
              ) : null}
              {showManualFields ? (
                <>
                  <SettingsField label={t("settings.connection.addressLabel")} htmlFor="ha-baseUrl">
                    <SettingsInput
                      id="ha-baseUrl"
                      type="url"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="http://homeassistant.local:8123"
                    />
                  </SettingsField>
                  <SettingsField label={t("settings.connection.tokenLabel")} htmlFor="ha-token">
                    <div className="relative">
                      <SettingsInput
                        id="ha-token"
                        type={showToken ? "text" : "password"}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder={t("settings.connection.tokenPaste")}
                        title={t("settings.connection.tokenPaste")}
                        autoComplete="off"
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken((v) => !v)}
                        className="absolute right-0.5 top-0.5 flex h-11 w-11 items-center justify-center text-[#4b5563] dark:text-[#c4c4cc]"
                        aria-label={showToken ? t("settings.connection.hideToken") : t("settings.connection.showToken")}
                      >
                        {showToken ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                      </button>
                    </div>
                    <p className="mt-2 text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
                      {t("settings.connection.tokenHelp")}
                    </p>
                  </SettingsField>
                </>
              ) : null}
              {testResult ? (
                <div className="sm:col-span-2">
                  <SettingsAlert tone={testResult.ok ? "ok" : "error"}>
                    {testResult.ok ? t("settings.connection.success") : testResult.error}
                  </SettingsAlert>
                </div>
              ) : null}
              {saveMessage === "success" ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-300 sm:col-span-2">{t("settings.connection.saved")}</p>
              ) : null}
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                {showManualFields ? (
                  <SettingsPrimaryButton onClick={onSave} disabled={saving || !token.trim()}>
                    {saving ? t("settings.connection.saving") : t("settings.connection.save")}
                  </SettingsPrimaryButton>
                ) : null}
                <SettingsSecondaryButton onClick={onTest} disabled={testing}>
                  {testing ? t("settings.connection.testing") : t("settings.connection.test")}
                </SettingsSecondaryButton>
              </div>
            </div>
          </SettingsGroup>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex min-h-[68px] w-full items-center rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white px-5 text-left text-base font-medium text-[#111827] dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6]"
        >
          {t("settings.connection.edit")}
        </button>
      )}

      <SettingsDisclosure
        title={t("settings.advanced")}
        hideTitle={t("settings.advanced.hide")}
        hint={t("settings.advanced.connection")}
        open={advancedOpen}
        onToggle={() => setAdvancedOpen((v) => !v)}
      >
        <div className="space-y-3 border-t border-[rgba(17,24,39,0.08)] px-5 py-4 dark:border-white/10">
          {isAddon && connectionSource !== "supervisor" ? (
            <SettingsSecondaryButton onClick={onUseSupervisor} disabled={saving}>
              {t("settings.connection.useSupervisor")}
            </SettingsSecondaryButton>
          ) : null}
          {showManualFields && !isAddon ? (
            <>
              <div className="flex min-h-11 items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#4b5563] dark:text-[#c4c4cc]">
                  {t("settings.connection.discovered")}
                </p>
                <button
                  type="button"
                  onClick={onDiscover}
                  disabled={discovering}
                  className="inline-flex h-11 items-center text-sm font-semibold text-[#111827] disabled:opacity-40 dark:text-[#f3f4f6]"
                >
                  {discovering ? t("settings.connection.discovering") : t("settings.connection.rediscover")}
                </button>
              </div>
              {discoveredInstances.length > 0 ? (
                <ul className="space-y-2">
                  {discoveredInstances.map((inst) => (
                    <li key={inst.baseUrl}>
                      <button
                        type="button"
                        onClick={() => setBaseUrl(inst.baseUrl)}
                        className={cn(
                          "flex min-h-11 w-full flex-col justify-center rounded-xl border px-3 py-2 text-left",
                          baseUrl === inst.baseUrl
                            ? "border-[#111827] dark:border-[#f3f4f6]"
                            : "border-[rgba(17,24,39,0.08)] dark:border-white/10"
                        )}
                      >
                        <span className="text-sm font-medium text-[#111827] dark:text-[#f3f4f6]">{inst.name}</span>
                        <span className="text-xs text-[#4b5563] dark:text-[#c4c4cc]">{inst.baseUrl}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#4b5563] dark:text-[#c4c4cc]">
                  {discovering ? t("settings.connection.discovering") : t("settings.connection.discoverEmpty")}
                </p>
              )}
              <SettingsSecondaryButton onClick={onOauthLogin} disabled={!baseUrl.trim()}>
                {t("settings.connection.oauthLogin")}
              </SettingsSecondaryButton>
            </>
          ) : null}
          {connectionSource === "supervisor" ? (
            <p className="text-sm text-[#4b5563] dark:text-[#c4c4cc]">{t("settings.connection.supervisorLinked")}</p>
          ) : null}
        </div>
      </SettingsDisclosure>

      {entitiesOpen ? (
      <div className="space-y-3 rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white p-4 dark:border-white/10 dark:bg-[#1b1a21]">
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
                      "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold",
                      on
                        ? "bg-[#111827] text-white dark:bg-[#f3f4f6] dark:text-[#111827]"
                        : "bg-[rgba(17,24,39,0.05)] text-[#4b5563] dark:bg-white/10 dark:text-[#c4c4cc]"
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
      ) : null}
    </div>
  );
}
