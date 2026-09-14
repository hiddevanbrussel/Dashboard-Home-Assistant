"use client";

import { useEffect, useState } from "react";
import { timerRemainingMs } from "@/lib/timer";
import { useTimerStore } from "@/stores/timer-store";

/** Ticks while a kitchen timer is running so remaining time stays live. */
export function useLiveTimerRemaining() {
  const status = useTimerStore((s) => s.status);
  const endsAt = useTimerStore((s) => s.endsAt);
  const remainingMs = useTimerStore((s) => s.remainingMs);
  const finish = useTimerStore((s) => s.finish);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setTick((n) => n + 1);
      if (endsAt != null && Date.now() >= endsAt) finish();
    }, 200);
    return () => clearInterval(id);
  }, [status, endsAt, finish]);

  return {
    status,
    remaining: timerRemainingMs(status, endsAt, remainingMs),
  };
}
