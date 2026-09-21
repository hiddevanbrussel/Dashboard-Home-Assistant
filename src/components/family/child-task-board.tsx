"use client";

import { cn } from "@/lib/utils";
import { getEveningHour } from "@/stores/dashboard-settings-store";
import type { ChildWithChores, ChoreCompletionRecord, WeekDayProgress } from "@/lib/chores-types";
import { TaskArt } from "./task-art";

function isChoreVisibleByTime(choreId: string): boolean {
  const m = choreId.match(/:(\d+)$/);
  if (!m) return true;
  const slot = parseInt(m[1]);
  if (slot === 0) return true;
  return new Date().getHours() >= getEveningHour();
}

function matchesQuery(chore: ChoreCompletionRecord, query: string) {
  if (!query.trim()) return true;
  return chore.title.toLowerCase().includes(query.trim().toLowerCase());
}

function WeekDots({ days }: { days: WeekDayProgress[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => (
        <span
          key={day.date}
          title={`${day.date} · ${day.done}/${day.total}`}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
            day.status === "done" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
            day.status === "partial" && "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
            day.status === "missed" && "bg-rose-100 text-rose-400 dark:bg-rose-900/30 dark:text-rose-300",
            day.status === "today" && "bg-white text-gray-400 ring-2 ring-gray-200 dark:bg-white/10 dark:ring-white/20",
            day.status === "empty" && "bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500",
            day.status === "future" && "bg-gray-50 text-gray-300 dark:bg-white/5 dark:text-gray-600"
          )}
        >
          {day.status === "done" ? "✓" : day.status === "missed" ? "×" : day.status === "partial" ? "·" : ""}
        </span>
      ))}
    </div>
  );
}

function TaskCard({
  chore,
  onComplete,
  onUncomplete,
}: {
  chore: ChoreCompletionRecord;
  onComplete: (choreId: string) => void;
  onUncomplete: (completionId: string) => void;
}) {
  const done = chore.completionId !== null;
  const penalty = chore.penalty && !done;

  return (
    <button
      type="button"
      onClick={() => (done ? onUncomplete(chore.completionId!) : onComplete(chore.choreId))}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-[1.6rem] bg-white text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5 dark:ring-white/10",
        done && "opacity-70",
        penalty && "ring-rose-200 dark:ring-rose-800/50"
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
                : "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
          )}
        >
          {done ? "✓" : penalty ? `−${chore.points}` : chore.points}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <p className={cn("truncate text-sm font-semibold text-gray-900 dark:text-white", done && "line-through text-gray-400")}>
          {chore.title}
        </p>
        <span className="text-lg text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-500 dark:text-gray-600">→</span>
      </div>
    </button>
  );
}

export function ChildTaskBoard({
  child,
  streak,
  balance,
  showCompleted,
  query,
  onComplete,
  onUncomplete,
  t,
}: {
  child: ChildWithChores;
  streak: number;
  balance: number;
  showCompleted: boolean;
  query: string;
  onComplete: (choreId: string, childId: string, frequency: string) => void;
  onUncomplete: (completionId: string) => void;
  t: (key: string) => string;
}) {
  const visibleChores = child.chores
    .filter((c) => isChoreVisibleByTime(c.choreId))
    .filter((c) => showCompleted || c.completionId === null)
    .filter((c) => matchesQuery(c, query));
  const dailyChores = visibleChores.filter((c) => c.frequency === "daily" || c.frequency === "weekdays");
  const weeklyChores = visibleChores.filter((c) => c.frequency === "weekly");
  const empty = dailyChores.length === 0 && weeklyChores.length === 0;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <section className="rounded-[1.8rem] bg-white px-5 py-5 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
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
              <p className="text-xs text-gray-400">
                {t("family.todayPoints").replace("{n}", String(child.todayPoints))}
                {streak >= 2 ? ` · ${streak} ${t("family.streak")}` : ""}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{t("family.totalBalance")}</p>
            <p className="text-2xl font-black tabular-nums text-gray-900 dark:text-white">{balance}</p>
          </div>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">{t("family.weekProgress")}</p>
          <WeekDots days={child.weekProgress ?? []} />
        </div>
      </section>

      {empty ? (
        <p className="py-8 text-center text-sm text-gray-400">
          {query.trim() ? t("family.noSearchResults") : child.chores.length === 0 ? "—" : t("family.noOpenTasks")}
        </p>
      ) : (
        <>
          {dailyChores.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("family.dailyChallenges")}</h2>
              <p className="mt-1 text-sm text-gray-400">{t("family.dailyChallengesHint")}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dailyChores.map((chore) => (
                  <TaskCard
                    key={chore.choreId}
                    chore={chore}
                    onComplete={(id) => onComplete(id, child.id, chore.frequency)}
                    onUncomplete={onUncomplete}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {weeklyChores.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t("family.weekly")}</h2>
              <p className="mt-1 text-sm text-gray-400">{t("family.weeklyHint")}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {weeklyChores.map((chore) => (
                  <TaskCard
                    key={chore.choreId}
                    chore={chore}
                    onComplete={(id) => onComplete(id, child.id, chore.frequency)}
                    onUncomplete={onUncomplete}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
