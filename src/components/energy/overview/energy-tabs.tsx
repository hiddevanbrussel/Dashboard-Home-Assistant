"use client";

import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { useTranslation } from "@/hooks/use-translation";
import type { EnergyTab } from "@/lib/energy-tab";
import { cn } from "@/lib/utils";
import { useEnergyTab } from "@/stores/energy-overview-store";

const TABS: EnergyTab[] = ["overview", "tiles"];

export function EnergyTabs() {
  const { t } = useTranslation();
  const { tab, ready, setTab } = useEnergyTab();
  const label = (id: EnergyTab) =>
    id === "overview" ? t("energy.overview.tabOverview") : t("energy.overview.tabTiles");

  if (!ready) {
    return (
      <div data-energy-tabs="pending" className="flex items-center gap-1" aria-hidden>
        <span className="h-11 w-24 rounded-full bg-black/5 dark:bg-white/10" />
        <span className="h-11 w-28 rounded-full bg-black/5 dark:bg-white/10" />
      </div>
    );
  }

  return (
    <div role="tablist" aria-label={t("energy.overview.tabs")} data-energy-tabs={tab} className="flex items-center gap-1">
      {TABS.map((id) => {
        const selected = tab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-[15px] font-semibold outline-none",
              FOCUS_RING_BRAND,
              selected
                ? "bg-[#111827] text-white dark:bg-[#f3f4f6] dark:text-[#111827]"
                : "text-[#111827] dark:text-[#f3f4f6]"
            )}
          >
            {label(id)}
          </button>
        );
      })}
    </div>
  );
}
