"use client";

import { useState, useCallback } from "react";
import { X, Lightbulb, Music2, Thermometer, Play, Pause } from "lucide-react";
import { EntitySelectWithSearch } from "./entity-select-with-search";
import { useEntityStateStore } from "@/stores/entity-state-store";
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
  /** Kaarten in de modal (light, climate, media_player). */
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
  entities: HaEntity[];
  onClose: () => void;
  onSave: (definition: CardDefinition) => void;
};

const CARD_TYPE_LABELS = {
  light: "Licht",
  climate: "Klimaat",
  media_player: "Media",
} as const;

const CARD_TYPE_ICONS = {
  light: Lightbulb,
  climate: Thermometer,
  media_player: Music2,
} as const;

export function CardDefinitionModal({
  title,
  definition,
  entities,
  onClose,
  onSave,
}: CardDefinitionModalProps) {
  const migrated = migrateToModalCards(definition);
  const [local, setLocal] = useState<ModalCard[]>(migrated);
  const [loading, setLoading] = useState(false);
  const [addMode, setAddMode] = useState<"light" | "climate" | "media_player" | null>(null);

  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const getEntityState = useEntityStateStore((s) => s.getState);

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

  const handleMediaPlayPause = useCallback(async (entityId: string) => {
    const ent = getEntityState(entityId);
    setLoading(true);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: entityId,
          domain: "media_player",
          service: "media_play_pause",
        }),
      });
      if (res.ok) await refreshState();
    } finally {
      setLoading(false);
    }
  }, [refreshState, getEntityState]);

  const handleClose = () => {
    onSave({ modal_cards: local });
    onClose();
  };

  const addCard = (type: "light" | "climate" | "media_player", entityId: string) => {
    if (!entityId) return;
    const exists = local.some((c) => c.entity_id === entityId);
    if (exists) return;
    setLocal((prev) => [
      ...prev,
      { id: `card-${Date.now()}-${Math.random().toString(36).slice(2)}`, type, entity_id: entityId },
    ]);
    setAddMode(null);
  };

  const usedEntityIds = local.map((c) => c.entity_id);

  const entityFilter = (type: "light" | "climate" | "media_player") => (e: HaEntity) => {
    if (usedEntityIds.includes(e.entity_id)) return false;
    if (type === "light") return e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.");
    if (type === "media_player") return e.entity_id.startsWith("media_player.");
    return e.entity_id.startsWith("climate.") || e.entity_id.startsWith("sensor.");
  };

  const getEntityName = (entityId: string) =>
    (entities.find((e) => e.entity_id === entityId)?.attributes as { friendly_name?: string })?.friendly_name ?? entityId;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        aria-hidden
        onClick={handleClose}
      />
      <div className="fixed top-4 right-4 bottom-4 z-50 w-full max-w-md animate-slide-in-right flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 shadow-2xl">
        <div className="shrink-0 flex items-center justify-between p-5 pb-3 border-b border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400"
            aria-label="Sluiten"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Voeg kaarten toe met de + knop, vergelijkbaar met het dashboard.
          </p>

          {/* Lijst van kaarten */}
          <div className="space-y-2">
            {local.map((card) => {
              const Icon = CARD_TYPE_ICONS[card.type];
              const name = getEntityName(card.entity_id);
              const ent = getEntityState(card.entity_id);

              return (
                <div
                  key={card.id}
                  className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden flex items-stretch"
                >
                  <div className="flex-1 min-w-0 flex items-center gap-3 p-3">
                    <div
                      className={cn(
                        "flex shrink-0 items-center justify-center w-10 h-10 rounded-lg",
                        card.type === "light" && (ent?.state === "on" ? "bg-amber-400 text-amber-900" : "bg-gray-200 dark:bg-gray-600 text-gray-500"),
                        card.type === "media_player" && ((ent?.state === "playing" || ent?.state === "paused") ? "bg-purple-500 text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-500"),
                        card.type === "climate" && "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} fill={card.type === "light" && ent?.state === "on" ? "currentColor" : "none"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
                      {card.type === "climate" && (
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {ent?.attributes?.current_temperature != null
                            ? `${Number(ent.attributes.current_temperature).toFixed(1)}°C`
                            : ent?.state ?? "—"}
                        </p>
                      )}
                      {card.type === "media_player" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {(ent?.attributes?.media_title as string) || ent?.state || "—"}
                        </p>
                      )}
                    </div>
                    {card.type === "light" && (
                      <button
                        type="button"
                        onClick={() => toggleLight(card.entity_id, ent?.state === "on")}
                        disabled={loading}
                        className={cn(
                          "shrink-0 py-2 px-4 rounded-lg text-sm font-medium transition-colors",
                          ent?.state === "on"
                            ? "bg-amber-400 text-amber-900 hover:bg-amber-300"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                        )}
                      >
                        {ent?.state === "on" ? "Uit" : "Aan"}
                      </button>
                    )}
                    {card.type === "media_player" && (
                      <button
                        type="button"
                        onClick={() => handleMediaPlayPause(card.entity_id)}
                        disabled={loading}
                        className="shrink-0 p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-70"
                      >
                        {ent?.state === "playing" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocal((prev) => prev.filter((c) => c.id !== card.id))}
                    className="p-2 shrink-0 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:hover:text-gray-300"
                    aria-label="Kaart verwijderen"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* + Knop om kaart toe te voegen */}
          {addMode === null ? (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Kaart toevoegen:</span>
              <button
                type="button"
                onClick={() => setAddMode("light")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Licht
              </button>
              <button
                type="button"
                onClick={() => setAddMode("climate")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Thermometer className="h-4 w-4 text-blue-500" />
                Klimaat
              </button>
              <button
                type="button"
                onClick={() => setAddMode("media_player")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Music2 className="h-4 w-4 text-purple-500" />
                Media
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-2 bg-gray-50 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {CARD_TYPE_LABELS[addMode]} toevoegen
                </span>
                <button
                  type="button"
                  onClick={() => setAddMode(null)}
                  className="p-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                  aria-label="Annuleren"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <EntitySelectWithSearch
                entities={entities}
                value=""
                onChange={(v) => v && addCard(addMode, v)}
                filter={entityFilter(addMode)}
                placeholder={
                  addMode === "light"
                    ? "Zoek lamp of groep…"
                    : addMode === "media_player"
                    ? "Zoek mediaplayer…"
                    : "Zoek klimaat of temperatuursensor…"
                }
                emptyOption={`Kies ${CARD_TYPE_LABELS[addMode].toLowerCase()}…`}
                className="[&_label]:sr-only"
              />
            </div>
          )}
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
