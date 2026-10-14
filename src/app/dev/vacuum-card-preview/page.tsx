"use client";

import { useEffect, useMemo, useState } from "react";
import { VacuumCard2Widget } from "@/components/widgets/vacuum-card-2-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { cn } from "@/lib/utils";

const ENTITY_ID = "vacuum.preview";

const STATES = ["docked", "cleaning", "returning", "paused", "idle"] as const;

/** Dev-only preview of the redesigned vacuum card 2 (no Home Assistant required). */
export default function VacuumCardPreviewPage() {
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [haState, setHaState] = useState<(typeof STATES)[number]>("docked");
  const [fan, setFan] = useState("standard");
  const [battery, setBattery] = useState(100);

  const entity = useMemo(
    () => ({
      entity_id: ENTITY_ID,
      state: haState,
      attributes: {
        friendly_name: "Robotstofzuiger",
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
    <div className="min-h-screen bg-[#12141a] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold">Vacuum card preview</h1>
        <p className="mt-1 text-sm text-white/60">
          Mockup layout + new docked / empty-dock lifestyle art. No Home Assistant required.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setHaState(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                haState === value ? "bg-white text-gray-900" : "bg-white/10 text-white/80"
              )}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(["eco", "standard", "turbo"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFan(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                fan === value ? "bg-emerald-400 text-gray-900" : "bg-white/10 text-white/80"
              )}
            >
              fan: {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setBattery((b) => (b === 100 ? 54 : 100))}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
          >
            battery: {battery}%
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <VacuumCard2Widget
            title="Robotstofzuiger"
            entity_id={ENTITY_ID}
            width={320}
            height={460}
          />
        </div>
      </div>
    </div>
  );
}
