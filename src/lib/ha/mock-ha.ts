/**
 * Local Home Assistant stand-in for energy prefs and statistics.
 * WebSocket and REST share one port. Tests bind port 0.
 * The access token is accepted and never written to the log or to a response.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, type WebSocket } from "ws";
import { advanceBucket, type EnergyBucket } from "../energy-time";
import { scaleEnergyToKwh, scaleVolumeToM3 } from "../energy-stats";

export const MOCK_HA_FIXTURE_SETS = ["full", "no-solar", "no-battery", "no-prefs", "fixed-tariff", "dynamic"] as const;
export type MockHaFixtureSet = (typeof MOCK_HA_FIXTURE_SETS)[number];

export type MockHaCall = {
  type: string;
  period?: string;
  statisticIds?: string[];
  units?: { energy?: string; volume?: string };
};

export type MockHaHandle = {
  baseUrl: string;
  port: number;
  calls: MockHaCall[];
  connections: number;
  close: () => Promise<void>;
};

export type MockHaOptions = {
  fixtureSet?: MockHaFixtureSet;
  timeZone?: string;
  port?: number;
  /** Reply only after this many websocket commands, so a sequential client deadlocks. */
  releaseAfter?: number;
  /** Accept the socket and never send auth_required. */
  silent?: boolean;
};

type StatisticMeta = {
  statistic_id: string;
  unit_class: string;
  unit_of_measurement: string;
};

