/**
 * Dev-only Home Assistant stand-in for Node 20 (CI and Docker).
 *   PORT=8210 FIXTURE_SET=full|no-solar|no-battery|no-prefs|fixed-tariff|dynamic node scripts/mock-ha.mjs
 * Reads the JSON fixtures under src/lib/ha/__fixtures__/energy. Does not import TypeScript.
 * Does not log the access token.
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const FIXTURE_SETS = ["full", "no-solar", "no-battery", "no-prefs", "fixed-tariff", "dynamic"];
const FIXTURE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/lib/ha/__fixtures__/energy");
const FALLBACK_TIME_ZONE = "Europe/Amsterdam";

const PART_OPTIONS = {
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
};

const formatters = new Map();

function readJson(name) {
  return JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), "utf8"));
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isValidTimeZone(timeZone) {
  try {
    Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function zoneOf(timeZone) {
  const trimmed = timeZone.trim();
  return trimmed && isValidTimeZone(trimmed) ? trimmed : FALLBACK_TIME_ZONE;
}

function formatter(timeZone) {
  const cached = formatters.get(timeZone);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat("en-US", { ...PART_OPTIONS, timeZone });
  formatters.set(timeZone, created);
  return created;
}

function readPart(parts, type) {
  const value = parts.find((part) => part.type === type)?.value;
  if (!value) throw new Error(`Could not resolve ${type}`);
  return Number(value);
}

function zonedParts(date, timeZone) {
  const parts = formatter(timeZone).formatToParts(date);
  let hour = readPart(parts, "hour");
  if (hour === 24) hour = 0;
  return {
    year: readPart(parts, "year"),
    month: readPart(parts, "month"),
    day: readPart(parts, "day"),
    hour,
    minute: readPart(parts, "minute"),
    second: readPart(parts, "second"),
  };
}

function localDateKey(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).formatToParts(date);
  return `${readPart(parts, "year")}-${String(readPart(parts, "month")).padStart(2, "0")}-${String(readPart(parts, "day")).padStart(2, "0")}`;
}

function offsetMs(instant, timeZone) {
  const parts = zonedParts(instant, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - instant.getTime();
}

function zonedDateTime(year, month, day, hour, minute, second, timeZone) {
  const normalized = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const y = normalized.getUTCFullYear();
  const m = normalized.getUTCMonth() + 1;
  const d = normalized.getUTCDate();
  const h = normalized.getUTCHours();
  const min = normalized.getUTCMinutes();
  const s = normalized.getUTCSeconds();
  const guess = Date.UTC(y, m - 1, d, h, min, s);
  const first = offsetMs(new Date(guess), timeZone);
  let instant = guess - first;
  const secondOffset = offsetMs(new Date(instant), timeZone);
  if (secondOffset !== first) instant = guess - secondOffset;
  return new Date(instant);
}

function zonedMidnight(date, timeZone) {
  const zone = zoneOf(timeZone);
  const key = localDateKey(date, zone);
  const [year, month, day] = key.split("-").map(Number);
  return zonedDateTime(year, month, day, 0, 0, 0, zone);
}

function addZonedDays(date, days, timeZone) {
  const zone = zoneOf(timeZone);
  const parts = zonedParts(date, zone);
  return zonedDateTime(parts.year, parts.month, parts.day + days, parts.hour, parts.minute, parts.second, zone);
}

function addZonedMonths(date, months, timeZone) {
  const zone = zoneOf(timeZone);
  const parts = zonedParts(date, zone);
  const anchor = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1));
  const year = anchor.getUTCFullYear();
  const month = anchor.getUTCMonth() + 1;
  const dim = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(parts.day, dim);
  return zonedDateTime(year, month, day, parts.hour, parts.minute, parts.second, zone);
}

function zonedMonthStart(date, timeZone) {
  const parts = zonedParts(zonedMidnight(date, timeZone), timeZone);
  return zonedDateTime(parts.year, parts.month, 1, 0, 0, 0, timeZone);
}

function advanceBucket(start, period, timeZone) {
  const zone = zoneOf(timeZone);
  if (period === "5minute") return new Date(start.getTime() + 5 * 60 * 1000);
  if (period === "hour") return new Date(start.getTime() + 60 * 60 * 1000);
  if (period === "day") return addZonedDays(zonedMidnight(start, zone), 1, zone);
  if (period === "month") return addZonedMonths(zonedMonthStart(start, zone), 1, zone);
  return new Date(start.getTime() + 60 * 60 * 1000);
}

function scaleEnergyToKwh(value, unit) {
  const key = (unit ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (key === "wh") return value / 1000;
  if (key === "mwh") return value * 1000;
  if (key === "gwh") return value * 1_000_000;
  return value;
}

function scaleVolumeToM3(value, unit) {
  const key = (unit ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (key === "l" || key === "liter" || key === "litre" || key === "liters" || key === "litres") return value / 1000;
  return value;
}

function prefsForFixture(set) {
  const prefs = clone(readJson("prefs-2026.3.json"));
  const sources = Array.isArray(prefs.energy_sources) ? prefs.energy_sources.filter(isRecord) : [];
  if (set === "no-solar") prefs.energy_sources = sources.filter((source) => source.type !== "solar");
  if (set === "no-battery") prefs.energy_sources = sources.filter((source) => source.type !== "battery");
  if (set === "fixed-tariff" || set === "dynamic") {
    prefs.energy_sources = sources.map((source) => {
      if (source.type !== "grid") return source;
      if (set === "fixed-tariff") {
        return {
          ...source,
          entity_energy_price: null,
          number_energy_price: 0.4,
          entity_energy_price_export: null,
          number_energy_price_export: 0.08,
        };
      }
      return {
        ...source,
        entity_energy_price: "sensor.energy_price",
        number_energy_price: null,
        entity_energy_price_export: "sensor.energy_price_export",
        number_energy_price_export: null,
      };
    });
  }
  return prefs;
}

function statisticCatalog() {
  return readJson("statistic-ids.json");
}

function metaFor(id) {
  return statisticCatalog().find((row) => row.statistic_id === id);
}

function nativeChange(id, period, startMs) {
  if (id === "sensor.grid_import" && period !== "5minute" && new Date(startMs).getUTCHours() === 0) return null;
  const hourly = id === "sensor.solar_yield_mwh" ? 1.25 : 0.4;
  if (period === "5minute") return hourly / 12;
  if (period === "day") return hourly * 24;
  if (period === "month") return hourly * 24 * 30;
  return hourly;
}

function displayChange(id, value, units) {
  const meta = metaFor(id);
  if (!meta) return value;
  if (units?.energy === "kWh" && meta.unit_class === "energy") return scaleEnergyToKwh(value, meta.unit_of_measurement);
  if ((units?.volume === "m³" || units?.volume === "m3") && meta.unit_class === "volume") {
    return scaleVolumeToM3(value, meta.unit_of_measurement);
  }
  return value;
}

function isPeriod(value) {
  return value === "5minute" || value === "hour" || value === "day" || value === "month";
}

function statisticsRows(id, period, startIso, endIso, units, timeZone) {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (!Number.isFinite(start) || !Number.isFinite(end) || !isPeriod(period)) return [];
  const rows = [];
  let cursor = start;
  for (let guard = 0; guard < 5000 && cursor < end; guard += 1) {
    const next = advanceBucket(new Date(cursor), period, timeZone).getTime();
    if (next <= cursor) break;
    const row = { start: cursor, end: Math.min(next, end) };
    if (id.endsWith("_soc") || metaFor(id)?.unit_of_measurement === "%") row.mean = 40;
    else {
      const native = nativeChange(id, period, cursor);
      if (native != null) row.change = displayChange(id, native, units);
    }
    if ("change" in row || "mean" in row) rows.push(row);
    cursor = next;
  }
  return rows;
}

function resultFrame(id, result) {
  return JSON.stringify({ id, type: "result", success: true, result });
}

function errorFrame(id, code, message) {
  return JSON.stringify({ id, type: "result", success: false, error: { code, message } });
}

function unitsOf(value) {
  if (!isRecord(value)) return undefined;
  return {
    energy: typeof value.energy === "string" ? value.energy : undefined,
    volume: typeof value.volume === "string" ? value.volume : undefined,
  };
}

function parseFixtureSet(value) {
  if (value && FIXTURE_SETS.includes(value)) return value;
  return "full";
}

function titleFromId(id) {
  const slug = id.replace(/^sensor\./, "").replace(/_/g, " ");
  return slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : id;
}

function energyState(id, name, unit) {
  return {
    entity_id: id,
    state: "0",
    attributes: {
      friendly_name: name,
      device_class: "energy",
      state_class: "total_increasing",
      unit_of_measurement: unit || "kWh",
    },
  };
}

/** REST states for the active fixture. device_consumption sensors keep their prefs name. */
function statesForFixture(set) {
  const states = [];
  const seen = new Set();
  if (set !== "no-prefs") {
    const prefs = prefsForFixture(set);
    const devices = Array.isArray(prefs.device_consumption) ? prefs.device_consumption : [];
    for (const device of devices) {
      if (!isRecord(device) || typeof device.stat_consumption !== "string") continue;
      const id = device.stat_consumption.trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const name = typeof device.name === "string" && device.name.trim() ? device.name.trim() : titleFromId(id);
      states.push(energyState(id, name, "kWh"));
    }
  }
  for (const row of statisticCatalog()) {
    if (!isRecord(row) || row.unit_class !== "energy" || typeof row.statistic_id !== "string") continue;
    if (seen.has(row.statistic_id)) continue;
    seen.add(row.statistic_id);
    const unit = typeof row.unit_of_measurement === "string" ? row.unit_of_measurement : "kWh";
    states.push(energyState(row.statistic_id, titleFromId(row.statistic_id), unit));
  }
  return states;
}

