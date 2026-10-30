"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Battery,
  BatteryCharging,
  CalendarDays,
  ChevronRight,
  Plug,
  Sun,
  Sunset,
  UtilityPole,
  Zap,
} from "lucide-react";
import { FOCUS_RING_BRAND } from "@/components/layout/tile-menu";
import { useTranslation } from "@/hooks/use-translation";
import { line, type StoryCardModel, type StoryLine } from "@/lib/energy-story/types";
import { cn } from "@/lib/utils";

export const ENERGY_SETTINGS_HREF = "/settings?sectie=paginas&page=energy";
export const ENERGY_DEVICES_HREF = "/settings?sectie=paginas&page=energy&apparaten=1";

function fill(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) out = out.split(`{${key}}`).join(value);
  return out;
}

function weekdayLabel(weekday: number, language: "nl" | "en"): string {
  const monday = new Date(Date.UTC(2026, 0, 5 + weekday));
  return new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en-GB", {
    weekday: "short",
    timeZone: "UTC",
  }).format(monday);
}

function Glow({ tone }: { tone: "sun" | "grid" | "gas" | "batt" | "dear" | "brand" }) {
  const color = {
    sun: "#FBBF24",
    grid: "#8357be",
    gas: "#FB923C",
    batt: "#38BDF8",
    dear: "#F87171",
    brand: "#8357be",
  }[tone];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-8 -top-16 h-64 w-64"
      style={{ background: `radial-gradient(closest-side, ${color}, transparent)`, opacity: 0.45 }}
    />
  );
}

