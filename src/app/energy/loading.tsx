import { AppShell } from "@/components/layout/app-shell";

export default function EnergyLoading() {
  return (
    <AppShell activeTab="/energy">
      <div className="flex justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
          aria-hidden
        />
      </div>
    </AppShell>
  );
}
