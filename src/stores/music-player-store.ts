"use client";

import { create } from "zustand";

export type MAPlayer = { queue_id: string; display_name?: string; [key: string]: unknown };

export type QueueState = {
  state?: "playing" | "paused" | "idle";
  position?: number;
  duration?: number;
  current_item?: {
    name?: string;
    artists?: { name?: string }[] | { name?: string };
    image?: string;
    image_url?: string;
    [key: string]: unknown;
  };
} | null;

type MusicPlayerStore = {
  maPlayers: MAPlayer[];
  setMaPlayers: (v: MAPlayer[]) => void;
  queueState: QueueState;
  setQueueState: (v: QueueState) => void;
  selectedQueueId: string | null;
  setSelectedQueueId: (v: string | null) => void;
  /** On non-music pages: true = bar expanded, false = only label visible */
  playerBarExpanded: boolean;
  setPlayerBarExpanded: (v: boolean) => void;
};

export const useMusicPlayerStore = create<MusicPlayerStore>((set) => ({
  maPlayers: [],
  setMaPlayers: (v) => set({ maPlayers: v }),
  queueState: null,
  setQueueState: (v) => set({ queueState: v }),
  selectedQueueId: null,
  setSelectedQueueId: (v) => set({ selectedQueueId: v }),
  playerBarExpanded: false,
  setPlayerBarExpanded: (v) => set({ playerBarExpanded: v }),
}));
