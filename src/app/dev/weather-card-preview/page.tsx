"use client";

import { useEffect, useMemo, useState } from "react";
import { WeatherCardWidget } from "@/components/widgets/weather-card-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

const ENTITY_ID = "weather.preview";
const AQI_ID = "sensor.aqi_preview";

const CONDITIONS = [
  "sunny",
  "clear-night",
  "partlycloudy",
  "cloudy",
  "fog",
  "rainy",
  "snowy",
  "lightning-rainy",
  "windy",
] as const;

/** Dev-only preview of the redesigned weather card (no Home Assistant required). */
export default function WeatherCardPreviewPage() {
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const setResolved = useThemeStore((s) => s.setResolved);
  const resolved = useThemeStore((s) => s.resolved);
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("partlycloudy");
  const [showWind, setShowWind] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);
  const [showAqi, setShowAqi] = useState(false);
  const [showPrecip, setShowPrecip] = useState(true);
  const [showHighLow, setShowHighLow] = useState(true);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d.toISOString();
  }, []);

  const entities = useMemo(
    () => [
      {
        entity_id: ENTITY_ID,
        state: condition,
        attributes: {
          temperature: 12,
          humidity: 77,
          wind_speed: 3.5,
          wind_bearing: 90,
          wind_speed_unit: "m/s",
          precipitation: 0,
          friendly_name: "Madeliefje",
          forecast: [
            {
              datetime: today,
              condition,
              temperature: 12,
              templow: 8,
              precipitation: 0,
            },
          ],
        },
      },
      {
        entity_id: AQI_ID,
        state: "goed",
        attributes: { friendly_name: "Luchtkwaliteit" },
      },
    ],
    [condition, today]
  );

  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  useEffect(() => {
    // Use optimistic updates so the global HA state poll cannot wipe mock entities.
    const seed = () => {
      for (const e of entities) {
        updateEntityState(e.entity_id, { state: e.state, attributes: e.attributes });
      }
    };
    seed();
    const id = setInterval(seed, 2500);
    return () => clearInterval(id);
  }, [entities, updateEntityState]);

  return (
    <div
      className={cn(
        "min-h-screen px-4 py-8 transition-colors",
        resolved === "dark" ? "bg-[#0b1220] text-white" : "bg-[#E8ECF2] text-gray-900"
      )}
    >
      <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold">Weather card preview</h1>
        <p className={cn("mt-1 text-sm", resolved === "dark" ? "text-white/60" : "text-gray-500")}>
          Mockup layout with 3D condition icons. Toggle details like the edit panel switches.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {CONDITIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCondition(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                condition === value
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

        <div
          className={cn(
            "mt-4 flex flex-wrap gap-3 text-sm",
            resolved === "dark" ? "text-white/80" : "text-gray-700"
          )}
        >
          {(
            [
              ["Hoog/laag", showHighLow, setShowHighLow],
              ["Wind", showWind, setShowWind],
              ["Vochtigheid", showHumidity, setShowHumidity],
              ["Luchtkwaliteit", showAqi, setShowAqi],
              ["Neerslag", showPrecip, setShowPrecip],
            ] as const
          ).map(([label, on, setOn]) => (
            <label
              key={label}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-1.5",
                resolved === "dark" ? "bg-white/5" : "bg-black/5"
              )}
            >
              <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
              {label}
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="h-[320px] w-[340px]">
            <WeatherCardWidget
              title="Madeliefje"
              entity_id={ENTITY_ID}
              show_icon
              show_condition
              show_high_low={showHighLow}
              show_wind={showWind}
              show_humidity={showHumidity}
              show_air_quality={showAqi}
              show_precipitation={showPrecip}
              air_quality_entity_id={AQI_ID}
              size="md"
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
