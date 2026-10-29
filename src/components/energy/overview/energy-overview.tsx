"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import { energyPanelId, energyTabId } from "@/components/energy/overview/energy-tabs";
import { NowHero } from "@/components/energy/overview/now-hero";

const STORY_DEV_FLAG = "1";

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

/** Landscape: Nu on the left, 560px, full height. Portrait: Nu on top, 680×560, page scrolls. */
export function EnergyOverview() {
  const { t } = useTranslation();
  const orientation = useOverviewOrientation();
  const showStory = process.env.NEXT_PUBLIC_ENERGY_STORY_DEV === STORY_DEV_FLAG;

  return (
    <div className="flex h-[calc(100dvh-5rem)] min-h-0 flex-row pt-14 portrait:h-auto portrait:min-h-[calc(100dvh-5rem)] portrait:flex-col">
      <section
        id={energyPanelId("overview")}
        role="tabpanel"
        aria-labelledby={energyTabId("overview")}
        aria-label={t("energy.overview.now.region")}
        className="h-full w-[560px] shrink-0 portrait:h-[560px] portrait:w-[680px]"
      >
        <NowHero orientation={orientation} />
      </section>
      {showStory ? (
        <p className="px-4 py-6 text-sm text-[#4b5563] dark:text-[#c4c4cc]">{t("energy.overview.now.storyLater")}</p>
      ) : (
        <div data-energy-carousel aria-hidden className="min-w-0 flex-1 portrait:hidden" />
      )}
    </div>
  );
}
