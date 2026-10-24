"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { isChoreSlotVisible } from "@/lib/family-task-completion";
import { getEveningHour } from "@/stores/dashboard-settings-store";
import { useTranslation } from "@/hooks/use-translation";
import type { ChildWithChores, ChoreCompletionRecord, WeekDayProgress } from "@/lib/chores-types";
import { TaskArt } from "./task-art";

function isChoreVisibleByTime(choreId: string): boolean {
  return isChoreSlotVisible(choreId, new Date().getHours(), getEveningHour());
}

function matchesQuery(chore: ChoreCompletionRecord, query: string) {
  if (!query.trim()) return true;
  return chore.title.toLowerCase().includes(query.trim().toLowerCase());
}

function isTodayChore(chore: ChoreCompletionRecord): boolean {
  return chore.frequency === "daily" || chore.frequency === "weekdays";
}

const DAY_LETTERS: Record<"nl" | "en", string[]> = {
  nl: ["Z", "M", "D", "W", "D", "V", "Z"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

function WeekStrip({ days, language }: { days: WeekDayProgress[]; language: "nl" | "en" }) {
  const letters = DAY_LETTERS[language];
  return (
    <div className="flex gap-1.5">
      {days.map((day) => (
        <span
          key={day.date}
          title={`${day.date} · ${day.done}/${day.total}`}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
            day.status === "done" && "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950",
            day.status === "partial" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
            (day.status === "missed" || day.status === "empty") && "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
            day.status === "today" && "bg-white text-brand ring-2 ring-brand dark:bg-transparent dark:text-[#c4b5fd] dark:ring-[#8357be]",
            day.status === "future" && "text-gray-600 ring-1 ring-gray-200 dark:text-gray-300 dark:ring-white/15",
          )}
        >
          {day.status === "done" ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            letters[new Date(`${day.date}T12:00:00`).getDay()]
          )}
        </span>
      ))}
    </div>
  );
}

function TaskCard({
  chore,
  onToggle,
  t,
}: {
  chore: ChoreCompletionRecord;
  onToggle: () => void;
  t: (key: string) => string;
}) {
  const done = chore.completionId !== null;
  const penalty = chore.penalty && !done;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-[1.6rem] bg-white text-left shadow-sm ring-1 ring-black/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.99] dark:bg-[#1b1a21] dark:ring-white/10",
        done && "ring-2 ring-emerald-600 dark:ring-emerald-500",
        penalty && "ring-rose-300 dark:ring-rose-700/60",
      )}
    >
      <div className="relative h-36 bg-[#F7F8FC] dark:bg-white/5">
        <TaskArt icon={chore.icon} className="px-3 pt-1" />
        <span
          className={cn(
            "absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-xs font-bold",
            done
              ? "bg-emerald-500 text-white"
              : penalty
                ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300"
                : "bg-gray-900 text-white dark:bg-white dark:text-gray-900",
          )}
        >
          {done ? "✓" : penalty ? `−${chore.points}` : chore.points}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 px-4 py-3">
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold leading-snug text-gray-900 dark:text-white">{chore.title}</span>
          <span
            className={cn(
              "mt-1 block text-sm font-medium",
              done
                ? "text-emerald-700 dark:text-emerald-300"
                : penalty
                  ? "text-rose-700 dark:text-rose-300"
                  : "text-gray-600 dark:text-gray-300",
            )}
          >
            {done
              ? t("familyX.doneLabel")
              : penalty
                ? t("familyX.penaltyHint").replace("{n}", String(chore.points))
                : `+${chore.points} ${t("familyX.pts")}`}
          </span>
        </span>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2",
            done
              ? "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-emerald-950"
              : "border-gray-400 text-transparent dark:border-gray-500",
          )}
          aria-hidden
        >
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
      </div>
    </button>
  );
}

export function ChildTaskBoard({
  child,
  streak,
  balance,
  query,
  onComplete,
  onUncomplete,
  t,
}: {
  child: ChildWithChores;
  streak: number;
  balance: number;
  query: string;
  onComplete: (choreId: string, childId: string, frequency: string) => void;
  onUncomplete: (completionId: string) => void;
  t: (key: string) => string;
}) {
  const { language } = useTranslation();
  const [openDone, setOpenDone] = useState(false);
  const timeVisible = child.chores.filter((chore) => isChoreVisibleByTime(chore.choreId));
  const matched = timeVisible.filter((chore) => matchesQuery(chore, query));
  const open = matched.filter((chore) => chore.completionId === null);
  const done = matched.filter((chore) => chore.completionId !== null);
  const daily = open.filter((chore) => isTodayChore(chore));
  const weekly = open.filter((chore) => chore.frequency === "weekly");
  const todayChores = timeVisible.filter(isTodayChore);
  const todayDone = todayChores.filter((chore) => chore.completionId !== null).length;
  const grid = "mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2";

  const toggle = (chore: ChoreCompletionRecord) => () => {
    if (chore.completionId) onUncomplete(chore.completionId);
    else onComplete(chore.choreId, child.id, chore.frequency);
  };

  const emptyMessage = query.trim()
    ? t("family.noSearchResults")
    : child.chores.length === 0 || timeVisible.length === 0
      ? child.chores.length === 0
        ? "—"
        : t("family.noOpenTasks")
      : t("familyX.allDone");

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <section className="rounded-[1.8rem] bg-white px-5 py-5 shadow-sm ring-1 ring-black/5 dark:bg-[#1b1a21] dark:ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
              style={{ background: child.color ?? "#6366F1" }}
            >
              {child.emoji ?? "👤"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{child.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t("familyX.progress").replace("{d}", String(todayDone)).replace("{n}", String(todayChores.length))}
                {streak >= 2 ? ` · ${streak} ${t("family.streak")}` : ""}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">{t("family.totalBalance")}</p>
            <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{balance}</p>
          </div>
        </div>
        <div className="mt-4">
          <WeekStrip days={child.weekProgress ?? []} language={language === "nl" ? "nl" : "en"} />
        </div>
      </section>

      {open.length === 0 && (done.length === 0 || !query.trim()) ? (
        <div className="flex flex-col items-center gap-1 rounded-2xl px-4 py-6 text-center">
          {done.length > 0 ? (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
          ) : null}
          <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            {done.length > 0 ? t("familyX.allDone") : emptyMessage}
          </p>
        </div>
      ) : open.length > 0 ? (
        <>
          {daily.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("family.dailyChallenges")}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t("family.dailyChallengesHint")}</p>
              <div className={grid}>
                {daily.map((chore) => (
                  <TaskCard key={chore.choreId} chore={chore} onToggle={toggle(chore)} t={t} />
                ))}
              </div>
            </section>
          ) : null}

          {weekly.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("family.weekly")}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t("family.weeklyHint")}</p>
              <div className={grid}>
                {weekly.map((chore) => (
                  <TaskCard key={chore.choreId} chore={chore} onToggle={toggle(chore)} t={t} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {done.length > 0 ? (
        <section>
          <button
            type="button"
            onClick={() => setOpenDone((openSection) => !openSection)}
            aria-expanded={openDone}
            className="flex min-h-11 w-full items-center justify-between rounded-xl px-1 text-base font-semibold text-gray-900 dark:text-white"
          >
            <span>
              {t("familyX.done")} · {done.length}
            </span>
            <ChevronDown className={cn("h-5 w-5 transition", openDone && "rotate-180")} />
          </button>
          {openDone ? (
            <div className={grid}>
              {done.map((chore) => (
                <TaskCard key={chore.choreId} chore={chore} onToggle={toggle(chore)} t={t} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
