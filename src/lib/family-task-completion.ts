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
      (chore.frequency === "daily" || chore.frequency === "weekdays") &&
      isChoreSlotVisible(chore.choreId, hour, eveningHour),
  ).length;
}

/** Celebration only when this completion finishes every visible task for today, and it is not a penalty. */
export function shouldCelebrateCompletingToday(remainingAfter: number, completingIsPenalty: boolean): boolean {
  return remainingAfter === 0 && !completingIsPenalty;
}

/** Undo is offered only after the completion row exists. Optimistic ids are not saved yet. */
export function savedCompletionId(responseOk: boolean, id: string | null | undefined): string | null {
  if (!responseOk || typeof id !== "string" || id.length === 0 || id === "optimistic") return null;
  return id;
}