const FIXTURE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "__fixtures__", "energy");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(path.join(FIXTURE_DIR, name), "utf8")) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function prefsForFixture(set: MockHaFixtureSet): Record<string, unknown> {
  const prefs = clone(readJson<Record<string, unknown>>("prefs-2026.3.json"));
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

function statisticCatalog(): StatisticMeta[] {
  return readJson<StatisticMeta[]>("statistic-ids.json");
}

function metaFor(id: string): StatisticMeta | undefined {
  return statisticCatalog().find((row) => row.statistic_id === id);
}

function nativeChange(id: string, period: string, startMs: number): number | null {
  if (id === "sensor.grid_import" && period !== "5minute" && new Date(startMs).getUTCHours() === 0) return null;
  const hourly = id === "sensor.solar_yield_mwh" ? 1.25 : 0.4;
  if (period === "5minute") return hourly / 12;
  if (period === "day") return hourly * 24;
  if (period === "month") return hourly * 24 * 30;
  return hourly;
}

function displayChange(id: string, value: number, units: { energy?: string; volume?: string } | undefined): number {
  const meta = metaFor(id);
  if (!meta) return value;
  if (units?.energy === "kWh" && meta.unit_class === "energy") return scaleEnergyToKwh(value, meta.unit_of_measurement);
  if ((units?.volume === "m³" || units?.volume === "m3") && meta.unit_class === "volume") {
    return scaleVolumeToM3(value, meta.unit_of_measurement);
  }
  return value;
}

function isPeriod(value: string): value is EnergyBucket {
  return value === "5minute" || value === "hour" || value === "day" || value === "month";
}

function statisticsRows(
  id: string,
  period: string,
  startIso: string,
  endIso: string,
  units: { energy?: string; volume?: string } | undefined,
  timeZone: string
): Array<Record<string, number>> {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (!Number.isFinite(start) || !Number.isFinite(end) || !isPeriod(period)) return [];
  const rows: Array<Record<string, number>> = [];
  let cursor = start;
  for (let guard = 0; guard < 5000 && cursor < end; guard += 1) {
    const next = advanceBucket(new Date(cursor), period, timeZone).getTime();
    if (next <= cursor) break;
    const row: Record<string, number> = { start: cursor, end: Math.min(next, end) };
    if (id.endsWith("_soc") || metaFor(id)?.unit_of_measurement === "%") {
      row.mean = 40;
    } else {
      const native = nativeChange(id, period, cursor);
      if (native != null) row.change = displayChange(id, native, units);
    }
    if ("change" in row || "mean" in row) rows.push(row);
    cursor = next;
  }
  return rows;
}

function resultFrame(id: number, result: unknown): string {
  return JSON.stringify({ id, type: "result", success: true, result });
}

function errorFrame(id: number, code: string, message: string): string {
  return JSON.stringify({ id, type: "result", success: false, error: { code, message } });
}

function unitsOf(value: unknown): { energy?: string; volume?: string } | undefined {
  if (!isRecord(value)) return undefined;
  const energy = typeof value.energy === "string" ? value.energy : undefined;
  const volume = typeof value.volume === "string" ? value.volume : undefined;
  return { energy, volume };
}

export function startMockHa(options: MockHaOptions = {}): Promise<MockHaHandle> {
  const fixtureSet = options.fixtureSet ?? "full";
  const timeZone = options.timeZone ?? "Europe/Amsterdam";
  const calls: MockHaCall[] = [];
  let connections = 0;
  const sockets = new Set<WebSocket>();

  const httpServer = createServer((request: IncomingMessage, response: ServerResponse) => {
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
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "not found" }));
  });

  const wss = new WebSocketServer({ server: httpServer, path: "/api/websocket" });
  wss.on("connection", (socket) => {
    connections += 1;
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
    if (options.silent) return;
    socket.send(JSON.stringify({ type: "auth_required" }));
    const waiting: Array<Record<string, unknown>> = [];
    const flush = (message: Record<string, unknown>) => {
      waiting.push(message);
      const needed = options.releaseAfter ?? 1;
      if (waiting.length < needed) return;
      const batch = waiting.splice(0, waiting.length);
      for (const item of batch) socket.send(reply(item));
    };
    socket.on("message", (raw) => {
      let message: Record<string, unknown>;
      try {
        const parsed = JSON.parse(raw.toString()) as unknown;
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
      const statisticIds = Array.isArray(message.statistic_ids)
        ? message.statistic_ids.filter((id): id is string => typeof id === "string")
        : undefined;
      calls.push({
        type: message.type,
        period: typeof message.period === "string" ? message.period : undefined,
        statisticIds,
        units: unitsOf(message.units),
      });
      flush(message);
    });
  });

  function reply(message: Record<string, unknown>): string {
    const id = typeof message.id === "number" ? message.id : 0;
    const type = typeof message.type === "string" ? message.type : "";
    if (type === "energy/get_prefs") {
      if (fixtureSet === "no-prefs") return errorFrame(id, "not_found", "No prefs");
      return resultFrame(id, prefsForFixture(fixtureSet));
    }
    if (type === "energy/info") {
      return resultFrame(id, { cost_sensors: {}, solar_forecast_domains: [] });
    }
    if (type === "recorder/list_statistic_ids") return resultFrame(id, statisticCatalog());
    if (type === "recorder/statistics_during_period") {
      const ids = Array.isArray(message.statistic_ids)
        ? message.statistic_ids.filter((item): item is string => typeof item === "string")
        : [];
      const period = typeof message.period === "string" ? message.period : "hour";
      const start = typeof message.start_time === "string" ? message.start_time : "";
      const end = typeof message.end_time === "string" ? message.end_time : "";
      const units = unitsOf(message.units);
      const table: Record<string, Array<Record<string, number>>> = {};
      for (const statisticId of ids) {
        table[statisticId] = statisticsRows(statisticId, period, start, end, units, timeZone);
      }
      return resultFrame(id, table);
    }
    return errorFrame(id, "unknown_command", "Unsupported command");
  }

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
        baseUrl: `http://127.0.0.1:${address.port}`,
        port: address.port,
        calls,
        get connections() {
          return connections;
        },
        close: async () => {
          for (const socket of sockets) socket.close();
          wss.close();
          await new Promise<void>((done) => httpServer.close(() => done()));
        },
      });
    });
  });
}

export async function listenMockHaFromEnv(): Promise<void> {
  const fixtureSet = parseFixtureSet(process.env.FIXTURE_SET);
  const port = Number(process.env.PORT ?? "8210");
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error("PORT must be a TCP port");
  }
  const handle = await startMockHa({ fixtureSet, port });
  process.stdout.write(`mock-ha ${fixtureSet} http://127.0.0.1:${handle.port}\n`);
}

function parseFixtureSet(value: string | undefined): MockHaFixtureSet {
  if (value && (MOCK_HA_FIXTURE_SETS as readonly string[]).includes(value)) return value as MockHaFixtureSet;
  return "full";
}
