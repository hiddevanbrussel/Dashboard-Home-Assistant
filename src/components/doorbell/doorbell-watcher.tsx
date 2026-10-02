"use client";

import { useEffect, useRef } from "react";
import { collectStateTransitions } from "@/lib/notification-rules";
import { shouldTriggerDoorbell } from "@/lib/doorbell";
import { playDoorbellChime, unlockDoorbellAudio } from "@/lib/doorbell-chime";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useDoorbellStore } from "@/stores/doorbell-store";

/**
 * Watches HA entity polls for the configured doorbell visitor sensor.
 * On ring: play chime + open camera popup. Mount once under Providers.
 */
export function DoorbellWatcher() {
  const states = useEntityStateStore((s) => s.states);
  const updatedAt = useEntityStateStore((s) => s.updatedAt);
  const settings = useDoorbellStore((s) => s.settings);
  const previousRef = useRef<Record<string, { state: string }> | null>(null);
  const primedRef = useRef(false);

  // Unlock audio on first user gesture so ring chime can play later.
  useEffect(() => {
    const unlock = () => unlockDoorbellAudio();
    window.addEventListener("pointerdown", unlock, { capture: true, passive: true });
    window.addEventListener("keydown", unlock, { capture: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true } as EventListenerOptions);
      window.removeEventListener("keydown", unlock, { capture: true } as EventListenerOptions);
    };
  }, []);

  useEffect(() => {
    if (updatedAt == null) return;
    if (!settings.enabled || !(settings.sensorEntityId ?? "").trim()) {
      // Still keep snapshot primed so enabling mid-session does not false-fire.
      const snapshot: Record<string, { state: string }> = {};
      for (const [id, e] of Object.entries(states)) {
        if (e) snapshot[id] = { state: e.state };
      }
      previousRef.current = snapshot;
      primedRef.current = Object.keys(snapshot).length > 0;
      return;
    }

    const snapshot: Record<string, { state: string }> = {};
    for (const [id, e] of Object.entries(states)) {
      if (e) snapshot[id] = { state: e.state };
    }

    if (!primedRef.current) {
      previousRef.current = snapshot;
      primedRef.current = Object.keys(snapshot).length > 0;
      return;
    }

    const previous = previousRef.current ?? {};
    const transitions = collectStateTransitions(previous, snapshot);
    previousRef.current = snapshot;
    if (transitions.length === 0) return;

    const now = Date.now();
    const lastRingAtMs = useDoorbellStore.getState().lastRingAtMs;
    const currentSettings = useDoorbellStore.getState().settings;

    for (const transition of transitions) {
      if (
        !shouldTriggerDoorbell({
          settings: currentSettings,
          sensorEntityId: transition.entityId,
          fromState: transition.fromState,
          toState: transition.toState,
          lastRingAtMs,
          nowMs: now,
        })
      ) {
        continue;
      }

      useDoorbellStore.getState().triggerRing({
        sensorEntityId: transition.entityId,
        cameraEntityId: currentSettings.cameraEntityId,
        webrtcStreamUrl: currentSettings.webrtcStreamUrl,
        atMs: now,
      });

      if (currentSettings.playChime) {
        try {
          playDoorbellChime();
        } catch {
          /* ignore */
        }
      }
      break;
    }
  }, [states, updatedAt, settings.enabled, settings.sensorEntityId]);

  return null;
}
