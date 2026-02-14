"use client";

import { useEffect, useState, useMemo } from "react";
import { OnboardingFullscreenLayout } from "./onboarding-fullscreen-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Check } from "lucide-react";

const DOMAIN_FILTERS = [
  "light",
  "switch",
  "climate",
  "sensor",
  "media_player",
  "vacuum",
] as const;

function getDomain(entityId: string): string {
  return entityId.split(".")[0] ?? "";
}

export function StepDiscovery() {
  const { setEntities, entities, connection, selectedEntityIds, toggleEntitySelection } =
    useOnboardingStore();
  const connectionId = connection.connectionId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = connectionId
      ? `/api/ha/entities?connectionId=${encodeURIComponent(connectionId)}`
      : "/api/ha/entities";
    fetch(url)
      .then((r) => {
        if (!r.ok) return r.json().then((body) => ({ error: body?.error ?? "Failed to load" }));
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        if ("error" in data) {
          setError(data.error);
          return;
        }
        if (Array.isArray(data)) setEntities(data);
      })
      .catch(() => {
        if (!cancelled) setError("Connection failed. Check that Home Assistant is reachable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [connectionId, setEntities]);

  const filtered = useMemo(() => {
    let list = entities;
    if (domainFilter) {
      list = list.filter((e) => getDomain(e.entity_id) === domainFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.entity_id.toLowerCase().includes(q) ||
          String((e.attributes as { friendly_name?: string })?.friendly_name ?? "")
            .toLowerCase()
            .includes(q)
      );
    }
    return list;
  }, [entities, domainFilter, search]);

  return (
    <OnboardingFullscreenLayout
      step={3}
      title="Fetch entities"
      subtitle="Entities from your Home Assistant instance. Click an entity (or use the domain tags) to select which entities may be used in your dashboard."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Filter by domain:</span>
          <button
            type="button"
            onClick={() => setDomainFilter(null)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              domainFilter === null
                ? "bg-accent-yellow dark:bg-accent-green text-gray-900"
                : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
            }`}
          >
            All
          </button>
          {DOMAIN_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomainFilter(d)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                domainFilter === d
                  ? "bg-accent-yellow dark:bg-accent-green text-gray-900"
                  : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search by entity_id or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
        />
        {error && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200">
            {error}
            {(error.includes("onboarding") || error.includes("connection")) && (
              <p className="mt-2 text-xs">
                Go back to step 2, test the connection and click &quot;Save and continue&quot;.
              </p>
            )}
          </div>
        )}
        {loading ? (
          <p className="text-sm text-gray-500">Loading entities…</p>
        ) : !error ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedEntityIds.length} selected. Click a row to include or exclude an entity.
            </p>
            <div className="rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-200 dark:divide-white/10 max-h-[360px] overflow-auto">
              {filtered.slice(0, 100).map((e) => {
                const name =
                  (e.attributes as { friendly_name?: string })?.friendly_name ??
                  e.entity_id;
                const selected = selectedEntityIds.includes(e.entity_id);
                return (
                  <button
                    key={e.entity_id}
                    type="button"
                    onClick={() => toggleEntitySelection(e.entity_id)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors ${
                      selected
                        ? "bg-accent-yellow/30 dark:bg-accent-green/30"
                        : "hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="font-medium truncate flex items-center gap-2">
                      {selected && <Check className="h-4 w-4 shrink-0 text-green-600" />}
                      {name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-2 shrink-0">
                      {e.entity_id}
                    </span>
                    <span
                      className="ml-2 shrink-0 rounded px-2 py-0.5 text-xs bg-gray-100 dark:bg-white/10"
                      title="State"
                    >
                      {e.state}
                    </span>
                  </button>
                );
              })}
            </div>
            {filtered.length > 100 && (
              <div className="text-xs text-gray-500">
                First 100 of {filtered.length} shown
              </div>
            )}
          </>
        ) : null}
      </div>
    </OnboardingFullscreenLayout>
  );
}
