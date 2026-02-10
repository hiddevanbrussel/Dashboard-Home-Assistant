"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/layout/glass-card";

export default function HomePage() {
  return (
    <AppShell activeTab="/dashboards">
      <div className="max-w-md space-y-4">
        <GlassCard>
          <h3 className="text-card-title font-medium text-gray-700 dark:text-gray-200">
            Quick start
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Set up your dashboard in 5–10 minutes with live Home Assistant data.
          </p>
          <Link
            href="/onboarding"
            className="mt-3 inline-block rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-accent-green dark:text-gray-900 hover:dark:bg-accent-green/90"
          >
            Start onboarding
          </Link>
        </GlassCard>
      </div>
    </AppShell>
  );
}
