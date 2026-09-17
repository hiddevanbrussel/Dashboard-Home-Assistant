"use client";

import { useMemo, useState } from "react";
import {
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsSelect,
} from "@/components/settings/settings-panel";
import { useTranslation } from "@/hooks/use-translation";
import {
  ENERGY_ENTITY_FIELDS,
  entityLabel,
  filterEnergySensors,
  type EnergySensorKind,
} from "@/lib/energy-dashboard";
import { useEnergyStore } from "@/stores/energy-store";

type HaEntity = {
  entity_id: string;
  state?: string;
  attributes?: Record<string, unknown>;
};

function optionLabel(entity: HaEntity): string {
  const name = entityLabel(entity);
  return name === entity.entity_id ? name : `${name} · ${entity.entity_id}`;
}

function EntitySelect({
  id,
  value,
  kind,
  entities,
  noneLabel,
  searchPlaceholder,
  onChange,
}: {
  id: string;
  value: string;
  kind: EnergySensorKind;
  entities: HaEntity[];
  noneLabel: string;
  searchPlaceholder: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const options = useMemo(
    () => filterEnergySensors(entities, kind, value, query),
    [entities, kind, value, query]
  );

  return (
    <div className="space-y-2">
      <SettingsInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
      />
      <SettingsSelect id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{noneLabel}</option>
        {options.map((entity) => (
          <option key={entity.entity_id} value={entity.entity_id}>
            {optionLabel(entity)}
          </option>
        ))}
      </SettingsSelect>
    </div>
  );
}

export function EnergyEntitySettings({ entities }: { entities: HaEntity[] }) {
  const { t } = useTranslation();
  const storeEntities = useEnergyStore((s) => s.entities);
  const setEntity = useEnergyStore((s) => s.setEntity);
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const setPanelTempEntityIds = useEnergyStore((s) => s.setPanelTempEntityIds);
  const [panelSearch, setPanelSearch] = useState("");

  const groups = [
    { id: "solar" as const, titleKey: "settings.energy.solar", descriptionKey: "settings.energy.solarHint" },
    { id: "grid" as const, titleKey: "settings.energy.grid", descriptionKey: "settings.energy.gridHint" },
    { id: "battery" as const, titleKey: "settings.energy.batteryEntities", descriptionKey: "settings.energy.batteryEntitiesHint" },
  ];

  const panelOptions = useMemo(
    () => filterEnergySensors(entities, "temperature", "", panelSearch),
    [entities, panelSearch]
  );

  return (
    <>
      {groups.map((group) => (
        <SettingsGroup key={group.id} title={t(group.titleKey)} description={t(group.descriptionKey)}>
          {ENERGY_ENTITY_FIELDS.filter((field) => field.group === group.id).map((field) => (
            <SettingsField
              key={field.key}
              htmlFor={`energy-${field.key}`}
              label={t(field.labelKey)}
              hint={t(field.hintKey)}
            >
              <EntitySelect
                id={`energy-${field.key}`}
                value={storeEntities[field.key]}
                kind={field.kind}
                entities={entities}
                noneLabel={t("settings.energy.entityNone")}
                searchPlaceholder={t("settings.energy.entitySearch")}
                onChange={(value) => setEntity(field.key, value)}
              />
            </SettingsField>
          ))}
        </SettingsGroup>
      ))}

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
