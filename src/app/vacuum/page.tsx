"use client";

import { AppShell } from "@/components/layout/app-shell";
import { VacuumControlView } from "@/components/vacuum/vacuum-control-view";

export default function VacuumPage() {
  return (
    <AppShell activeTab="/vacuum" contentNoScroll>
      <VacuumControlView variant="page" />
    </AppShell>
  );
}
