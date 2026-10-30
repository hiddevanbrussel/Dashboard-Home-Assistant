/**
 * Which story cards exist, in the fixed order.
 * A card without data is left out. The hint is a real card and keeps its dot.
 * There is no price card and no tariff chip.
 */

import { largestRemainder } from "./format";
import { batterySentence, deviceSentence, gridSentence, peakSentence, solarSentence, weekSentence } from "./sentences";
import type { SolarPartKey, StoryCardModel, StoryFacts } from "./types";

const MAX_DEVICE_ROWS = 5;

function solarCard(facts: StoryFacts): StoryCardModel | null {
  const sentence = solarSentence(facts);
  if (!sentence) return null;
  const solar = Math.max(0, facts.solarKwh ?? 0);
  const charge = Math.max(0, facts.chargeKwh ?? 0);
  const exported = Math.max(0, facts.exportKwh ?? 0);
  const direct = Math.max(0, solar - charge - exported);
  const viaBattery = facts.hasBattery ? Math.max(0, facts.dischargeKwh ?? 0) : 0;
  const fromGrid = Math.max(0, facts.importKwh ?? 0);
  const keys: SolarPartKey[] = facts.hasBattery ? ["direct", "battery", "grid"] : ["direct", "grid"];
  const values = facts.hasBattery ? [direct, viaBattery, fromGrid] : [direct, fromGrid];
  const percents = largestRemainder(values);
  return {
    kind: "solar",
    label: facts.night ? "today" : "sun",
    lead: sentence.lead,
    big: sentence.big,
    tail: sentence.tail,
    parts: keys.map((key, index) => ({ key, pct: percents[index] ?? 0 })),
  };
}

function gridCard(facts: StoryFacts): StoryCardModel | null {
  if (!facts.hasGrid && facts.importKwh == null) return null;
  const sentence = gridSentence(facts);
  if (!sentence || facts.importKwh == null) return null;
  return {
    kind: "grid",
    lead: sentence.lead,
    big: sentence.big,
    tail: sentence.tail,
    todayKwh: facts.importKwh,
    yesterdayKwh: facts.yesterdayImportKwh,
  };
}

function peakCard(facts: StoryFacts): StoryCardModel | null {
  const sentence = peakSentence(facts);
  if (!sentence) return null;
  const peakHour = Number(sentence.big.slice(0, 2));
  const maxLoad = Math.max(0.1, ...facts.hours.map((row) => row.loadKwh));
  const byHour = new Map(facts.hours.map((row) => [row.hour, row.loadKwh]));
  const bars = Array.from({ length: 24 }, (_, hour) => {
    const load = byHour.get(hour);
    const known = load != null;
    return {
      hour,
      height: known ? Math.max(6, Math.round((load / maxLoad) * 70)) : 6,
      peak: hour === peakHour,
      faded: !known || hour > Math.floor(facts.hour),
    };
  });
  return { kind: "peak", lead: sentence.lead, big: sentence.big, sub: sentence.sub, tail: sentence.tail, bars };
}

function batteryCard(facts: StoryFacts): StoryCardModel | null {
  const sentence = batterySentence(facts);
  if (!sentence || facts.soc == null) return null;
  return {
    kind: "battery",
    soc: Math.round(facts.soc),
    tail: sentence.tail,
    charging: facts.emptySinceHour == null && facts.chargeKw > 0.01,
  };
}

function deviceCard(facts: StoryFacts): StoryCardModel | null {
  if (facts.manualWithoutImport) return { kind: "link" };
  if (facts.devices.length === 0) {
    if (!facts.devicesKnown) return null;
    return { kind: "hint", mode: facts.hasDeviceConsumption ? "choose" : "setup" };
  }
  const sentence = deviceSentence(facts);
  if (!sentence) return null;
  const ranked = facts.devices
    .filter((device): device is typeof device & { kwh: number } => device.kwh != null && device.kwh > 0)
    .slice(0, MAX_DEVICE_ROWS);
  const widest = Math.max(sentence.topKwh, ...ranked.map((device) => device.kwh));
  return {
    kind: "devices",
    lead: sentence.lead,
    big: sentence.big,
    tail: sentence.tail,
    rows: ranked.map((device) => ({
      name: device.name,
      pct: widest > 0 ? Math.max(4, Math.round((device.kwh / widest) * 100)) : 4,
    })),
  };
}

function weekCard(facts: StoryFacts): StoryCardModel | null {
  const sentence = weekSentence(facts);
  if (!sentence) return null;
  return {
    kind: "week",
    lead: sentence.lead,
    big: sentence.big,
    tail: sentence.tail,
    days: facts.weekDays,
  };
}

/** Fixed order. The link card replaces every other card when nothing is linked. */
export function buildStoryCards(facts: StoryFacts): StoryCardModel[] {
  if (!facts.linked) return [{ kind: "link" }];
  const cards: Array<StoryCardModel | null> = [
    solarCard(facts),
    gridCard(facts),
    peakCard(facts),
    batteryCard(facts),
    deviceCard(facts),
    weekCard(facts),
  ];
  return cards.filter((card): card is StoryCardModel => card != null);
}

export function storyCardCount(cards: readonly StoryCardModel[]): number {
  return cards.length;
}
