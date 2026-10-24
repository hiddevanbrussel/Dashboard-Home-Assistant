"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyStateCard } from "@/components/layout/empty-state-card";
import { useTranslation } from "@/hooks/use-translation";

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) {
          router.replace(`/dashboards/${d.id}`);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <AppShell activeTab="/dashboards">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t("appShell.loading")}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeTab="/dashboards">
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <EmptyStateCard
          icon={LayoutGrid}
          title={t("home.welcomeTitle")}
          body={t("home.welcomeBody")}
          action={{ label: `${t("home.welcomeAction")} →`, href: "/onboarding" }}
        />
      </div>
    </AppShell>
  );
}
