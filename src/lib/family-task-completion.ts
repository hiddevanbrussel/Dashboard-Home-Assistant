export type TodayChoreRef = {
  choreId: string;
  frequency: string;
  completionId: string | null;
  penalty: boolean;
};

/**
 * Evening slots (`choreId` ending in `:1`, `:2`, …) stay hidden until `eveningHour`.
 * Slot `:0` (morning) is always visible. This is the existing slot rule, not a date rule.
 */
export function isChoreSlotVisible(choreId: string, hour: number, eveningHour: number): boolean {
  const match = choreId.match(/:(\d+)$/);
  if (!match) return true;
  const slot = parseInt(match[1], 10);
  if (slot === 0) return true;
  return hour >= eveningHour;
}

/** A task that counts for "alles van vandaag": daily or school-day, and its slot is on screen. */
export function countsForToday(
  chore: Pick<TodayChoreRef, "choreId" | "frequency">,
  hour: number,
  eveningHour: number,
): boolean {
  return (
    (chore.frequency === "daily" || chore.frequency === "weekdays") &&
    isChoreSlotVisible(chore.choreId, hour, eveningHour)
  );
}

/** Open tasks that count for "alles van vandaag": daily and school-day, and only the slots on screen. */
export function remainingVisibleTodayChores(
  chores: TodayChoreRef[],
  completingChoreId: string,
  hour: number,
  eveningHour: number,
): number {
  return chores.filter(
    (chore) =>
      chore.choreId !== completingChoreId &&
      chore.completionId === null &&
      countsForToday(chore, hour, eveningHour),
  ).length;
}

/**
 * Celebration only when this completion finishes every visible task for today: the task itself
 * counts for today (not weekly, not a hidden evening slot), it is not a penalty, and none remain.
 */
export function shouldCelebrateCompletingToday(
  completing: Pick<TodayChoreRef, "choreId" | "frequency" | "penalty">,
  remainingAfter: number,
  hour: number,
  eveningHour: number,
): boolean {
  return remainingAfter === 0 && !completing.penalty && countsForToday(completing, hour, eveningHour);
}

/** Undo is offered only after the completion row exists. Optimistic ids are not saved yet. */
export function savedCompletionId(responseOk: boolean, id: string | null | undefined): string | null {
  if (!responseOk || typeof id !== "string" || id.length === 0 || id === "optimistic") return null;
  return id;
}
