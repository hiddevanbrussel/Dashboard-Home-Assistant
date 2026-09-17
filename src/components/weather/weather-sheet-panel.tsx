"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Droplets } from "lucide-react";
import { WeatherIcon } from "@/components/widgets/weather-card-widget";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguageStore } from "@/stores/language-store";
import { useEntityStateStore } from "@/stores/entity-state-store";
import {
  formatForecastHour,
  formatForecastWeekday,
  isForecastToday,
  type WeatherForecastItem,
} from "@/lib/ha-weather-forecast";

function formatTemp(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}°`;
}

function conditionLabel(condition: string, t: (key: string) => string): string {
  const key = `weatherSheet.condition.${condition.toLowerCase()}`;
  const label = t(key);
  return label === key ? condition : label;
}

async function loadForecast(entityId: string, type: "hourly" | "daily"): Promise<WeatherForecastItem[]> {
  const res = await fetch(`/api/ha/weather-forecast?entity_id=${encodeURIComponent(entityId)}&type=${type}`);
  if (!res.ok) return [];
  const data = (await res.json()) as { forecast?: WeatherForecastItem[] };
  return Array.isArray(data.forecast) ? data.forecast : [];
}

export function WeatherSheetPanel({
  entityId,
  onClose,
}: {
  entityId: string;
  onClose?: () => void;
}) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const locale = language === "nl" ? "nl-NL" : "en-GB";
  const entity = useEntityStateStore((s) => s.getState(entityId));
  const [hourly, setHourly] = useState<WeatherForecastItem[]>([]);
  const [daily, setDaily] = useState<WeatherForecastItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const condition = (entity?.state as string) ?? "";
  const temperature =
    entity?.attributes?.temperature != null ? Number(entity.attributes.temperature) : undefined;
  const humidity =
    entity?.attributes?.humidity != null ? Number(entity.attributes.humidity) : undefined;
  const title =
    (entity?.attributes?.friendly_name as string | undefined)?.trim() || t("weatherSheet.title");
  const today = daily.find((item) => isForecastToday(item.datetime)) ?? daily[0];

  useEffect(() => {
    if (!entityId) return;
    let cancelled = false;
    setLoaded(false);
    Promise.all([loadForecast(entityId, "hourly"), loadForecast(entityId, "daily")])
      .then(([nextHourly, nextDaily]) => {
        if (cancelled) return;
        setHourly(nextHourly.slice(0, 24));
        setDaily(nextDaily.slice(0, 7));
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [entityId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative flex shrink-0 items-center justify-center px-5 pb-2 pt-1">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
            aria-label={t("weatherSheet.close")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        <h2 className="truncate px-12 text-[17px] font-semibold tracking-tight text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex flex-col items-center pb-5 pt-2 text-center">
          <WeatherIcon state={condition} className="h-14 w-14 text-sky-500 dark:text-sky-300" />
          <p className="mt-2 text-[4.25rem] font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
            {formatTemp(temperature)}
          </p>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-white/55">
            {condition ? conditionLabel(condition, t) : t("weatherSheet.unknown")}
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-white/45">
            {t("weatherSheet.highLow")
              .replace("{high}", formatTemp(today?.temperature ?? temperature))
              .replace("{low}", formatTemp(today?.templow))}
          </p>
          {humidity != null && !Number.isNaN(humidity) ? (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-white/45">
              <Droplets className="h-3.5 w-3.5" />
              {Math.round(humidity)}%
            </p>
          ) : null}
        </div>

        <section className="rounded-[1.35rem] bg-white px-3 py-3 shadow-sm dark:bg-white/5">
          <h3 className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
            {t("weatherSheet.hourly")}
          </h3>
          {hourly.length === 0 ? (
            <p className="px-2 py-4 text-sm text-gray-400 dark:text-white/45">
              {loaded ? t("weatherSheet.noForecast") : t("weatherSheet.loading")}
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {hourly.map((item) => (
                <div key={item.datetime} className="flex w-12 shrink-0 flex-col items-center gap-1.5 py-1">
                  <span className="text-[11px] font-medium text-gray-400 dark:text-white/45">
                    {formatForecastHour(item.datetime, locale)}
                  </span>
                  <WeatherIcon state={item.condition || condition} className="h-5 w-5 text-sky-500 dark:text-sky-300" />
                  <span className="text-sm font-semibold tabular-nums text-gray-800 dark:text-white">
                    {formatTemp(item.temperature)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-3 rounded-[1.35rem] bg-white px-2 py-2 shadow-sm dark:bg-white/5">
          <h3 className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/45">
            {t("weatherSheet.weekly")}
          </h3>
          {daily.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-400 dark:text-white/45">
              {loaded ? t("weatherSheet.noForecast") : t("weatherSheet.loading")}
            </p>
          ) : (
            <ul>
              {daily.map((item) => (
                <li
                  key={item.datetime}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                  <span className="w-14 shrink-0 text-sm font-medium text-gray-700 dark:text-white/80">
                    {isForecastToday(item.datetime)
                      ? t("weatherSheet.today")
                      : formatForecastWeekday(item.datetime, locale)}
                  </span>
                  <WeatherIcon state={item.condition || condition} className="h-5 w-5 text-sky-500 dark:text-sky-300" />
                  {item.precipitationProbability != null ? (
                    <span className="w-10 text-xs font-medium text-sky-500">
                      {Math.round(item.precipitationProbability)}%
                    </span>
                  ) : (
                    <span className="w-10" />
                  )}
                  <span className="ml-auto flex items-baseline gap-2 tabular-nums">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {formatTemp(item.temperature)}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-white/40">{formatTemp(item.templow)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
