"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useAppNotificationsStore } from "@/stores/app-notifications-store";
import {
  hydrateNotificationRulesStore,
  useNotificationRulesStore,
} from "@/stores/notification-rules-store";
import { createVacuumFinishedRule } from "@/lib/notification-rules";
import { SettingsPrimaryButton, SettingsSecondaryButton } from "@/components/settings/settings-panel";

/**
 * Dev preview: simulate vacuum cleaning → docked to verify in-app notifications.
 * No Home Assistant required.
 */
export default function NotificationsPreviewPage() {
  const setStates = useEntityStateStore((s) => s.setStates);
  const vacuumState = useEntityStateStore((s) => s.getState("vacuum.demo")?.state ?? "—");
  const items = useAppNotificationsStore((s) => s.items);
  const setRules = useNotificationRulesStore((s) => s.setRules);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    hydrateNotificationRulesStore();
    // Ensure vacuum rule is present with zero cooldown for easy re-testing.
    setRules([createVacuumFinishedRule({ cooldownMs: 0 })]);
    setStates([
      {
        entity_id: "vacuum.demo",
        state: "docked",
        attributes: { friendly_name: "Demo Vacuum" },
      },
    ]);
  }, [setRules, setStates]);

  function append(msg: string) {
    setLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 12));
  }

  function setVacuum(state: string) {
    // Keep entity in store across polls by re-seeding full snapshot.
    const current = useEntityStateStore.getState().states;
    const next = {
      ...current,
      "vacuum.demo": {
        entity_id: "vacuum.demo",
        state,
        attributes: { friendly_name: "Demo Vacuum" },
      },
    };
    setStates(Object.values(next));
    append(`vacuum.demo → ${state}`);
  }

  function simulateFinished() {
    setVacuum("cleaning");
    window.setTimeout(() => {
      setVacuum("docked");
      append("Triggered cleaning → docked (expect toast)");
    }, 600);
  }

  return (
    <AppShell
      activeTab="/settings"
      showSidebar={false}
      showFloatingToolbar={false}
      welcomeTitle="Notifications preview"
      welcomeSubtitle="Simulate vacuum finished → toast + header bell (no HA)."
    >
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current <code className="text-xs">vacuum.demo</code> state:{" "}
          <strong>{vacuumState}</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <SettingsPrimaryButton type="button" onClick={simulateFinished}>
            Simulate cleaning → docked
          </SettingsPrimaryButton>
          <SettingsSecondaryButton type="button" onClick={() => setVacuum("cleaning")}>
            Set cleaning
          </SettingsSecondaryButton>
          <SettingsSecondaryButton type="button" onClick={() => setVacuum("returning")}>
            Set returning
          </SettingsSecondaryButton>
          <SettingsSecondaryButton type="button" onClick={() => setVacuum("docked")}>
            Set docked
          </SettingsSecondaryButton>
          <SettingsSecondaryButton type="button" onClick={() => setVacuum("idle")}>
            Set idle
          </SettingsSecondaryButton>
        </div>
        <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/5">
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            History ({items.filter((i) => !i.dismissed).length} active)
          </p>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
            {items.slice(0, 8).map((n) => (
              <li key={n.id}>
                {n.dismissed ? "[dismissed] " : n.toastVisible ? "[toast] " : ""}
                {n.title} — {n.message}
              </li>
            ))}
            {items.length === 0 ? <li>No notifications yet.</li> : null}
          </ul>
        </div>
        <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/5">
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Log</p>
          <ul className="space-y-1 font-mono text-xs text-gray-500 dark:text-gray-400">
            {log.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
