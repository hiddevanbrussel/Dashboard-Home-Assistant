"use client";

import { cssUrl } from "@/lib/base-path";
import type { ButtonHTMLAttributes, ChangeEvent, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const settingsInputClass =
  "h-12 w-full rounded-xl border border-[rgba(17,24,39,0.16)] bg-white px-3.5 text-base text-[#111827] placeholder:text-[#6b7280] focus:outline-none dark:border-white/20 dark:bg-black/20 dark:text-[#f3f4f6] dark:placeholder:text-[#a1a1aa]";

export const settingsSelectClass =
  "settings-select h-12 w-full rounded-xl border border-[rgba(17,24,39,0.16)] bg-white px-3.5 text-base text-[#111827] focus:outline-none dark:border-white/20 dark:bg-black/20 dark:text-[#f3f4f6]";

export function SettingsToggle({
  checked,
  onChange,
  label,
  description,
  compact = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  /** Icon-only switch control (label stays as aria-label). */
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "text-left",
        compact
          ? "inline-flex h-11 w-16 shrink-0 items-center justify-end"
          : "flex min-h-11 w-full items-center justify-between gap-4"
      )}
    >
      {!compact ? (
        <span className="min-w-0">
          <span className="block text-base font-medium leading-snug text-[#111827] dark:text-[#f3f4f6]">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">{description}</span>
          ) : null}
        </span>
      ) : null}
      <span
        className={cn(
          "relative h-8 w-[52px] shrink-0 rounded-full",
          checked ? "bg-[#111827] dark:bg-[#f3f4f6]" : "bg-[rgba(17,24,39,0.18)] dark:bg-white/20"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-[3px] h-[26px] w-[26px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
            checked ? "left-[23px] dark:bg-[#1b1a21]" : "left-[3px]"
          )}
        />
      </span>
    </button>
  );
}

export function SettingsCheckRow({
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
      onClick={() => onChange(!checked)}
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left",
        checked
          ? "bg-[rgba(17,24,39,0.05)] dark:bg-white/[0.07]"
          : "bg-transparent hover:bg-[rgba(17,24,39,0.04)] dark:hover:bg-white/5"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked
            ? "border-[#111827] bg-[#111827] text-white dark:border-[#f3f4f6] dark:bg-[#f3f4f6] dark:text-[#111827]"
            : "border-gray-300 bg-white/60 dark:border-white/20 dark:bg-white/5"
        )}
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : null}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-100" title={label}>{label}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-[11px] text-gray-400 dark:text-gray-500" title={description}>{description}</span>
        ) : null}
      </span>
    </button>
  );
}

export function SettingsField({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-[15px] font-medium text-[#111827] dark:text-[#f3f4f6]">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm leading-snug text-[#4b5563] dark:text-[#c4c4cc]">{hint}</p> : null}
    </div>
  );
}

export function SettingsInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(settingsInputClass, props.className)} />;
}

export function SettingsSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(settingsSelectClass, props.className)} />;
}

export function SettingsGroup({
  title,
  description,
  children,
}: {
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-[18px] border border-[rgba(17,24,39,0.08)] bg-white p-5 dark:border-white/10 dark:bg-[#1b1a21]">
      {title ? <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</p> : null}
      {description ? <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p> : null}
      {children}
    </div>
  );
}

export function SettingsPrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "settings-primary inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-[15px] font-semibold text-white hover:opacity-90 disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SettingsSecondaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[rgba(17,24,39,0.08)] bg-white px-[18px] text-[15px] font-semibold text-[#111827] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.08)] disabled:opacity-40 dark:border-white/10 dark:bg-[#1b1a21] dark:text-[#f3f4f6] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SettingsUploadButton({
  children,
  disabled,
  accept,
  onChange,
}: {
  children: ReactNode;
  disabled?: boolean;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full bg-accent-yellow px-4 py-2 text-sm font-medium text-gray-900 transition-opacity hover:opacity-90 dark:bg-accent-green",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
      <input type="file" accept={accept} className="sr-only" onChange={onChange} disabled={disabled} />
    </label>
  );
}

export function SettingsPillTabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-0.5 rounded-full bg-black/5 p-0.5 dark:bg-white/5" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            value === item.id
              ? "bg-white text-gray-900 shadow-sm dark:bg-white/15 dark:text-white"
              : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPreview({ url }: { url: string }) {
  return (
    <div
      className="h-32 rounded-2xl bg-cover bg-center ring-1 ring-white/60 dark:ring-white/10"
      style={{ backgroundImage: cssUrl(url) }}
    />
  );
}

export function SettingsAlert({ tone, children }: { tone: "ok" | "error"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl px-3 py-2.5 text-sm",
        tone === "ok"
          ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
          : "bg-red-500/10 text-red-800 dark:text-red-200"
      )}
    >
      {children}
    </div>
  );
}

export function SettingsPanel({
  icon: Icon,
  title,
  description,
  badge,
  onBack,
  backLabel,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="settings-panel-enter flex min-h-0 flex-1 flex-col overflow-hidden p-0">
      <div className="flex items-start justify-between gap-3 border-b border-white/50 px-5 py-5 dark:border-white/10">
        <div className="flex min-w-0 items-start gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/[0.04] text-gray-700 transition-colors hover:bg-black/[0.08] dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              aria-label={backLabel}
              title={backLabel}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-brand/30 dark:text-white">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h2>
            {description ? (
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
            ) : null}
          </div>
        </div>
        {badge}
      </div>
      <div className="min-h-0 flex-1 space-y-5 overflow-auto px-5 py-5">{children}</div>
    </div>
  );
}
