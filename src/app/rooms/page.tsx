"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { OfflinePill } from "@/components/offline-pill";
import { DoorOpen, LayoutGrid, ChevronRight } from "lucide-react";

type HaArea = { area_id: string; name: string };

export default function RoomsPage() {
  const [areas, setAreas] = useState<HaArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/ha/areas")
      .then((r) => {
        if (!r.ok) throw new Error("Kon geen kamers laden.");
        return r.json();
      })
      .then((data: HaArea[]) => {
        setAreas(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Er is iets misgegaan."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell activeTab="/rooms">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Kamers
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Klik op een kamer om kaarten toe te voegen — dezelfde editor als het dashboard.
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

        {!loading && !error && areas.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5 py-16 px-6 text-center">
            <DoorOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Geen kamers gevonden
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Voer eerst de onboarding uit om je Home Assistant-verbinding in te stellen.
            </p>
          </div>
        )}

        {!loading && !error && areas.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.area_id}
                href={`/rooms/${encodeURIComponent(a.area_id)}`}
                className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5 transition-colors hover:border-[#4D2FB2]/40 hover:bg-[#4D2FB2]/5 dark:hover:bg-[#4D2FB2]/10"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4D2FB2]/10 text-[#4D2FB2] dark:bg-[#4D2FB2]/20">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-[#4D2FB2]">{a.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.area_id}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-[#4D2FB2]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
