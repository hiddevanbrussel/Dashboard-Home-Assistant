"use client";

import { useState, useCallback } from "react";
import { X, Lightbulb, Plus } from "lucide-react";
import { EntitySelectWithSearch } from "./entity-select-with-search";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export type HaEntity = {
  entity_id: string;
  attributes?: Record<string, unknown>;
};

export type ModalCard = {
  id: string;
  type: "light" | "climate" | "media_player";
  entity_id: string;
};

export type CardDefinition = {
  /** Kaarten in de modal (voor nu alleen light). */
  modal_cards?: ModalCard[];
};

function migrateToModalCards(def: {
  modal_light_entity_ids?: string[];
  media_player_entity_id?: string;
  climate_entity_id?: string;
  modal_cards?: ModalCard[];
}): ModalCard[] {
  const cards = def.modal_cards ?? [];
  if (cards.length > 0) return cards;
  const result: ModalCard[] = [];
  let idCounter = 0;
  const genId = () => `card-${Date.now()}-${++idCounter}`;
  for (const eid of def.modal_light_entity_ids ?? []) {
    result.push({ id: genId(), type: "light", entity_id: eid });
  }
  if (def.media_player_entity_id) {
    result.push({ id: genId(), type: "media_player", entity_id: def.media_player_entity_id });
  }
  if (def.climate_entity_id) {
    result.push({ id: genId(), type: "climate", entity_id: def.climate_entity_id });
  }
  return result;
}

type CardDefinitionModalProps = {
  title: string;
  definition: CardDefinition & {
    modal_light_entity_ids?: string[];
    media_player_entity_id?: string;
    climate_entity_id?: string;
  };
  /** Light entity van de kamer: alleen als switch in de header (naam staat al in title) */
  roomLightEntityId?: string;
  entities: HaEntity[];
  onClose: () => void;
  onSave: (definition: CardDefinition) => void;
};

export function CardDefinitionModal({
  title,
  definition,
  roomLightEntityId,
  entities,
  onClose,
  onSave,
}: CardDefinitionModalProps) {
  const { t } = useTranslation();
  const migrated = migrateToModalCards(definition);
  const lightCards = migrated.filter((c) => c.type === "light");
  const [local, setLocal] = useState<ModalCard[]>(lightCards);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const getEntityState = useEntityStateStore((s) => s.getState);
  const roomLightState = useEntityStateStore((s) => (roomLightEntityId ? s.states[roomLightEntityId] : undefined));
  const roomLightOn = roomLightState?.state === "on";

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

  const handleClose = () => {
    onSave({ modal_cards: local });
    onClose();
  };

  const addLight = (entityId: string) => {
    if (!entityId) return;
    const exists = local.some((c) => c.entity_id === entityId);
    if (exists) return;
    setLocal((prev) => [
      ...prev,
      { id: `card-${Date.now()}-${Math.random().toString(36).slice(2)}`, type: "light", entity_id: entityId },
    ]);
    setShowAdd(false);
  };

  const usedEntityIds = local.map((c) => c.entity_id);

  const lightEntityFilter = (e: HaEntity) =>
    (e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.")) && !usedEntityIds.includes(e.entity_id);

  const getEntityName = (entityId: string) =>
    (entities.find((e) => e.entity_id === entityId)?.attributes as { friendly_name?: string })?.friendly_name ?? entityId;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-md"
        aria-hidden
        onClick={handleClose}
      />
      <div className="fixed top-4 right-4 bottom-4 z-50 w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-gray-900/85 backdrop-blur-xl shadow-2xl">
        <div className="shrink-0 flex items-center justify-between gap-3 p-5 pb-3 border-b border-white/20 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate min-w-0 flex-1">{title}</h3>
          <div className="flex items-center gap-2 shrink-0">
            {roomLightEntityId && (
              <button
                type="button"
                role="switch"
                aria-checked={roomLightOn}
                onClick={() => toggleLight(roomLightEntityId, roomLightOn)}
                disabled={loading}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-white/30 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70",
                  roomLightOn ? "bg-amber-400 border-amber-500" : "bg-white/50 dark:bg-white/10"
                )}
                aria-label={roomLightOn ? t("editPanel.lightOff") : t("editPanel.lightOn")}
              >
                <span
                  className={cn(
                    "absolute left-0.5 top-px h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    roomLightOn ? "translate-x-[19px]" : "translate-x-0"
                  )}
                />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="p-2 rounded-xl text-gray-500 hover:bg-white/50 dark:hover:bg-white/10 dark:text-gray-400 hover:text-[#4D2FB2] dark:hover:text-[#4D2FB2] transition-colors"
              aria-label={t("editPanel.addLight")}
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-xl text-gray-500 hover:bg-white/50 dark:hover:bg-white/10 dark:text-gray-400"
              aria-label={t("editPanel.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 pb-6 space-y-3">
          {showAdd && (
            <div className="rounded-xl border border-white/20 dark:border-white/10 p-4 space-y-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{t("editPanel.addOrRemoveLight")}</span>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="p-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                  aria-label={t("editPanel.close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <EntitySelectWithSearch
                entities={entities}
                value=""
                onChange={(v) => v && addLight(v)}
                filter={lightEntityFilter}
                placeholder={t("editPanel.searchLight")}
                emptyOption={t("editPanel.chooseLight")}
                className="[&_label]:sr-only"
              />
              <div className="space-y-2">
                {local.map((card) => {
                  const name = getEntityName(card.entity_id);
                  return (
                    <div
                      key={card.id}
                      className="flex items-center justify-between gap-3 py-2 px-3 rounded-xl bg-white/60 dark:bg-white/5"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 min-w-0">
                        {name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setLocal((prev) => prev.filter((c) => c.id !== card.id))}
                        className="p-1.5 shrink-0 text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 rounded-lg transition-colors"
                        aria-label={t("editPanel.removeLight")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {local.map((card) => {
              const name = getEntityName(card.entity_id);
              const ent = getEntityState(card.entity_id);
              const isOn = ent?.state === "on";

              return (
                <div
                  key={card.id}
                  className="rounded-xl border border-white/20 dark:border-white/10 overflow-hidden flex items-center gap-3 p-3 bg-white/40 dark:bg-white/5 backdrop-blur-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleLight(card.entity_id, isOn)}
                    disabled={loading}
                    className={cn(
                      "flex shrink-0 items-center justify-center w-10 h-10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:opacity-70",
                      isOn ? "bg-amber-400 text-amber-900 hover:bg-amber-300" : "bg-gray-200 dark:bg-gray-600 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500"
                    )}
                    aria-label={isOn ? t("editPanel.lightOff") : t("editPanel.lightOn")}
                  >
                    <Lightbulb className="h-5 w-5" strokeWidth={1.5} fill={isOn ? "currentColor" : "none"} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    onClick={() => toggleLight(card.entity_id, isOn)}
                    disabled={loading}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-70",
                      isOn ? "bg-amber-400 border-amber-500" : "bg-gray-200 dark:bg-gray-600"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0.5 top-px h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                        isOn ? "translate-x-[19px]" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
