"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { WeatherCardWidget } from "@/components/widgets/weather-card-widget";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";
import { DEFAULT_SUN_ENTITY_ID, normalizeSkyMotion, type SkyMotion, type SkyPhase } from "@/lib/weather-sky";
import { useSkyReducedMotion } from "@/components/weather/weather-sky";
import { getServerSkyFrameStats, getSkyFrameStats, subscribeSkyFrameStats } from "@/lib/sky/frame-loop";
import { planParticles } from "@/lib/sky/particles";
import { resolveSkyMode } from "@/lib/sky/sky-motion";
import { cn } from "@/lib/utils";

const ENTITY_ID = "weather.preview";
const AQI_ID = "sensor.aqi_preview";
const subscribeNoStats = () => () => {};

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
  "hail",
  "snowy-rainy",
  "pouring",
  "lightning",
  "windy-variant",
] as const;

/** Dev-only preview of the redesigned weather card (no Home Assistant required). */
export default function WeatherCardPreviewPage() {
  const updateEntityState = useEntityStateStore((s) => s.updateEntityState);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const setResolved = useThemeStore((s) => s.setResolved);
  const resolved = useThemeStore((s) => s.resolved);
  const [condition, setCondition] = useState<string>("partlycloudy");
  const [sun, setSun] = useState({ elevation: 7, rising: true });
  const [dimensions, setDimensions] = useState({ width: 320, height: 300 });
  const [motion, setMotion] = useState<SkyMotion>("on");
  const [precipitation, setPrecipitation] = useState<number | null>(null);
  const [wind, setWind] = useState(10);
  const [bearing, setBearing] = useState(270);
  const [freezeTime, setFreezeTime] = useState<number | undefined>();
  const [seed, setSeed] = useState(1);
  const [debug, setDebug] = useState(false);
  const reducedMotion = useSkyReducedMotion();
  const stats = useSyncExternalStore(debug ? subscribeSkyFrameStats : subscribeNoStats,
    debug ? getSkyFrameStats : getServerSkyFrameStats, getServerSkyFrameStats);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.has("condition")) setCondition(query.get("condition") ?? "");
    const phase = query.get("phase") as SkyPhase | null;
    const elevations = { day: 7, dawn: 0, dusk: 0, night: -7 };
    const phaseElevation = phase && Object.prototype.hasOwnProperty.call(elevations, phase) ? elevations[phase] : 7;
    const customElevation = query.has("elevation") ? Number(query.get("elevation")) : NaN;
    setSun({
      elevation: Number.isFinite(customElevation) ? customElevation : phaseElevation,
      rising: query.has("rising") ? ["true", "1"].includes(query.get("rising") ?? "") : phase !== "dusk" && phase !== "night",
    });
    const customSize = (key: string, fallback: number) => {
      const value = Number(query.get(key));
      return Number.isFinite(value) && value > 0 ? Math.min(1000, value) : fallback;
    };
    setDimensions({ width: customSize("w", 320), height: customSize("h", query.get("size") === "compact" ? 160 : 300) });
    setMotion(normalizeSkyMotion(query.get("motion")));
    const numberParam = (key: string, fallback: number) => {
      const value = query.has(key) ? Number(query.get(key)) : NaN;
      return Number.isFinite(value) ? value : fallback;
    };
    if (query.has("precip")) setPrecipitation(Math.max(0, numberParam("precip", 0)));
    setWind(Math.max(0, numberParam("wind", 10)));
    setBearing(numberParam("bearing", 270));
    setSeed(numberParam("seed", 1));
    if (query.has("t")) setFreezeTime(Math.max(0, Math.min(3600, numberParam("t", 0))));
    setDebug(query.get("debug") === "1");
    const theme = query.get("theme");
    if (theme === "light" || theme === "dark") {
      setThemeMode(theme);
      setResolved(theme);
    }
  }, [setThemeMode, setResolved]);
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

  const precip = precipitation ?? (condition === "rainy" ? 1 : 0);
  const debugPlan = useMemo(() => debug ? planParticles({ condition, precipitation: precip, windKmh: wind, bearing,
    width: dimensions.width, height: dimensions.height,
    compact: dimensions.height < 184 || !(showWind || showHumidity || showAqi || showPrecip),
    mode: resolveSkyMode({ motion, reducedMotion, performanceStep: stats.performanceStep }),
    performanceStep: stats.performanceStep,
  }) : null, [debug, condition, precip, wind, bearing, dimensions, showWind, showHumidity, showAqi, showPrecip, motion, reducedMotion, stats.performanceStep]);

  const entities = useMemo(
    () => [
      {
        entity_id: DEFAULT_SUN_ENTITY_ID,
        state: sun.elevation > 0 ? "above_horizon" : "below_horizon",
        attributes: { elevation: sun.elevation, rising: sun.rising },
      },
      {
        entity_id: ENTITY_ID,
        state: condition,
        attributes: {
          temperature: 12,
          humidity: 77,
          wind_speed: wind,
          wind_bearing: bearing,
          wind_speed_unit: "km/h",
          precipitation: precip,
          friendly_name: "Preview weather",
          forecast: [
            {
              datetime: today,
              condition,
              temperature: 12,
              templow: 8,
              precipitation: precip,
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
    [condition, today, sun, wind, bearing, precip]
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
        {debug && <p data-sky-debug className="mt-1 text-sm">
          Particles: {freezeTime != null ? debugPlan?.total ?? 0 : stats.activeParticles}, fps: {stats.fps}, average work: {stats.averageWorkMs.toFixed(3)} ms
        </p>}

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

        <div className="mt-4 flex flex-wrap gap-2">
          {(["day", "dawn", "dusk", "night"] as const).map((phase) => (
            <button key={phase} type="button" className="min-h-[44px] rounded-lg border px-3"
              onClick={() => setSun({ elevation: phase === "day" ? 7 : phase === "night" ? -7 : 0, rising: phase === "day" || phase === "dawn" })}>
              {phase}
            </button>
          ))}
          <select aria-label="Preview tile size" className="min-h-[44px] rounded-lg bg-transparent px-3"
            value={dimensions.height === 160 ? "compact" : "large"}
            onChange={(event) => setDimensions({ width: 320, height: event.target.value === "compact" ? 160 : 300 })}>
            <option value="large">Large</option><option value="compact">Compact</option>
          </select>
          <select aria-label="Preview sky motion" className="min-h-[44px] rounded-lg bg-transparent px-3"
            value={motion} onChange={(event) => setMotion(normalizeSkyMotion(event.target.value))}>
            <option value="on">On</option><option value="calm">Calm</option><option value="off">Off</option>
          </select>
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
          <div data-weather-preview style={dimensions}>
            <WeatherCardWidget
              title="Preview weather"
              entity_id={ENTITY_ID}
              show_icon
              show_condition
              show_high_low={showHighLow}
              show_wind={showWind}
              show_humidity={showHumidity}
              show_air_quality={showAqi}
              show_precipitation={showPrecip}
              sky_motion={motion}
              skyPreview={{ time: freezeTime, seed }}
              height={dimensions.height}
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
