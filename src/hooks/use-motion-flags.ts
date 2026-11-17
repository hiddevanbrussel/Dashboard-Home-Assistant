"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { DASHBOARD_EDIT_ATTR } from "@/lib/card-plot";

const MEDIA = "(prefers-reduced-motion: reduce)";
function subscribePreference(onChange: () => void) {
  const media = window.matchMedia(MEDIA);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
export function useSkyReducedMotionPreference(): boolean {
  return useSyncExternalStore(subscribePreference, () => window.matchMedia(MEDIA).matches, () => false);
}

/** Generic flags only: no feature-specific stores or dependencies. */
export function useSkyMotionFlags(ref: RefObject<HTMLElement | null>, { rootMargin = "100px" } = {}) {
  const reducedMotion = useSkyReducedMotionPreference();
  const [flags, setFlags] = useState({ hidden: false, visible: false, screensaver: false, editMode: false });
  useEffect(() => {
    const read = () => {
      const hidden = document.hidden;
      const screensaver = Boolean(document.body.querySelector(".fixed.inset-0.z-\\[9999\\]"));
      const editMode = document.documentElement.hasAttribute(DASHBOARD_EDIT_ATTR);
      setFlags((old) => old.hidden === hidden && old.screensaver === screensaver && old.editMode === editMode
        ? old : { ...old, hidden, screensaver, editMode });
    };
    read();
    document.addEventListener("visibilitychange", read);
    const body = new MutationObserver(read);
    body.observe(document.body, { childList: true });
    const edit = new MutationObserver(read);
    edit.observe(document.documentElement, { attributes: true, attributeFilter: [DASHBOARD_EDIT_ATTR] });
    return () => { document.removeEventListener("visibilitychange", read); body.disconnect(); edit.disconnect(); };
  }, []);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setFlags((old) => ({ ...old, visible: true }));
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      const visible = Boolean(entry?.isIntersecting);
      setFlags((old) => old.visible === visible ? old : { ...old, visible });
    }, { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return { ...flags, reducedMotion };
}
