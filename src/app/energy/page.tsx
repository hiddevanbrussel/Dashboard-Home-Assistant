import { AppShell } from "@/components/layout/app-shell";

export default function EnergyPage() {
  return (
    <AppShell activeTab="/energy">
      <h2 className="text-xl font-semibold">Energy</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Energy overview — content coming soon.
      </p>
    </AppShell>
  );
}
