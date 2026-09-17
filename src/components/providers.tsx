"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { ScreensaverProvider } from "./screensaver";
import { TimerSound } from "./timer-sound";
import { CardPlotController } from "./card-plot-controller";
import { useEntityStatePolling } from "@/hooks/use-entity-state";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <EntityStatePoller />
        <CardPlotController />
        <TimerSound />
        <ScreensaverProvider>{children}</ScreensaverProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function EntityStatePoller() {
  useEntityStatePolling();
  return null;
}
