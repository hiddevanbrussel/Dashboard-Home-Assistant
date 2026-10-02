"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { ScreensaverProvider } from "./screensaver";
import { TimerSound } from "./timer-sound";
import "@/stores/ui-sound-store";
import { CardPlotController } from "./card-plot-controller";
import { VoiceSatelliteOverlay } from "./voice/voice-satellite-overlay";
import { VoiceWakeWordListener } from "./voice/voice-wake-word-listener";
import { useEntityStatePolling } from "@/hooks/use-entity-state";
import { NotificationWatcher } from "@/components/notifications/notification-watcher";
import { NotificationToasts } from "@/components/notifications/notification-toasts";
import { DoorbellWatcher } from "@/components/doorbell/doorbell-watcher";
import { DoorbellPopup } from "@/components/doorbell/doorbell-popup";

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
        <NotificationWatcher />
        <NotificationToasts />
        <DoorbellWatcher />
        <DoorbellPopup />
        <CardPlotController />
        <TimerSound />
        <VoiceWakeWordListener />
        <VoiceSatelliteOverlay />
        <ScreensaverProvider>{children}</ScreensaverProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function EntityStatePoller() {
  useEntityStatePolling();
  return null;
}
