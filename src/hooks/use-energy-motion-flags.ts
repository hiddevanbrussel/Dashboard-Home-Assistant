"use client";

import { useEffect, useState, type RefObject } from "react";
import { ENERGY_MY_TILES_ENABLED } from "@/lib/energy-tab";
import { useEnergyOverviewStore } from "@/stores/energy-overview-store";

/** Motion, visibility and tab flags shared by the house hero and the day band. */
export function useMotionFlags(frame: RefObject<HTMLElement | null>) {
  const storedTab = useEnergyOverviewStore((state) => state.tab);
  const tab = ENERGY_MY_TILES_ENABLED ? storedTab : "overview";
  const [flags, setFlags] = useState({
    reducedMotion: false,
    glassOff: false,
    hidden: false,
    visible: true,
    screensaver: false,
  });

  useEffect(() => {
    const read = () => {
      setFlags((current) => ({
        ...current,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        glassOff: document.documentElement.getAttribute("data-glass-density") === "off",
        hidden: document.hidden,
        screensaver: Boolean(document.querySelector(".fixed.inset-0.z-\\[9999\\]")),
      }));
    };
    read();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", read);
    document.addEventListener("visibilitychange", read);
    const glass = new MutationObserver(read);
    glass.observe(document.documentElement, { attributes: true, attributeFilter: ["data-glass-density"] });
    const body = new MutationObserver(read);
    body.observe(document.body, { childList: true });
    return () => {
      motion.removeEventListener("change", read);
      document.removeEventListener("visibilitychange", read);
      glass.disconnect();
      body.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = frame.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setFlags((current) => ({ ...current, visible: Boolean(entry?.isIntersecting) }));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [frame]);

  return { ...flags, tab };
}
