/**
 * Home Assistant Assist pipeline helpers. Server-side only.
 */

import type { HaRestConfig } from "./rest";

export type AssistPipeline = {
  id: string;
  name: string;
  language: string;
  conversation_engine?: string;
  stt_engine?: string | null;
  tts_engine?: string | null;
};

export type AssistPipelineList = {
  pipelines: AssistPipeline[];
  preferred_pipeline: string | null;
};

export type AssistRunResult = {
  transcript: string | null;
  speech: string | null;
  conversationId: string | null;
  ttsUrl: string | null;
  error: string | null;
};

type HaWsJson =
  | { type: "auth_required" }
  | { type: "auth_ok" }
  | { type: "auth_invalid"; message?: string }
  | { type: "result"; id: number; success: boolean; result?: unknown; error?: { code?: string; message?: string } }
  | { type: "event"; id: number; event?: { type?: string; data?: Record<string, unknown> } };

function getWsUrl(baseUrl: string): string {
  const u = baseUrl.trim().replace(/\/+$/, "");
  return u.replace(/^http/, "ws") + "/api/websocket";
}

export function parsePipelineList(raw: unknown): AssistPipelineList {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const list = Array.isArray(obj.pipelines) ? obj.pipelines : [];
  const pipelines = list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const p = item as Record<string, unknown>;
      const id = typeof p.id === "string" ? p.id : "";
      if (!id) return null;
      return {
        id,
        name: typeof p.name === "string" && p.name.trim() ? p.name : id,
        language: typeof p.language === "string" ? p.language : "",
        conversation_engine: typeof p.conversation_engine === "string" ? p.conversation_engine : undefined,
        stt_engine: typeof p.stt_engine === "string" ? p.stt_engine : p.stt_engine === null ? null : undefined,
        tts_engine: typeof p.tts_engine === "string" ? p.tts_engine : p.tts_engine === null ? null : undefined,
      } satisfies AssistPipeline;
    })
    .filter((p): p is AssistPipeline => p != null);
  const preferred = typeof obj.preferred_pipeline === "string" ? obj.preferred_pipeline : null;
  return { pipelines, preferred_pipeline: preferred };
}

export function speechFromIntentOutput(output: unknown): string | null {
  if (!output || typeof output !== "object") return null;
  const response = (output as { response?: unknown }).response;
  if (!response || typeof response !== "object") return null;
  const speech = (response as { speech?: unknown }).speech;
  if (!speech || typeof speech !== "object") return null;
  const plain = (speech as { plain?: unknown }).plain;
  if (plain && typeof plain === "object") {
    const text = (plain as { speech?: unknown }).speech;
    if (typeof text === "string" && text.trim()) return text.trim();
  }
  const extra = (speech as { extra_data?: { wav_file?: unknown } }).extra_data;
  if (extra && typeof extra === "object") return null;
  return null;
}

export function conversationIdFromIntentOutput(output: unknown): string | null {
  if (!output || typeof output !== "object") return null;
  const id = (output as { conversation_id?: unknown }).conversation_id;
  return typeof id === "string" && id.trim() ? id : null;
}