function startMockHa(options = {}) {
  const fixtureSet = options.fixtureSet ?? "full";
  const timeZone = options.timeZone ?? "Europe/Amsterdam";
  const sockets = new Set();

  const states = statesForFixture(fixtureSet);

  const httpServer = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/api/config") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ time_zone: timeZone, version: "2026.10.0" }));
      return;
    }
    if (request.method === "GET" && (url.pathname === "/api/" || url.pathname === "/api")) {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end("API running.");
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/states") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(states));
      return;
    }
    if (request.method === "GET" && url.pathname.startsWith("/api/states/")) {
      const entityId = decodeURIComponent(url.pathname.slice("/api/states/".length));
      const found = states.find((item) => item.entity_id === entityId);
      if (!found) {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "not found" }));
        return;
      }
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(found));
      return;
    }
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "not found" }));
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/api/websocket" });

  function reply(message) {
    const id = typeof message.id === "number" ? message.id : 0;
    const type = typeof message.type === "string" ? message.type : "";
    if (type === "energy/get_prefs") {
      if (fixtureSet === "no-prefs") return errorFrame(id, "not_found", "No prefs");
      return resultFrame(id, prefsForFixture(fixtureSet));
    }
    if (type === "energy/info") return resultFrame(id, { cost_sensors: {}, solar_forecast_domains: [] });
    if (type === "recorder/list_statistic_ids") return resultFrame(id, statisticCatalog());
    if (type === "recorder/statistics_during_period") {
      const ids = Array.isArray(message.statistic_ids) ? message.statistic_ids.filter((item) => typeof item === "string") : [];
      const period = typeof message.period === "string" ? message.period : "hour";
      const start = typeof message.start_time === "string" ? message.start_time : "";
      const end = typeof message.end_time === "string" ? message.end_time : "";
      const units = unitsOf(message.units);
      const table = {};
      for (const statisticId of ids) table[statisticId] = statisticsRows(statisticId, period, start, end, units, timeZone);
      return resultFrame(id, table);
    }
    return errorFrame(id, "unknown_command", "Unsupported command");
  }

  wss.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    socket.send(JSON.stringify({ type: "auth_required" }));
    socket.on("message", (raw) => {
      let message;
      try {
        const parsed = JSON.parse(raw.toString());
        if (!isRecord(parsed)) return;
        message = parsed;
      } catch {
        return;
      }
      if (message.type === "auth") {
        socket.send(JSON.stringify({ type: "auth_ok" }));
        return;
      }
      if (typeof message.type !== "string") return;
      socket.send(reply(message));
    });
  });

  const port = options.port ?? 0;
  return new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, "127.0.0.1", () => {
      const address = httpServer.address();
      if (!address || typeof address === "string") {
        reject(new Error("Mock Home Assistant did not bind a port"));
        return;
      }
      resolve({
        port: address.port,
        close: async () => {
          for (const socket of sockets) socket.close();
          wss.close();
          await new Promise((done) => httpServer.close(() => done()));
        },
      });
    });
  });
}

const fixtureSet = parseFixtureSet(process.env.FIXTURE_SET);
const port = Number(process.env.PORT ?? "8210");
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("PORT must be a TCP port");
}
const handle = await startMockHa({ fixtureSet, port });
process.stdout.write(`mock-ha ${fixtureSet} http://127.0.0.1:${handle.port}\n`);
