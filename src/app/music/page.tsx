"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MediaCardWidget } from "@/components/widgets";
import { OfflinePill } from "@/components/offline-pill";
import { Music2 } from "lucide-react";

type HaEntity = { entity_id: string; attributes?: Record<string, unknown> };

export default function MusicPage() {
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/ha/entities")
      .then((r) => {
        if (!r.ok) throw new Error("Kon geen verbinding maken met Home Assistant.");
        return r.json();
      })
      .then((data: HaEntity[]) => {
        const list = Array.isArray(data) ? data : [];
        const mediaPlayers = list.filter((e) => e.entity_id?.startsWith("media_player."));
        setEntities(mediaPlayers);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Er is iets misgegaan."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell activeTab="/music">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Music
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bedien je Sonos en andere media players via Home Assistant.
            </p>
          </div>
          <OfflinePill />
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
              aria-hidden
            />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && entities.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5 py-16 px-6 text-center">
            <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Geen media players gevonden
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Voeg de Sonos-integratie (of een andere media player) toe in Home Assistant,
              dan verschijnen je speakers hier.
            </p>
          </div>
        )}

        {!loading && !error && entities.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {entities.map((e) => {
              const title =
                (e.attributes?.friendly_name as string) ?? e.entity_id;
              return (
                <MediaCardWidget
                  key={e.entity_id}
                  title={title}
                  entity_id={e.entity_id}
                  size="md"
                />
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
