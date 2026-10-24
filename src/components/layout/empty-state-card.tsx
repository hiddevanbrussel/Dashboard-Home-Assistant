"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";

type EmptyStateAction =
  | { label: string; onClick: () => void; href?: never }
  | { label: string; href: string; onClick?: never };

const actionClass =
  "mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-muted " +
  "outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-brand-muted dark:focus-visible:ring-offset-[#1b1a21]";

/** Centered empty state: icon, title, one line of body text, one action and an optional tip. */
export function EmptyStateCard({
  icon: Icon,
  title,
  body,
  action,
  tip,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action: EmptyStateAction;
  tip?: string;
  className?: string;
}) {
  return (
    <GlassCard className={cn("w-full max-w-md p-6 text-center sm:p-8", className)}>
      <div className="flex flex-col items-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-brand-muted/20 dark:text-[#c9b3ec]">
          <Icon className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="mt-4 text-[22px] font-semibold leading-tight text-gray-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">{body}</p>
        {action.href != null ? (
          <Link href={action.href} className={actionClass}>
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={actionClass}>
            {action.label}
          </button>
        )}
        {tip ? <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">{tip}</p> : null}
      </div>
    </GlassCard>
  );
}
