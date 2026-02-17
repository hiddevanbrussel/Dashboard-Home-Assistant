"use client";

import { useState, useCallback } from "react";
import { Lightbulb, MoreVertical, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_ICONS } from "./card-icons";
import { useEntityStateStore } from "@/stores/entity-state-store";

export type TextCardProps = {
  text: string;
  type: "title" | "subtitle" | "text";
  show_icon?: boolean;
  icon?: string;
  /** Breedte kaart in px (alleen floating cards). */
  width?: number;
  /** Entity voor aan/uit-schakelaar (switch, light, input_boolean). */
  entity_id?: string;
  className?: string;
  onMoreClick?: () => void;
};

/** Tekstkaart: titel, ondertitel of gewone tekst, optioneel met icoon. */
export function TextCardWidget({
  text,
  type,
  show_icon = false,
  icon = "Type",
  width,
  entity_id,
  className,
  onMoreClick,
}: TextCardProps) {
  const IconComponent = show_icon && icon ? CARD_ICONS[icon] : null;
  const entity = useEntityStateStore((s) => (entity_id ? s.getState(entity_id) : undefined));
  const setStates = useEntityStateStore((s) => s.setStates);
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const [loading, setLoading] = useState(false);
  const isOn = entity?.state === "on";
  const domain = entity_id?.split?.(".")?.[0] ?? "switch";

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!entity_id || loading) return;
      const nextOn = !isOn;
      updateEntityState(entity_id, { state: nextOn ? "on" : "off" });
      setLoading(true);
      try {
        const res = await fetch("/api/ha/call-service", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entity_id,
            domain,
            service: nextOn ? "turn_on" : "turn_off",
            service_data: nextOn && domain === "light" ? { brightness_pct: 100 } : undefined,
          }),
        });
        if (res.ok) {
          fetch("/api/ha/state").then((r) => r.json()).then((data) => { if (Array.isArray(data)) setStates(data); }).catch(() => {});
        }
      } finally {
        setLoading(false);
      }
    },
    [entity_id, domain, isOn, loading, setStates, updateEntityState]
  );

  const ToggleIcon = domain === "light" ? Lightbulb : Power;

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 py-2 min-h-[44px] relative",
        className
      )}
      style={width != null ? { width } : undefined}
      aria-hidden
    >
      {IconComponent && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 dark:bg-black/20">
          <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {type === "title" && (
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
            {text?.trim() || " "}
          </h2>
        )}
        {type === "subtitle" && (
          <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300 truncate">
            {text?.trim() || " "}
          </p>
        )}
        {type === "text" && (
          <p className="text-sm md:text-base font-normal text-gray-800 dark:text-gray-200 truncate">
            {text?.trim() || " "}
          </p>
        )}
      </div>
      {entity_id && (
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          onPointerDown={(e) => e.stopPropagation()}
          className={cn(
            "shrink-0 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70",
            isOn
              ? "bg-[#FFD41D] shadow-sm dark:bg-[#FFD41D] dark:shadow-sm text-white"
              : "bg-white/30 dark:bg-white/10 shadow-inner text-gray-500 dark:text-gray-400"
          )}
          aria-label={isOn ? "Uitzetten" : "Aanzetten"}
        >
          <ToggleIcon className="h-5 w-5" strokeWidth={1.5} fill={isOn ? "currentColor" : "none"} aria-hidden />
        </button>
      )}
      {onMoreClick && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (e.button === 0) onMoreClick();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onMoreClick();
          }}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-900/5 dark:hover:bg-white/10 transition-colors z-20",
            entity_id && "right-12"
          )}
          aria-label="Opties"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
