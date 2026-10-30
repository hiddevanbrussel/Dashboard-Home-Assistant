"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Battery,
  BatteryCharging,
  CalendarDays,
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

function Frame({ kind, label, children }: { kind: string; label: ReactNode; children: ReactNode }) {
  return (
    <article
      data-story-card={kind}
      className="glass-card flex h-full min-h-[280px] w-[280px] shrink-0 snap-start flex-col gap-2 overflow-hidden p-5 portrait:w-[332px]"
    >
      <p className="flex items-center gap-2 text-[13px] font-semibold text-[#374151] dark:text-[#d1d5db]">
        {label}
      </p>
      {children}
    </article>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="text-base font-semibold leading-snug text-[#111827] dark:text-[#f3f4f6]">{children}</p>;
}

function Big({ children }: { children: ReactNode }) {
  return <p className="text-5xl font-bold leading-none tracking-tight text-[#111827] tabular-nums dark:text-[#f3f4f6]">{children}</p>;
}

function Tail({ children }: { children: ReactNode }) {
  return <p className="text-base leading-snug text-[#374151] dark:text-[#d1d5db]">{children}</p>;
}

function say(value: StoryLine | string, language: "nl" | "en"): string {
  return typeof value === "string" ? value : line(value, language);
}

const PART_COLOR = {
  direct: "#F59E0B",
  battery: "#0EA5E9",
  grid: "#4700B5",
} as const;

export function StoryCardView({ card }: { card: StoryCardModel }) {
  const { t, language } = useTranslation();
  const lang = language === "nl" ? "nl" : "en";
  switch (card.kind) {
    case "solar":
      return (
        <Frame
          kind="solar"
          label={
            <>
              {card.label === "today" ? <Sunset className="h-4 w-4 text-[#92400E] dark:text-[#FCD34D]" aria-hidden /> : <Sun className="h-4 w-4 text-[#92400E] dark:text-[#FCD34D]" aria-hidden />}
              {card.label === "today" ? t("energy.story.today") : t("energy.story.sun")}
            </>
          }
        >
          <Lead>{say(card.lead, lang)}</Lead>
          <Big>{card.big.replace("%", "")}<span className="ml-0.5 text-2xl font-semibold">%</span></Big>
          <Tail>{say(card.tail, lang)}</Tail>
          <div className="mt-auto pt-4">
            <div className="flex h-2 overflow-hidden rounded-full bg-[rgba(17,24,39,0.06)] dark:bg-white/10">
              {card.parts.map((part) => (
                <span key={part.key} style={{ width: `${part.pct}%`, background: PART_COLOR[part.key] }} />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#374151] dark:text-[#d1d5db]">
              {card.parts.map((part) => (
                <span key={part.key} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: PART_COLOR[part.key] }} aria-hidden />
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
        <Frame kind="grid" label={<><UtilityPole className="h-4 w-4 text-[#4700B5] dark:text-[#c4b5fd]" aria-hidden />{t("energy.story.grid")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big>{say(card.big, lang).replace(" kWh", "")}<span className="ml-1 text-2xl font-semibold">kWh</span></Big>
          {card.tail ? <Tail>{say(card.tail, lang)}</Tail> : null}
          <div className="mt-auto space-y-2 pt-4">
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
        <Frame kind="peak" label={<><Zap className="h-4 w-4 text-[#C2410C] dark:text-[#FDBA74]" aria-hidden />{t("energy.story.peak")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big>{card.big}</Big>
          <Tail>
            <b className="font-semibold text-[#111827] dark:text-[#f3f4f6]">{say(card.sub, lang)}</b>
            {` · ${say(card.tail, lang)}`}
          </Tail>
          <div className="mt-auto pt-4">
            <div className="flex h-[76px] items-end gap-px">
              {card.bars.map((bar) => (
                <span
                  key={bar.hour}
                  className={cn("flex-1 rounded-sm", bar.peak ? "bg-[#C2410C]" : "bg-[rgba(17,24,39,0.16)] dark:bg-white/20", bar.faded && "opacity-30")}
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
          label={
            <>
              {card.charging ? <BatteryCharging className="h-4 w-4 text-[#075985] dark:text-[#7DD3FC]" aria-hidden /> : <Battery className="h-4 w-4 text-[#075985] dark:text-[#7DD3FC]" aria-hidden />}
              {t("energy.story.battery")}
            </>
          }
        >
          <Lead>{t("energy.story.batteryIs")}</Lead>
          <Big>{card.soc}<span className="ml-0.5 text-2xl font-semibold">%</span></Big>
          <Tail>{say(card.tail, lang)}</Tail>
          <div className="mt-auto pt-4">
            <div className="h-3 overflow-hidden rounded-full bg-[rgba(17,24,39,0.08)] dark:bg-white/10">
              <span className="block h-full rounded-full bg-[#0EA5E9]" style={{ width: `${Math.max(4, card.soc)}%` }} />
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
        <Frame kind="devices" label={<><Plug className="h-4 w-4" aria-hidden />{t("energy.story.devices")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big>{say(card.big, lang).replace(" kWh", "")}<span className="ml-1 text-2xl font-semibold">kWh</span></Big>
          <Tail>{say(card.tail, lang)}</Tail>
          <div className="mt-auto space-y-2 pt-4">
            {card.rows.map((row) => (
              <div key={say(row.name, lang)} className="flex items-center gap-2 text-sm text-[#111827] dark:text-[#f3f4f6]">
                <span className="min-w-0 flex-1 truncate">{say(row.name, lang)}</span>
                <span className="h-2 rounded-full bg-[#4700B5]/70" style={{ width: `${Math.max(8, row.pct * 0.4)}%` }} />
              </div>
            ))}
          </div>
        </Frame>
      );
    case "hint":
      return (
        <Frame kind="hint" label={<><Plug className="h-4 w-4" aria-hidden />{t("energy.story.devices")}</>}>
          <Lead>{t("energy.story.hintTitle")}</Lead>
          <Tail>{card.mode === "setup" ? t("energy.story.hintSetup") : t("energy.story.hintChoose")}</Tail>
          <Link
            href={ENERGY_DEVICES_HREF}
            className={cn(
              "mt-auto inline-flex h-11 items-center justify-center rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
              FOCUS_RING_BRAND
            )}
          >
            {card.mode === "setup" ? t("energy.story.howTo") : t("energy.story.chooseDevices")}
          </Link>
        </Frame>
      );
    case "week": {
      const max = Math.max(0.1, ...card.days.map((day) => day.kwh));
      return (
        <Frame kind="week" label={<><CalendarDays className="h-4 w-4 text-[#4700B5] dark:text-[#c4b5fd]" aria-hidden />{t("energy.story.week")}</>}>
          <Lead>{say(card.lead, lang)}</Lead>
          <Big>{say(card.big, lang).replace(" kWh", "")}<span className="ml-1 text-2xl font-semibold">kWh</span></Big>
          {card.tail ? <Tail>{say(card.tail, lang)}</Tail> : null}
          <div className="mt-auto flex items-end gap-2 pt-4">
            {card.days.map((day) => (
              <div key={`${day.weekday}-${day.current ? "now" : "past"}`} className="flex flex-1 flex-col items-center gap-1">
                <span
                  className={cn("w-full rounded-sm bg-[#4700B5]", day.current && "opacity-50")}
                  style={{ height: Math.max(6, Math.round((day.kwh / max) * 72)) }}
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
        <Frame kind="link" label={<><Plug className="h-4 w-4" aria-hidden />{t("energy.story.devices")}</>}>
          <Lead>{t("energy.story.linkTitle")}</Lead>
          <Link
            href={ENERGY_SETTINGS_HREF}
            className={cn(
              "mt-auto inline-flex h-11 items-center justify-center rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
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
        className={cn("h-2 rounded-full", tone === "today" ? "bg-[#047857]" : "bg-[rgba(17,24,39,0.2)] dark:bg-white/25")}
        style={{ width: `${Math.max(4, width)}%` }}
      />
    </div>
  );
}

export function storyDotLabel(template: string, index: number, total: number): string {
  return fill(template, { n: String(index + 1), total: String(total) });
}
