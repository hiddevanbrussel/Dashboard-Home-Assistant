"use client";

import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { VacuumCardProps } from "./widget-types";
import { cn, capitalizeFirst } from "@/lib/utils";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { CARD_ICONS } from "./card-icons";

export { CARD_ICON_OPTIONS as VACUUM_ICON_OPTIONS } from "./card-icons";

const STATE_LABELS: Record<string, string> = {
  idle: "Inactief",
  cleaning: "Bezig met stofzuigen",
  docked: "In basis",
  returning: "Keert terug",
  paused: "Gepauzeerd",
  error: "Fout",
  unknown: "—",
};

export function VacuumCardWidget({
  title = "Stofzuiger",
  entity_id,
  script_ids = [],
  script_names = {},
  cleaned_area_entity_id,
  icon: iconName,
  size = "md",
  className,
  onMoreClick,
}: VacuumCardProps & { className?: string; onMoreClick?: () => void }) {
  const entity = useEntityStateStore((s) => s.getState(entity_id));
  const cleanedAreaEntity = useEntityStateStore((s) =>
    cleaned_area_entity_id ? s.getState(cleaned_area_entity_id) : null
  );
  const setStates = useEntityStateStore((s) => s.setStates);
  const [loadingScript, setLoadingScript] = useState<string | null>(null);
  /** Script die gestart is; blijft actief tot vacuum weer "docked" is. */
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);

  const state = (entity?.state as string) ?? "unknown";
  const friendlyName = (entity?.attributes?.friendly_name as string) ?? entity_id;
  const statusLabel = STATE_LABELS[state] ?? capitalizeFirst(state);

  const cleanedAreaValue = cleanedAreaEntity?.state;
  const cleanedAreaUnit = (cleanedAreaEntity?.attributes as { unit_of_measurement?: string })?.unit_of_measurement ?? "";
  const showCleanedArea = cleaned_area_entity_id && cleanedAreaValue != null && cleanedAreaValue !== "";

  const IconComponent = (iconName && CARD_ICONS[iconName]) ? CARD_ICONS[iconName] : CARD_ICONS.Bot;
  const isActive = state === "cleaning" || activeScriptId != null;

  useEffect(() => {
    if (state === "docked" && activeScriptId) {
      setActiveScriptId(null);
    }
  }, [state, activeScriptId]);

  async function runScript(scriptEntityId: string) {
    setLoadingScript(scriptEntityId);
    try {
      const res = await fetch("/api/ha/call-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_id: scriptEntityId,
          domain: "script",
          service: "turn_on",
        }),
      });
      if (res.ok) {
        const data = await fetch("/api/ha/state").then((r) => r.json());
        if (Array.isArray(data)) setStates(data);
        setActiveScriptId(scriptEntityId);
      }
    } finally {
      setLoadingScript(null);
    }
  }

  const isAnyScriptActive = activeScriptId != null;

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 min-h-[7.75rem]",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white",
              isActive && "animate-vacuum"
            )}
          >
            <IconComponent className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-white/90">{title}</p>
            <p className="text-xs text-white/60 truncate">{friendlyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 min-w-0 max-w-[45%]">
          {onMoreClick && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMoreClick(); }}
              className="p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Opties"
            >
              <MoreVertical className="h-5 w-5" aria-hidden />
            </button>
          )}
          <div className="flex flex-col items-end min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium truncate w-full text-right",
              state === "cleaning" && "text-amber-400",
              state === "docked" && "text-green-400",
              state === "error" && "text-red-400",
              !["cleaning", "docked", "error"].includes(state) && "text-white/80"
            )}
            title={statusLabel}
          >
            {statusLabel}
          </p>
          {showCleanedArea && (
            <p className="text-xs text-white/60 truncate w-full text-right">
              {cleanedAreaValue}{cleanedAreaUnit ? ` ${cleanedAreaUnit}` : ""}
            </p>
          )}
          </div>
        </div>
      </div>

      {script_ids.length > 0 && (
        <div className="px-4 pb-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap gap-1.5">
            {script_ids.map((scriptId) => (
              <ScriptTag
                key={scriptId}
                entityId={scriptId}
                displayName={script_names?.[scriptId]}
                onRun={() => runScript(scriptId)}
                loading={loadingScript === scriptId}
                active={activeScriptId === scriptId}
                disabled={isAnyScriptActive && activeScriptId !== scriptId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScriptTag({
  entityId,
  displayName,
  onRun,
  loading,
  active,
  disabled,
}: {
  entityId: string;
  displayName?: string;
  onRun: () => void;
  loading: boolean;
  active?: boolean;
  disabled?: boolean;
}) {
  const entity = useEntityStateStore((s) => s.getState(entityId));
  const raw =
    displayName ?? entity?.attributes?.friendly_name ?? entityId.replace(/^script\./, "");
  const label = typeof raw === "string" ? raw : String(raw ?? "");

  return (
    <button
      type="button"
      onClick={onRun}
      disabled={loading || disabled}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-normal transition-colors",
        active
          ? "border-amber-400/40 bg-amber-500/20 text-amber-200/95"
          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/85 hover:border-white/20",
        (loading || disabled) && !active && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="truncate max-w-[7rem]">
        {loading ? "…" : label}
      </span>
    </button>
  );
}
