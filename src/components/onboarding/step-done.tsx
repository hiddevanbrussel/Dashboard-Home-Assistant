"use client";

import { useRouter } from "next/navigation";
import { OnboardingFullscreenLayout } from "./onboarding-fullscreen-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { setOnboardingCompleted } from "@/lib/onboarding-completed";
import { useState } from "react";

export function StepDone() {
  const router = useRouter();
  const { rooms, dashboardId: storedDashboardId, dashboardName: storedDashboardName } =
    useOnboardingStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      let dashboardId = storedDashboardId;
      if (!dashboardId) {
        const res = await fetch("/api/dashboard");
        const d = await res.json();
        if (d?.id) {
          dashboardId = d.id;
        } else {
          const createRes = await fetch("/api/dashboards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: storedDashboardName || "My dashboard",
              theme: "auto",
            }),
          });
          const created = await createRes.json();
          dashboardId = created?.id ?? null;
        }
      }
      if (dashboardId) {
        await fetch(`/api/dashboards/${dashboardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            widgets: JSON.stringify([]),
            layout: JSON.stringify([]),
          }),
        });
      }
      setOnboardingCompleted();
      router.push("/dashboards");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <OnboardingFullscreenLayout
      step={6}
      title="Save"
      subtitle="Create your dashboard and finish. You can add widgets and change settings later in the app."
    >
      <div className="space-y-4 max-w-md">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dashboard name: <strong>{storedDashboardName || "My dashboard"}</strong>
          <br />
          Rooms: {rooms.length}
        </p>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-accent-yellow dark:bg-accent-green px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save and open dashboard"}
        </button>
      </div>
    </OnboardingFullscreenLayout>
  );
}
