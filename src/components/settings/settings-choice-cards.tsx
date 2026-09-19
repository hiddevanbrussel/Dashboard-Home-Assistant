"use client";

import type { ChangeEvent, ReactNode } from "react";
import { Check, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SCREENSAVER_CLOCK_POSITIONS,
  type ScreensaverClockPosition,
} from "@/lib/screensaver-clock-position";
import {
  THEME_ACCENTS,
  accentRgbCss,
  type ThemeAccentId,
} from "@/lib/theme-accents";
import {
  clockSizePreviewDigitClass,
  type ScreensaverClockSize,
} from "@/lib/screensaver-clock-size";

export function SettingsChoiceCards<T extends string>({
  label,
  hint,
  value,
  onChange,
  options,
  columns = 3,
}: {
  label: string;
  hint?: string;
  value: T;
  onChange: (id: T) => void;
  options: {
    id: T;
    label: string;
    description?: string;
    preview?: ReactNode;
  }[];
  columns?: 2 | 3;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "grid gap-3",
          columns === 2 ? "max-w-lg grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
        )}
      >
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex flex-col rounded-2xl p-2.5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                selected
                  ? "bg-brand/10 ring-2 ring-brand dark:bg-brand/25"
                  : "bg-black/[0.04] ring-1 ring-black/[0.06] hover:bg-black/[0.07] dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10"
              )}
            >
              {option.preview ? (
                <div className="overflow-hidden rounded-xl">{option.preview}</div>
              ) : null}
              <span className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
                <span className="min-h-[2.5rem] min-w-0">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    selected
                      ? "border-brand bg-brand text-white"
                      : "border-gray-300 bg-white/70 dark:border-white/25 dark:bg-white/5"
                  )}
                  aria-hidden
                >
                  {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

export function SettingsChipSelect<T extends string>({
  label,
  hint,
  items,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {items.map((item) => {
          const selected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                selected
                  ? "bg-brand text-white shadow-sm"
                  : "bg-black/[0.04] text-gray-600 hover:bg-black/[0.07] dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

export function SettingsClockPositionPicker({
  label,
  hint,
  value,
  onChange,
  names,
}: {
  label: string;
  hint?: string;
  value: ScreensaverClockPosition;
  onChange: (position: ScreensaverClockPosition) => void;
  names: Record<ScreensaverClockPosition, string>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid aspect-video max-w-sm grid-cols-3 grid-rows-3 gap-1.5 rounded-2xl bg-[#0A0014] p-3"
      >
        {SCREENSAVER_CLOCK_POSITIONS.map((position) => {
          const selected = value === position;
          return (
            <button
              key={position}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={names[position]}
              title={names[position]}
              onClick={() => onChange(position)}
              className={cn(
                "flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                selected
                  ? "bg-brand text-white shadow-sm"
                  : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80"
              )}
            >
              <span
                className={cn("h-1.5 rounded-full", selected ? "w-5 bg-white" : "w-3 bg-white/40")}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {names[value]}
        {hint ? ` — ${hint}` : null}
      </p>
    </div>
  );
}

function ThemeMiniWindow({ scheme }: { scheme: "light" | "dark" }) {
  const isLight = scheme === "light";
  return (
    <div className={cn("h-[4.75rem]", isLight ? "bg-[#F2F0FE]" : "bg-[#0A0014]")}>
      <div className="flex h-full">
        <div
          className={cn(
            "flex w-[1.15rem] flex-col items-center gap-1 py-2",
            isLight ? "bg-white" : "bg-[#1C0A3A]"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isLight ? "bg-brand" : "bg-white")} />
          <span className={cn("h-1.5 w-1.5 rounded-full", isLight ? "bg-black/15" : "bg-white/25")} />
          <span className={cn("h-1.5 w-1.5 rounded-full", isLight ? "bg-black/15" : "bg-white/25")} />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-1.5">
          <div className={cn("h-2.5 rounded-md", isLight ? "bg-white" : "bg-white/10")} />
          <div className="grid flex-1 grid-cols-2 gap-1">
            <div className={cn("rounded-md", isLight ? "bg-white" : "bg-white/10")} />
            <div className={cn("rounded-md", isLight ? "bg-brand/25" : "bg-brand/55")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThemePreview({ variant }: { variant: "light" | "dark" | "auto" }) {
  if (variant === "auto") {
    return (
      <div className="relative overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
        <ThemeMiniWindow scheme="light" />
        <div className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
          <ThemeMiniWindow scheme="dark" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
      <ThemeMiniWindow scheme={variant} />
    </div>
  );
}

export function LanguagePreview({ code }: { code: string }) {
  return (
    <div className="flex h-[4.75rem] items-center justify-center bg-gradient-to-br from-white to-[#F2F0FE] dark:from-[#1C0A3A] dark:to-[#0A0014]">
      <span className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white">{code}</span>
    </div>
  );
}

export function ClockFormatPreview({ variant }: { variant: "24" | "12" }) {
  return (
    <div className="flex h-[4.75rem] flex-col items-center justify-center gap-0.5 bg-[#0A0014] text-white">
      <span className="text-2xl font-light tabular-nums">{variant === "24" ? "14:32" : "2:32"}</span>
      <span className="text-[11px] text-white/55">{variant === "24" ? "24:00" : "pm"}</span>
    </div>
  );
}

export function ClockSizePreview({ size }: { size: ScreensaverClockSize }) {
  const digitClass = cn(
    "font-montserrat font-medium leading-none tabular-nums",
    clockSizePreviewDigitClass(size)
  );
  return (
    <div className="flex h-24 items-center justify-center overflow-hidden bg-[#0A0014]">
      <span className="grid grid-cols-[auto_auto] items-end gap-x-0.5">
        <span className={cn(digitClass, "text-[#EBC895]")}>08</span>
        <span className={cn(digitClass, "text-[#E3AE62]")}>42</span>
      </span>
    </div>
  );
}

export function SettingsAccentDots({
  label,
  hint,
  value,
  onChange,
  names,
}: {
  label: string;
  hint?: string;
  value: ThemeAccentId;
  onChange: (id: ThemeAccentId) => void;
  names: Record<ThemeAccentId, string>;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-3">
        {THEME_ACCENTS.map((accent) => {
          const selected = value === accent.id;
          return (
            <button
              key={accent.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={names[accent.id]}
              title={names[accent.id]}
              onClick={() => onChange(accent.id)}
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white",
                selected
                  ? "scale-110 ring-2 ring-gray-900 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-[#1C0A3A]"
                  : "hover:scale-105"
              )}
              style={{ backgroundColor: accentRgbCss(accent.rgb) }}
            >
              {selected ? <Check className="h-4 w-4 text-white" strokeWidth={3} aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

export function SettingsImagePick({
  label,
  description,
  url,
  uploading,
  onUpload,
  onRemove,
  addLabel,
  uploadingLabel,
  removeLabel,
}: {
  label: string;
  description?: string;
  url: string | null;
  uploading?: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  addLabel: string;
  uploadingLabel: string;
  removeLabel: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl p-2.5 text-left transition-all",
        url
          ? "bg-brand/10 ring-2 ring-brand dark:bg-brand/25"
          : "bg-black/[0.04] ring-1 ring-black/[0.06] dark:bg-white/5 dark:ring-white/10"
      )}
    >
      <label
        className={cn(
          "relative block cursor-pointer overflow-hidden rounded-xl focus-within:ring-2 focus-within:ring-brand/40",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {url ? (
          <span
            className="block h-[4.75rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        ) : (
          <span className="flex h-[4.75rem] flex-col items-center justify-center gap-1.5 bg-white/70 dark:bg-white/5">
            <ImagePlus className="h-5 w-5 text-brand" aria-hidden />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {uploading ? uploadingLabel : addLabel}
            </span>
          </span>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={onUpload}
          disabled={uploading}
        />
      </label>
      <span className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <span className="min-h-[2.5rem] min-w-0">
          <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-[11px] leading-snug text-gray-500 dark:text-gray-400">
              {description}
            </span>
          ) : null}
        </span>
        {url ? (
          <button
            type="button"
            onClick={onRemove}
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-red-400 hover:bg-red-500 hover:text-white dark:border-white/25 dark:text-gray-400"
            aria-label={removeLabel}
            title={removeLabel}
          >
            <X className="h-3 w-3" strokeWidth={3} aria-hidden />
          </button>
        ) : (
          <span
            className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-gray-300 bg-white/70 dark:border-white/25 dark:bg-white/5"
            aria-hidden
          />
        )}
      </span>
    </div>
  );
}
