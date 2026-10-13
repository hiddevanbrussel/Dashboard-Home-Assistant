"use client";

import { useEffect, useMemo, useState } from "react";
import { WeatherSheetPanel } from "@/components/weather/weather-sheet-panel";
import type { WeatherForecastItem } from "@/lib/ha-weather-forecast";
import { WEATHER_ICON_FILES } from "@/lib/weather-card";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { cn } from "@/lib/utils";

const ENTITY_ID = "weather.preview";

const CONDITIONS = [
  "sunny",
  "clear-night",
  "partlycloudy",
  "cloudy",
  "fog",
  "rainy",
  "pouring",
  "hail",
  "snowy",
  "snowy-rainy",
  "lightning",
  "lightning-rainy",
  "windy",
  "windy-variant",
  "exceptional",
] as const;

function hoursFromNow(offset: number): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + offset);
  return d.toISOString();
}

function daysFromNow(offset: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

const HOURLY_CONDITIONS = [
  "partlycloudy",
  "sunny",
  "cloudy",
  "rainy",
  "pouring",
  "lightning-rainy",
  "windy",
  "fog",
] as const;

function mockHourly(): WeatherForecastItem[] {
  return Array.from({ length: 12 }, (_, i) => ({
    datetime: hoursFromNow(i),
    condition: HOURLY_CONDITIONS[i % HOURLY_CONDITIONS.length],
    temperature: 21 - Math.round(i / 3),
    templow: null,
    precipitationProbability: i % 3 === 0 ? 40 + i : null,
  }));
}

const DAILY_CONDITIONS = [
  "partlycloudy",
  "sunny",
  "rainy",
  "lightning",
  "cloudy",
  "snowy",
  "windy",
] as const;

function mockDaily(): WeatherForecastItem[] {
  return Array.from({ length: 7 }, (_, i) => ({
    datetime: daysFromNow(i),
    condition: DAILY_CONDITIONS[i],
    temperature: 22 - i,
    templow: 12 - Math.round(i / 2),
    precipitationProbability: i === 0 ? 10 : 20 + i * 8,
  }));
}

function SheetFrame({ dark }: { dark: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[min(92dvh,760px)] w-full max-w-[min(36rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] shadow-[0_-18px_60px_rgba(15,23,42,0.28)]",
        dark ? "dark bg-black" : "bg-white"
      )}
    >
      <WeatherSheetPanel entityId={ENTITY_ID} hourly={mockHourly()} daily={mockDaily()} />
    </div>
  );
}

/** Dev-only preview of the weather popup (no Home Assistant required). */
export default function WeatherSheetPreviewPage() {
  const setStates = useEntityStateStore((s) => s.setStates);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>("partlycloudy");

  const entity = useMemo(
    () => ({
      entity_id: ENTITY_ID,
      state: condition,
      attributes: {
        temperature: 18,
        humidity: 62,
        friendly_name: "Thuis",
      },
    }),
    [condition]
  );

  useEffect(() => {
    setLanguage("nl");
  }, [setLanguage]);

  useEffect(() => {
    const seed = () => setStates([entity]);
    seed();
    const id = setInterval(seed, 1500);
    return () => clearInterval(id);
  }, [entity, setStates]);

  return (
    <div className="min-h-screen bg-[#e8e6f4] px-4 py-6 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-lg font-semibold">Weather sheet preview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Light + dark popup, Pixeden color icons, no Home Assistant.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CONDITIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCondition(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                condition === value ? "bg-gray-900 text-white" : "bg-white text-gray-700 shadow-sm"
              )}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {WEATHER_ICON_FILES.map((file) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={file}
              src={`/weather-icons/${file}.png`}
              alt={file}
              title={file}
              className="h-10 w-10 object-contain"
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
          <SheetFrame dark={false} />
          <SheetFrame dark />
        </div>
      </div>
    </div>
  );
}
