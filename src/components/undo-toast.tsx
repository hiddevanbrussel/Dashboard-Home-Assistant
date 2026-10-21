"use client";

type UndoToastProps = {
  message: string;
  actionLabel: string;
  onAction: () => void;
};

/**
 * Compact undo toast. The action is a 44px target so a later page-delete
 * undo can reuse the same control without a second pattern.
 */
export function UndoToast({ message, actionLabel, onAction }: UndoToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-auto fixed bottom-[38px] left-1/2 z-[320] flex h-11 max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white pl-4 pr-1 text-[#111827] shadow-[0_12px_32px_rgba(15,10,40,0.18)] dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6] dark:shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
    >
      <span className="truncate text-[15px] font-semibold">{message}</span>
      <span className="text-[#6b7280] dark:text-[#a1a1aa]" aria-hidden>
        ·
      </span>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex h-11 shrink-0 items-center rounded-xl px-3 text-[15px] font-semibold text-[#4700B5] hover:bg-[rgba(17,24,39,0.05)] dark:text-[#c4b5fd] dark:hover:bg-white/10"
      >
        {actionLabel}
      </button>
    </div>
  );
}
