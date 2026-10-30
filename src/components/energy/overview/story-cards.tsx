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

type StoryTone = "sun" | "grid" | "peak" | "batt" | "devices";

const ZONE_STOPS: Record<StoryTone, { light: readonly [string, string]; dark: readonly [string, string] }> = {
  sun: { light: ["#B45309", "#92400E"], dark: ["#B45309", "#92400E"] },
  grid: { light: ["#4700B5", "#2E0080"], dark: ["#8357be", "#4700B5"] },
  peak: { light: ["#C2410C", "#9A3412"], dark: ["#C2410C", "#9A3412"] },
  batt: { light: ["#0369A1", "#075985"], dark: ["#0369A1", "#075985"] },
  devices: { light: ["#DC2626", "#B91C1C"], dark: ["#DC2626", "#B91C1C"] },
};

const ACCENT = {
  sun: "bg-[#B45309] dark:bg-[#FBBF24]",
  grid: "bg-[#4700B5] dark:bg-[#8357be]",
  peak: "bg-[#C2410C] dark:bg-[#FB923C]",
  batt: "bg-[#0369A1] dark:bg-[#38BDF8]",
  devices: "bg-[#DC2626] dark:bg-[#F87171]",
} as const;

const ACCENT_BORDER = {
  sun: "border-[#B45309] dark:border-[#FBBF24]",
  grid: "border-[#4700B5] dark:border-[#8357be]",
  peak: "border-[#C2410C] dark:border-[#FB923C]",
  batt: "border-[#0369A1] dark:border-[#38BDF8]",
  devices: "border-[#DC2626] dark:border-[#F87171]",
} as const;

const ICON = "h-5 w-5 shrink-0";

function weekdayLabel(weekday: number, language: "nl" | "en"): string {
  const monday = new Date(Date.UTC(2026, 0, 5 + weekday));
  return new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en-GB", {
    weekday: "short",
    timeZone: "UTC",
  }).format(monday);
}

function zoneFill(stops: readonly [string, string]): string {
  return `linear-gradient(135deg, ${stops[0]}, ${stops[1]})`;
}

function bodyTint(stop: string): string {
  return `linear-gradient(180deg, color-mix(in srgb, ${stop} 10%, transparent), transparent 60%)`;
}

function Frame({
  kind,
  tone,
  label,
  value,
  children,
}: {
  kind: string;
  tone: StoryTone;
  label: ReactNode;
  value?: ReactNode;
  children: ReactNode;
}) {
  const stops = ZONE_STOPS[tone];
  return (
    <article
      data-story-card={kind}
      data-story-tone={tone}
      style={{ boxShadow: "none" }}
      className="glass-card relative flex h-[280px] w-[252px] shrink-0 snap-start flex-col overflow-hidden p-0 shadow-none portrait:h-[272px] portrait:w-[248px]"
    >
      <div
        data-story-zone
        className={cn(
          "relative shrink-0 overflow-hidden px-4 text-white",
          value
            ? "h-[106px] pb-[14px] pt-4 portrait:h-[96px] portrait:pb-3 portrait:pt-[14px]"
            : "pb-[14px] pt-4 portrait:pb-3 portrait:pt-[14px]"
        )}
      >
        <div aria-hidden className="absolute inset-0 dark:hidden" style={{ background: zoneFill(stops.light) }} />
        <div aria-hidden className="absolute inset-0 hidden dark:block" style={{ background: zoneFill(stops.dark) }} />
        <div className="relative z-[1]">
          <p className="flex items-center gap-2 text-[14px] font-semibold leading-none text-white">{label}</p>
          {value}
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col px-4 pb-4 pt-[14px]">
        <div aria-hidden className="absolute inset-0 dark:hidden" style={{ background: bodyTint(stops.light[0]) }} />
        <div aria-hidden className="absolute inset-0 hidden dark:block" style={{ background: bodyTint(stops.dark[0]) }} />
        <div className="relative z-[1] flex min-h-0 flex-col">{children}</div>
      </div>
    </article>
  );
}

function Big({ children, time = false }: { children: ReactNode; time?: boolean }) {
  return (
    <p
      data-story-big
      className={cn(
        "mt-2.5 font-bold leading-none tracking-[-0.02em] text-white tabular-nums portrait:mt-1.5",
        time ? "whitespace-nowrap text-[34px]" : "text-[46px] portrait:text-[44px]"
      )}
    >
      {children}
    </p>
  );
}

function Unit({ children }: { children: ReactNode }) {
  return <span className="ml-0.5 text-[24px] font-semibold tracking-normal">{children}</span>;
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p data-story-lead className="text-[18px] font-semibold leading-[1.25] text-[#111827] dark:text-[#f3f4f6]">
      {children}
    </p>
  );
}

