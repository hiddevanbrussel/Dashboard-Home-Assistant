/**
 * Points balance shown as saldo. Undo and putting a task back both
 * subtract earned points; the result never goes below zero.
 */
export function clampPointsBalance(earned: number, spent: number): number {
  const value = earned - spent;
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}
