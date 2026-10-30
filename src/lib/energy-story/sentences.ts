/**
 * Story sentences, one function per card.
 * Wording for solar, peak, battery and devices follows the v3.1 sentence list.
 * Grid and week compare kilowatt-hours. They do not mention a tariff or a price.
 * A card with no data returns null. Nothing here renders an em dash.
 */

import { formatClock, formatHourSpan, formatKwh, formatPercent, formatPower, lowerMedian, round1, selfPctShown } from "./format";
import type { StoryFacts, StoryLine } from "./types";

const DAY_SAME_KWH = 0.05;
const WEEK_SAME_KWH = 0.1;

export type SolarSentence = { lead: StoryLine; big: string; tail: StoryLine; yesterday: boolean };
export type GridSentence = { lead: StoryLine; big: StoryLine; tail: StoryLine | null };
export type PeakSentence = { lead: StoryLine; big: string; sub: StoryLine; tail: StoryLine };
export type BatterySentence = { lead: StoryLine; big: string; tail: StoryLine };
export type DeviceSentence = { lead: StoryLine; big: StoryLine; tail: StoryLine };
export type WeekSentence = { lead: StoryLine; big: StoryLine; tail: StoryLine | null };

function afterSunset(facts: StoryFacts): boolean {
  return facts.hour >= facts.sunsetHour;
}

function who(hasBattery: boolean): StoryLine {
  return hasBattery
    ? { nl: "Zon en batterij dekten", en: "Sun and battery covered" }
    : { nl: "De zon dekte", en: "The sun covered" };
}

function when(facts: StoryFacts): StoryLine {
  return afterSunset(facts) ? { nl: "vandaag", en: "today" } : { nl: "tot nu", en: "so far" };
}

/** Card 1. The live hero still applies its own hysteresis before it asks for a line. */
export function nowSentence(facts: StoryFacts): StoryLine | null {
  const live = facts.live;
  const solarCovers = live.solarKw >= live.homeKw && live.solarKw > 0.05;
  if (facts.night && live.solarKw < 0.01 && live.dischargeKw > 0.01) {
    return {
      nl: `Je batterij levert nu ${formatPower(live.dischargeKw, "nl")} aan het huis.`,
      en: `Your battery is supplying ${formatPower(live.dischargeKw, "en")} to the house.`,
    };
  }
  if (solarCovers && live.gridExportKw > 0.05) {
    return {
      nl: "De zon dekt je huis nu volledig, de rest gaat terug.",
      en: "The sun covers the whole house; the rest goes to the grid.",
    };
  }
  if (solarCovers) {
    return {
      nl: "De zon dekt je huis nu volledig.",
      en: "The sun is covering the whole house right now.",
    };
  }
  if (live.solarKw > 0.05) {
    return {
      nl: `De zon levert nu ${formatPower(live.solarKw, "nl")} van de ${formatPower(live.homeKw, "nl")}.`,
      en: `The sun supplies ${formatPower(live.solarKw, "en")} of ${formatPower(live.homeKw, "en")} right now.`,
    };
  }
  if (live.gridImportKw > 0.01) {
    return {
      nl: `Je huis haalt nu ${formatPower(live.gridImportKw, "nl")} van het net.`,
      en: `The house is drawing ${formatPower(live.gridImportKw, "en")} from the grid.`,
    };
  }
  return null;
}

