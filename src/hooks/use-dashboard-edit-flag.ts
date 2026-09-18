"use client";

import { useLayoutEffect } from "react";
import { markCardsPlotInstant, setDashboardEditFlag } from "@/lib/card-plot";

/** Skip first-open plot animations before the browser paints edit mode. */
export function useDashboardEditFlag(editMode: boolean) {
  useLayoutEffect(() => {
    setDashboardEditFlag(editMode);
    if (editMode) markCardsPlotInstant();
    return () => setDashboardEditFlag(false);
  }, [editMode]);
}
