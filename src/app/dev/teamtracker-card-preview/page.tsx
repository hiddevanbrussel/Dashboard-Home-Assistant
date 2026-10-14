"use client";

import { useEffect, useMemo, useState } from "react";
import { TeamtrackerCardWidget } from "@/components/widgets/teamtracker-card-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const ENTITY_ID = "sensor.team_psv_preview";

/** Dev-only preview of the Team Tracker match card (no Home Assistant required). */
export default function TeamtrackerCardPreviewPage() {
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setMode = useThemeStore((s) => s.setMode);
  const setResolved = useThemeStore((s) => s.setResolved);
  const resolved = useThemeStore((s) => s.resolved);
  const [mode, setMode] = useState<"pre" | "in" | "post">("pre");

  const entity = useMemo(() => {
    if (mode === "pre") {
      return {
        entity_id: ENTITY_ID,
        state: "PRE",
        attributes: {
          status: "PRE",
          team_abbr: "PSV",
          opponent_abbr: "RBL",
          team_name: "PSV",
          opponent_name: "RB Leipzig",
          team_long_name: "PSV Eindhoven",
          opponent_long_name: "RB Leipzig",
          team_homeaway: "away",
          league: "UEFA.EUROPA_LEAGUE",
          date: "2026-10-22T21:00:00+00:00",
          team_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/145.png",
          opponent_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/11420.png",
          team_form: "WDWW",
          opponent_form: "LDWW",
        },
      };
    }
    if (mode === "in") {
      return {
        entity_id: ENTITY_ID,
        state: "IN",
        attributes: {
          status: "IN",
          team_abbr: "PSV",
          opponent_abbr: "RBL",
          team_name: "PSV",
          opponent_name: "RB Leipzig",
          team_long_name: "PSV Eindhoven",
          opponent_long_name: "RB Leipzig",
          team_score: 1,
          opponent_score: 0,
          clock: "67'",
          half: "2",
          team_homeaway: "away",
          league: "UEFA.EUROPA_LEAGUE",
          date: "2026-10-22T21:00:00+00:00",
          team_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/145.png",
          opponent_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/11420.png",
        },
      };
    }
    return {
      entity_id: ENTITY_ID,
      state: "POST",
      attributes: {
        status: "POST",
        team_abbr: "PSV",
        opponent_abbr: "RBL",
        team_name: "PSV",
        opponent_name: "RB Leipzig",
        team_long_name: "PSV Eindhoven",
        opponent_long_name: "RB Leipzig",
        team_score: 2,
        opponent_score: 1,
        team_homeaway: "away",
        league: "UEFA.EUROPA_LEAGUE",
        date: "2026-10-22T21:00:00+00:00",
        team_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/145.png",
        opponent_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/11420.png",
      },
    };
  }, [mode]);

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
        <h1 className="text-lg font-semibold">Team Tracker card preview</h1>
        <p className="mt-1 text-sm text-white/60">
          Day/night stadium backgrounds with logos, league pill, and kickoff footer. No Home Assistant
          required.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["pre", "in", "post"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                mode === value ? "bg-white text-gray-900" : "bg-white/10 text-white/80"
              )}
            >
              {value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = resolved === "dark" ? "light" : "dark";
              setMode(next);
              setResolved(next);
            }}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
          >
            theme: {resolved} ({resolved === "dark" ? "night" : "day"} art)
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div style={{ width: 380, height: 280 }}>
            <TeamtrackerCardWidget
              title="PSV"
              entity_id={ENTITY_ID}
              show_form={false}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
