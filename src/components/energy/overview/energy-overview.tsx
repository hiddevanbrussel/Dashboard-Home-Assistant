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

/** Landscape: Nu on the left, 560px, full height. Portrait: Nu on top, 680×560, page scrolls. */
export function EnergyOverview() {
  const { t } = useTranslation();
  const orientation = useOverviewOrientation();
  const story = useRef<StoryCarouselHandle>(null);

  return (
    <div className="flex h-[calc(100dvh-5rem)] min-h-0 flex-row pt-14 portrait:h-auto portrait:min-h-[calc(100dvh-5rem)] portrait:flex-col">
      <section
        id={energyPanelId("overview")}
        role="tabpanel"
        aria-labelledby={energyTabId("overview")}
        aria-label={t("energy.overview.now.region")}
        className="h-full w-[560px] shrink-0 portrait:h-[560px] portrait:w-[680px]"
      >
        <NowHero
          orientation={orientation}
          onOpenCard={(kind: StoryOpenKind) => story.current?.open(kind)}
        />
      </section>
      <StoryCarousel ref={story} />
    </div>
  );
}
