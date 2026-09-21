"use client";

import { useMemo, useState } from "react";
import {
  SettingsCheckRow,
  SettingsGroup,
  SettingsInput,
} from "@/components/settings/settings-panel";
import { useTranslation } from "@/hooks/use-translation";
import { entityLabel, filterEnergySensors } from "@/lib/energy-dashboard";
import { useEnergyStore } from "@/stores/energy-store";

type HaEntity = {
  entity_id: string;
  state?: string;
  attributes?: Record<string, unknown>;
};

export function EnergyEntitySettings({ entities }: { entities: HaEntity[] }) {
  const { t } = useTranslation();
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const setPanelTempEntityIds = useEnergyStore((s) => s.setPanelTempEntityIds);
  const [panelSearch, setPanelSearch] = useState("");

  const panelOptions = useMemo(
    () => filterEnergySensors(entities, "temperature", "", panelSearch),
    [entities, panelSearch]
  );

  return (
    <>
      <SettingsGroup title={t("settings.energy.entities")} description={t("settings.energy.bindOnPage")} />

      <SettingsGroup title={t("settings.energy.panels")} description={t("settings.energy.panelsHint")}>
        <SettingsInput
          value={panelSearch}
          onChange={(e) => setPanelSearch(e.target.value)}
          placeholder={t("settings.energy.panelsSearch")}
          aria-label={t("settings.energy.panelsSearch")}
        />
        {panelOptions.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("settings.energy.noSensors")}</p>
        ) : (
          <div className="max-h-56 space-y-1.5 overflow-y-auto">
            {panelOptions.slice(0, 60).map((entity) => {
              const checked = panelTempEntityIds.includes(entity.entity_id);
              return (
                <SettingsCheckRow
                  key={entity.entity_id}
                  checked={checked}
                  onChange={(value) => {
                    setPanelTempEntityIds(
                      value
                        ? [...panelTempEntityIds, entity.entity_id]
                        : panelTempEntityIds.filter((id) => id !== entity.entity_id)
                    );
                  }}
                  label={entityLabel(entity)}
                  description={entityLabel(entity) === entity.entity_id ? undefined : entity.entity_id}
                />
              );
            })}
          </div>
        )}
      </SettingsGroup>
    </>
  );
}
