"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardsPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/dashboard");
        const d = r.ok ? await r.json() : null;
        if (cancelled) return;
        if (d?.id) {
          router.replace(`/dashboards/${d.id}`);
        } else {
          router.replace("/onboarding/start");
        }
      } catch {
        if (!cancelled) router.replace("/");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <AppShell activeTab="/dashboards">
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    </AppShell>
  );
}
