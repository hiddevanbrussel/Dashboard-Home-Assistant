"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ink = "text-[#111827] dark:text-[#f3f4f6]";
const muted = "text-[#4b5563] dark:text-[#c4c4cc]";
const faint = "text-[#4b5563] dark:text-[#a1a1aa]";
const line = "border-[rgba(17,24,39,0.08)] dark:border-white/10";
const surface = "bg-white dark:bg-[#1b1a21]";

export function SettingsScreenTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className={cn("mb-3.5 ml-1 text-[28px] font-bold leading-tight tracking-[-0.02em]", ink)}>
      {children}
    </h1>
  );
}

export function SettingsGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className={cn("mb-1.5 ml-4 text-sm font-semibold", faint)}>{children}</p>
  );
}

export type SettingsNavItem = {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  active?: boolean;
  connected?: boolean;
};

export function SettingsNavList({
  label,
  items,
  portrait,
  onSelect,
}: {
  label: string;
  items: SettingsNavItem[];
  portrait?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      aria-label={label}
      className={cn("flex flex-col gap-0.5 rounded-[18px] border p-1", line, surface)}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "relative flex w-full items-center gap-3.5 rounded-[14px] px-3.5 py-2 text-left",
              portrait ? "min-h-16" : "min-h-12",
              item.active && "bg-[rgba(17,24,39,0.05)] dark:bg-white/[0.07]"
            )}
          >
            {item.active ? (
              <span
                className="settings-nav-bar absolute bottom-3 left-[3px] top-3 w-[3px] rounded-sm bg-brand"
                aria-hidden
              />
            ) : null}
            <Icon className={cn("h-5 w-5 shrink-0", muted)} aria-hidden />
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block break-words text-base leading-snug",
                  ink,
                  item.active ? "font-[650]" : "font-medium"
                )}
              >
                {item.label}
              </span>
              {portrait && item.hint ? (
                <span className={cn("mt-0.5 flex items-start gap-1.5 break-words text-sm leading-snug", faint)}>
                  {item.connected ? (
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-[#16a34a]" aria-hidden />
                  ) : null}
                  <span className="min-w-0 break-words">{item.hint}</span>
                </span>
              ) : null}
            </span>
            {portrait ? <ChevronRight className={cn("h-5 w-5 shrink-0", faint)} aria-hidden /> : null}
          </button>
        );
      })}
    </nav>
  );
}

export function SettingsDetailHeader({
  title,
  description,
  portrait,
  onBack,
  backLabel,
}: {
  title: string;
  description?: string;
  portrait: boolean;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <header className="mb-[18px] ml-1">
      {portrait && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "mb-2.5 -ml-1.5 inline-flex h-11 items-center gap-1.5 rounded-xl pl-0 pr-3.5 text-base font-medium",
            ink
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </span>
          {backLabel}
        </button>
      ) : null}
      {!portrait && onBack && backLabel ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "mb-2 inline-flex h-11 items-center gap-1.5 rounded-xl px-2 text-base font-medium",
            ink
          )}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
          {backLabel}
        </button>
      ) : null}
      <h2
        className={cn(
          "break-words font-[650] leading-tight tracking-[-0.015em]",
          ink,
          portrait ? "text-[26px]" : "text-2xl"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-1 break-words text-[15px] leading-snug", muted)}>{description}</p>
      ) : null}
    </header>
  );
}

export function SettingsBlockLabel({ children }: { children: ReactNode }) {
  return <p className={cn("mb-2 ml-4 mt-[18px] text-sm font-semibold first:mt-0", faint)}>{children}</p>;
}

export function SettingsGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("settings-group overflow-hidden rounded-[18px] border", line, surface, className)}>
      {children}
    </div>
  );
}

export function SettingsRow({
  title,
  hint,
  children,
  tall,
}: {
  title: string;
  hint?: string;
  children?: ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 border-t px-5 py-3 first:border-t-0",
        line,
        tall ? "min-h-20" : "min-h-[68px]"
      )}
    >
      <div className="min-w-0 flex-1 basis-48">
        <p className={cn("break-words text-base font-medium leading-snug", ink)}>{title}</p>
        {hint ? <p className={cn("mt-0.5 break-words text-sm leading-snug", muted)}>{hint}</p> : null}
      </div>
      {children ? (
        <div className="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2">{children}</div>
      ) : null}
    </div>
  );
}

export function SettingsSegment<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (id: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full flex-nowrap rounded-[14px] bg-[rgba(17,24,39,0.05)] p-0.5 dark:bg-white/[0.07]"
    >
      {options.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex h-11 min-w-[4.5rem] items-center justify-center whitespace-nowrap rounded-xl px-3.5 text-[15px]",
              on
                ? "bg-white font-semibold text-[#111827] shadow-[0_1px_3px_rgba(15,23,42,0.14)] dark:bg-[#3a3843] dark:text-[#f3f4f6] dark:shadow-none"
                : "font-medium text-[#4b5563] dark:text-[#c4c4cc]"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsDisclosure({
  title,
  hideTitle,
  hint,
  open,
  onToggle,
  children,
}: {
  title: string;
  hideTitle: string;
  hint?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const panelId = useId();
  return (
    <SettingsGroup>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex min-h-[68px] w-full items-center gap-4 px-5 py-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className={cn("block break-words text-base font-medium leading-snug", ink)}>
            {open ? hideTitle : title}
          </span>
          {!open && hint ? (
            <span className={cn("mt-0.5 block break-words text-sm leading-snug", muted)}>{hint}</span>
          ) : null}
        </span>
        {open ? (
          <ChevronUp className={cn("h-5 w-5 shrink-0", faint)} aria-hidden />
        ) : (
          <ChevronDown className={cn("h-5 w-5 shrink-0", faint)} aria-hidden />
        )}
      </button>
      <div id={panelId} hidden={!open}>
        {open ? children : null}
      </div>
    </SettingsGroup>
  );
}

export function SettingsSwatch({
  color,
  label,
  selected,
  onSelect,
}: {
  color: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className="flex h-11 w-11 items-center justify-center"
    >
      <span
        className={cn(
          "flex h-[30px] w-[30px] items-center justify-center rounded-full text-white",
          selected &&
            "shadow-[0_0_0_2px_#fff,0_0_0_4px_#111827] dark:shadow-[0_0_0_2px_#1b1a21,0_0_0_4px_#f3f4f6]"
        )}
        style={{ background: color }}
      >
        {selected ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : null}
      </span>
    </button>
  );
}
