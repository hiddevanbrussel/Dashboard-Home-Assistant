"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { OverviewOrientation } from "@/lib/energy-house-anchors";
import { energyStageFromContent, type EnergyStage } from "@/lib/energy-house-labels";

export function useEnergyStage(orientation: OverviewOrientation): {
  ref: RefObject<HTMLDivElement | null>;
  stage: EnergyStage | null;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<EnergyStage | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const apply = () => {
      const contentWidth = node.clientWidth;
      const viewportHeight = window.innerHeight;
      if (contentWidth < 200 || viewportHeight < 200) return;
      setStage(energyStageFromContent({ contentWidth, viewportHeight, orientation }));
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [orientation]);

  return { ref, stage };
}