/** Card 2. Before the first 0.5 kWh of sun, the card talks about yesterday. */
export function solarSentence(facts: StoryFacts): SolarSentence | null {
  if (!facts.hasSolar) return null;
  const covered = who(facts.hasBattery);
  const solarToday = facts.solarKwh ?? 0;
  if (solarToday < 0.5) {
    const yesterday = facts.yesterday;
    if (afterSunset(facts) || !yesterday || yesterday.solarKwh < 0.5 || yesterday.loadKwh < 0.5) return null;
    const pct = Math.min(99, Math.max(1, Math.round(yesterday.selfPct)));
    return {
      lead: {
        nl: `Gisteren: ${covered.nl.toLowerCase()}`,
        en: `Yesterday: ${covered.en.toLowerCase()}`,
      },
      big: formatPercent(pct),
      tail: { nl: "van je verbruik", en: "of your usage" },
      yesterday: true,
    };
  }
  const load = facts.loadKwh;
  const imported = facts.importKwh;
  if (load == null || imported == null) return null;
  const self = load > 0 ? (1 - imported / load) * 100 : null;
  const pct = selfPctShown(self, load, imported);
  if (pct == null) return null;
  const period = when(facts);
  return {
    lead: { nl: `${covered.nl} ${period.nl}`, en: `${covered.en} ${period.en}` },
    big: formatPercent(pct),
    tail: { nl: "van je verbruik", en: "of your usage" },
    yesterday: false,
  };
}

function compareTail(
  today: number,
  yesterday: number,
  sameAt: number,
  around: boolean,
  scope: "day" | "week"
): StoryLine | null {
  const shownToday = round1(today);
  const shownYesterday = round1(yesterday);
  const delta = round1(shownYesterday - shownToday);
  if (Math.abs(delta) < sameAt) {
    return scope === "day"
      ? { nl: "Ongeveer evenveel als gisteren.", en: "About the same as yesterday." }
      : { nl: "Ongeveer evenveel als vorige week.", en: "About the same as last week." };
  }
  const less = delta > 0;
  const amount = formatKwh(Math.abs(delta), "nl");
  const amountEn = formatKwh(Math.abs(delta), "en");
  if (scope === "week") {
    return less
      ? { nl: `${amount} minder dan vorige week.`, en: `${amountEn} less than last week.` }
      : { nl: `${amount} meer dan vorige week.`, en: `${amountEn} more than last week.` };
  }
  const ref = around
    ? { nl: "dan gisteren rond deze tijd", en: "than yesterday at this time" }
    : { nl: "dan gisteren", en: "than yesterday" };
  return less
    ? { nl: `${amount} minder ${ref.nl}.`, en: `${amountEn} less ${ref.en}.` }
    : { nl: `${amount} meer ${ref.nl}.`, en: `${amountEn} more ${ref.en}.` };
}

/**
 * Card 3. Grid import today against yesterday at the same time.
 * The lead stays "tot nu", matching the old cost card, including after sunset.
 */
export function gridSentence(facts: StoryFacts): GridSentence | null {
  if (facts.importKwh == null) return null;
  const yesterday = facts.yesterdayImportKwh;
  const around = facts.hour < 23.9;
  return {
    lead: { nl: "Vandaag tot nu", en: "Today so far" },
    big: { nl: formatKwh(facts.importKwh, "nl"), en: formatKwh(facts.importKwh, "en") },
    tail: yesterday == null ? null : compareTail(facts.importKwh, yesterday, DAY_SAME_KWH, around, "day"),
  };
}

/** Card 4. Fixed tariff only. The busiest completed hour, plus a device when it was at least half of that hour. */
export function peakSentence(facts: StoryFacts): PeakSentence | null {
  if (!facts.tariffFixed || facts.hours.length < 1) return null;
  if (facts.loadKwh == null || facts.loadKwh < 1) return null;
  let peak: { hour: number; loadKwh: number } | null = null;
  for (const row of facts.hours) {
    if (!peak || row.loadKwh > peak.loadKwh) peak = row;
  }
  if (!peak || peak.loadKwh < 0.5) return null;
  const median = lowerMedian(facts.hours.map((row) => row.loadKwh));
  if (median != null && peak.loadKwh < 1.5 * median) return null;
  let device: StoryDeviceName | null = null;
  for (const entry of facts.devices) {
    if (entry.peakKwh != null && peak.loadKwh > 0 && entry.peakKwh / peak.loadKwh >= 0.5) {
      device = entry.name;
    }
  }
  return {
    lead: { nl: "Grootste verbruik", en: "Busiest hour" },
    big: formatHourSpan(peak.hour),
    sub: { nl: formatKwh(peak.loadKwh, "nl"), en: formatKwh(peak.loadKwh, "en") },
    tail: device
      ? {
          nl: `Toen draaide de ${device.nl.toLowerCase()}.`,
          en: `The ${device.en.toLowerCase()} was running.`,
        }
      : { nl: "Geen apparaat sprong eruit.", en: "No single device stood out." },
  };
}

