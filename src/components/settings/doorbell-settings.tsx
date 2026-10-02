"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SettingsAlert,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsSecondaryButton,
  SettingsSelect,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { DEFAULT_DOORBELL_COOLDOWN_MS } from "@/lib/doorbell";
import { playDoorbellChime, unlockDoorbellAudio } from "@/lib/doorbell-chime";
import { hydrateDoorbellStore, useDoorbellStore } from "@/stores/doorbell-store";
import { useTranslation } from "@/hooks/use-translation";

type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
};

export function DoorbellSettings() {
  const { t } = useTranslation();
  const settings = useDoorbellStore((s) => s.settings);
  const setSettings = useDoorbellStore((s) => s.setSettings);
  const triggerRing = useDoorbellStore((s) => s.triggerRing);
  const [entities, setEntities] = useState<HaEntity[]>([]);
  const [entitiesError, setEntitiesError] = useState<string | null>(null);

  useEffect(() => {
    hydrateDoorbellStore();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ha/state")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          setEntities(data as HaEntity[]);
          setEntitiesError(null);
        } else {
          setEntities([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntities([]);
          setEntitiesError(t("settings.doorbell.entitiesLoadError"));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const visitorSensors = useMemo(
    () =>
      entities.filter((e) => {
        const id = e.entity_id.toLowerCase();
        return (
          id.startsWith("binary_sensor.") &&
          (id.includes("visitor") ||
            id.includes("doorbell") ||
            id.includes("ding") ||
            id.includes("ring") ||
            id.includes("button"))
        );
      }),
    [entities]
  );

  const otherBinary = useMemo(
    () =>
      entities
        .filter((e) => e.entity_id.startsWith("binary_sensor."))
        .filter((e) => !visitorSensors.some((v) => v.entity_id === e.entity_id))
        .slice(0, 150),
    [entities, visitorSensors]
  );

  const cameras = useMemo(
    () => entities.filter((e) => e.entity_id.startsWith("camera.")),
    [entities]
  );

  function testRing() {
    unlockDoorbellAudio();
    if (settings.playChime) playDoorbellChime();
    triggerRing({ atMs: Date.now() });
  }

  return (
    <div className="space-y-6">
      <SettingsGroup title={t("settings.doorbell")}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("settings.doorbell.intro")}
        </p>
        {entitiesError ? <SettingsAlert tone="error">{entitiesError}</SettingsAlert> : null}

        <SettingsToggle
          checked={settings.enabled}
          onChange={(enabled) => setSettings({ enabled })}
          label={
            settings.enabled ? t("settings.doorbell.on") : t("settings.doorbell.off")
          }
          description={t("settings.doorbell.enabledHint")}
        />

        <SettingsField
          label={t("settings.doorbell.sensor")}
          hint={t("settings.doorbell.sensorHint")}
        >
          <SettingsSelect
            value={settings.sensorEntityId}
            onChange={(e) => setSettings({ sensorEntityId: e.target.value })}
          >
            <option value="">{t("settings.doorbell.selectSensor")}</option>
            {visitorSensors.length > 0 ? (
              <optgroup label={t("settings.doorbell.suggestedSensors")}>
                {visitorSensors.map((e) => (
                  <option key={e.entity_id} value={e.entity_id}>
                    {(e.attributes.friendly_name as string) || e.entity_id}
                  </option>
                ))}
              </optgroup>
            ) : null}
            {otherBinary.length > 0 ? (
              <optgroup label={t("settings.doorbell.otherBinary")}>
                {otherBinary.map((e) => (
                  <option key={e.entity_id} value={e.entity_id}>
                    {(e.attributes.friendly_name as string) || e.entity_id}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </SettingsSelect>
        </SettingsField>

        <SettingsField
          label={t("settings.doorbell.camera")}
          hint={t("settings.doorbell.cameraHint")}
        >
          <SettingsSelect
            value={settings.cameraEntityId}
            onChange={(e) => setSettings({ cameraEntityId: e.target.value })}
          >
            <option value="">{t("settings.doorbell.selectCamera")}</option>
            {cameras.map((e) => (
              <option key={e.entity_id} value={e.entity_id}>
                {(e.attributes.friendly_name as string) || e.entity_id}
              </option>
            ))}
          </SettingsSelect>
        </SettingsField>

        <SettingsToggle
          checked={settings.playChime}
          onChange={(playChime) => setSettings({ playChime })}
          label={t("settings.doorbell.playChime")}
          description={t("settings.doorbell.playChimeHint")}
        />

        <SettingsField
          label={t("settings.doorbell.cooldown")}
          hint={t("settings.doorbell.cooldownHint")}
        >
          <SettingsInput
            type="number"
            min={0}
            step={1}
            value={Math.round(settings.cooldownMs / 1000)}
            onChange={(e) => {
              const sec = Number(e.target.value);
              setSettings({
                cooldownMs:
                  Number.isFinite(sec) && sec >= 0
                    ? Math.round(sec * 1000)
                    : DEFAULT_DOORBELL_COOLDOWN_MS,
              });
            }}
          />
        </SettingsField>

        <SettingsField
          label={t("settings.doorbell.webrtc")}
          hint={t("settings.doorbell.webrtcHint")}
        >
          <SettingsInput
            type="url"
            placeholder="http://homeassistant.local:1984/stream.html?src=doorbell&media=video+audio+microphone"
            value={settings.webrtcStreamUrl}
            onChange={(e) => setSettings({ webrtcStreamUrl: e.target.value })}
          />
        </SettingsField>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("settings.doorbell.talkbackNote")}
        </p>

        <SettingsSecondaryButton type="button" onClick={testRing}>
          {t("settings.doorbell.test")}
        </SettingsSecondaryButton>
      </SettingsGroup>
    </div>
  );
}
