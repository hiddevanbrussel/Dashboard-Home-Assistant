"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_SETTINGS_LOCATION,
  parseSettingsSearch,
  settingsHref,
  type SettingsLocation,
} from "@/lib/settings-navigation";

export type SettingsNavMode = "push" | "replace";

const PORTRAIT_QUERY = "(max-width: 1023px)";

function readLocation(): SettingsLocation {
  if (typeof window === "undefined") return EMPTY_SETTINGS_LOCATION;
  return parseSettingsSearch(window.location.search);
}

/**
 * Section lives in the URL. Portrait pushes a detail entry so browser and
 * Android back return to the list. Landscape replaces, because the list
 * stays on screen. A deep link to a detail gets the list inserted behind it.
 */
export function useSettingsNavigation() {
  const [loc, setLoc] = useState<SettingsLocation>(EMPTY_SETTINGS_LOCATION);
  const [ready, setReady] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_QUERY);
    const onChange = () => setIsPortrait(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const read = () => setLoc(readLocation());
    read();
    setReady(true);
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (new URLSearchParams(window.location.search).get("ha_oauth")) return;
    const path = window.location.pathname;
    if (!isPortrait) {
      if (!loc.sectie) {
        const next: SettingsLocation = { sectie: "uiterlijk", page: null, app: null };
        window.history.replaceState({ settingsNav: "landscape" }, "", settingsHref(path, next));
        setLoc(next);
        return;
      }
      const canonical = settingsHref(path, loc);
      const current = `${path}${window.location.search}`;
      if (current !== canonical) {
        window.history.replaceState({ settingsNav: "landscape" }, "", canonical);
      }
      return;
    }
    if (!loc.sectie) return;
    if (window.history.state?.settingsNav === "detail") return;
    const detail = loc;
    window.history.replaceState(
      { settingsNav: "list" },
      "",
      settingsHref(path, EMPTY_SETTINGS_LOCATION)
    );
    window.history.pushState({ settingsNav: "detail" }, "", settingsHref(path, detail));
  }, [ready, isPortrait, loc]);

  const go = useCallback(
    (next: SettingsLocation, mode: SettingsNavMode) => {
      const href = settingsHref(window.location.pathname, next);
      const settingsNav = !next.sectie ? "list" : isPortrait ? "detail" : "landscape";
      if (mode === "push") window.history.pushState({ settingsNav }, "", href);
      else window.history.replaceState({ settingsNav }, "", href);
      setLoc(next);
    },
    [isPortrait]
  );

  const back = useCallback(() => {
    window.history.back();
  }, []);

  return { loc, ready, isPortrait, go, back };
}
