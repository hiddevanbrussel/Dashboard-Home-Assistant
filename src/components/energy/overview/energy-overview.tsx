"use client";

import { useEffect, useRef, useState } from "react";
import { energyPanelId, energyTabId } from "@/components/energy/overview/energy-tabs";
import { NowHero } from "@/components/energy/overview/now-hero";
import { StoryCarousel, type StoryCarouselHandle, type StoryOpenKind } from "@/components/energy/overview/story-carousel";
import { useTranslation } from "@/hooks/use-translation";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";

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

/** Landscape: house box 560×424, cards centred on that row. Portrait: sentence under the house, cards 24px below. */
export function EnergyOverview() {
  const { t } = useTranslation();
  const orientation = useOverviewOrientation();
  const story = useRef<StoryCarouselHandle>(null);

  return (
    <div
      id={energyPanelId("overview")}
      role="tabpanel"
      aria-labelledby={energyTabId("overview")}
      aria-label={t("energy.overview.now.region")}
      data-energy-overview
      className="grid h-[calc(100dvh-5rem)] min-h-0 w-full grid-cols-[560px_minmax(0,1fr)] grid-rows-[auto_424px_auto] content-start pt-14 portrait:mx-auto portrait:h-auto portrait:min-h-[calc(100dvh-5rem)] portrait:w-[560px] portrait:grid-cols-[560px] portrait:grid-rows-[auto_424px_auto_auto]"
    >
      <NowHero
        orientation={orientation}
        onOpenCard={(kind: StoryOpenKind) => story.current?.open(kind)}
      />
      <StoryCarousel ref={story} />
    </div>
  );
}
