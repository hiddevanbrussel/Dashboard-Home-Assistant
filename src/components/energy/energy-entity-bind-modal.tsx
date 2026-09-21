"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  ENERGY_ENTITY_FIELDS,
  entityLabel,
  filterEnergySensors,
  type EnergyEntityKey,
} from "@/lib/energy-dashboard";
import { useEnergyStore } from "@/stores/energy-store";

export type EnergyBindEntity = {
  entity_id: string;
  state?: string;
  attributes?: Record<string, unknown>;
};

function entityStateLabel(entity: EnergyBindEntity): string {
  const state = entity.state?.trim();
  if (!state || state === "unknown" || state === "unavailable") return "";
  const unit = (entity.attributes?.unit_of_measurement as string | undefined)?.trim();
  return unit ? `${state} ${unit}` : state;
}

export function EnergyEntityBindModal({
  fieldKey,
  haEntities,
  onClose,
}: {
  fieldKey: EnergyEntityKey;
  haEntities: EnergyBindEntity[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const field = ENERGY_ENTITY_FIELDS.find((item) => item.key === fieldKey);
  const selectedId = useEnergyStore((s) => s.entities[fieldKey]);
  const setEntity = useEnergyStore((s) => s.setEntity);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState<EnergyBindEntity[]>(haEntities);
  const [loading, setLoading] = useState(haEntities.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (haEntities.length > 0) {
      setLoaded(haEntities);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch("/api/ha/entities")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: EnergyBindEntity[]) => {
        if (cancelled) return;
        setLoaded(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError(t("editPanel.noEntitiesFound"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [haEntities, t]);

  const options = useMemo(
    () => filterEnergySensors(loaded, field?.kind ?? "power", selectedId, query),
    [field?.kind, loaded, query, selectedId]
  );

  function choose(entityId: string) {
    setEntity(fieldKey, entityId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4">
      <div className="absolute inset-0 z-[321] bg-black/20 backdrop-blur-md dark:bg-black/40" aria-hidden onClick={onClose} />
      <div
        className="relative z-[322] flex max-h-[min(36rem,90vh)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-xl dark:border dark:border-white/10 dark:bg-black/60 dark:backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {field ? t(field.labelKey) : t("energy.overview.bindTitle")}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-white/50">
              {field ? t(field.hintKey) : t("energy.overview.bindHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            aria-label={t("editPanel.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("settings.energy.entitySearch")}
          className="mb-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
          autoFocus
        />

        {selectedId ? (
          <button
            type="button"
            onClick={() => choose("")}
            className="mb-3 self-start rounded-full px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {t("energy.overview.unlink")}
          </button>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <p className="px-1 py-6 text-sm text-gray-500 dark:text-gray-400">{t("editPanel.loading")}</p>
          ) : error ? (
            <p className="px-1 py-6 text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : options.length === 0 ? (
            <p className="px-1 py-6 text-sm text-gray-500 dark:text-gray-400">{t("settings.energy.noSensors")}</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-white/5">
              {options.map((entity) => {
                const name = entityLabel(entity);
                const reading = entityStateLabel(entity);
                const selected = entity.entity_id === selectedId;
                return (
                  <li key={entity.entity_id}>
                    <button
                      type="button"
                      onClick={() => choose(entity.entity_id)}
                      className="flex w-full items-start justify-between gap-3 px-2 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/10"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{name}</span>
                        {name !== entity.entity_id ? (
                          <span className="mt-0.5 block truncate text-[11px] text-gray-400 dark:text-white/40">
                            {entity.entity_id}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-right">
                        {reading ? (
                          <span className="block text-xs font-semibold tabular-nums text-gray-700 dark:text-white/75">
                            {reading}
                          </span>
                        ) : null}
                        {selected ? (
                          <span className="mt-0.5 block text-[11px] font-medium text-brand">{t("energy.overview.linked")}</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
