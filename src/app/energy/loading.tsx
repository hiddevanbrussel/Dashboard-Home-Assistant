import { AppShell } from "@/components/layout/app-shell";
import { EnergyPageBackground } from "@/components/energy/energy-page-background";

export default function EnergyLoading() {
  return (
    <AppShell activeTab="/energy" headerFixed>
      <div className="relative min-h-[calc(100dvh-5rem)]">
        <EnergyPageBackground />
        <div className="relative z-[1] flex justify-center pt-14 py-12">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
            aria-hidden
          />
        </div>
      </div>
    </AppShell>
  );
}
