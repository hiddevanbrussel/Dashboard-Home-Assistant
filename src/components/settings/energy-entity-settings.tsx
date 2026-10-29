"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import {
  SettingsCheckRow,
  SettingsField,
  SettingsGroup,
  SettingsInput,
  SettingsSelect,
} from "@/components/settings/settings-panel";
import { useTranslation } from "@/hooks/use-translation";
import { entityLabel, filterEnergySensors, type EnergyTariffMode } from "@/lib/energy-dashboard";
import { cn } from "@/lib/utils";
import { useEnergyStore } from "@/stores/energy-store";

type HaEntity = {
  entity_id: string;
  state?: string;
  attributes?: Record<string, unknown>;
};

const choice = cn(
  "inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-xl border px-4 text-[15px] font-semibold outline-none",
  FOCUS_RING_BRAND
);

const choiceSelected =
  "bg-[#4700B5] text-white border-[#4700B5] dark:bg-[#8357be] dark:text-white dark:border-[#8357be] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1b1a21]";

const choiceIdle = "border-[#767b85] text-[#111827] dark:border-[#6b6b75] dark:text-[#f3f4f6]";

export function EnergyEntitySettings({ entities }: { entities: HaEntity[] }) {
  const { t } = useTranslation();
  const panelTempEntityIds = useEnergyStore((s) => s.panelTempEntityIds);
  const setPanelTempEntityIds = useEnergyStore((s) => s.setPanelTempEntityIds);
  const energyEntities = useEnergyStore((s) => s.entities);
  const setEntity = useEnergyStore((s) => s.setEntity);
  const gridPowerInverted = useEnergyStore((s) => s.gridPowerInverted);
  const setGridPowerInverted = useEnergyStore((s) => s.setGridPowerInverted);
  const tariffMode = useEnergyStore((s) => s.tariffMode);
  const setTariffMode = useEnergyStore((s) => s.setTariffMode);
  const [panelSearch, setPanelSearch] = useState("");
  const storedSplit = Boolean(energyEntities.gridImportPowerEntityId || energyEntities.gridExportPowerEntityId);
  const [modeChoice, setModeChoice] = useState<"signed" | "split" | null>(null);
  const mode = modeChoice ?? (storedSplit ? "split" : "signed");

  const panelOptions = useMemo(
    () => filterEnergySensors(entities, "temperature", "", panelSearch),
    [entities, panelSearch]
  );
  const powerOptions = useMemo(() => filterEnergySensors(entities, "power"), [entities]);

  function chooseMode(next: "signed" | "split") {
    setModeChoice(next);
    if (next === "signed") {
      setEntity("gridImportPowerEntityId", "");
      setEntity("gridExportPowerEntityId", "");
      return;
    }
    setEntity("gridPowerEntityId", "");
  }

  function chooseTariff(next: EnergyTariffMode) {
    setTariffMode(next);
  }

  return (
    <>
      <SettingsGroup title={t("settings.energy.entities")} description={t("settings.energy.bindOnPage")} />

      <SettingsGroup title={t("settings.energy.liveGrid")} description={t("settings.energy.liveGridHint")}>
        <div role="radiogroup" aria-label={t("settings.energy.liveGrid")} className="flex flex-wrap gap-2">
          <button
            type="button"
            role="radio"
            aria-checked={mode === "signed"}
            onClick={() => chooseMode("signed")}
            className={cn(choice, mode === "signed" ? choiceSelected : choiceIdle)}
          >
            <Check className={cn("h-4 w-4 shrink-0", mode !== "signed" && "invisible")} aria-hidden />
            {t("settings.energy.liveGridSigned")}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={mode === "split"}
            onClick={() => chooseMode("split")}
            className={cn(choice, mode === "split" ? choiceSelected : choiceIdle)}
          >
            <Check className={cn("h-4 w-4 shrink-0", mode !== "split" && "invisible")} aria-hidden />
            {t("settings.energy.liveGridSplit")}
          </button>
        </div>
        {mode === "signed" ? (
          <PowerSelect
            id="energy-grid-power"
            label={t("settings.energy.liveGridSensor")}
            value={energyEntities.gridPowerEntityId}
            entities={powerOptions}
            noneLabel={t("settings.energy.entityNone")}
            onChange={(value) => setEntity("gridPowerEntityId", value)}
          />
        ) : (
          <>
            <PowerSelect
              id="energy-grid-import"
              label={t("settings.energy.liveGridImport")}
              value={energyEntities.gridImportPowerEntityId}
              entities={powerOptions}
              noneLabel={t("settings.energy.entityNone")}
              onChange={(value) => setEntity("gridImportPowerEntityId", value)}
            />
            <PowerSelect
              id="energy-grid-export"
              label={t("settings.energy.liveGridExport")}
              value={energyEntities.gridExportPowerEntityId}
              entities={powerOptions}
              noneLabel={t("settings.energy.entityNone")}
              onChange={(value) => setEntity("gridExportPowerEntityId", value)}
            />
          </>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={gridPowerInverted}
          onClick={() => setGridPowerInverted(!gridPowerInverted)}
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-4 rounded-xl px-1 text-left outline-none",
            FOCUS_RING_BRAND
          )}
        >
          <span className="min-w-0">
            <span className="block text-base font-medium text-[#111827] dark:text-[#f3f4f6]">
              {t("settings.energy.liveGridInverted")}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">
              {t("settings.energy.liveGridInvertedHint")}
            </span>
          </span>
          <span
            className={cn(
              "relative h-8 w-[52px] shrink-0 rounded-full",
              gridPowerInverted ? "bg-[#111827] dark:bg-[#f3f4f6]" : "bg-[rgba(17,24,39,0.18)] dark:bg-white/20"
            )}
            aria-hidden
          >
            <span
              className={cn(
                "absolute top-[3px] h-[26px] w-[26px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
                gridPowerInverted ? "left-[23px] dark:bg-[#1b1a21]" : "left-[3px]"
              )}
            />
          </span>
        </button>
      </SettingsGroup>

      <SettingsGroup title={t("settings.energy.tariff")}>
        <div role="radiogroup" aria-label={t("settings.energy.tariff")} className="flex flex-wrap gap-2">
          <button
            type="button"
            role="radio"
            aria-checked={tariffMode === "fixed"}
            onClick={() => chooseTariff("fixed")}
            className={cn(choice, tariffMode === "fixed" ? choiceSelected : choiceIdle)}
          >
            <Check className={cn("h-4 w-4 shrink-0", tariffMode !== "fixed" && "invisible")} aria-hidden />
            {t("settings.energy.tariffFixed")}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={tariffMode === "dynamic"}
            onClick={() => chooseTariff("dynamic")}
            className={cn(choice, tariffMode === "dynamic" ? choiceSelected : choiceIdle)}
          >
            <Check className={cn("h-4 w-4 shrink-0", tariffMode !== "dynamic" && "invisible")} aria-hidden />
            {t("settings.energy.tariffDynamic")}
          </button>
        </div>
        {tariffMode === "dynamic" ? (
          <p className="text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">{t("settings.energy.tariffDynamicLater")}</p>
        ) : (
          <p className="text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">{t("settings.energy.tariffFixedHint")}</p>
        )}
      </SettingsGroup>

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

function PowerSelect({
  id,
  label,
  value,
  entities,
  noneLabel,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  entities: HaEntity[];
  noneLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <SettingsField label={label} htmlFor={id}>
      <SettingsSelect
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn("outline-none focus-visible:!outline-none", FOCUS_RING_BRAND)}
      >
        <option value="">{noneLabel}</option>
        {entities.map((entity) => (
          <option key={entity.entity_id} value={entity.entity_id}>
            {entityLabel(entity)}
          </option>
        ))}
        {value && !entities.some((entity) => entity.entity_id === value) ? (
          <option value={value}>{value}</option>
        ) : null}
      </SettingsSelect>
    </SettingsField>
  );
}