type StoryDeviceName = StoryLine;

/** Card 5. */
export function batterySentence(facts: StoryFacts): BatterySentence | null {
  if (!facts.hasBattery || facts.soc == null) return null;
  const soc = Math.round(facts.soc);
  let tail: StoryLine;
  if (facts.emptySinceHour != null) {
    const clock = formatClock(facts.emptySinceHour, true);
    tail = facts.chargesFromSolarOnly
      ? { nl: `Leeg sinds ${clock}. Laadt weer op zon.`, en: `Empty since ${clock}. Recharges from solar.` }
      : { nl: `Leeg sinds ${clock}.`, en: `Empty since ${clock}.` };
  } else if (facts.chargeKw > 0.01) {
    tail = facts.chargesFromSolarOnly
      ? {
          nl: `Laadt nu met ${formatPower(facts.chargeKw, "nl")} uit zon.`,
          en: `Charging at ${formatPower(facts.chargeKw, "en")} from solar.`,
        }
      : {
          nl: `Laadt nu met ${formatPower(facts.chargeKw, "nl")}.`,
          en: `Charging at ${formatPower(facts.chargeKw, "en")}.`,
        };
  } else if (facts.dischargeKw > 0.01) {
    tail = {
      nl: `Levert nu ${formatPower(facts.dischargeKw, "nl")} aan het huis.`,
      en: `Supplying ${formatPower(facts.dischargeKw, "en")} to the house.`,
    };
  } else if (soc >= 99) {
    tail = { nl: "Vol.", en: "Full." };
  } else {
    tail = { nl: "Rust.", en: "Idle." };
  }
  return { lead: { nl: "Batterij", en: "Battery" }, big: formatPercent(soc), tail };
}

/** Card 6. The largest chosen device, when it is at least 0.5 kWh and 10% of the load. */
export function deviceSentence(facts: StoryFacts): (DeviceSentence & { topKwh: number }) | null {
  const ranked = facts.devices
    .filter((device): device is typeof device & { kwh: number } => device.kwh != null)
    .sort((a, b) => b.kwh - a.kwh);
  const top = ranked[0];
  const load = facts.loadKwh;
  if (!top || load == null || load <= 0 || top.kwh < 0.5 || top.kwh / load < 0.1) return null;
  const share = Math.round((top.kwh / load) * 100);
  const period = when(facts);
  return {
    lead: { nl: `${top.name.nl} verbruikte`, en: `${top.name.en} used` },
    big: { nl: formatKwh(top.kwh, "nl"), en: formatKwh(top.kwh, "en") },
    tail: {
      nl: `${share}% van je verbruik ${period.nl}.`,
      en: `${share}% of your usage ${period.en}.`,
    },
    topKwh: top.kwh,
  };
}

/** Card 7. This week against last week at the same moment. Needs 8 days of history. */
export function weekSentence(facts: StoryFacts): WeekSentence | null {
  if (facts.ltsDays == null || facts.ltsDays < 8 || facts.weekKwh == null) return null;
  const yesterday = facts.lastWeekKwh;
  return {
    lead: { nl: "Deze week tot nu", en: "This week so far" },
    big: { nl: formatKwh(facts.weekKwh, "nl"), en: formatKwh(facts.weekKwh, "en") },
    tail: yesterday == null ? null : compareTail(facts.weekKwh, yesterday, WEEK_SAME_KWH, true, "week"),
  };
}
