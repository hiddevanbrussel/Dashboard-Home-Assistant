"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useEntityStateStore } from "@/stores/entity-state-store";

function mockEntities() {
  const rising = new Date();
  rising.setHours(7, 12, 0, 0);
  const setting = new Date();
  setting.setHours(19, 48, 0, 0);
  return [
    {
      entity_id: "weather.home",
      state: "partlycloudy",
      attributes: {
        temperature: 18,
        friendly_name: "Home",
      },
    },
    {
      entity_id: "sensor.weather_temperature",
      state: "18",
      attributes: { unit_of_measurement: "°C", friendly_name: "Temperature" },
    },
    {
      entity_id: "sun.sun",
      state: "above_horizon",
      attributes: {
        next_rising: rising.toISOString(),
        next_setting: setting.toISOString(),
        friendly_name: "Sun",
      },
    },
  ];
}

/** Dev-only preview of header weather + sunrise/sunset (no HA required). */
export default function HeaderSunPreviewPage() {
  const setStates = useEntityStateStore((s) => s.setStates);

  useEffect(() => {
    try {
      localStorage.setItem("dashboard.headerTemperatureEntityId", "weather.home");
    } catch {
      // ignore
    }
    // Re-seed often so HA polling (empty when offline) does not wipe the demo.
    const seed = () => setStates(mockEntities());
    seed();
    const id = setInterval(seed, 1500);
    return () => clearInterval(id);
  }, [setStates]);

  return (
    <AppShell
      activeTab="/dashboards"
      showSidebar={false}
      showFloatingToolbar={false}
      welcomeTitle="Header sun preview"
      welcomeSubtitle="Weather + sunrise/sunset in the top chrome (mock HA data)."
      temperatureEntityId="weather.home"
    >
      <div className="px-4 py-6 text-sm text-gray-600 dark:text-gray-400 sm:px-6">
        Dev preview — mock `sun.sun` and `weather.home` are injected into the entity store.
      </div>
    </AppShell>
  );
}
