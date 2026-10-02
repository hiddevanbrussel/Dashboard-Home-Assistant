"use client";

import { create } from "zustand";
import {
  defaultNotificationRules,
  parseNotificationRules,
  type NotificationRule,
} from "@/lib/notification-rules";

const STORAGE_KEY_RULES = "dashboard.notifications.rules";
const STORAGE_KEY_LAST_FIRED = "dashboard.notifications.lastFired";

function readRules(): NotificationRule[] {
  if (typeof window === "undefined") return defaultNotificationRules();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RULES);
    if (raw == null || raw === "") return defaultNotificationRules();
    return parseNotificationRules(JSON.parse(raw));
  } catch {
    return defaultNotificationRules();
  }
}

function writeRules(rules: NotificationRule[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
  } catch {
    /* ignore */
  }
}

function readLastFired(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_FIRED);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function writeLastFired(map: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_LAST_FIRED, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

type NotificationRulesStore = {
  rules: NotificationRule[];
  lastFiredByRuleId: Record<string, number>;
  setRules: (rules: NotificationRule[]) => void;
  upsertRule: (rule: NotificationRule) => void;
  removeRule: (id: string) => void;
  setRuleEnabled: (id: string, enabled: boolean) => void;
  markFired: (ruleId: string, atMs?: number) => void;
};

export const useNotificationRulesStore = create<NotificationRulesStore>((set, get) => ({
  rules: readRules(),
  lastFiredByRuleId: readLastFired(),
  setRules: (rules) => {
    writeRules(rules);
    set({ rules });
  },
  upsertRule: (rule) => {
    const current = get().rules;
    const idx = current.findIndex((r) => r.id === rule.id);
    const next =
      idx >= 0 ? current.map((r, i) => (i === idx ? rule : r)) : [...current, rule];
    writeRules(next);
    set({ rules: next });
  },
  removeRule: (id) => {
    const next = get().rules.filter((r) => r.id !== id);
    writeRules(next);
    set({ rules: next });
  },
  setRuleEnabled: (id, enabled) => {
    const next = get().rules.map((r) => (r.id === id ? { ...r, enabled } : r));
    writeRules(next);
    set({ rules: next });
  },
  markFired: (ruleId, atMs = Date.now()) => {
    const next = { ...get().lastFiredByRuleId, [ruleId]: atMs };
    writeLastFired(next);
    set({ lastFiredByRuleId: next });
  },
}));

export function hydrateNotificationRulesStore() {
  if (typeof window === "undefined") return;
  useNotificationRulesStore.setState({
    rules: readRules(),
    lastFiredByRuleId: readLastFired(),
  });
}
