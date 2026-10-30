"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { useTranslation } from "@/hooks/use-translation";
import { ENERGY_MY_TILES_ENABLED, type EnergyTab } from "@/lib/energy-tab";
import { cn } from "@/lib/utils";
import { useEnergyTab } from "@/stores/energy-overview-store";

const TABS: EnergyTab[] = ["overview", "tiles"];

export function energyTabId(tab: EnergyTab): string {
  return `energy-tab-${tab}`;
}

export function energyPanelId(tab: EnergyTab): string {
  return `energy-panel-${tab}`;
}

export function EnergyTabs() {
  if (!ENERGY_MY_TILES_ENABLED) return null;
  return <EnergyTabList />;
}

export function EnergyTabList() {
  const { t } = useTranslation();
  const { tab, ready, setTab } = useEnergyTab();
  const moveFocus = useRef(false);
  const label = (id: EnergyTab) =>
    id === "overview" ? t("energy.overview.tabOverview") : t("energy.overview.tabTiles");

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    document.getElementById(energyTabId(tab))?.focus();
  }, [tab]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, id: EnergyTab) {
    const index = TABS.indexOf(id);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    const nextId = TABS[next];
    if (!nextId || nextId === id) return;
    moveFocus.current = true;
    setTab(nextId);
  }

  if (!ready) {
    return (
      <div data-energy-tabs="pending" className="inline-flex items-center rounded-full p-1" aria-hidden>
        <span className="h-11 w-24 rounded-full bg-black/5 dark:bg-white/10" />
        <span className="h-11 w-28 rounded-full bg-black/5 dark:bg-white/10" />
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={t("energy.overview.tabs")}
      data-energy-tabs={tab}
      className="inline-flex items-center gap-0.5 rounded-full border border-[rgba(17,24,39,0.08)] bg-[var(--glass-strong)] p-1 dark:border-white/10"
    >
      {TABS.map((id) => {
        const selected = tab === id;
        return (
          <button
            key={id}
            id={energyTabId(id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={energyPanelId(id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(event) => onKeyDown(event, id)}
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-[15px] font-medium outline-none",
              FOCUS_RING_BRAND,
              selected
                ? "bg-[#4700B5] font-semibold text-white dark:bg-[#8357be]"
                : "bg-transparent text-[#374151] dark:text-[#d1d5db]"
            )}
          >
            {label(id)}
          </button>
        );
      })}
    </div>
  );
}
