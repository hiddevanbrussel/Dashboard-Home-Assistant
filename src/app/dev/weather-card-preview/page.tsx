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
  const setResolved = useThemeStore((s) => s.setResolved);
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("cloudy");
  const [showWind, setShowWind] = useState(true);
  const [showHumidity, setShowHumidity] = useState(true);
  const [showAqi, setShowAqi] = useState(true);
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
          temperature: 16,
          humidity: 72,
          wind_speed: 3.5,
          wind_bearing: 225,
          wind_speed_unit: "m/s",
          precipitation: 0,
          friendly_name: "Thuis",
          forecast: [
            {
              datetime: today,
              condition,
              temperature: 19,
              templow: 11,
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
    // Day packs for clear daytime conditions; dark theme unlocks night variants.
    const day = new Set(["sunny", "cloudy", "fog", "windy", "partlycloudy"]);
    setResolved(day.has(condition) ? "light" : "dark");
  }, [condition, setResolved]);

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
    <div className="min-h-screen bg-[#0b1220] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold">Weather card preview</h1>
        <p className="mt-1 text-sm text-white/60">
          Mockup layout + WebP backgrounds. Toggle details like the edit panel switches.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {CONDITIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCondition(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                condition === value ? "bg-white text-gray-900" : "bg-white/10 text-white/80"
              )}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/80">
          {(
            [
              ["Hoog/laag", showHighLow, setShowHighLow],
              ["Wind", showWind, setShowWind],
              ["Vochtigheid", showHumidity, setShowHumidity],
              ["Luchtkwaliteit", showAqi, setShowAqi],
              ["Neerslag", showPrecip, setShowPrecip],
            ] as const
          ).map(([label, on, setOn]) => (
            <label key={label} className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
              <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
              {label}
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <div className="h-[320px] w-[340px]">
            <WeatherCardWidget
              title="Thuis"
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
