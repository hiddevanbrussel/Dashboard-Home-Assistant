"use client";

import { AlertTriangle, BatteryMedium, Download, Leaf, SunMedium } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 dark:text-white/45">{label}</p>
      <p className="mt-1 flex items-baseline gap-1 text-[1.65rem] font-semibold tracking-tight text-gray-900 dark:text-white">
        {value}
        {unit ? <span className="text-sm font-medium text-gray-400 dark:text-white/40">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">{hint}</p> : null}
    </div>
  );
}

function HousePlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-sky-100 to-amber-50 dark:from-zinc-800 dark:to-zinc-900">
      <div className="absolute inset-x-8 top-6 h-24 rounded-t-[1.25rem] bg-zinc-800 dark:bg-zinc-950" />
      <div className="absolute inset-x-10 top-8 grid grid-cols-6 gap-1.5">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="aspect-square rounded-sm bg-zinc-700 ring-1 ring-sky-300/40" />
        ))}
      </div>
      <div className="mt-36 flex h-40 items-end justify-center bg-gradient-to-t from-white/80 to-transparent pb-4 dark:from-zinc-900/80">
        <SunMedium className="h-8 w-8 text-amber-400" />
      </div>
    </div>
  );
}

export function EnergyOverview({
  title,
  subtitle,
  houseImage,
}: {
  title?: string | null;
  subtitle?: string | null;
  houseImage?: string | null;
}) {
  const { t } = useTranslation();
  const heatmap = Array.from({ length: 24 }, (_, i) => (i === 16 ? "hot" : i % 7 === 3 ? "warm" : "idle"));

  return (
    <div className="mx-auto w-full max-w-6xl pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {title?.trim() || t("energy.overview.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-400 dark:text-white/45">
          {subtitle?.trim() || t("energy.overview.subtitle")}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4 rounded-[1.5rem] bg-white/80 p-5 shadow-sm dark:bg-white/5">
            <Stat label={t("energy.overview.totalGenerated")} value="—" unit="kWh" />
            <Stat label={t("energy.overview.currentOutput")} value="—" unit="kW" />
            <Stat label={t("energy.overview.gridExport")} value="—" unit="kWh" />
          </div>

          <section className="rounded-[1.5rem] bg-white/80 p-5 shadow-sm dark:bg-white/5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.chart")}</h2>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {t("energy.overview.generation")}</span>
                <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-amber-300" /> {t("energy.overview.consumption")}</span>
                <span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t("energy.overview.export")}</span>
              </div>
            </div>
            <div className="flex h-40 items-end gap-1 rounded-2xl bg-gradient-to-t from-orange-50/80 to-transparent px-2 pb-2 dark:from-orange-400/5">
              {Array.from({ length: 24 }, (_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-md bg-orange-300/70 dark:bg-orange-400/40"
                  style={{ height: `${18 + ((i * 17) % 70)}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400 dark:text-white/40">{t("energy.overview.chartHint")}</p>
          </section>
        </div>

        <div className="space-y-5">
          {houseImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={houseImage} alt="" className="h-52 w-full rounded-[1.5rem] object-cover shadow-sm" />
          ) : (
            <HousePlaceholder />
          )}
          <div className="grid grid-cols-2 gap-4">
            <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
              <p className="text-xs font-medium text-gray-400">{t("energy.overview.power")}</p>
              <div className="mt-3 flex h-28 items-center justify-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-orange-200 dark:border-orange-400/30">
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">—</span>
                  <span className="absolute -bottom-1 text-[10px] font-medium text-gray-400">kW</span>
                </div>
              </div>
            </section>
            <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <BatteryMedium className="h-3.5 w-3.5" />
                {t("energy.overview.battery")}
              </p>
              <div className="space-y-3">
                {[t("energy.overview.energy"), t("energy.overview.consuming"), t("energy.overview.temperature")].map((label) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-[11px] text-gray-400">
                      <span>{label}</span>
                      <span>—</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10">
                      <div className="h-2 w-1/3 rounded-full bg-emerald-300" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t("energy.overview.alerts")}
            </h2>
            <span className="text-xs text-gray-400">{t("energy.overview.noAlerts")}</span>
          </div>
          <div className="flex h-16 items-end gap-2">
            <span className="w-8 rounded-t-md bg-orange-400/80" style={{ height: "35%" }} />
            <span className="w-8 rounded-t-md bg-amber-200" style={{ height: "55%" }} />
            <span className="w-8 rounded-t-md bg-gray-200 dark:bg-white/15" style={{ height: "80%" }} />
          </div>
        </section>
        <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white">
            <Leaf className="h-4 w-4 text-emerald-500" />
            {t("energy.overview.impact")}
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-white/55">
              <dt>{t("energy.overview.carbon")}</dt>
              <dd className="font-medium text-gray-800 dark:text-white">—</dd>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-white/55">
              <dt>{t("energy.overview.trees")}</dt>
              <dd className="font-medium text-gray-800 dark:text-white">—</dd>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-white/55">
              <dt>{t("energy.overview.homes")}</dt>
              <dd className="font-medium text-gray-800 dark:text-white">—</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{t("energy.overview.heatmap")}</h2>
            <span className="text-[11px] text-gray-400">{t("energy.overview.heatmapHint")}</span>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {heatmap.map((tone, i) => (
              <span
                key={i}
                className={cn(
                  "aspect-square rounded-md",
                  tone === "hot" ? "bg-orange-500" : tone === "warm" ? "bg-amber-300" : "bg-amber-100 dark:bg-amber-200/30"
                )}
              />
            ))}
          </div>
        </section>
      </div>

      <p className="mt-5 inline-flex items-center gap-2 text-xs text-gray-400 dark:text-white/40">
        <Download className="h-3.5 w-3.5" />
        {t("energy.overview.prepareHint")}
      </p>
    </div>
  );
}
