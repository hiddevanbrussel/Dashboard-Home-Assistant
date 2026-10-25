"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Backpack, Trash2, Dog, Book, Shirt, BedDouble, Utensils, ShoppingCart, Star, Brush, Wrench, Smile, Bike, Sprout,
  IceCreamCone, CakeSlice, Sandwich,
  X, Plus, Pencil, ListTodo, ChevronLeft, Trophy, Gift, Search,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CelebrationSheet, type CelebrationState } from "@/components/family/celebration-sheet";
import { ChildTaskBoard } from "@/components/family/child-task-board";
import { UndoToast, UNDO_TOAST_DURATION_MS } from "@/components/undo-toast";
import { useTranslation } from "@/hooks/use-translation";
import { remainingVisibleTodayChores, savedCompletionId, shouldCelebrateCompletingToday } from "@/lib/family-task-completion";
import { clampPointsBalance } from "@/lib/points-balance";
import { cn } from "@/lib/utils";
import { localDateKey } from "@/lib/local-date";
import { getEditModeAllowed, getEditModePasscode, checkEditModePasscode, getEveningHour } from "@/stores/dashboard-settings-store";
import type { ChildRecord, ChoreRecord, ChoreCompletionsResponse, ScoresResponse, ChoreFrequency, RewardRecord, StreaksResponse, BalancesResponse } from "@/lib/chores-types";

// ── icon picker ──────────────────────────────────────────────────────────────

const CHORE_ICONS: { name: string; Icon: React.FC<{ className?: string }> }[] = [
  { name: "Backpack", Icon: Backpack },
  { name: "Smile", Icon: Smile },
  { name: "Trash2", Icon: Trash2 },
  { name: "Dog", Icon: Dog },
  { name: "Book", Icon: Book },
  { name: "Shirt", Icon: Shirt },
  { name: "BedDouble", Icon: BedDouble },
  { name: "Utensils", Icon: Utensils },
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "Star", Icon: Star },
  { name: "Brush", Icon: Brush },
  { name: "Wrench", Icon: Wrench },
  { name: "Bike", Icon: Bike },
  { name: "Sprout", Icon: Sprout },
];

function ChoreIcon({ name, className }: { name: string | null; className?: string }) {
  const entry = CHORE_ICONS.find((i) => i.name === name);
  if (!entry) return <ListTodo className={className} />;
  return <entry.Icon className={className} />;
}

const REWARD_ICONS: { name: string; Icon: React.FC<{ className?: string }> }[] = [
  ...CHORE_ICONS,
  { name: "IceCreamCone", Icon: IceCreamCone },
  { name: "CakeSlice", Icon: CakeSlice },
  { name: "Sandwich", Icon: Sandwich },
];

