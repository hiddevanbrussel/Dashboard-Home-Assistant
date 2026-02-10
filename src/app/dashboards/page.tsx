"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardsPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) {
          router.replace(`/dashboards/${d.id}`);
        } else {
          router.replace("/onboarding/start");
        }
      })
      .catch(() => {
        router.replace("/onboarding/start");
      });
  }, [router]);

  return (
    <AppShell activeTab="/dashboards">
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    </AppShell>
  );
}
