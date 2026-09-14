"use client";

import { CheckCircle2, RotateCcw, Wind } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  consumableKey,
  consumableLabelKey,
  consumableRemainingRatio,
  fanPresetLabelKey,
  isConsumableDue,
  metaForConsumable,
  type ConsumableMeta,
  type ConsumableState,
  type FanPreset,
} from "@/lib/valetudo-robot";

function remainingLabel(item: ConsumableState, t: (key: string) => string): string {
  const remaining = item.remaining;
  if (!remaining) return "—";
  if (remaining.unit === "percent") {
    return t("vacuum.remainingPercent").replace("{n}", String(remaining.value));
  }
  const hours = remaining.value / 60;
  if (hours >= 1) {
    const rounded = hours >= 10 ? Math.round(hours) : Math.round(hours * 10) / 10;
    return t("vacuum.remainingHours").replace("{n}", String(rounded));
  }
  return t("vacuum.remainingMinutes").replace("{n}", String(remaining.value));
}

function consumableTitle(item: ConsumableState, t: (key: string) => string): string {
  const specificKey = consumableLabelKey(item);
  const specific = t(specificKey);
  if (specific !== specificKey) return specific;
  const typeKey = `vacuum.consumable.${item.type}`;
  const typeLabel = t(typeKey);
  if (typeLabel !== typeKey) return typeLabel;
  return item.type;
}

export function VacuumSidePanel({
  fanPresets,
  fanSpeed,
  fanBusy,
  onFanPreset,
  consumables,
  consumableMeta,
  resettingKey,
  onResetConsumable,
}: {
  fanPresets: FanPreset[];
  fanSpeed: FanPreset | null;
  fanBusy: boolean;
  onFanPreset: (preset: FanPreset) => void;
  consumables: ConsumableState[];
  consumableMeta: ConsumableMeta[];
  resettingKey: string | null;
  onResetConsumable: (item: ConsumableState) => void;
}) {
  const { t } = useTranslation();
  const dueCount = consumables.filter((item) =>
    isConsumableDue(item, metaForConsumable(item, consumableMeta))
  ).length;
  const showFan = fanPresets.length > 0;
  const showConsumables = consumables.length > 0;

  if (!showFan && !showConsumables) return null;

  return (
    <aside className="flex max-h-[42vh] w-full shrink-0 flex-col gap-3 overflow-y-auto lg:max-h-none lg:w-[300px] lg:self-stretch lg:overflow-hidden">
      {showFan ? (
        <section className="flex flex-col gap-3 rounded-card border border-white/70 bg-white/45 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Wind className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t("vacuum.fan")}</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("vacuum.fanHint")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {fanPresets.map((preset) => {
              const selected = fanSpeed === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={fanBusy}
                  onClick={() => onFanPreset(preset)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? "bg-brand text-white shadow-sm"
                      : "bg-white/70 text-gray-800 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  } disabled:opacity-50`}
                >
                  {t(fanPresetLabelKey(preset))}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {showConsumables ? (
        <section className="flex min-h-0 flex-1 flex-col gap-3 rounded-card border border-white/70 bg-white/45 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05]">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{t("vacuum.maintenance")}</h2>
            <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
              {dueCount > 0
                ? t("vacuum.consumableDueCount").replace("{n}", String(dueCount))
                : t("vacuum.consumableOk")}
            </p>
          </div>
          {dueCount === 0 ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {t("vacuum.consumableAllGood")}
            </div>
          ) : null}
          <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
            {consumables.map((item) => {
              const key = consumableKey(item);
              const meta = metaForConsumable(item, consumableMeta);
              const due = isConsumableDue(item, meta);
              const barRatio = consumableRemainingRatio(item, meta);
              return (
                <li
                  key={key}
                  className={`rounded-xl border px-3 py-2.5 ${
                    due
                      ? "border-amber-300/80 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10"
                      : "border-white/60 bg-white/55 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {consumableTitle(item, t)}
                      </p>
                      <p
                        className={`text-[11px] ${
                          due
                            ? "font-medium text-amber-800 dark:text-amber-200"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {due ? t("vacuum.consumableDue") : remainingLabel(item, t)}
                      </p>
                    </div>
                    {due ? (
                      <button
                        type="button"
                        disabled={resettingKey === key}
                        onClick={() => onResetConsumable(item)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-gray-800 hover:bg-white disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {t("vacuum.consumableReset")}
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full ${due ? "bg-amber-500" : "bg-brand"}`}
                      style={{ width: `${Math.round(barRatio * 100)}%` }}
                    />
                  </div>
                  {due ? (
                    <p className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                      {remainingLabel(item, t)}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