function RewardIcon({ name, className }: { name: string | null; className?: string }) {
  const entry = REWARD_ICONS.find((i) => i.name === name);
  if (!entry) return <Gift className={className} />;
  return <entry.Icon className={className} />;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function getTodayDate() {
  return localDateKey();
}

const COLOR_PRESETS = [
  "#FF6B6B", "#FF9F43", "#FECA57", "#1DD1A1", "#54A0FF", "#5F27CD",
  "#FF6BB5", "#C8D6E5", "#576574", "#222F3E",
];

// ── Edit panel ────────────────────────────────────────────────────────────────

type EditPanelProps = {
  onClose: () => void;
};

function EditPanel({ onClose }: EditPanelProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"children" | "chores" | "rewards">("children");

  // -- Children data
  const { data: children = [] } = useQuery<ChildRecord[]>({
    queryKey: ["children"],
    queryFn: () => fetch("/api/children").then((r) => r.json()),
  });

  // -- Chores data
  const { data: chores = [] } = useQuery<ChoreRecord[]>({
    queryKey: ["chores"],
    queryFn: () => fetch("/api/chores").then((r) => r.json()),
  });

  // ── Child form state ──
  const [editingChildId, setEditingChildId] = useState<string | "new" | null>(null);
  const [childForm, setChildForm] = useState({ name: "", emoji: "", color: COLOR_PRESETS[0] });

  function openNewChild() {
    setEditingChildId("new");
    setChildForm({ name: "", emoji: "", color: COLOR_PRESETS[0] });
  }

  function openEditChild(c: ChildRecord) {
    setEditingChildId(c.id);
    setChildForm({ name: c.name, emoji: c.emoji ?? "", color: c.color ?? COLOR_PRESETS[0] });
  }

  function cancelChild() { setEditingChildId(null); }

  const saveChildMutation = useMutation({
    mutationFn: async () => {
      if (editingChildId === "new") {
        return fetch("/api/children", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: childForm.name, emoji: childForm.emoji || null, color: childForm.color }),
        }).then((r) => r.json());
      } else {
        return fetch(`/api/children/${editingChildId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: childForm.name, emoji: childForm.emoji || null, color: childForm.color }),
        }).then((r) => r.json());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["chore-completions"] });
      setEditingChildId(null);
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/children/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["chore-completions"] });
      setEditingChildId(null);
    },
  });

  // ── Chore form state ──
  const [editingChoreId, setEditingChoreId] = useState<string | "new" | null>(null);
  const [choreForm, setChoreForm] = useState({
    title: "",
    points: 1,
    frequency: "daily" as ChoreFrequency,
    icon: null as string | null,
    childIds: null as string[] | null,
    timesPerDay: 1,
    shared: false,
    penalty: false,
  });

  function openNewChore() {
    setEditingChoreId("new");
    setChoreForm({ title: "", points: 1, frequency: "daily", icon: null, childIds: null, timesPerDay: 1, shared: false, penalty: false });
  }

  function openEditChore(c: ChoreRecord) {
    setEditingChoreId(c.id);
    setChoreForm({ title: c.title, points: c.points, frequency: c.frequency, icon: c.icon, childIds: c.childIds, timesPerDay: c.timesPerDay ?? 1, shared: c.shared ?? false, penalty: c.penalty ?? false });
  }

  function cancelChore() { setEditingChoreId(null); }

  const saveChoreMutation = useMutation({
    mutationFn: async () => {
      if (editingChoreId === "new") {
        return fetch("/api/chores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(choreForm),
        }).then((r) => r.json());
      } else {
        return fetch(`/api/chores/${editingChoreId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(choreForm),
        }).then((r) => r.json());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      queryClient.invalidateQueries({ queryKey: ["chore-completions"] });
      setEditingChoreId(null);
    },
  });

  const deleteChoreMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/chores/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      queryClient.invalidateQueries({ queryKey: ["chore-completions"] });
      setEditingChoreId(null);
    },
  });

  // ── Rewards data ──
  const { data: rewards = [] } = useQuery<RewardRecord[]>({
    queryKey: ["rewards"],
    queryFn: () => fetch("/api/rewards").then((r) => r.json()),
  });

  // ── Reward form state ──
  const [editingRewardId, setEditingRewardId] = useState<string | "new" | null>(null);
  const [rewardForm, setRewardForm] = useState({ title: "", pointsCost: 10, icon: null as string | null });

  function openNewReward() {
    setEditingRewardId("new");
    setRewardForm({ title: "", pointsCost: 10, icon: null });
  }

  function openEditReward(r: RewardRecord) {
    setEditingRewardId(r.id);
    setRewardForm({ title: r.title, pointsCost: r.pointsCost, icon: r.icon });
  }

  function cancelReward() { setEditingRewardId(null); }

  const saveRewardMutation = useMutation({
    mutationFn: async () => {
      if (editingRewardId === "new") {
        return fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rewardForm),
        }).then((r) => r.json());
      } else {
        return fetch(`/api/rewards/${editingRewardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rewardForm),
        }).then((r) => r.json());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setEditingRewardId(null);
    },
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/rewards/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
      setEditingRewardId(null);
    },
  });

  function toggleChildIdInChoreForm(childId: string) {
    setChoreForm((f) => {
      if (f.childIds === null) {
        return { ...f, childIds: children.map((c) => c.id).filter((id) => id !== childId) };
      }
      const has = f.childIds.includes(childId);
      const next = has ? f.childIds.filter((id) => id !== childId) : [...f.childIds, childId];
      return { ...f, childIds: next.length === children.length ? null : next };
    });
  }

  if (typeof document === "undefined") return null;

  const tabClass = (active: boolean) =>
    cn(
      "h-11 flex-1 rounded-full px-3 text-sm font-semibold transition-colors",
      active
        ? "bg-white text-gray-900 shadow-sm dark:bg-[#8357be] dark:text-white"
        : "text-gray-700 dark:text-gray-300",
    );

  return createPortal(
    <>
    <div className="fixed inset-0 z-[90] bg-black/30" aria-hidden onClick={onClose} />
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("family.edit")}
      className="fixed inset-y-0 right-0 z-[91] flex w-full max-w-[400px] flex-col bg-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] dark:bg-[#1b1a21] dark:shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-3 py-2 dark:border-white/10">
        <div className="flex flex-1 gap-0.5 rounded-full bg-gray-100 p-0.5 dark:bg-white/[0.06]" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "children"}
            onClick={() => { setTab("children"); setEditingChildId(null); setEditingChoreId(null); }}
            className={tabClass(tab === "children")}
          >
            {t("family.children")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "chores"}
            onClick={() => { setTab("chores"); setEditingChildId(null); setEditingChoreId(null); }}
            className={tabClass(tab === "chores")}
          >
            {t("family.chores")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "rewards"}
            onClick={() => { setTab("rewards"); setEditingChildId(null); setEditingChoreId(null); setEditingRewardId(null); }}
            className={tabClass(tab === "rewards")}
          >
            {t("family.rewards")}
          </button>
        </div>
        <button type="button" onClick={onClose} aria-label={t("editPanel.close")} className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* ── CHILDREN TAB ── */}
        {tab === "children" && (
          <div className="flex flex-col gap-3">
            {editingChildId !== null ? (
              <div className="flex flex-col gap-3">
                <button onClick={cancelChild} className="flex h-11 items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                  <ChevronLeft className="h-4 w-4" /> {t("family.cancel")}
                </button>
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.childName")}</label>
                    <input
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      value={childForm.name}
                      onChange={(e) => setChildForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder={t("family.childNamePlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.childEmoji")}</label>
                    <input
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      value={childForm.emoji}
                      onChange={(e) => setChildForm((f) => ({ ...f, emoji: e.target.value }))}
                      placeholder={t("family.childEmojiPlaceholder")}
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.childColor")}</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setChildForm((f) => ({ ...f, color: c }))}
                          className={cn("h-11 w-11 rounded-full transition-transform", childForm.color === c && "scale-125 ring-2 ring-offset-2 ring-gray-400")}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveChildMutation.mutate()}
                      disabled={!childForm.name.trim() || saveChildMutation.isPending}
                      className="h-11 flex-1 rounded-full bg-brand text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 dark:bg-[#8357be]"
                    >
                      {t("family.save")}
                    </button>
                    {editingChildId !== "new" && (
                      <button
                        onClick={() => { if (confirm(t("family.confirmDelete"))) deleteChildMutation.mutate(editingChildId); }}
                        className="h-11 rounded-full border border-red-300 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        {t("family.delete")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {children.map((child) => (
                  <div key={child.id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full text-lg" style={{ background: child.color ?? "#6366F1" }}>
                      {child.emoji ?? "👤"}
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">{child.name}</span>
                    <button onClick={() => openEditChild(child)} className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={openNewChild}
                  className="flex min-h-11 items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand dark:border-white/20 dark:text-gray-200 dark:hover:border-[#8357be]"
                >
                  <Plus className="h-4 w-4" /> {t("family.addChild")}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── CHORES TAB ── */}
        {tab === "chores" && (
          <div className="flex flex-col gap-3">
            {editingChoreId !== null ? (
              <div className="flex flex-col gap-3">
                <button onClick={cancelChore} className="flex h-11 items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                  <ChevronLeft className="h-4 w-4" /> {t("family.cancel")}
                </button>
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.choreTitle")}</label>
                    <input
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      value={choreForm.title}
                      onChange={(e) => setChoreForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder={t("family.choreTitlePlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.chorePoints")}</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      value={choreForm.points}
                      onChange={(e) => setChoreForm((f) => ({ ...f, points: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.choreFrequency")}</label>
                    <div className="flex flex-col gap-1">
                      {(["daily", "weekdays", "weekly"] as const).map((freq) => (
                        <label key={freq} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                          <input
                            type="radio"
                            name="frequency"
                            value={freq}
                            checked={choreForm.frequency === freq}
                            onChange={() => setChoreForm((f) => ({ ...f, frequency: freq, timesPerDay: freq === "weekly" ? 1 : f.timesPerDay }))}
                            className="mt-0.5"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{t(`family.frequency.${freq}`)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {(choreForm.frequency === "daily" || choreForm.frequency === "weekdays") && !choreForm.shared && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.choreTimesPerDay")}</label>
                      <div className="flex gap-2">
                        {([
                          [1, "family.timesPerDay.once"],
                          [2, "family.timesPerDay.twice"],
                          [3, "family.timesPerDay.evening"],
                        ] as [number, string][]).map(([n, labelKey]) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setChoreForm((f) => ({ ...f, timesPerDay: n }))}
                            className={cn(
                              "h-11 flex-1 rounded-full border-2 px-2 text-sm font-semibold transition-all",
                              choreForm.timesPerDay === n
                                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                : "border-gray-300 text-gray-700 dark:border-white/15 dark:text-gray-300"
                            )}
                          >
                            {t(labelKey)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-3 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5">
                    <input
                      type="checkbox"
                      className="mt-0.5 shrink-0"
                      checked={choreForm.shared}
                      onChange={(e) => setChoreForm((f) => ({ ...f, shared: e.target.checked, timesPerDay: e.target.checked ? 1 : f.timesPerDay }))}
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-100">{t("family.choreShared")}</span>
                  </label>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-red-200 px-3 hover:bg-red-50 dark:border-red-800/40 dark:hover:bg-red-900/10">
                    <input
                      type="checkbox"
                      className="mt-0.5 shrink-0"
                      checked={choreForm.penalty}
                      onChange={(e) => setChoreForm((f) => ({ ...f, penalty: e.target.checked }))}
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-100">{t("family.chorePenalty")}</span>
                  </label>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.choreIcon")}</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setChoreForm((f) => ({ ...f, icon: null }))}
                        className={cn("flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all",
                          choreForm.icon === null ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-200 dark:border-gray-700")}
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                      {CHORE_ICONS.map(({ name, Icon }) => (
                        <button
                          key={name}
                          onClick={() => setChoreForm((f) => ({ ...f, icon: name }))}
                          className={cn("flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all",
                            choreForm.icon === name ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "border-gray-200 text-gray-500 dark:border-gray-700")}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                  {children.length > 0 && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.choreForWho")}</label>
                      <div className="flex flex-col gap-1">
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                          <input
                            type="checkbox"
                            checked={choreForm.childIds === null}
                            onChange={() => setChoreForm((f) => ({ ...f, childIds: null }))}
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{t("family.allChildren")}</span>
                        </label>
                        {children.map((child) => (
                          <label key={child.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 hover:bg-gray-50 dark:hover:bg-white/5">
                            <input
                              type="checkbox"
                              checked={choreForm.childIds === null || choreForm.childIds.includes(child.id)}
                              onChange={() => toggleChildIdInChoreForm(child.id)}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{child.emoji ? `${child.emoji} ` : ""}{child.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveChoreMutation.mutate()}
                      disabled={!choreForm.title.trim() || saveChoreMutation.isPending}
                      className="h-11 flex-1 rounded-full bg-brand text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 dark:bg-[#8357be]"
                    >
                      {t("family.save")}
                    </button>
                    {editingChoreId !== "new" && (
                      <button
                        onClick={() => { if (confirm(t("family.confirmDelete"))) deleteChoreMutation.mutate(editingChoreId); }}
                        className="h-11 rounded-full border border-red-300 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        {t("family.delete")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {chores.map((chore) => (
                  <div key={chore.id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                    <ChoreIcon name={chore.icon} className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{chore.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{chore.points} pt · {t(`family.frequency.${chore.frequency}`).split(" (")[0]}{(chore.timesPerDay ?? 1) > 1 ? ` · ${t("family.timesPerDay.twice")}` : ""}{chore.shared ? " · gedeeld" : ""}{chore.penalty ? " · straf" : ""}</p>
                    </div>
                    <button onClick={() => openEditChore(chore)} className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={openNewChore}
                  className="flex min-h-11 items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand dark:border-white/20 dark:text-gray-200 dark:hover:border-[#8357be]"
                >
                  <Plus className="h-4 w-4" /> {t("family.addChore")}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── REWARDS TAB ── */}
        {tab === "rewards" && (
          <div className="flex flex-col gap-3">
            {editingRewardId !== null ? (
              <div className="flex flex-col gap-3">
                <button onClick={cancelReward} className="flex h-11 items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                  <ChevronLeft className="h-4 w-4" /> {t("family.cancel")}
                </button>
                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.rewardTitle")}</label>
                    <input
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      value={rewardForm.title}
                      onChange={(e) => setRewardForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder={t("family.rewardPlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.rewardCost")}</label>
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-white/15 dark:bg-white/[0.04] dark:text-white"
                      value={rewardForm.pointsCost}
                      onChange={(e) => setRewardForm((f) => ({ ...f, pointsCost: Math.max(1, parseInt(e.target.value) || 1) }))}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("family.rewardIcon")}</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setRewardForm((f) => ({ ...f, icon: null }))}
                        className={cn("flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all",
                          rewardForm.icon === null ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-200 dark:border-gray-700")}
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                      {REWARD_ICONS.map(({ name, Icon }) => (
                        <button
                          key={name}
                          onClick={() => setRewardForm((f) => ({ ...f, icon: name }))}
                          className={cn("flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all",
                            rewardForm.icon === name ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" : "border-gray-200 text-gray-500 dark:border-gray-700")}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => saveRewardMutation.mutate()}
                      disabled={!rewardForm.title.trim() || saveRewardMutation.isPending}
                      className="h-11 flex-1 rounded-full bg-brand text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 dark:bg-[#8357be]"
                    >
                      {t("family.save")}
                    </button>
                    {editingRewardId !== "new" && (
                      <button
                        onClick={() => { if (confirm(t("family.confirmDelete"))) deleteRewardMutation.mutate(editingRewardId); }}
                        className="h-11 rounded-full border border-red-300 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        {t("family.delete")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {rewards.map((reward) => (
                  <div key={reward.id} className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-700">
                    <RewardIcon name={reward.icon} className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{reward.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{reward.pointsCost} pt</p>
                    </div>
                    <button onClick={() => openEditReward(reward)} className="flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={openNewReward}
                  className="flex min-h-11 items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand dark:border-white/20 dark:text-gray-200 dark:hover:border-[#8357be]"
                >
                  <Plus className="h-4 w-4" /> {t("family.addReward")}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </>
    ,
    document.body,
  );
}

// ── Scoreboard ────────────────────────────────────────────────────────────────

const MEDALS = ["🥇", "🥈", "🥉"];

function Scoreboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const todayDate = getTodayDate();

  const { data, isLoading } = useQuery<ScoresResponse>({
    queryKey: ["chore-scores", period, todayDate],
    queryFn: () => fetch(`/api/chore-completions/scores?period=${period}&date=${todayDate}`).then((r) => r.json()),
  });

  const children = data?.children ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* period tabs */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "h-11 rounded-full px-4 text-sm font-semibold transition-colors",
              period === p
                ? "bg-white text-gray-900 shadow-sm dark:bg-[#8357be] dark:text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300"
            )}
          >
            {t(`family.scoreboard.${p}`)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {!isLoading && children.every((c) => c.points === 0) && (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Trophy className="h-10 w-10 text-gray-300" />
          <p className="text-gray-600 dark:text-gray-300">{t("family.scoreboard.noData")}</p>
        </div>
      )}

      {!isLoading && children.some((c) => c.points > 0) && (
        <div className="flex flex-col gap-3 max-w-lg">
          {children.map((child, i) => (
            <div
              key={child.id}
              className={cn(
                "flex items-center gap-4 rounded-2xl px-5 py-4",
                i === 0 && child.points > 0
                  ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  : "bg-white/60 dark:bg-white/5"
              )}
            >
              <span className="text-2xl w-8 text-center">
                {child.points > 0 && child.rank <= 3 ? MEDALS[child.rank - 1] : <span className="text-base font-bold text-gray-400">{child.rank}</span>}
              </span>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                style={{ background: child.color ?? "#6366F1", boxShadow: `0 0 0 3px ${child.color ?? "#6366F1"}44` }}
              >
                {child.emoji ?? "👤"}
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{child.name}</span>
              <span className={cn(
                "rounded-full px-3 py-1 text-sm font-bold",
                child.points > 0
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                  : "bg-gray-100 text-gray-400 dark:bg-gray-800"
              )}>
                {child.points} {t("family.scoreboard.pts")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FamilyPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const todayDate = getTodayDate();
  const [editOpen, setEditOpen] = useState(false);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [view, setView] = useState<"tasks" | "scoreboard" | "rewards">("tasks");
  const [taskQuery, setTaskQuery] = useState("");
  const [celebration, setCelebration] = useState<CelebrationState | null>(null);
  const [undo, setUndo] = useState<{ completionId: string; title: string; points: number } | null>(null);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  function openEditWithPasscode() {
    const passcode = getEditModePasscode().trim();
    if (passcode) {
      setPasscodeInput("");
      setPasscodeError(null);
      setPasscodeModalOpen(true);
    } else {
      setEditOpen(true);
    }
  }

  const { data, isLoading } = useQuery<ChoreCompletionsResponse>({
    queryKey: ["chore-completions", todayDate],
    queryFn: () => fetch(`/api/chore-completions?date=${todayDate}`).then((r) => r.json()),
    refetchInterval: 60_000,
  });

  const { data: streaksData } = useQuery<StreaksResponse>({
    queryKey: ["chore-streaks", todayDate],
    queryFn: () => fetch(`/api/chore-completions/streaks?date=${todayDate}`).then((r) => r.json()),
    refetchInterval: 300_000,
  });

  const { data: balancesData, refetch: refetchBalances } = useQuery<BalancesResponse>({
    queryKey: ["reward-balances"],
    queryFn: () => fetch("/api/reward-claims/balances").then((r) => r.json()),
  });

  const { data: rewardsData } = useQuery<RewardRecord[]>({
    queryKey: ["rewards"],
    queryFn: () => fetch("/api/rewards").then((r) => r.json()),
  });

  const children = useMemo(() => data?.children ?? [], [data]);
  const streakMap = new Map((streaksData?.streaks ?? []).map((s) => [s.childId, s.streak]));
  const balanceMap = new Map((balancesData?.balances ?? []).map((b) => [b.childId, b]));
  const rewards = rewardsData ?? [];

  const completeMutation = useMutation({
    mutationFn: async ({ choreId, childId, frequency }: { choreId: string; childId: string; frequency: string; title: string; points: number; childName: string; celebrate: boolean }) => {
      const response = await fetch("/api/chore-completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choreId, childId, frequency, date: todayDate }),
      });
      const data = await response.json().catch(() => ({})) as { id?: string };
      const id = savedCompletionId(response.ok, data.id);
      if (!id) throw new Error("save failed");
      return { id };
    },
    onMutate: async ({ choreId, childId }) => {
      await queryClient.cancelQueries({ queryKey: ["chore-completions", todayDate] });
      const prev = queryClient.getQueryData<ChoreCompletionsResponse>(["chore-completions", todayDate]);
      queryClient.setQueryData<ChoreCompletionsResponse>(["chore-completions", todayDate], (old) => {
        if (!old) return old;
        return {
          children: old.children.map((c) => {
            if (c.id !== childId) return c;
            const chore = c.chores.find((ch) => ch.choreId === choreId);
            const pts = chore?.points ?? 0;
            return {
              ...c,
              todayPoints: chore?.frequency === "daily" || chore?.frequency === "weekdays" ? c.todayPoints + pts : c.todayPoints,
              weekPoints: c.weekPoints + pts,
              weekProgress: (c.weekProgress ?? []).map((day) => {
                if (day.date !== todayDate || chore?.frequency === "weekly") return day;
                const done = day.done + 1;
                return { ...day, done, status: done >= day.total && day.total > 0 ? "done" : "partial" };
              }),
              chores: c.chores.map((ch) =>
                ch.choreId === choreId
                  ? { ...ch, completionId: "optimistic", completedAt: new Date().toISOString() }
                  : ch
              ),
            };
          }),
        };
      });
      return { prev };
    },
    onSuccess: (data, vars) => {
      queryClient.setQueryData<ChoreCompletionsResponse>(["chore-completions", todayDate], (old) => {
        if (!old) return old;
        return {
          children: old.children.map((child) => {
            if (child.id !== vars.childId) return child;
            return {
              ...child,
              chores: child.chores.map((chore) =>
                chore.choreId === vars.choreId
                  ? { ...chore, completionId: data.id, completedAt: new Date().toISOString() }
                  : chore,
              ),
            };
          }),
        };
      });
      setUndo({ completionId: data.id, title: vars.title, points: vars.points });
      if (vars.celebrate) {
        setCelebration({ points: vars.points, title: vars.title, childName: vars.childName });
      }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["chore-completions", todayDate], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chore-completions", todayDate] });
      queryClient.invalidateQueries({ queryKey: ["reward-balances"] });
    },
  });

  const uncompleteMutation = useMutation({
    mutationFn: async (completionId: string) => {
      const response = await fetch("/api/chore-completions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: completionId }),
      });
      if (!response.ok) throw new Error("undo failed");
      return response.json();
    },
    onMutate: async (completionId) => {
      await queryClient.cancelQueries({ queryKey: ["chore-completions", todayDate] });
      const prev = queryClient.getQueryData<ChoreCompletionsResponse>(["chore-completions", todayDate]);
      queryClient.setQueryData<ChoreCompletionsResponse>(["chore-completions", todayDate], (old) => {
        if (!old) return old;
        return {
          children: old.children.map((c) => {
            const chore = c.chores.find((ch) => ch.completionId === completionId);
            if (!chore) return c;
            const pts = chore.points;
            return {
              ...c,
              todayPoints: chore.frequency === "daily" || chore.frequency === "weekdays" ? Math.max(0, c.todayPoints - pts) : c.todayPoints,
              weekPoints: Math.max(0, c.weekPoints - pts),
              weekProgress: (c.weekProgress ?? []).map((day) => {
                if (day.date !== todayDate || chore.frequency === "weekly") return day;
                const done = Math.max(0, day.done - 1);
                return { ...day, done, status: done === 0 ? "today" : "partial" };
              }),
              chores: c.chores.map((ch) =>
                ch.completionId === completionId
                  ? { ...ch, completionId: null, completedAt: null }
                  : ch
              ),
            };
          }),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["chore-completions", todayDate], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chore-completions", todayDate] });
      queryClient.invalidateQueries({ queryKey: ["reward-balances"] });
    },
  });

  const handleComplete = useCallback((choreId: string, childId: string, frequency: string) => {
    const child = children.find((c) => c.id === childId);
    const chore = child?.chores.find((ch) => ch.choreId === choreId);
    const hour = new Date().getHours();
    const eveningHour = getEveningHour();
    const remaining = child && chore
      ? remainingVisibleTodayChores(child.chores, choreId, hour, eveningHour)
      : 1;
    completeMutation.mutate({
      choreId,
      childId,
      frequency,
      title: chore?.title ?? "",
      points: chore?.points ?? 0,
      childName: child?.name ?? "",
      celebrate: chore ? shouldCelebrateCompletingToday(chore, remaining, hour, eveningHour) : false,
    });
  }, [completeMutation, children]);

  const handleUncomplete = useCallback((completionId: string) => {
    if (!completionId || completionId === "optimistic") return;
    setUndo((current) => (current?.completionId === completionId ? null : current));
    uncompleteMutation.mutate(completionId);
  }, [uncompleteMutation]);

  const handleUndo = useCallback(() => {
    if (!undo) return;
    const completionId = undo.completionId;
    setUndo(null);
    uncompleteMutation.mutate(completionId);
  }, [undo, uncompleteMutation]);

  useEffect(() => {
    if (!undo || celebration) return;
    const timer = window.setTimeout(() => setUndo(null), UNDO_TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [undo, celebration]);

  const [claimedRewardId, setClaimedRewardId] = useState<string | null>(null);
  const [selectedRewardChildId, setSelectedRewardChildId] = useState<string | null>(null);
  const [penaltyPoints, setPenaltyPoints] = useState(5);
  const [penaltyReason, setPenaltyReason] = useState("");
  const [penaltySuccess, setPenaltySuccess] = useState(false);

  const claimMutation = useMutation({
    mutationFn: ({ rewardId, childId }: { rewardId: string; childId: string }) =>
      fetch("/api/reward-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId, childId }),
      }).then((r) => r.json()),
    onSuccess: (_data, vars) => {
      setClaimedRewardId(vars.rewardId + ":" + vars.childId);
      setTimeout(() => setClaimedRewardId(null), 2000);
      refetchBalances();
    },
  });

  const penaltyMutation = useMutation({
    mutationFn: ({ childId, points, reason }: { childId: string; points: number; reason: string }) =>
      fetch("/api/reward-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, points, reason: reason.trim() || undefined }),
      }).then((r) => r.json()),
    onSuccess: () => {
      setPenaltySuccess(true);
      setPenaltyReason("");
      setTimeout(() => setPenaltySuccess(false), 2000);
      refetchBalances();
    },
  });

  const useTabLayout = children.length > 2;

  return (
    <AppShell activeTab="/family" contentNoScroll>
      <div className="flex h-full flex-col">
        {/* page header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("family.title")}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {view === "tasks" && children.length > 0 ? (
              <label className="flex h-11 w-56 items-center gap-2 rounded-full bg-white px-4 shadow-sm ring-1 ring-black/5 dark:bg-[#1b1a21] dark:ring-white/10">
                <Search className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden />
                <input
                  type="search"
                  value={taskQuery}
                  onChange={(e) => setTaskQuery(e.target.value)}
                  placeholder={t("family.searchPlaceholder")}
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-600 outline-none dark:text-white dark:placeholder-gray-300"
                  aria-label={t("family.searchPlaceholder")}
                />
              </label>
            ) : null}
            <div className="flex gap-0.5 rounded-full bg-gray-100 p-0.5 dark:bg-white/[0.06]" role="tablist">
              {([
                ["tasks", ListTodo, t("family.chores")],
                ["scoreboard", Trophy, t("family.scoreboard")],
                ["rewards", Gift, t("family.rewards")],
              ] as const).map(([id, Icon, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                    view === id
                      ? "bg-white text-gray-900 shadow-sm dark:bg-[#8357be] dark:text-white"
                      : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          {view === "tasks" && (
            editOpen ? (
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-white dark:text-white dark:ring-white/20 dark:hover:bg-white/5"
              >
                {t("family.done")}
              </button>
            ) : getEditModeAllowed() ? (
              <>
                <button
                  type="button"
                  onClick={openEditWithPasscode}
                  className="flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-white dark:text-white dark:ring-white/20 dark:hover:bg-white/5"
                >
                  {t("family.edit")}
                </button>
                {passcodeModalOpen && typeof document !== "undefined" && createPortal(
                  <div className="fixed inset-0 z-[300]" aria-modal="true" role="dialog">
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden onClick={() => { setPasscodeModalOpen(false); setPasscodeError(null); setPasscodeInput(""); }} />
                    <div className="fixed left-1/2 top-1/2 z-[301] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 shadow-2xl">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t("settings.dashboard.enterPasscode")}</h3>
                      <input
                        type="password"
                        value={passcodeInput}
                        onChange={(e) => { setPasscodeInput(e.target.value); setPasscodeError(null); }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (checkEditModePasscode(passcodeInput)) {
                              setEditOpen(true);
                              setPasscodeModalOpen(false);
                              setPasscodeInput("");
                              setPasscodeError(null);
                            } else setPasscodeError(t("settings.dashboard.wrongPasscode"));
                          }
                        }}
                        placeholder={t("settings.dashboard.editModePasscodePlaceholder")}
                        className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500"
                        autoFocus
                        autoComplete="off"
                      />
                      {passcodeError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{passcodeError}</p>}
                      <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => { setPasscodeModalOpen(false); setPasscodeError(null); setPasscodeInput(""); }} className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">{t("editPanel.close")}</button>
                        <button type="button" onClick={() => { if (checkEditModePasscode(passcodeInput)) { setEditOpen(true); setPasscodeModalOpen(false); setPasscodeInput(""); setPasscodeError(null); } else setPasscodeError(t("settings.dashboard.wrongPasscode")); }} className="inline-flex h-11 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white hover:opacity-90 dark:bg-[#8357be]">{t("settings.dashboard.unlock")}</button>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </>
            ) : null
          )}
          </div>
        </div>

        {/* scoreboard view */}
        {view === "scoreboard" && (
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
            <Scoreboard />
          </div>
        )}

        {/* rewards view */}
        {view === "rewards" && (() => {
          const activeChildId = selectedRewardChildId ?? children[0]?.id ?? null;
          const activeChild = children.find((c) => c.id === activeChildId) ?? null;
          const bal = activeChildId ? balanceMap.get(activeChildId) : null;
          const balance = clampPointsBalance(bal?.balance ?? 0, 0);
          return (
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 flex flex-col gap-4">
              {/* child selector with balances */}
              {children.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {children.map((child) => {
                    const childBal = balanceMap.get(child.id);
                    const childBalance = clampPointsBalance(childBal?.balance ?? 0, 0);
                    const isActive = child.id === activeChildId;
                    return (
                      <button
                        key={child.id}
                        onClick={() => setSelectedRewardChildId(child.id)}
                        className={cn(
                          "flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2 transition-all",
                          isActive
                            ? "shadow-sm"
                            : "bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10"
                        )}
                        style={isActive ? { background: child.color ?? "#6366F1" } : undefined}
                      >
                        <span className="text-base">{child.emoji ?? "👤"}</span>
                        <div className="flex flex-col items-start">
                          <span className={cn("text-sm font-semibold leading-tight", isActive ? "text-white" : "text-gray-800 dark:text-white")}>
                            {child.name}
                          </span>
                          <span className={cn("text-xs leading-tight", isActive ? "text-white/80" : "text-gray-600 dark:text-gray-300")}>
                            {childBalance} pt
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* rewards list */}
              {rewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <Gift className="h-12 w-12 text-gray-300" />
                  <p className="text-gray-600 dark:text-gray-300">{t("family.rewards.noRewards")}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t("family.rewards.addRewards")}</p>
                </div>
              ) : activeChild && (
                <div className="flex flex-col gap-2">
                  {rewards.map((reward) => {
                    const claimKey = reward.id + ":" + activeChild.id;
                    const justClaimed = claimedRewardId === claimKey;
                    const canAfford = balance >= reward.pointsCost;
                    return (
                      <div
                        key={reward.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 transition-all",
                          canAfford
                            ? "bg-white/60 dark:bg-white/5"
                            : "bg-gray-50 dark:bg-gray-900/30 opacity-50"
                        )}
                      >
                        <RewardIcon name={reward.icon} className="h-5 w-5 shrink-0 text-indigo-400" />
                        <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white truncate">{reward.title}</span>
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          {reward.pointsCost} pt
                        </span>
                        <button
                          disabled={!canAfford || claimMutation.isPending}
                          onClick={() => claimMutation.mutate({ rewardId: reward.id, childId: activeChild.id })}
                          className={cn(
                            "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-all",
                            justClaimed
                              ? "bg-green-500 text-white"
                              : canAfford
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-200 text-gray-400 dark:bg-gray-700 cursor-not-allowed"
                          )}
                        >
                          {justClaimed ? t("family.rewards.claimed") : canAfford ? t("family.rewards.claim") : t("family.rewards.notEnough")}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* manual penalty — always visible for parents in rewards view */}
              {activeChild && (
                <div className="mt-2 rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-4 flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">{t("family.givePenalty")}</p>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-sm text-gray-600 dark:text-gray-300">{t("family.reasonOptional")}</label>
                      <input
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-white"
                        placeholder={t("family.penaltyReasonPlaceholder")}
                        value={penaltyReason}
                        onChange={(e) => setPenaltyReason(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-20">
                      <label className="text-sm text-gray-600 dark:text-gray-300">{t("family.chorePoints")}</label>
                      <input
                        type="number"
                        min={1}
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm dark:text-white"
                        value={penaltyPoints}
                        onChange={(e) => setPenaltyPoints(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                  </div>
                  <button
                    disabled={penaltyMutation.isPending}
                    onClick={() => penaltyMutation.mutate({ childId: activeChild.id, points: penaltyPoints, reason: penaltyReason })}
                    className={cn(
                      "self-start rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                      penaltySuccess
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white hover:bg-red-600"
                    )}
                  >
                    {penaltySuccess ? t("family.penaltySaved") : t("family.applyPenalty").replace("{n}", String(penaltyPoints))}
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* tasks view */}
        {view === "tasks" && (
          <>
            {/* loading */}
            {isLoading && (
              <div className="flex flex-1 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            )}

            {/* empty state */}
            {!isLoading && children.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4F2FA] dark:bg-white/[0.06]">
                  <ListTodo className="h-7 w-7 text-brand dark:text-[#c4b5fd]" />
                </span>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{t("familyX.emptyTitle")}</p>
                <p className="max-w-sm text-sm text-gray-600 dark:text-gray-300">{t("familyX.emptyBody")}</p>
                {getEditModeAllowed() ? (
                  <button
                    type="button"
                    onClick={openEditWithPasscode}
                    className="mt-3 flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white hover:opacity-90 dark:bg-[#8357be]"
                  >
                    <Plus className="h-4 w-4" />
                    {t("family.addChild")}
                  </button>
                ) : null}
              </div>
            )}

            {/* tab strip for >3 children */}
            {!isLoading && useTabLayout && children.length > 0 && (
              <div className="flex gap-2 overflow-x-auto px-6 pb-2">
                {children.map((child, i) => (
                  <button
                    key={child.id}
                    onClick={() => setActiveChildIndex(i)}
                    className={cn(
                      "flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
                      activeChildIndex === i
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                        : "bg-white text-gray-600 shadow-sm ring-1 ring-black/5 hover:bg-gray-50 dark:bg-white/5 dark:text-gray-300 dark:ring-white/10"
                    )}
                  >
                    <span>{child.emoji ?? "👤"}</span>
                    {child.name}
                  </button>
                ))}
              </div>
            )}

            {/* content */}
            {!isLoading && children.length > 0 && (
              <div className={cn(
                "flex-1 min-h-0 overflow-y-auto px-6 pb-6",
                !useTabLayout && "flex gap-6"
              )}>
                {useTabLayout ? (
                  children[activeChildIndex] && (
                    <ChildTaskBoard
                      key={children[activeChildIndex].id}
                      child={children[activeChildIndex]}
                      streak={streakMap.get(children[activeChildIndex].id) ?? 0}
                      balance={clampPointsBalance(balanceMap.get(children[activeChildIndex].id)?.balance ?? children[activeChildIndex].weekPoints, 0)}
                      query={taskQuery}
                      onComplete={handleComplete}
                      onUncomplete={handleUncomplete}
                      t={t}
                    />
                  )
                ) : (
                  children.map((child) => (
                    <ChildTaskBoard
                      key={child.id}
                      child={child}
                      streak={streakMap.get(child.id) ?? 0}
                      balance={clampPointsBalance(balanceMap.get(child.id)?.balance ?? child.weekPoints, 0)}
                      query={taskQuery}
                      onComplete={handleComplete}
                      onUncomplete={handleUncomplete}
                      t={t}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* edit panel overlay */}
      {editOpen && <EditPanel onClose={() => setEditOpen(false)} />}
      <CelebrationSheet celebration={celebration} onClose={() => setCelebration(null)} t={t} />
      {undo && !celebration && typeof document !== "undefined"
        ? createPortal(
            <UndoToast
              message={t("familyX.checked").replace("{task}", undo.title).replace("{n}", String(undo.points))}
              actionLabel={t("dashboardPages.undo")}
              onAction={handleUndo}
            />,
            document.body,
          )
        : null}
    </AppShell>
  );
}
