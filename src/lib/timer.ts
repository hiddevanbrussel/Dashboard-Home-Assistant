export const TIMER_PRESETS = [
  { id: "1m", seconds: 60 },
  { id: "3m", seconds: 180 },
  { id: "5m", seconds: 300 },
  { id: "10m", seconds: 600 },
  { id: "15m", seconds: 900 },
  { id: "30m", seconds: 1800 },
] as const;

export type TimerStatus = "idle" | "running" | "paused" | "ringing";

export function formatTimerMs(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function timerRemainingMs(
  status: TimerStatus,
  endsAt: number | null,
  pausedRemainingMs: number,
  now = Date.now()
): number {
  if (status === "running" && endsAt != null) return Math.max(0, endsAt - now);
  if (status === "paused") return Math.max(0, pausedRemainingMs);
  if (status === "ringing") return 0;
  return 0;
}

export function timerShouldRing(
  status: TimerStatus,
  endsAt: number | null,
  now = Date.now()
): boolean {
  return status === "running" && endsAt != null && now >= endsAt;
}
