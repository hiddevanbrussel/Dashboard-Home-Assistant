"use client";

import { create } from "zustand";

export type AppNotification = {
  id: string;
  ruleId: string;
  entityId: string;
  title: string;
  message: string;
  icon?: string | null;
  createdAt: number;
  /** Still visible as a toast. */
  toastVisible: boolean;
  /** Kept in the notification center until dismissed. */
  dismissed: boolean;
};

const MAX_HISTORY = 40;
const TOAST_AUTO_DISMISS_MS = 8_000;

type AppNotificationsStore = {
  items: AppNotification[];
  push: (input: {
    ruleId: string;
    entityId: string;
    title: string;
    message: string;
    icon?: string | null;
  }) => string;
  dismissToast: (id: string) => void;
  dismissItem: (id: string) => void;
  dismissAll: () => void;
  toastAutoDismissMs: number;
};

function newId(): string {
  return `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAppNotificationsStore = create<AppNotificationsStore>((set, get) => ({
  items: [],
  toastAutoDismissMs: TOAST_AUTO_DISMISS_MS,
  push: (input) => {
    const id = newId();
    const item: AppNotification = {
      id,
      ruleId: input.ruleId,
      entityId: input.entityId,
      title: input.title || "Notification",
      message: input.message || "",
      icon: input.icon ?? null,
      createdAt: Date.now(),
      toastVisible: true,
      dismissed: false,
    };
    const items = [item, ...get().items].slice(0, MAX_HISTORY);
    set({ items });
    return id;
  },
  dismissToast: (id) => {
    set({
      items: get().items.map((n) => (n.id === id ? { ...n, toastVisible: false } : n)),
    });
  },
  dismissItem: (id) => {
    set({
      items: get().items.map((n) =>
        n.id === id ? { ...n, toastVisible: false, dismissed: true } : n
      ),
    });
  },
  dismissAll: () => {
    set({
      items: get().items.map((n) => ({ ...n, toastVisible: false, dismissed: true })),
    });
  },
}));
