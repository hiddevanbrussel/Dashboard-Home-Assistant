"use client";

import { useEffect, useRef } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTICE_MS = 4000;

/** Error text in the undo-toast shell. No action. One notice at a time, for 4 seconds. */
export function HouseLightNotice({
  message,
  placement,
  onDone,
}: {
  message: string;
  placement: "viewport" | "sheet";
  onDone: () => void;
}) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const id = window.setTimeout(() => onDoneRef.current(), NOTICE_MS);
    return () => window.clearTimeout(id);
  }, [message]);

  return (
    <div
      role="status"
      data-house-light-notice=""
      className={cn(
        "pointer-events-none flex h-11 w-max max-w-[calc(100vw-2rem)] items-center gap-2 rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white px-4 text-[#111827] shadow-[0_12px_32px_rgba(15,10,40,0.18)] dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)]",
        placement === "viewport"
          ? "fixed bottom-[38px] left-1/2 z-[320] -translate-x-1/2"
          : "relative z-[2] mb-3"
      )}
    >
      <CircleAlert className="h-5 w-5 shrink-0 text-[#B91C1C] dark:text-[#F87171]" aria-hidden />
      <span className="truncate text-[15px] font-semibold">{message}</span>
    </div>
  );
}
