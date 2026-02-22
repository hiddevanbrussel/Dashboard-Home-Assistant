"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardsPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) =>
        r.ok
          ? r.json().then((data) => ({ ok: true as const, data }))
          : Promise.resolve({ ok: false as const, data: null })
      )
      .then(({ ok, data: d }) => {
        if (ok && d?.id) {
          router.replace(`/dashboards/${d.id}`);
        } else if (ok && d === null) {
          router.replace("/onboarding/start");
        } else if (!ok) {
          router.replace("/");
        }
      })
      .catch(() => router.replace("/"));
  }, [router]);

  return (
    <AppShell activeTab="/dashboards">
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    </AppShell>
  );
}
