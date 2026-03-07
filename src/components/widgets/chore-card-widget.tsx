"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ListTodo, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChoreCompletionsResponse, ChildWithChores } from "@/lib/chores-types";

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

// ── minimal ChoreRow for widget ───────────────────────────────────────────────

function WidgetChoreRow({
  choreId,
  title,
  points,
  completionId,
  onComplete,
  onUncomplete,
}: {
  choreId: string;
  title: string;
  points: number;
  completionId: string | null;
  onComplete: (choreId: string) => void;
  onUncomplete: (completionId: string) => void;
}) {
  const done = completionId !== null;
  return (
    <button
      onClick={() => done ? onUncomplete(completionId!) : onComplete(choreId)}
      className={cn(
        "flex items-center gap-2 w-full rounded-xl px-3 py-2 text-left transition-all",
        done ? "opacity-60" : "hover:bg-black/5 dark:hover:bg-white/5"
      )}
    >
      <span className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
        done ? "border-green-500 bg-green-500 text-white" : "border-gray-300 dark:border-gray-500"
      )}>
        {done && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className={cn("flex-1 truncate text-xs font-medium", done && "line-through text-gray-400")}>
        {title}
      </span>
      <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
        {points}
      </span>
    </button>
  );
}

// ── ChildSection ──────────────────────────────────────────────────────────────

function ChildSection({
  child,
  showPoints,
  onComplete,
  onUncomplete,
}: {
  child: ChildWithChores;
  showPoints: boolean;
  onComplete: (choreId: string, childId: string, frequency: string) => void;
  onUncomplete: (completionId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 px-1 py-1">
        <span className="text-base">{child.emoji ?? "👤"}</span>
        <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-white">{child.name}</span>
        {showPoints && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            {child.todayPoints} pt
          </span>
        )}
      </div>
      {child.chores.map((chore) => (
        <WidgetChoreRow
          key={chore.choreId}
          choreId={chore.choreId}
          title={chore.title}
          points={chore.points}
          completionId={chore.completionId}
          onComplete={(id) => onComplete(id, child.id, chore.frequency)}
          onUncomplete={onUncomplete}
        />
      ))}
      {child.chores.length === 0 && (
        <p className="px-3 py-1 text-xs text-gray-400 dark:text-gray-500">—</p>
      )}
    </div>
  );
}

// ── ChoreCardWidget ───────────────────────────────────────────────────────────

export type ChoreCardWidgetProps = {
  childId?: string | null;
  showPoints?: boolean;
  title?: string;
  onMoreClick?: () => void;
};

export function ChoreCardWidget({ childId, showPoints = true, title, onMoreClick }: ChoreCardWidgetProps) {
  const queryClient = useQueryClient();
  const todayDate = getTodayDate();

  const { data, isLoading } = useQuery<ChoreCompletionsResponse>({
    queryKey: ["chore-completions", todayDate],
    queryFn: () => fetch(`/api/chore-completions?date=${todayDate}`).then((r) => r.json()),
    refetchInterval: 30_000,
  });

  const allChildren = data?.children ?? [];
  const children = childId
    ? allChildren.filter((c) => c.id === childId)
    : allChildren;

  const completeMutation = useMutation({
    mutationFn: ({ choreId, childId: cid, frequency }: { choreId: string; childId: string; frequency: string }) =>
      fetch("/api/chore-completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choreId, childId: cid, frequency }),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chore-completions", todayDate] }),
  });

  const uncompleteMutation = useMutation({
    mutationFn: (completionId: string) =>
      fetch("/api/chore-completions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: completionId }),
      }).then((r) => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chore-completions", todayDate] }),
  });

  return (
    <div className="flex flex-col rounded-2xl bg-white/60 shadow-md dark:bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 dark:border-white/10">
        <ListTodo className="h-4 w-4 text-indigo-500" />
        <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-white">{title || "Taken"}</span>
        {onMoreClick && (
          <button onClick={onMoreClick} className="rounded-lg p-1 text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* content */}
      <div className="flex flex-col gap-3 p-3">
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}
        {!isLoading && children.length === 0 && (
          <p className="py-3 text-center text-xs text-gray-400 dark:text-gray-500">Geen kinderen gevonden.</p>
        )}
        {children.map((child) => (
          <ChildSection
            key={child.id}
            child={child}
            showPoints={showPoints}
            onComplete={(choreId, cid, freq) => completeMutation.mutate({ choreId, childId: cid, frequency: freq })}
            onUncomplete={(completionId) => uncompleteMutation.mutate(completionId)}
          />
        ))}
      </div>
    </div>
  );
}
