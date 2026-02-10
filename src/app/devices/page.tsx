import { AppShell } from "@/components/layout/app-shell";

export default function DevicesPage() {
  return (
    <AppShell activeTab="/devices">
      <h2 className="text-xl font-semibold">Devices</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Device discovery — coming in onboarding.</p>
    </AppShell>
  );
}