export function transcriptFromSttOutput(output: unknown): string | null {
  if (!output || typeof output !== "object") return null;
  const text = (output as { text?: unknown }).text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

export function ttsUrlFromOutput(output: unknown): string | null {
  if (!output || typeof output !== "object") return null;
  const url = (output as { url?: unknown }).url;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

export function isAllowedHaMediaUrl(baseUrl: string, mediaUrl: string): boolean {
  try {
    const base = new URL(baseUrl);
    const media = new URL(mediaUrl, base);
    return media.origin === base.origin && media.pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

export function assistTtsProxyHref(ttsUrl: string | null | undefined): string | null {
  if (!ttsUrl || !ttsUrl.trim()) return null;
  return `/api/ha/assist/tts?url=${encodeURIComponent(ttsUrl.trim())}`;
}

export function emptyAssistResult(error: string | null = null): AssistRunResult {
  return { transcript: null, speech: null, conversationId: null, ttsUrl: null, error };
}

function applyPipelineEvent(result: AssistRunResult, type: string, data: Record<string, unknown> | undefined): void {
  if (!data) return;
  if (type === "stt-end") {
    result.transcript = transcriptFromSttOutput(data.stt_output) ?? result.transcript;
  }
  if (type === "intent-end") {
    result.speech = speechFromIntentOutput(data.intent_output) ?? result.speech;
    result.conversationId = conversationIdFromIntentOutput(data.intent_output) ?? result.conversationId;
  }
  if (type === "tts-end") {
    result.ttsUrl = ttsUrlFromOutput(data.tts_output) ?? result.ttsUrl;
  }
  if (type === "error") {
    const message = typeof data.message === "string" ? data.message : "Assist pipeline error";
    result.error = message;
  }
}

type PipelineEvent = { type: string; data?: Record<string, unknown> };

type WsSession = {
  sendJson: (payload: Record<string, unknown>) => number;
  sendBinary: (buf: Buffer) => void;
  waitResult: (id: number) => Promise<unknown>;
  waitUntil: (id: number, until: (type: string, data?: Record<string, unknown>) => boolean) => Promise<PipelineEvent[]>;
  close: () => void;
};

async function openHaAssistSocket(config: HaRestConfig, timeoutMs = 45000): Promise<WsSession> {
  const WebSocket = (await import("ws")).default;
  const ws = new WebSocket(getWsUrl(config.baseUrl));
  let nextId = 1;
  const results = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  const eventsById = new Map<number, PipelineEvent[]>();
  const eventWaiters = new Map<
    number,
    { resolve: () => void; reject: (e: Error) => void; until: (type: string, data?: Record<string, unknown>) => boolean }
  >();

  const timeout = setTimeout(() => {
    ws.close();
    const err = new Error("Assist WebSocket timeout");
    results.forEach((p) => p.reject(err));
    eventWaiters.forEach((p) => p.reject(err));
  }, timeoutMs);

  function pushEvent(id: number, event: PipelineEvent) {
    const list = eventsById.get(id) ?? [];
    list.push(event);
    eventsById.set(id, list);
    const waiter = eventWaiters.get(id);
    if (!waiter) return;
    try {
      if (waiter.until(event.type, event.data)) {
        eventWaiters.delete(id);
        waiter.resolve();
      }
    } catch (err) {
      eventWaiters.delete(id);
      waiter.reject(err instanceof Error ? err : new Error(String(err)));
    }
  }

  await new Promise<void>((resolve, reject) => {
    ws.on("error", (err: Error) => reject(err));
    ws.once("close", () => reject(new Error("WebSocket closed")));
    ws.on("message", (raw: Buffer | string) => {
      let msg: HaWsJson;
      try {
        msg = JSON.parse(raw.toString()) as HaWsJson;
      } catch {
        return;
      }
      if (msg.type === "auth_required") {
        ws.send(JSON.stringify({ type: "auth", access_token: config.token }));
        return;
      }
      if (msg.type === "auth_ok") {
        resolve();
        return;
      }
      if (msg.type === "auth_invalid") {
        reject(new Error(msg.message ?? "WebSocket auth failed"));
        return;
      }
      if (msg.type === "result") {
        const pending = results.get(msg.id);
        if (!pending) return;
        results.delete(msg.id);
        if (!msg.success) {
          pending.reject(new Error(msg.error?.message ?? "Assist command failed"));
          return;
        }
        pending.resolve(msg.result);
        return;
      }
      if (msg.type === "event" && msg.event) {
        pushEvent(msg.id, { type: msg.event.type ?? "", data: msg.event.data });
      }
    });
  });

  return {
    sendJson(payload) {
      const id = nextId++;
      eventsById.set(id, []);
      ws.send(JSON.stringify({ id, ...payload }));
      return id;
    },
    sendBinary(buf) {
      ws.send(buf, { binary: true });
    },
    waitResult(id) {
      return new Promise((resolve, reject) => {
        results.set(id, { resolve, reject });
      });
    },
    async waitUntil(id, until) {
      const already = eventsById.get(id) ?? [];
      if (already.some((event) => until(event.type, event.data))) return already;
      await new Promise<void>((resolve, reject) => {
        eventWaiters.set(id, { resolve, reject, until });
      });
      return eventsById.get(id) ?? [];
    },
    close() {
      clearTimeout(timeout);
      ws.close();
    },
  };
}

export async function listAssistPipelines(config: HaRestConfig): Promise<AssistPipelineList> {
  const session = await openHaAssistSocket(config, 15000);
  try {
    const id = session.sendJson({ type: "assist_pipeline/pipeline/list" });
    const raw = await session.waitResult(id);
    return parsePipelineList(raw);
  } finally {
    session.close();
  }
}

export async function runAssistText(
  config: HaRestConfig,
  input: { text: string; pipeline?: string | null; conversationId?: string | null }
): Promise<AssistRunResult> {
  const text = input.text.trim();
  if (!text) return emptyAssistResult("Empty text");
  const result = emptyAssistResult();
  const session = await openHaAssistSocket(config);
  try {
    const id = session.sendJson({
      type: "assist_pipeline/run",
      start_stage: "intent",
      end_stage: "tts",
      input: { text },
      ...(input.pipeline ? { pipeline: input.pipeline } : {}),
      ...(input.conversationId ? { conversation_id: input.conversationId } : {}),
    });
    await session.waitResult(id);
    const events = await session.waitUntil(id, (type) => type === "run-end" || type === "error");
    for (const event of events) applyPipelineEvent(result, event.type, event.data);
    return result;
  } finally {
    session.close();
  }
}

export async function runAssistAudio(
  config: HaRestConfig,
  input: {
    pcm: Buffer;
    sampleRate?: number;
    pipeline?: string | null;
    conversationId?: string | null;
  }
): Promise<AssistRunResult> {
  if (!input.pcm.length) return emptyAssistResult("Empty audio");
  const sampleRate = input.sampleRate && input.sampleRate > 0 ? input.sampleRate : 16000;
  const result = emptyAssistResult();
  const session = await openHaAssistSocket(config);
  try {
    const id = session.sendJson({
      type: "assist_pipeline/run",
      start_stage: "stt",
      end_stage: "tts",
      input: { sample_rate: sampleRate },
      ...(input.pipeline ? { pipeline: input.pipeline } : {}),
      ...(input.conversationId ? { conversation_id: input.conversationId } : {}),
    });
    await session.waitResult(id);

    const started = await session.waitUntil(id, (type) => type === "run-start" || type === "error");
    for (const event of started) applyPipelineEvent(result, event.type, event.data);
    if (result.error) return result;
    const runStart = started.find((event) => event.type === "run-start");
    const runner = runStart?.data?.runner_data;
    const handlerId =
      runner && typeof runner === "object"
        ? (runner as { stt_binary_handler_id?: unknown }).stt_binary_handler_id
        : undefined;
    if (typeof handlerId !== "number") return emptyAssistResult("Assist pipeline did not start speech-to-text");

    const chunkSize = 8192;
    for (let offset = 0; offset < input.pcm.length; offset += chunkSize) {
      const slice = input.pcm.subarray(offset, offset + chunkSize);
      session.sendBinary(Buffer.concat([Buffer.from([handlerId]), slice]));
    }
    session.sendBinary(Buffer.from([handlerId]));

    const finished = await session.waitUntil(id, (type) => type === "run-end" || type === "error");
    for (const event of finished) applyPipelineEvent(result, event.type, event.data);
    return result;
  } finally {
    session.close();
  }
}
