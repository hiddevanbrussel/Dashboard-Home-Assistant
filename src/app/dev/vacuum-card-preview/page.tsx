"use client";

import { useEffect, useMemo, useState } from "react";
import { VacuumCard2Widget } from "@/components/widgets/vacuum-card-2-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const ENTITY_ID = "vacuum.preview";

const STATES = ["docked", "cleaning", "returning", "paused", "idle"] as const;

/** Dev-only preview of the quiet vacuum card 2 (no Home Assistant required). */
export default function VacuumCardPreviewPage() {
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const setResolved = useThemeStore((s) => s.setResolved);
  const resolved = useThemeStore((s) => s.resolved);
  const [haState, setHaState] = useState<(typeof STATES)[number]>("docked");
  const [fan, setFan] = useState("turbo");
  const [battery, setBattery] = useState(100);

  const entity = useMemo(
    () => ({
      entity_id: ENTITY_ID,
      state: haState,
      attributes: {
        friendly_name: "Matt-E",
        battery_level: battery,
        fan_speed: fan,
        fan_speed_list: ["eco", "standard", "turbo"],
        cleaning_progress: haState === "cleaning" ? 42 : undefined,
      },
    }),
    [haState, fan, battery]
  );

  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  useEffect(() => {
    const seed = () =>
      updateEntityState(entity.entity_id, {
        state: entity.state,
        attributes: entity.attributes,
      });
    seed();
    const id = setInterval(seed, 2500);
    return () => clearInterval(id);
  }, [entity, updateEntityState]);

  return (
    <div
      className={cn(
        "min-h-screen px-4 py-8 transition-colors",
        resolved === "dark" ? "bg-[#0b1220] text-white" : "bg-[#E8ECF2] text-gray-900"
      )}
    >
      <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold">Vacuum card preview</h1>
        <p className={cn("mt-1 text-sm", resolved === "dark" ? "text-white/60" : "text-gray-500")}>
          Quiet mockup layout: name + status, battery, product art, Eco / Standard / Turbo.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setHaState(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                haState === value
                  ? "bg-white text-gray-900 shadow-sm"
                  : resolved === "dark"
                    ? "bg-white/10 text-white/80"
                    : "bg-black/5 text-gray-700"
              )}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = resolved === "dark" ? "light" : "dark";
              setThemeMode(next);
              setResolved(next);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              resolved === "dark" ? "bg-white/10 text-white/80" : "bg-black/5 text-gray-700"
            )}
          >
            theme: {resolved}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["eco", "standard", "turbo"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFan(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                fan === value
                  ? "bg-emerald-400 text-gray-900"
                  : resolved === "dark"
                    ? "bg-white/10 text-white/80"
                    : "bg-black/5 text-gray-700"
              )}
            >
              fan: {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setBattery((b) => (b === 100 ? 54 : 100))}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              resolved === "dark" ? "bg-white/10 text-white/80" : "bg-black/5 text-gray-700"
            )}
          >
            battery: {battery}%
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <VacuumCard2Widget title="Matt-E" entity_id={ENTITY_ID} width={320} height={420} />
        </div>
      </div>
    </div>
  );
}