function Frame({
  kind,
  tone,
  label,
  children,
}: {
  kind: string;
  tone: "sun" | "grid" | "gas" | "batt" | "dear" | "brand";
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <article
      data-story-card={kind}
      className="glass-card relative flex h-full w-[280px] shrink-0 snap-start flex-col overflow-hidden p-6 portrait:w-[332px]"
    >
      <Glow tone={tone} />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-[#374151] dark:text-[#d1d5db]">{label}</p>
        {children}
      </div>
    </article>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="mt-11 text-2xl font-semibold leading-snug text-[#111827] dark:text-[#f3f4f6]">{children}</p>;
}

function Big({ children, size }: { children: ReactNode; size: "hero" | "kwh" | "time" }) {
  const type = size === "kwh" ? "text-[64px]" : size === "time" ? "whitespace-nowrap text-[32px]" : "text-[96px]";
  return <p className={cn(type, "font-bold leading-none tracking-tight text-[#111827] tabular-nums dark:text-[#f3f4f6]")}>{children}</p>;
}

function Tail({ children }: { children: ReactNode }) {
  return <p className="mt-3.5 text-[17px] font-medium leading-snug text-[#374151] dark:text-[#d1d5db]">{children}</p>;
}

function say(value: StoryLine | string, language: "nl" | "en"): string {
  return typeof value === "string" ? value : line(value, language);
}

const PART_CLASS = {
  direct: "bg-[#B45309] dark:bg-[#FBBF24]",
  battery: "bg-[#0369A1] dark:bg-[#38BDF8]",
  grid: "bg-[#4700B5] dark:bg-[#8357be]",
} as const;

export function StoryCardView({ card }: { card: StoryCardModel }) {
  const { t, language } = useTranslation();
  const lang = language === "nl" ? "nl" : "en";
  switch (card.kind) {
    case "solar":
      return (
        <Frame
          kind="solar"
          tone="sun"
          label={
            <>
              {card.label === "today" ? (
                <Sunset className="h-[18px] w-[18px] text-[#B45309] dark:text-[#FBBF24]" aria-hidden />
              ) : (
                <Sun className="h-[18px] w-[18px] text-[#B45309] dark:text-[#FBBF24]" aria-hidden />
              )}
              {card.label === "today" ? t("energy.story.today") : t("energy.story.sun")}
            </>
          }
        >
          <svg aria-hidden viewBox="0 0 120 120" className="pointer-events-none absolute right-2 top-8 h-24 w-24 opacity-40">
            {Array.from({ length: 12 }, (_, index) => {
              const angle = (index / 12) * Math.PI * 2;
              return (
                <line
                  key={index}
                  x1={60 + 28 * Math.cos(angle)}
                  y1={60 + 28 * Math.sin(angle)}
                  x2={60 + 52 * Math.cos(angle)}
                  y2={60 + 52 * Math.sin(angle)}
                  stroke="currentColor"
                  className="text-[#B45309] dark:text-[#FBBF24]"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big size="hero">
            {card.big.replace("%", "")}
            <span className="ml-0.5 text-[40px] font-semibold">%</span>
          </Big>
          <Tail>{say(card.tail, lang)}</Tail>
          <div className="pt-6">
            <div className="flex h-5 gap-[3px]">
              {card.parts.map((part) => (
                <span key={part.key} className={cn("rounded-sm", PART_CLASS[part.key])} style={{ width: `${part.pct}%` }} />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#374151] dark:text-[#d1d5db]">
              {card.parts.map((part) => (
                <span key={part.key} className="inline-flex items-center gap-1.5">
                  <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", PART_CLASS[part.key])} aria-hidden />
                  {part.key === "direct" ? t("energy.story.direct") : part.key === "battery" ? t("energy.story.viaBattery") : t("energy.story.grid")}
                </span>
              ))}
            </div>
          </div>
        </Frame>
      );
    case "grid": {
      const max = Math.max(card.todayKwh, card.yesterdayKwh ?? 0, 0.001);
      return (
        <Frame kind="grid" tone="grid" label={<><UtilityPole className="h-[18px] w-[18px] text-[#4700B5] dark:text-[#8357be]" aria-hidden />{t("energy.story.gridLabel")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big size="kwh">{say(card.big, lang).replace(" kWh", "")}<span className="ml-1 text-[28px] font-semibold">kWh</span></Big>
          {card.tail ? <Tail>{say(card.tail, lang)}</Tail> : null}
          <div className="space-y-2 pt-6">
            {card.yesterdayKwh != null ? (
              <CompareRow label={t("energy.story.yesterday")} width={(card.yesterdayKwh / max) * 100} tone="muted" />
            ) : null}
            <CompareRow label={t("energy.story.todayShort")} width={(card.todayKwh / max) * 100} tone="today" />
          </div>
        </Frame>
      );
    }
    case "peak":
      return (
        <Frame kind="peak" tone="gas" label={<><Zap className="h-[18px] w-[18px] text-[#C2410C] dark:text-[#FB923C]" aria-hidden />{t("energy.story.peak")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big size="time">{card.big}</Big>
          <Tail>
            <b className="font-semibold text-[#111827] dark:text-[#f3f4f6]">{say(card.sub, lang)}</b>
            {` · ${say(card.tail, lang)}`}
          </Tail>
          <div className="pt-6">
            <div className="flex h-20 items-end gap-[3px]">
              {card.bars.map((bar) => (
                <span
                  key={bar.hour}
                  className={cn("flex-1 rounded-[3px]", bar.peak ? "bg-[#C2410C] dark:bg-[#FB923C]" : "bg-[rgba(17,24,39,0.16)] dark:bg-white/20", bar.faded && "opacity-30")}
                  style={{ height: bar.height }}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[12px] text-[#4b5563] dark:text-[#b4b4bd]">
              <span>00</span>
              <span>12</span>
              <span>24</span>
            </div>
          </div>
        </Frame>
      );
    case "battery":
      return (
        <Frame
          kind="battery"
          tone="batt"
          label={
            <>
              {card.charging ? (
                <BatteryCharging className="h-[18px] w-[18px] text-[#0369A1] dark:text-[#38BDF8]" aria-hidden />
              ) : (
                <Battery className="h-[18px] w-[18px] text-[#0369A1] dark:text-[#38BDF8]" aria-hidden />
              )}
              {t("energy.story.battery")}
            </>
          }
        >
          <Lead>{t("energy.story.batteryIs")}</Lead>
          <Big size="hero">
            {card.soc}
            <span className="ml-0.5 text-[40px] font-semibold">%</span>
          </Big>
          <Tail>{say(card.tail, lang)}</Tail>
          <div className="pt-6">
            <div className="h-11 overflow-hidden rounded-lg border-2 border-[#0369A1] dark:border-[#38BDF8]">
              <span className="block h-full bg-[#0369A1] dark:bg-[#38BDF8]" style={{ width: `${Math.max(4, card.soc)}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[12px] text-[#4b5563] dark:text-[#b4b4bd]">
              <span>{t("energy.story.empty")}</span>
              <span>{t("energy.story.full")}</span>
            </div>
          </div>
        </Frame>
      );
    case "devices":
      return (
        <Frame kind="devices" tone="dear" label={<><Plug className="h-[18px] w-[18px]" aria-hidden />{t("energy.story.devices")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big size="kwh">{say(card.big, lang).replace(" kWh", "")}<span className="ml-1 text-[28px] font-semibold">kWh</span></Big>
          <Tail>{say(card.tail, lang)}</Tail>
          <div className="space-y-1 pt-6">
            {card.rows.map((row) => (
              <div key={say(row.name, lang)} className="flex h-[34px] items-center gap-2 text-sm text-[#111827] dark:text-[#f3f4f6]">
                <Plug className="h-[18px] w-[18px] shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{say(row.name, lang)}</span>
                <span className="h-2 rounded-full bg-[#DC2626] dark:bg-[#F87171]" style={{ width: `${Math.max(8, Math.min(100, row.pct))}%` }} />
              </div>
            ))}
          </div>
        </Frame>
      );
    case "hint":
      return (
        <Frame kind="hint" tone="dear" label={<><Plug className="h-[18px] w-[18px]" aria-hidden />{t("energy.story.devices")}</>}>
          <Lead>{t("energy.story.hintTitle")}</Lead>
          <Tail>{card.mode === "setup" ? t("energy.story.hintSetup") : t("energy.story.hintChoose")}</Tail>
          <Link
            href={ENERGY_DEVICES_HREF}
            className={cn(
              "mt-4 inline-flex h-11 w-fit items-center justify-center gap-1 rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
              FOCUS_RING_BRAND
            )}
          >
            {card.mode === "setup" ? t("energy.story.howTo") : t("energy.story.chooseDevices")}
            <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
          </Link>
        </Frame>
      );
    case "week": {
      const max = Math.max(0.1, ...card.days.map((day) => day.kwh));
      return (
        <Frame kind="week" tone="brand" label={<><CalendarDays className="h-[18px] w-[18px] text-[#4700B5] dark:text-[#8357be]" aria-hidden />{t("energy.story.week")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big size="kwh">{say(card.big, lang).replace(" kWh", "")}<span className="ml-1 text-[28px] font-semibold">kWh</span></Big>
          {card.tail ? <Tail>{say(card.tail, lang)}</Tail> : null}
          <div className="mt-6 flex h-[104px] items-end gap-2.5">
            {card.days.map((day) => (
              <div key={`${day.weekday}-${day.current ? "now" : "past"}`} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span
                  className={cn("w-full rounded-md bg-[#4700B5] dark:bg-[#8357be]", day.current && "opacity-50")}
                  style={{ height: Math.max(6, Math.round((day.kwh / max) * 80)) }}
                />
                <span className="text-[12px] text-[#4b5563] dark:text-[#b4b4bd]">{weekdayLabel(day.weekday, lang)}</span>
              </div>
            ))}
          </div>
        </Frame>
      );
    }
    case "link":
      return (
        <Frame kind="link" tone="brand" label={<><Plug className="h-[18px] w-[18px]" aria-hidden />{t("energy.story.devices")}</>}>
          <Lead>{t("energy.story.linkTitle")}</Lead>
          <Link
            href={ENERGY_SETTINGS_HREF}
            className={cn(
              "mt-4 inline-flex h-11 w-fit items-center justify-center rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
              FOCUS_RING_BRAND
            )}
          >
            {t("energy.story.linkButton")}
          </Link>
        </Frame>
      );
    default: {
      const neverCard: never = card;
      return neverCard;
    }
  }
}

function CompareRow({ label, width, tone }: { label: string; width: number; tone: "muted" | "today" }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[#374151] dark:text-[#d1d5db]">
      <span className="w-16 shrink-0">{label}</span>
      <span
        className={cn("h-[18px] rounded-full", tone === "today" ? "bg-[#047857] dark:bg-[#34D399]" : "bg-[rgba(17,24,39,0.2)] dark:bg-white/25")}
        style={{ width: `${Math.max(4, width)}%` }}
      />
    </div>
  );
}

export function storyDotLabel(template: string, index: number, total: number): string {
  return fill(template, { n: String(index + 1), total: String(total) });
}