function Sentence({ children }: { children: ReactNode }) {
  return (
    <p data-story-sentence className="mt-1.5 text-[14px] font-normal leading-[1.35] text-[#374151] dark:text-[#d1d5db]">
      {children}
    </p>
  );
}

function Foot({ children }: { children: ReactNode }) {
  return (
    <div data-story-foot className="mt-4">
      {children}
    </div>
  );
}

function say(value: StoryLine | string, language: "nl" | "en"): string {
  return typeof value === "string" ? value : line(value, language);
}

const PART_CLASS = {
  direct: "bg-[#B45309] dark:bg-[#FBBF24]",
  battery: "bg-[#0369A1] dark:bg-[#38BDF8]",
  grid: "bg-[#4700B5] dark:bg-[#8357be]",
} as const;

function kwhValue(text: string): string {
  return text.replace(" kWh", "");
}

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
                <Sunset className={ICON} strokeWidth={2} aria-hidden />
              ) : (
                <Sun className={ICON} strokeWidth={2} aria-hidden />
              )}
              {card.label === "today" ? t("energy.story.today") : t("energy.story.sun")}
            </>
          }
          value={
            <Big>
              {card.big.replace("%", "")}
              <Unit>%</Unit>
            </Big>
          }
        >
          <Lead>{say(card.lead, lang)}</Lead>
          <Sentence>{say(card.tail, lang)}</Sentence>
          <Foot>
            <div className="flex h-[14px] gap-[3px]">
              {card.parts.map((part) => (
                <span key={part.key} className={cn("rounded-sm", PART_CLASS[part.key])} style={{ width: `${part.pct}%` }} />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#374151] dark:text-[#d1d5db]">
              {card.parts.map((part) => (
                <span key={part.key} className="inline-flex items-center gap-1.5">
                  <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", PART_CLASS[part.key])} aria-hidden />
                  {part.key === "direct" ? t("energy.story.direct") : part.key === "battery" ? t("energy.story.viaBattery") : t("energy.story.grid")}
                </span>
              ))}
            </div>
          </Foot>
        </Frame>
      );
    case "grid": {
      const max = Math.max(card.todayKwh, card.yesterdayKwh ?? 0, 0.001);
      return (
        <Frame
          kind="grid"
          tone="grid"
          label={
            <>
              <UtilityPole className={ICON} strokeWidth={2} aria-hidden />
              {t("energy.story.gridLabel")}
            </>
          }
          value={
            <Big>
              {kwhValue(say(card.big, lang))}
              <Unit>kWh</Unit>
            </Big>
          }
        >
          <Lead>{say(card.lead, lang)}</Lead>
          {card.tail ? <Sentence>{say(card.tail, lang)}</Sentence> : null}
          <Foot>
            <div className="space-y-1.5">
              {card.yesterdayKwh != null ? (
                <CompareRow label={t("energy.story.yesterday")} width={(card.yesterdayKwh / max) * 100} className="bg-[rgba(17,24,39,0.16)] dark:bg-white/20" />
              ) : null}
              <CompareRow label={t("energy.story.todayShort")} width={(card.todayKwh / max) * 100} className={ACCENT.grid} />
            </div>
          </Foot>
        </Frame>
      );
    }
    case "peak":
      return (
        <Frame
          kind="peak"
          tone="peak"
          label={
            <>
              <Zap className={ICON} strokeWidth={2} aria-hidden />
              {t("energy.story.peak")}
            </>
          }
          value={<Big time>{card.big}</Big>}
        >
          <Lead>{say(card.lead, lang)}</Lead>
          <Sentence>
            <b className="font-semibold">{say(card.sub, lang)}</b>
            {` · ${say(card.tail, lang)}`}
          </Sentence>
          <Foot>
            <div className="flex h-11 items-end gap-[2px]">
              {card.bars.map((bar) => (
                <span
                  key={bar.hour}
                  className={cn(
                    "flex-1 rounded-[2px]",
                    bar.peak ? ACCENT.peak : "bg-[rgba(17,24,39,0.16)] dark:bg-white/20",
                    bar.faded && "opacity-30"
                  )}
                  style={{ height: Math.max(2, Math.round((bar.height / 70) * 44)) }}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[12px] text-[#374151] dark:text-[#d1d5db]">
              <span>00</span>
              <span>12</span>
              <span>24</span>
            </div>
          </Foot>
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
                <BatteryCharging className={ICON} strokeWidth={2} aria-hidden />
              ) : (
                <Battery className={ICON} strokeWidth={2} aria-hidden />
              )}
              {t("energy.story.battery")}
            </>
          }
          value={
            <Big>
              {card.soc}
              <Unit>%</Unit>
            </Big>
          }
        >
          <Lead>{t("energy.story.batteryIs")}</Lead>
          <Sentence>{say(card.tail, lang)}</Sentence>
          <Foot>
            <div className={cn("h-6 overflow-hidden rounded-[7px] border-2", ACCENT_BORDER.batt)}>
              <span className={cn("block h-full", ACCENT.batt)} style={{ width: `${Math.max(4, card.soc)}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[12px] text-[#374151] dark:text-[#d1d5db]">
              <span>{t("energy.story.empty")}</span>
              <span>{t("energy.story.full")}</span>
            </div>
          </Foot>
        </Frame>
      );
    case "devices":
      return (
        <Frame
          kind="devices"
          tone="devices"
          label={
            <>
              <Plug className={ICON} strokeWidth={2} aria-hidden />
              {t("energy.story.devices")}
            </>
          }
          value={
            <Big>
              {kwhValue(say(card.big, lang))}
              <Unit>kWh</Unit>
            </Big>
          }
        >
          <Lead>{say(card.lead, lang)}</Lead>
          <Sentence>{say(card.tail, lang)}</Sentence>
          <Foot>
            <div className="space-y-1">
              {card.rows.map((row) => (
                <div key={say(row.name, lang)} className="flex h-4 items-center gap-2 text-[12px] text-[#111827] dark:text-[#f3f4f6]">
                  <Plug className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{say(row.name, lang)}</span>
                  <span className={cn("h-1.5 rounded-full", ACCENT.devices)} style={{ width: `${Math.max(8, Math.min(100, row.pct))}%` }} />
                </div>
              ))}
            </div>
          </Foot>
        </Frame>
      );
    case "hint":
      return (
        <Frame
          kind="hint"
          tone="devices"
          label={
            <>
              <Plug className={ICON} strokeWidth={2} aria-hidden />
              {t("energy.story.devices")}
            </>
          }
        >
          <Lead>{t("energy.story.hintTitle")}</Lead>
          <Sentence>{card.mode === "setup" ? t("energy.story.hintSetup") : t("energy.story.hintChoose")}</Sentence>
          <Foot>
            <Link
              href={ENERGY_DEVICES_HREF}
              className={cn(
                "inline-flex h-11 w-fit items-center justify-center gap-1 rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
                FOCUS_RING_BRAND
              )}
            >
              {card.mode === "setup" ? t("energy.story.howTo") : t("energy.story.chooseDevices")}
              <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
            </Link>
          </Foot>
        </Frame>
      );
    case "week": {
      const max = Math.max(0.1, ...card.days.map((day) => day.kwh));
      return (
        <Frame
          kind="week"
          tone="grid"
          label={
            <>
              <CalendarDays className={ICON} strokeWidth={2} aria-hidden />
              {t("energy.story.week")}
            </>
          }
          value={
            <Big>
              {kwhValue(say(card.big, lang))}
              <Unit>kWh</Unit>
            </Big>
          }
        >
          <Lead>{say(card.lead, lang)}</Lead>
          {card.tail ? <Sentence>{say(card.tail, lang)}</Sentence> : null}
          <Foot>
            <div className="flex items-end gap-1.5">
              {card.days.map((day) => (
                <div key={`${day.weekday}-${day.current ? "now" : "past"}`} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <span
                    className={cn("w-full rounded-md", ACCENT.grid, day.current && "opacity-50 dark:opacity-90")}
                    style={{ height: Math.max(4, Math.round((day.kwh / max) * 52)) }}
                  />
                  <span className="text-[12px] text-[#374151] dark:text-[#d1d5db]">{weekdayLabel(day.weekday, lang)}</span>
                </div>
              ))}
            </div>
          </Foot>
        </Frame>
      );
    }
    case "link":
      return (
        <Frame
          kind="link"
          tone="grid"
          label={
            <>
              <Plug className={ICON} strokeWidth={2} aria-hidden />
              {t("energy.story.devices")}
            </>
          }
        >
          <Lead>{t("energy.story.linkTitle")}</Lead>
          <Foot>
            <Link
              href={ENERGY_SETTINGS_HREF}
              className={cn(
                "inline-flex h-11 w-fit items-center justify-center rounded-full bg-[#4700B5] px-4 text-[15px] font-semibold text-white outline-none dark:bg-[#8357be]",
                FOCUS_RING_BRAND
              )}
            >
              {t("energy.story.linkButton")}
            </Link>
          </Foot>
        </Frame>
      );
    default: {
      const neverCard: never = card;
      return neverCard;
    }
  }
}

function CompareRow({ label, width, className }: { label: string; width: number; className: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#374151] dark:text-[#d1d5db]">
      <span className="w-16 shrink-0">{label}</span>
      <span className="h-[10px] min-w-0 flex-1">
        <span className={cn("block h-full rounded-full", className)} style={{ width: `${Math.max(4, width)}%` }} />
      </span>
    </div>
  );
}
