import { precipitationIntensity, type SkyPhase, type SkyTheme } from "./weather-sky";
import type { SkyMode } from "./sky/sky-motion";

export const PLANE_LABEL_COLORS = {
  light: { text: "#404C62", border: "rgba(27,36,55,.08)", background: "rgba(247,250,253,.90)" },
  dark: { text: "rgba(255,255,255,.8)", border: "rgba(255,255,255,.12)", background: "rgba(18,24,38,.86)" },
} as const;

export type Flight = {
  id: string; callsign: string; aircraftCode: string; altitude?: number;
  heading: number; groundSpeed: number; verticalSpeed: number;
};
export type PlaneSensor = { entity_id: string; state?: string; attributes?: Record<string, unknown> };
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const number = (value: unknown): number | undefined => {
  if (value == null || value === "" || (typeof value !== "string" && typeof value !== "number")) return;
  const n = Number(value); return Number.isFinite(n) ? n : undefined;
};
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
export function parseFlights(sensor?: PlaneSensor): Flight[] {
  if (!sensor || ["unknown", "unavailable"].includes(sensor.state ?? "unknown") || !Array.isArray(sensor.attributes?.flights)) return [];
  const flights: Flight[] = []; const ids = new Set<string>();
  for (const item of sensor.attributes.flights) {
    if (!item || typeof item !== "object") continue;
    const f = item as Record<string, unknown>; const id = text(f.id);
    const altitude = number(f.altitude);
    if (!id || ids.has(id) || number(f.on_ground) === 1 || (altitude != null && altitude <= 500) || text(f.tracked_type).toLowerCase() === "scheduled") continue;
    ids.add(id);
    flights.push({ id, callsign: text(f.callsign) || text(f.flight_number), aircraftCode: text(f.aircraft_code).toUpperCase(), altitude,
      heading: number(f.heading) ?? 90, groundSpeed: number(f.ground_speed) ?? 420, verticalSpeed: number(f.vertical_speed) ?? 0 });
  }
  return flights;
}
export function flightHash(id: string): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) hash = Math.imul(hash ^ id.charCodeAt(i), 16777619);
  return hash >>> 0;
}
export function planeLabel(flight: Flight): string {
  const label = [flight.callsign, flight.aircraftCode].filter(Boolean).join(" · ");
  return label.length > 18 ? label.slice(0, 17) + "…" : label;
}
export function planeSilhouette(code: string): "smal" | "breed" | "klein" {
  const c = code.trim().toUpperCase();
  if (/^(B7[4678].|A3[3458].|MD11$|IL96$)/.test(c)) return "breed";
  if (/^(AT[47].|DH8.|C1..|PA..|SR2.|BE20$|PC12$|E1[0-8]\d|E75[SL]$|EC|AS|BK|H[0-9]|R44|B06|A13|A16|S76|AW)/.test(c)) return "klein";
  return "smal";
}
export function planeWeather(condition: string, precipitation: number) {
  const state = condition.trim().toLowerCase();
  const intensity = precipitationIntensity(precipitation, state);
  const chance = ["sunny", "clear-night", "partlycloudy", "windy", "windy-variant"].includes(state) ? 100
    : state === "cloudy" ? 60 : (state === "rainy" && intensity !== "heavy") || (state === "snowy" && intensity === "light") ? 70 : 0;
  return { chance, contrail: ["sunny", "partlycloudy", "clear"].includes(state) };
}
export function planeAllowed(flight: Flight, condition: string, precipitation: number): boolean {
  return flightHash(flight.id) % 100 < planeWeather(condition, precipitation).chance;
}
export function planeGeometry(flight: Flight, width: number, height: number, compact: boolean) {
  const radians = flight.heading * Math.PI / 180;
  const eastbound = Math.abs(Math.sin(radians)) <= Math.sin(Math.PI / 12) + 1e-12 ? flightHash(flight.id) % 2 === 0 : Math.sin(radians) >= 0;
  const altitude = flight.altitude ?? 3000;
  const scale = flight.altitude == null ? 1 : clamp(1 - (altitude - 3000) / 33000 * 0.35, 0.65, 1);
  const silhouette = planeSilhouette(flight.aircraftCode);
  const length = ({ smal: 60, breed: 74, klein: 40 }[silhouette]) * scale * (compact ? 0.85 : 1);
  const low = compact ? 0.14 : 0.12, high = compact ? 0.28 : 0.26;
  const lane = high - (high - low) * clamp(altitude / 36000, 0, 1);
  const slope = -Math.cos(radians) * 6;
  const pitch = clamp(slope + (flight.verticalSpeed > 500 ? 3 : flight.verticalSpeed < -500 ? -3 : 0), -9, 9);
  const startX = eastbound ? -length / 2 : width + length / 2;
  const endX = eastbound ? width + length / 2 : -length / 2;
  const deltaY = Math.tan(slope * Math.PI / 180) * (endX - startX);
  const centreY = lane * height;
  return { eastbound, scale, silhouette, length, lane, pitch, startX, endX,
    startY: centreY - deltaY / 2, endY: centreY + deltaY / 2,
    duration: clamp(16 * 420 / Math.max(1, flight.groundSpeed), 10, 24) * Math.sqrt(width / 320) };
}
export function planePalette(phase: SkyPhase, theme: SkyTheme) {
  const dark = theme === "dark", night = phase === "night", twilight = phase === "dawn" || phase === "dusk";
  const top = twilight ? dark ? "#C9C2CF" : "#FFF6F0" : dark ? "#E4EAF3" : "#FFFFFF";
  const under = twilight ? dark ? "#9F8E99" : "#E9C6B4" : dark ? "#8E9DB4" : "#9FB0C6";
  return { top, under, opacity: night ? dark ? 0.30 : 0.42 : dark && !twilight ? 0.85 : 1,
    trail: twilight ? dark ? "rgba(230,200,205,.32)" : "rgba(255,236,228,.7)" : dark ? "rgba(255,255,255,.32)" : "rgba(255,255,255,.7)" };
}
export function planeContrailLength(width: number, scale: number) { return Math.min(.42 * width, 140) * scale; }
export function planeContrail(flight: Flight, condition: string, precipitation: number, phase: SkyPhase) {
  return phase !== "night" && (flight.altitude ?? 0) >= 25000 && planeWeather(condition, precipitation).contrail;
}
export function planeLabelAllowed(height: number, stacked: boolean) { return height >= 184 && !stacked; }
const inArea = (s: PlaneSensor) => /^sensor\..*flightradar24.*current_in_area/.test(s.entity_id);
export function planeSensors(sensors: PlaneSensor[]) {
  return sensors.filter(s => s.entity_id.startsWith("sensor.") && Array.isArray(s.attributes?.flights))
    .sort((a, b) => Number(inArea(b)) - Number(inArea(a)) || a.entity_id.localeCompare(b.entity_id));
}
export function planeCandidates(sensors: PlaneSensor[]) {
  const named = sensors.filter(inArea);
  return named.length ? named : sensors.filter(s => s.entity_id.startsWith("sensor.") && Array.isArray(s.attributes?.flights) && Object.hasOwn(s.attributes ?? {}, "bounds"));
}
export function resolvePlaneOptions(options: { show_planes?: boolean; planes_entity_id?: string }, sensors: PlaneSensor[]) {
  if (options.show_planes !== undefined || options.planes_entity_id !== undefined) return { show_planes: options.show_planes === true, planes_entity_id: options.planes_entity_id ?? "" };
  const candidates = planeCandidates(sensors);
  return { show_planes: candidates.length === 1, planes_entity_id: candidates.length === 1 ? candidates[0].entity_id : "" };
}
export type PlaneClock = { now: () => number; setTimeout: (fn: () => void, ms: number) => unknown; clearTimeout: (id: unknown) => void };
export type PlanePolicy = { calm?: boolean; mode: SkyMode; performanceStep: number; paused: boolean; visible?: boolean; compact: boolean; stacked: boolean; condition: string; precipitation: number };
/** No frame loop: one wake-up timer, state updates and animation finish events. */
export function createPlanePlanner(clock: PlaneClock, events: { start: (flight: Flight) => void; remove: (id: string, fade: boolean, duration?: number, reason?: "pause") => void }) {
  let policy: PlanePolicy = { mode: "static", performanceStep: 0, paused: true, compact: false, stacked: false, condition: "sunny", precipitation: 0 };
  let previous = new Set<string>(), cache = new Map<string, number>();
  let queue: { flight: Flight; expires: number; due: number } | undefined;
  let timer: unknown, first = true, pausedAt: number | undefined, lastStart = -Infinity;
  let starts: number[] = [];
  const active = new Map<string, Flight>();
  const retiring = new Map<string, number>();
  const clearTimer = () => { if (timer != null) clock.clearTimeout(timer); timer = undefined; };
  const prune = () => { const now = clock.now(); for (const [id, time] of cache) if (now - time >= 1800000) cache.delete(id); starts = starts.filter(t => now - t < 3600000); };
  const remember = (id: string) => { if (!cache.has(id)) cache.set(id, clock.now()); while (cache.size > 50) cache.delete(cache.keys().next().value!); };
  const retire = (id: string, duration = 1500, reason?: "pause") => { if (!retiring.has(id) || duration < retiring.get(id)!) { retiring.set(id, duration); if (reason) events.remove(id, true, duration, reason); else events.remove(id, true, duration); } };
  const removeAll = (fade: boolean, duration = 1500, reason?: "pause") => {
    for (const id of active.keys()) { if (fade) retire(id, duration, reason); else events.remove(id, false); }
    if (!fade) { active.clear(); retiring.clear(); }
  };
  const longPause = () => { queue = undefined; first = false; removeAll(policy.visible === true, 300, "pause"); };
  const pump = () => {
    clearTimer(); prune(); const now = clock.now();
    if (policy.mode === "static" || policy.performanceStep >= 2) { queue = undefined; removeAll(false); return; }
    if (policy.paused) {
      if (pausedAt != null && now - pausedAt > 5000) longPause();
      else if (pausedAt != null) timer = clock.setTimeout(pump, 5001 - (now - pausedAt));
      return;
    }
    if (queue && now >= queue.expires) queue = undefined;
    if (!queue) return;
    if (!planeAllowed(queue.flight, policy.condition, policy.precipitation)) { queue = undefined; return; }
    // Strict spacing and one active crossing also cover unusually long passes.
    const due = Math.max(queue.due, lastStart + ((policy.calm ?? policy.mode === "animated-calm") ? 300000 : 90000), starts.length >= 12 ? starts[0] + 3600000 : 0);
    if (now >= due && active.size === 0) {
      const flight = queue.flight; queue = undefined; lastStart = now; starts.push(now); remember(flight.id); active.set(flight.id, flight); events.start(flight);
    } else timer = clock.setTimeout(pump, Math.max(1, Math.min(queue.expires, due > now ? due : queue.expires) - now));
  };
  return {
    updatePolicy(next: PlanePolicy) {
      if (next.paused && pausedAt == null) pausedAt = clock.now();
      if (!next.paused && policy.paused) { if (pausedAt != null && clock.now() - pausedAt > 5000) longPause(); pausedAt = undefined; }
      policy = next;
      for (const [id, flight] of active) if (!planeAllowed(flight, next.condition, next.precipitation)) { retire(id); }
      pump();
    },
    updateSensor(sensor?: PlaneSensor) {
      prune(); const flights = parseFlights(sensor); const now = clock.now();
      const valid = sensor && !["unknown", "unavailable"].includes(sensor.state ?? "unknown");
      if (!valid) { queue = undefined; removeAll(true); previous = new Set(); pump(); return; }
      const fresh = flights.filter(f => !previous.has(f.id) && !cache.has(f.id));
      previous = new Set(flights.map(f => f.id));
      for (const f of flights) remember(f.id);
      const eligible = (first ? flights : fresh).find(f => planeAllowed(f, policy.condition, policy.precipitation));
      if (eligible && (!policy.paused || first) && policy.mode !== "static" && !queue) queue = { flight: eligible, due: now + (first ? 3000 : 0), expires: now + 60000 };
      first = false; pump();
    },
    finish(id: string) { active.delete(id); retiring.delete(id); pump(); },
    dispose() { clearTimer(); queue = undefined; active.clear(); retiring.clear(); },
    inspect: () => ({ cache: [...cache.keys()], queued: queue?.flight.id, active: [...active.keys()], starts: [...starts] }),
  };
}
