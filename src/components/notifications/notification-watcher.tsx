"use client";

import { useEffect, useRef } from "react";
import { useEntityStateStore } from "@/stores/entity-state-store";
import { useNotificationRulesStore } from "@/stores/notification-rules-store";
import { useAppNotificationsStore } from "@/stores/app-notifications-store";
import {
  collectStateTransitions,
  matchNotificationRules,
} from "@/lib/notification-rules";
import { playUiClick } from "@/lib/ui-click";

/**
 * Watches HA entity state polls and pushes in-app notifications when rules match.
 * Mount once under Providers.
 */
export function NotificationWatcher() {
  const states = useEntityStateStore((s) => s.states);
  const updatedAt = useEntityStateStore((s) => s.updatedAt);
  const rules = useNotificationRulesStore((s) => s.rules);
  const markFired = useNotificationRulesStore((s) => s.markFired);
  const push = useAppNotificationsStore((s) => s.push);
  const previousRef = useRef<Record<string, { state: string }> | null>(null);
  const primedRef = useRef(false);

  useEffect(() => {
    if (updatedAt == null) return;

    const snapshot: Record<string, { state: string }> = {};
    for (const [id, e] of Object.entries(states)) {
      if (e) snapshot[id] = { state: e.state };
    }

    // First non-empty poll: prime history without notifying.
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
    let fired = { ...useNotificationRulesStore.getState().lastFiredByRuleId };
    const currentRules = useNotificationRulesStore.getState().rules;

    for (const transition of transitions) {
      const matches = matchNotificationRules(currentRules, transition, fired, now);
      for (const match of matches) {
        push({
          ruleId: match.rule.id,
          entityId: match.entityId,
          title: match.rule.title,
          message: match.rule.message,
          icon: match.rule.icon,
        });
        markFired(match.rule.id, now);
        fired = { ...fired, [match.rule.id]: now };
        try {
          playUiClick();
        } catch {
          /* ignore */
        }
      }
    }
  }, [states, updatedAt, rules, markFired, push]);

  return null;
}
