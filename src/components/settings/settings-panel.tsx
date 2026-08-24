"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/40 px-4 py-3 text-left dark:border-white/10 dark:bg-white/5"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{description}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[#4D2FB2]" : "bg-gray-300 dark:bg-white/20"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

export function SettingsPanel({
  icon: Icon,
  title,
  description,
  badge,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4D2FB2]/10 text-[#4D2FB2] dark:bg-[#4D2FB2]/25 dark:text-[#C4B5FD]">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h2>
            {description ? (
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
            ) : null}
          </div>
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}
