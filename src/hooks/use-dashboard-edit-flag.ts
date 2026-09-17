"use client";

import { useEffect } from "react";
import { setDashboardEditFlag } from "@/lib/card-plot";

/** Lets the plot controller skip first-open animations while a dashboard is being edited. */
export function useDashboardEditFlag(editMode: boolean) {
  useEffect(() => {
    setDashboardEditFlag(editMode);
    return () => setDashboardEditFlag(false);
  }, [editMode]);
}
