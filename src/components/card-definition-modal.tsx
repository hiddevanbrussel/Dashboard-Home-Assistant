"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Lightbulb, Music2, Thermometer, Play, Pause } from "lucide-react";
import { EntitySelectWithSearch } from "./entity-select-with-search";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { cn } from "@/lib/utils";

export type HaEntity = {
  entity_id: string;
  attributes?: Record<string, unknown>;
};

export type CardDefinition = {
  /** Lampen om in de modal afzonderlijk te schakelen. */
  modal_light_entity_ids?: string[];
  media_player_entity_id?: string;
  climate_entity_id?: string;
};

type CardDefinitionModalProps = {
  title: string;
  definition: CardDefinition;
  entities: HaEntity[];
  onClose: () => void;
  onSave: (definition: CardDefinition) => void;
};

export function CardDefinitionModal({
  title,
  definition,
  entities,
  onClose,
  onSave,
}: CardDefinitionModalProps) {
  const [local, setLocal] = useState<CardDefinition>(definition);
  const [loading, setLoading] = useState(false);

  const lightIds = local.modal_light_entity_ids ?? [];
  const mediaEntity = useEntityStateStore((s) =>
    local.media_player_entity_id ? s.getState(local.media_player_entity_id) : null
  );
  const climateEntity = useEntityStateStore((s) =>
    local.climate_entity_id ? s.getState(local.climate_entity_id) : null
  );
  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);

  useEffect(() => {
    setLocal(definition);
  }, [definition]);

  const refreshState = useCallback(async () => {
    const res = await fetch("/api/ha/state").then((r) => r.json());
    if (Array.isArray(res)) setStates(res);
  }, [setStates]);

  const toggleLight = useCallback(async (entityId: string, isOn: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: entityId,
          domain: "light",
          service: isOn ? "turn_off" : "turn_on",
          service_data: isOn ? undefined : { brightness_pct: 100 },
        }),
      });
      if (res.ok) {
        updateEntityState(entityId, { state: isOn ? "off" : "on" });
        await refreshState();
      }
    } finally {
      setLoading(false);
    }
  }, [updateEntityState, refreshState]);

  const handleMediaPlayPause = useCallback(async () => {
    if (!local.media_player_entity_id) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: local.media_player_entity_id,
          domain: "media_player",
          service: "media_play_pause",
        }),
      });
      if (res.ok) await refreshState();
    } finally {
      setLoading(false);
    }
  }, [local.media_player_entity_id, refreshState]);

  const handleClose = () => {
    onSave(local);
    onClose();
  };

  const getEntityState = useEntityStateStore((s) => s.getState);
  const mediaName =
    (entities.find((e) => e.entity_id === local.media_player_entity_id)?.attributes as { friendly_name?: string })?.friendly_name ??
    local.media_player_entity_id ??
    "";
  const climateTemp = climateEntity?.attributes?.current_temperature ?? climateEntity?.state;
  const tempStr =
    climateTemp != null && !Number.isNaN(Number(climateTemp))
      ? `${Number(climateTemp).toFixed(1)}°C`
      : null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        aria-hidden
        onClick={handleClose}
      />
      <div className="fixed top-4 right-4 bottom-4 z-50 w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl">
        <div className="shrink-0 flex items-center justify-between p-5 pb-3 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400"
            aria-label="Sluiten"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Schakel verlichting en media snel in of voeg kaarten toe.
          </p>

          {/* Verlichting – meerdere lampen afzonderlijk schakelen */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Verlichting
              </h4>
            </div>
            <div className="p-4 space-y-3">
              {lightIds.map((entityId) => {
                const ent = getEntityState(entityId);
                const isOn = ent?.state === "on";
                const name =
                  (entities.find((e) => e.entity_id === entityId)?.attributes as { friendly_name?: string })?.friendly_name ??
                  entityId;
                return (
                  <div key={entityId} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleLight(entityId, isOn)}
                      disabled={loading}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2",
                        isOn
                          ? "bg-amber-400 text-amber-900 hover:bg-amber-300"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                      )}
                    >
                      <Lightbulb
                        className="h-5 w-5 shrink-0"
                        strokeWidth={1.5}
                        fill={isOn ? "currentColor" : "none"}
                      />
                      <span className="truncate">{name}</span>
                      <span className="text-xs opacity-80">{isOn ? "Aan" : "Uit"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLocal((prev) => ({
                          ...prev,
                          modal_light_entity_ids: (prev.modal_light_entity_ids ?? []).filter((id) => id !== entityId),
                        }))
                      }
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 dark:hover:text-gray-300 shrink-0"
                      aria-label="Lamp verwijderen"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              <div>
                <EntitySelectWithSearch
                  entities={entities}
                  value=""
                  onChange={(v) => {
                    if (!v || lightIds.includes(v)) return;
                    setLocal((prev) => ({
                      ...prev,
                      modal_light_entity_ids: [...(prev.modal_light_entity_ids ?? []), v],
                    }));
                  }}
                  filter={(e) =>
                    (e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.")) &&
                    !lightIds.includes(e.entity_id)
                  }
                  placeholder="Lamp toevoegen…"
                  emptyOption="Kies een lamp…"
                  className="[&_label]:sr-only"
                />
              </div>
            </div>
          </section>

          {/* Mediaplayer */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <Music2 className="h-5 w-5 text-purple-500 shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Media
              </h4>
            </div>
            <div className="p-4">
              {local.media_player_entity_id ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={local.media_player_entity_id}>
                    {mediaName}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleMediaPlayPause}
                      disabled={loading}
                      className={cn(
                        "flex items-center justify-center h-12 w-12 rounded-full transition-colors",
                        mediaEntity?.state === "playing" || mediaEntity?.state === "paused"
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500"
                      )}
                    >
                      {mediaEntity?.state === "playing" ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {(mediaEntity?.attributes?.media_title as string) || "Media"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {(mediaEntity?.attributes?.media_artist as string) || mediaEntity?.state || "—"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, media_player_entity_id: undefined }))}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Media wijzigen
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Voeg een mediaplayer toe</p>
                  <EntitySelectWithSearch
                    entities={entities}
                    value=""
                    onChange={(v) =>
                      setLocal((prev) => ({ ...prev, media_player_entity_id: v || undefined }))
                    }
                    filter={(e) => e.entity_id.startsWith("media_player.")}
                    placeholder="Zoek mediaplayer…"
                    emptyOption="Kies mediaplayer…"
                    className="[&_label]:sr-only"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Klimaat */}
          <section className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
              <Thermometer className="h-5 w-5 text-blue-500 shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Klimaat
              </h4>
            </div>
            <div className="p-4">
              {local.climate_entity_id ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {(entities.find((e) => e.entity_id === local.climate_entity_id)?.attributes as { friendly_name?: string })?.friendly_name ??
                      local.climate_entity_id}
                  </p>
                  <div className="flex items-center gap-3 py-2">
                    <Thermometer className="h-8 w-8 text-blue-500 shrink-0" strokeWidth={1.5} />
                    <div>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {tempStr ?? "—"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Temperatuur</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, climate_entity_id: undefined }))}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Klimaat wijzigen
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Voeg een klimaatkaart toe</p>
                  <EntitySelectWithSearch
                    entities={entities}
                    value=""
                    onChange={(v) =>
                      setLocal((prev) => ({ ...prev, climate_entity_id: v || undefined }))
                    }
                    filter={(e) =>
                      e.entity_id.startsWith("climate.") || e.entity_id.startsWith("sensor.")
                    }
                    placeholder="Zoek klimaat of sensor…"
                    emptyOption="Kies klimaat…"
                    className="[&_label]:sr-only"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="shrink-0 p-5 pt-4 pb-6 border-t border-gray-200 dark:border-white/10">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-lg bg-[#4D2FB2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Sluiten
          </button>
        </div>
      </div>
    </>
  );
}
