"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { MediaCardWidget } from "@/components/widgets";
import { OfflinePill } from "@/components/offline-pill";
import { Music2 } from "lucide-react";
import { useMusicAssistantStore, hydrateMusicAssistantStore } from "@/stores/music-assistant-store";

type HaEntity = { entity_id: string; attributes?: Record<string, unknown> };

/** Music Assistant queue/player from player_queues/all (queue_id ≈ player_id). */
type MAPlayer = { queue_id: string; display_name?: string; [key: string]: unknown };

function callMusicAssistant(
  baseUrl: string,
  token: string,
  command: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  return fetch("/api/music-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ baseUrl, token, command, args }),
  }).then((r) => r.json());
}

export default function MusicPage() {
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [maPlayers, setMaPlayers] = useState<MAPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const musicAssistant = useMusicAssistantStore();

  useEffect(() => {
    hydrateMusicAssistantStore();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setMaPlayers([]);
    setEntities([]);

    if (musicAssistant.enabled && musicAssistant.baseUrl) {
      callMusicAssistant(musicAssistant.baseUrl, musicAssistant.token, "player_queues/all")
        .then((data: unknown) => {
          const err = (data as { error?: string })?.error;
          if (err) {
            setError(err);
            return;
          }
          const list = Array.isArray(data) ? data : (data as { result?: MAPlayer[] })?.result ?? [];
          setMaPlayers(list);
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Er is iets misgegaan."))
        .finally(() => setLoading(false));
      return;
    }

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
  }, [musicAssistant.enabled, musicAssistant.baseUrl, musicAssistant.token]);

  const useMA = musicAssistant.enabled;

  return (
    <AppShell activeTab="/music">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Music
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {useMA
                ? "Bedien je spelers via Music Assistant."
                : "Bedien je Sonos en andere media players via Home Assistant."}
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

        {!loading && !error && !useMA && entities.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5 py-16 px-6 text-center">
            <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Geen media players gevonden
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Voeg de Sonos-integratie (of een andere media player) toe in Home Assistant,
              of schakel Music Assistant in onder Instellingen.
            </p>
          </div>
        )}

        {!loading && !error && useMA && maPlayers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5 py-16 px-6 text-center">
            <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Geen spelers gevonden
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Controleer of Music Assistant draait en of er spelers zijn gekoppeld. API-docs: &lt;baseUrl&gt;/api-docs
            </p>
          </div>
        )}

        {!loading && !error && !useMA && entities.length > 0 && (
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

        {!loading && !error && useMA && maPlayers.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {maPlayers.map((p) => {
              const title = (p.display_name as string) ?? p.queue_id ?? String(p.queue_id);
              return (
                <div
                  key={p.queue_id}
                  className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <Music2 className="h-10 w-10 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Music Assistant • {p.queue_id}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Volledige bediening volgt later; spelers worden nu alleen getoond.
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
