"use client";

import type { ButtonHTMLAttributes, ChangeEvent, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const settingsInputClass =
  "w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:bg-white/5 dark:text-white";

export const settingsSelectClass =
  "settings-select w-full rounded-2xl bg-black/[0.04] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 dark:bg-white/5 dark:text-white";

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
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-black/[0.04] px-4 py-3 text-left transition-colors hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
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
          checked ? "bg-accent-purple" : "bg-gray-300 dark:bg-white/20"
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
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
        checked
          ? "bg-accent-purple/15 dark:bg-accent-purple/20"
          : "bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10"
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          checked
            ? "border-accent-purple bg-accent-purple text-gray-900"
            : "border-gray-300 bg-white/60 dark:border-white/20 dark:bg-white/5"
        )}
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : null}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-100">{label}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-[11px] text-gray-400 dark:text-gray-500">{description}</span>
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
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-800 dark:text-gray-200">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p> : null}
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
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-2xl bg-black/[0.03] p-4 dark:bg-white/5">
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
        "inline-flex items-center justify-center gap-2 rounded-full bg-accent-purple px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-opacity hover:opacity-90 disabled:opacity-40",
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
        "inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white/70 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10",
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
      style={{ backgroundImage: `url(${url})` }}
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
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="settings-panel-enter glass-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-white/70 p-0 dark:border-white/10">
      <div className="flex items-start justify-between gap-3 border-b border-white/50 px-5 py-5 dark:border-white/10">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-purple/25 text-gray-900 dark:bg-accent-purple/30 dark:text-white">
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
      <div className="min-h-0 flex-1 space-y-5 overflow-auto px-5 py-5">{children}</div>
    </div>
  );
}
