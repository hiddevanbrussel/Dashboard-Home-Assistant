"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DayBand } from "@/components/energy/overview/day-band";
import { energyPanelId, energyTabId } from "@/components/energy/overview/energy-tabs";
import { EnergyStorySheet } from "@/components/energy/overview/energy-story-sheet";
import { NowHero } from "@/components/energy/overview/now-hero";
import { useEnergyStage } from "@/components/energy/overview/use-energy-stage";
import { useTranslation } from "@/hooks/use-translation";
import { useEnergyOverviewData } from "@/hooks/use-energy-overview-data";
import { bandCells, cardForHouseLabel, storySheetLabelKey } from "@/lib/energy-day-band";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import { fallbackEnergyStage, type HouseLabelKind } from "@/lib/energy-house-labels";
import { FALLBACK_TIME_ZONE } from "@/lib/local-date";
import { formatClockInstant } from "@/lib/energy-story/offline";
import type { StoryCardModel } from "@/lib/energy-story/types";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useThemeStore } from "@/stores/theme-store";

function useOverviewOrientation(): OverviewOrientation {
  const [orientation, setOrientation] = useState<OverviewOrientation>("landscape");
  useEffect(() => {
    const query = window.matchMedia("(orientation: portrait)");
    const apply = () => setOrientation(query.matches ? "portrait" : "landscape");
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return orientation;
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{${key}}`).join(value);
  }
  return out;
}

/** House, one sentence and the day band. A tap opens one story card. */
export function EnergyOverview() {
  const { t, language } = useTranslation();
  const orientation = useOverviewOrientation();
  const { ref, stage } = useEnergyStage(orientation);
  const frame = stage ?? fallbackEnergyStage(orientation);
  const { facts, status } = useEnergyOverviewData();
  const dark = useThemeStore((state) => state.resolved) === "dark";
  const haError = useEntityStateStore((state) => state.error);
  const updatedAt = useEntityStateStore((state) => state.updatedAt);
  const reduced = useReducedMotion();
  const returnFocus = useRef<HTMLElement | null>(null);
  const [sheet, setSheet] = useState<StoryCardModel | null>(null);
  const lang = language === "nl" ? "nl" : "en";
  const cells = facts ? bandCells(facts, lang) : [];
  const showLink = status === "ready" && facts != null && cells.length === 0;
  const offline = haError != null;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || FALLBACK_TIME_ZONE;
  const offlineTime = updatedAt == null ? "" : formatClockInstant(new Date(updatedAt), timeZone);
  const offlineLabel = offline
    ? offlineTime
      ? fill(t("energy.story.offlineBadge"), { time: offlineTime })
      : t("energy.story.offlineOnly")
    : null;

  function openCard(card: StoryCardModel, source: HTMLElement) {
    returnFocus.current = source;
    setSheet(card);
  }

  return (
    <div
      ref={ref}
      id={energyPanelId("overview")}
      role="tabpanel"
      aria-labelledby={energyTabId("overview")}
      aria-label={t("energy.overview.now.region")}
      data-energy-overview
      data-orientation={orientation}
      className="relative -mx-4 -my-4 h-dvh w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]"
    >
      <NowHero
        orientation={orientation}
        stage={frame}
        labelOpens={(kind: HouseLabelKind) => (facts ? cardForHouseLabel(facts, kind) != null : false)}
        onOpenLabel={(kind, source) => {
          if (!facts) return;
          const card = cardForHouseLabel(facts, kind);
          if (!card) return;
          openCard(card, source);
        }}
      />
      <DayBand
        cells={cells}
        showLink={showLink}
        orientation={orientation}
        dark={dark}
        style={{ position: "absolute", top: frame.bandTop, left: frame.padLeft, width: frame.columnWidth }}
        onOpen={openCard}
      />
      <EnergyStorySheet
        card={sheet}
        label={sheet ? t(storySheetLabelKey(sheet)) : ""}
        offlineLabel={sheet && offline ? offlineLabel : null}
        reducedMotion={reduced}
        returnFocus={returnFocus}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
