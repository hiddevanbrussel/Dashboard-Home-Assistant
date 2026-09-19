"use client";

import { useEffect, useState } from "react";
import {
  SettingsAlert,
  SettingsField,
  SettingsGroup,
  SettingsSelect,
  SettingsToggle,
} from "@/components/settings/settings-panel";
import { useTranslation } from "@/hooks/use-translation";
import { hydrateVoiceSatelliteStore, useVoiceSatelliteStore } from "@/stores/voice-satellite-store";

type PipelineList = {
  pipelines: { id: string; name: string; language?: string }[];
  preferred_pipeline: string | null;
};

export function VoiceSatelliteSettings() {
  const { t } = useTranslation();
  const enabled = useVoiceSatelliteStore((s) => s.enabled);
  const pipelineId = useVoiceSatelliteStore((s) => s.pipelineId);
  const setEnabled = useVoiceSatelliteStore((s) => s.setEnabled);
  const setPipelineId = useVoiceSatelliteStore((s) => s.setPipelineId);
  const [pipelines, setPipelines] = useState<PipelineList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hydrateVoiceSatelliteStore();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/ha/assist/pipelines")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data?.error === "No HA connection"
              ? t("settings.voiceSatellite.noHa")
              : data?.error || t("settings.voiceSatellite.pipelinesError")
          );
        }
        return data as PipelineList;
      })
      .then((list) => {
        if (!cancelled) setPipelines(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("settings.voiceSatellite.pipelinesError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="space-y-4">
      <SettingsToggle
        checked={enabled}
        onChange={setEnabled}
        label={t("settings.voiceSatellite.enabled")}
        description={t("settings.voiceSatellite.enabledHint")}
      />
      <SettingsGroup title={t("settings.voiceSatellite.pipeline")} description={t("settings.voiceSatellite.pipelineHint")}>
        {loading ? <p className="text-sm text-gray-500 dark:text-gray-400">{t("settings.voiceSatellite.loading")}</p> : null}
        {error ? <SettingsAlert tone="error">{error}</SettingsAlert> : null}
        {pipelines ? (
          <SettingsField label={t("settings.voiceSatellite.pipeline")}>
            <SettingsSelect value={pipelineId} onChange={(e) => setPipelineId(e.target.value)}>
              <option value="">{t("settings.voiceSatellite.preferredPipeline")}</option>
              {pipelines.pipelines.map((pipeline) => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                  {pipeline.language ? ` (${pipeline.language})` : ""}
                </option>
              ))}
            </SettingsSelect>
          </SettingsField>
        ) : null}
      </SettingsGroup>
      <SettingsGroup title={t("settings.voiceSatellite.requirements")} description={t("settings.voiceSatellite.requirementsHint")} />
    </div>
  );
}
