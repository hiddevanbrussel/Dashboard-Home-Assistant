/**
 * Home Assistant REST API client. Use only on the server.
 */

export type HaRestConfig = {
  baseUrl: string;
  token: string;
};

function normalizeBaseUrl(baseUrl: string): string {
  const u = baseUrl.trim().replace(/\/+$/, "");
  return u;
}

async function haFetch(
  baseUrl: string,
  token: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${normalizeBaseUrl(baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
}

/**
 * Test connection: GET /api/ (returns "API running" when ok).
 */
export async function testConnection(config: HaRestConfig): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await haFetch(config.baseUrl, config.token, "/api/");
    if (!res.ok) {
      if (res.status === 401) return { ok: false, error: "Invalid token. Create a new Long-Lived Access Token in Home Assistant." };
      if (res.status === 404) return { ok: false, error: "API not found. Check the base URL and that Home Assistant is running." };
      return { ok: false, error: `Connection failed: ${res.status} ${res.statusText}` };
    }
    const text = await res.text();
    if (!text.toLowerCase().includes("api")) {
      return { ok: false, error: "Unexpected response from Home Assistant." };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("fetch failed") || message.includes("ECONNREFUSED")) {
      return { ok: false, error: "Cannot reach Home Assistant. Check base URL and network." };
    }
    if (message.includes("Mixed Content") || message.includes("HTTPS")) {
      return { ok: false, error: "Use HTTPS for the base URL or a reverse proxy to avoid mixed content." };
    }
    return { ok: false, error: message };
  }
}

export type HaEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
};

/**
 * Fetch all entity states: GET /api/states.
 */
export async function getEntities(config: HaRestConfig): Promise<HaEntity[]> {
  const res = await haFetch(config.baseUrl, config.token, "/api/states");
  if (!res.ok) {
    throw new Error(`Failed to fetch entities: ${res.status}`);
  }
  const data = (await res.json()) as HaEntity[];
  return Array.isArray(data) ? data : [];
}

export type HaArea = {
  area_id: string;
  name: string;
};

/**
 * Fetch area registry via WebSocket (HA has no REST endpoint for areas).
 * Uses config/area_registry/list over WebSocket.
 */
export async function getAreas(config: HaRestConfig): Promise<HaArea[]> {
  const { fetchAreasViaWebSocket } = await import("./websocket");
  const list = await fetchAreasViaWebSocket(config.baseUrl, config.token);
  return list.map((a) => ({ area_id: a.area_id, name: a.name }));
}

export type HaHistoryState = {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated?: string;
  attributes?: Record<string, unknown>;
};

/**
 * Fetch history for entities. Returns array of state arrays (one per entity).
 * GET /api/history/period?filter_entity_id=...&start_time=...&end_time=...
 */
export async function getHistory(
  config: HaRestConfig,
  entityIds: string[],
  startTime: string,
  endTime?: string
): Promise<HaHistoryState[][]> {
  const params = new URLSearchParams();
  params.set("filter_entity_id", entityIds.join(","));
  params.set("minimal_response", "1");
  params.set("end_time", endTime ?? new Date().toISOString());
  const path = `/api/history/period/${encodeURIComponent(startTime)}?${params.toString()}`;
  const res = await haFetch(config.baseUrl, config.token, path);
  if (!res.ok) {
    throw new Error(`Failed to fetch history: ${res.status}`);
  }
  const data = (await res.json()) as HaHistoryState[][];
  return Array.isArray(data) ? data : [];
}

/**
 * Call a Home Assistant service (e.g. light.toggle).
 */
export async function callService(
  config: HaRestConfig,
  domain: string,
  service: string,
  data: Record<string, unknown> = {}
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await haFetch(
      config.baseUrl,
      config.token,
      `/api/services/${domain}/${service}`,
      { method: "POST", body: JSON.stringify(data) }
    );
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || res.statusText };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
