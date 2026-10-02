"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { hydrateDoorbellStore, useDoorbellStore } from "@/stores/doorbell-store";
import { SettingsPrimaryButton, SettingsSecondaryButton } from "@/components/settings/settings-panel";

/**
 * Dev preview: simulate doorbell visitor off → on (chime + camera popup).
 * No Home Assistant required for the ring path; camera image may 400 without HA.
 */
export default function DoorbellPreviewPage() {
  const setStates = useEntityStateStore((s) => s.setStates);
  const sensorState =
    useEntityStateStore((s) => s.getState("binary_sensor.doorbell_visitor")?.state) ?? "—";
  const settings = useDoorbellStore((s) => s.settings);
  const setSettings = useDoorbellStore((s) => s.setSettings);
  const activeRing = useDoorbellStore((s) => s.activeRing);
  const dismissRing = useDoorbellStore((s) => s.dismissRing);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    hydrateDoorbellStore();
    setSettings({
      enabled: true,
      sensorEntityId: "binary_sensor.doorbell_visitor",
      cameraEntityId: "camera.doorbell_demo",
      playChime: true,
      cooldownMs: 0,
      webrtcStreamUrl: "",
    });
    setStates([
      {
        entity_id: "binary_sensor.doorbell_visitor",
        state: "off",
        attributes: { friendly_name: "Doorbell Visitor" },
      },
      {
        entity_id: "camera.doorbell_demo",
        state: "idle",
        attributes: { friendly_name: "Demo Doorbell Cam" },
      },
    ]);
  }, [setSettings, setStates]);

  function append(msg: string) {
    setLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 12));
  }

  function setVisitor(state: string) {
    const current = useEntityStateStore.getState().states;
    const next = {
      ...current,
      "binary_sensor.doorbell_visitor": {
        entity_id: "binary_sensor.doorbell_visitor",
        state,
        attributes: { friendly_name: "Doorbell Visitor" },
      },
      "camera.doorbell_demo": {
        entity_id: "camera.doorbell_demo",
        state: "idle",
        attributes: { friendly_name: "Demo Doorbell Cam" },
      },
    };
    setStates(Object.values(next));
    append(`binary_sensor.doorbell_visitor → ${state}`);
  }

  function simulateRing() {
    setVisitor("off");
    window.setTimeout(() => {
      setVisitor("on");
      append("Triggered off → on (expect chime + popup)");
    }, 500);
  }

  return (
    <AppShell
      activeTab="/settings"
      showSidebar={false}
      showFloatingToolbar={false}
      welcomeTitle="Doorbell preview"
      welcomeSubtitle="Simulate visitor binary_sensor → chime + camera popup (no HA required for ring)."
    >
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enabled: <strong>{settings.enabled ? "yes" : "no"}</strong> · Sensor:{" "}
          <code className="text-xs">{settings.sensorEntityId || "—"}</code> · State:{" "}
          <strong>{sensorState}</strong> · Popup:{" "}
          <strong>{activeRing ? "open" : "closed"}</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <SettingsPrimaryButton type="button" onClick={simulateRing}>
            Simulate ring (off → on)
          </SettingsPrimaryButton>
          <SettingsSecondaryButton type="button" onClick={() => setVisitor("off")}>
            Set off
          </SettingsSecondaryButton>
          <SettingsSecondaryButton type="button" onClick={() => setVisitor("on")}>
            Set on
          </SettingsSecondaryButton>
          <SettingsSecondaryButton type="button" onClick={() => dismissRing()}>
            Dismiss popup
          </SettingsSecondaryButton>
        </div>
        <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/5">
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Log</p>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
            {log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
