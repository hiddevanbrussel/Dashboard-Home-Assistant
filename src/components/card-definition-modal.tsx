"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, Music2, Thermometer } from "lucide-react";
import { EntitySelectWithSearch } from "./entity-select-with-search";

export type HaEntity = {
  entity_id: string;
  attributes?: Record<string, unknown>;
};

export type CardDefinition = {
  light_entity_id?: string;
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

  useEffect(() => {
    setLocal(definition);
  }, [definition]);

  const handleClose = () => {
    onSave(local);
    onClose();
  };

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
            Kaarten definiëren: {title}
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
        <div className="flex-1 min-h-0 overflow-y-auto p-5 pt-4 space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Klik op een kaart om deze te openen. Hier kun je koppelen welke entiteiten er worden getoond.
          </p>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Lichtkaart</h4>
            </div>
            <EntitySelectWithSearch
              entities={entities}
              value={local.light_entity_id ?? ""}
              onChange={(v) =>
                setLocal((prev) => ({ ...prev, light_entity_id: v || undefined }))
              }
              filter={(e) =>
                e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.")
              }
              label="Lamp of groep"
              placeholder="Zoek licht…"
              emptyOption="Geen"
            />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Music2 className="h-5 w-5 text-purple-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Mediaplayer
              </h4>
            </div>
            <EntitySelectWithSearch
              entities={entities}
              value={local.media_player_entity_id ?? ""}
              onChange={(v) =>
                setLocal((prev) => ({ ...prev, media_player_entity_id: v || undefined }))
              }
              filter={(e) => e.entity_id.startsWith("media_player.")}
              label="Mediaplayer"
              placeholder="Zoek mediaplayer…"
              emptyOption="Geen"
            />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-5 w-5 text-blue-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Klimaatkaart
              </h4>
            </div>
            <EntitySelectWithSearch
              entities={entities}
              value={local.climate_entity_id ?? ""}
              onChange={(v) =>
                setLocal((prev) => ({ ...prev, climate_entity_id: v || undefined }))
              }
              filter={(e) =>
                e.entity_id.startsWith("climate.") || e.entity_id.startsWith("sensor.")
              }
              label="Klimaat of temperatuursensor"
              placeholder="Zoek klimaat…"
              emptyOption="Geen"
            />
          </section>
        </div>
        <div className="shrink-0 p-5 pt-4 pb-6 border-t border-gray-200 dark:border-white/10">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-lg bg-[#4D2FB2] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Opslaan en sluiten
          </button>
        </div>
      </div>
    </>
  );
}
