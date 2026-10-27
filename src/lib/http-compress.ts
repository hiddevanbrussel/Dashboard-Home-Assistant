/**
 * Gzip (or brotli, when the client does not accept gzip) for API responses
 * on the standalone Node server: `next start` / Docker `node server.js`,
 * and the add-on Next process behind nginx on :3000.
 *
 * Only `${basePath}/api` and `${basePath}/api/...` are compressed. `basePath`
 * is `NEXT_BASE_PATH` or `NEXT_PUBLIC_BASE_PATH` (see next.config.ts). A
 * request that a proxy already stripped to `/api/...` still matches. Every
 * other path, including HTML documents and the RSC stream, is left untouched
 * so App Router responses keep streaming. `text/html` and `text/x-component`
 * are never buffered, even when they are returned from an API route.
 *
 * Next's built-in `compress` middleware is off (see next.config.ts). For a
 * compressible API body this hook buffers chunks until `end`, then sets
 * `Content-Encoding` and `Vary: Accept-Encoding` once.
 *
 * The HA ingress proxy sends `Accept-Encoding: identity` upstream so it can
 * rewrite paths, and compresses the rewritten body itself. Clients that do
 * not accept gzip/br are unchanged. Bodies that are already encoded, marked
 * `no-transform`, or below 1 KB are not compressed again.
 */

import http from "node:http";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import type { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from "node:http";

const THRESHOLD = 1024;
const GZIP_LEVEL = 6;
const BROTLI_QUALITY = 1;

type Encoded = "gzip" | "br";
type StampedServer = http.Server & { __dashboardGzip?: boolean };
type StampedResponse = ServerResponse & { __dashboardGzip?: boolean };

export function encodingQuality(acceptEncoding: string | undefined, name: string): number {
  if (!acceptEncoding) return 0;
  let star = 0;
  let specific: number | null = null;
  for (const part of acceptEncoding.split(",")) {
    const [rawEnc, ...params] = part
      .trim()
      .split(";")
      .map((piece) => piece.trim())
      .filter((piece) => piece.length > 0);
    if (!rawEnc) continue;
    const enc = rawEnc.toLowerCase();
    let q = 1;
    for (const param of params) {
      if (!param.toLowerCase().startsWith("q=")) continue;
      const parsed = Number(param.slice(2));
      q = Number.isFinite(parsed) ? parsed : 0;
    }
    if (enc === name) specific = q;
    else if (enc === "*") star = q;
  }
  return specific === null ? star : specific;
}

/**
 * Prefer gzip when the client accepts it at least as much as brotli.
 * Gzip is cheaper on a throttled CPU; brotli is used when it is the only
 * accepted encoding or the client gives it a higher q-value.
 */
export function chooseContentEncoding(acceptEncoding: string | undefined): Encoded | null {
  const gzip = encodingQuality(acceptEncoding, "gzip");
  const br = encodingQuality(acceptEncoding, "br");
  if (gzip > 0 && gzip >= br) return "gzip";
  if (br > 0) return "br";
  return null;
}

export function isCompressibleContentType(contentType: string | undefined): boolean {
  if (!contentType) return false;
  const ct = contentType.toLowerCase().split(";")[0]?.trim() ?? "";
  if (
    !ct ||
    ct === "text/event-stream" ||
    ct === "text/html" ||
    ct === "text/x-component" ||
    ct.startsWith("multipart/")
  ) {
    return false;
  }
  if (ct.includes("svg")) return true;
  if (
    ct.startsWith("image/") ||
    ct.startsWith("audio/") ||
    ct.startsWith("video/") ||
    ct.startsWith("font/") ||
    ct.includes("woff") ||
    ct.includes("octet-stream") ||
    ct.includes("wasm") ||
    ct.includes("protobuf")
  ) {
    return false;
  }
  return ct.startsWith("text/") || ct.includes("json") || ct.includes("javascript") || ct.includes("xml");
}

export function appendAcceptEncodingVary(current: string | undefined): string {
  if (!current) return "Accept-Encoding";
  if (current.trim() === "*") return "*";
  const parts = current.split(",").map((part) => part.trim().toLowerCase());
  if (parts.includes("accept-encoding")) return current;
  return `${current}, Accept-Encoding`;
}

function headerString(value: number | string | readonly string[] | undefined): string {
  if (value === undefined) return "";
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function acceptEncodingHeader(req: IncomingMessage): string | undefined {
  const raw = req.headers["accept-encoding"];
  if (Array.isArray(raw)) return raw.join(", ");
  return raw;
}

function toBuffer(chunk: unknown, encoding: BufferEncoding): Buffer {
  if (Buffer.isBuffer(chunk)) return Buffer.from(chunk);
  if (chunk instanceof Uint8Array) return Buffer.from(chunk);
  return Buffer.from(String(chunk), encoding);
}

function compressBody(body: Buffer, encoding: Encoded): Buffer {
  if (encoding === "gzip") return gzipSync(body, { level: GZIP_LEVEL });
  return brotliCompressSync(body, {
    params: { [constants.BROTLI_PARAM_QUALITY]: BROTLI_QUALITY },
  });
}

function shouldPassthrough(res: ServerResponse): boolean {
  if (res.statusCode === 204 || res.statusCode === 304 || res.statusCode < 200) return true;
  const encoding = headerString(res.getHeader("content-encoding")).trim().toLowerCase();
  if (encoding && encoding !== "identity") return true;
  const cacheControl = headerString(res.getHeader("cache-control"));
  if (/(?:^|,)\s*no-transform\s*(?:,|$)/i.test(cacheControl)) return true;
  const type = headerString(res.getHeader("content-type"));
  if (!type) return false;
  return !isCompressibleContentType(type);
}

function applyHeaders(res: ServerResponse, headers: OutgoingHttpHeaders): void {
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    res.setHeader(name, value);
  }
}

/**
 * True only for `${basePath}/api` and `${basePath}/api/...`.
 * With an empty basePath that is `/api` and `/api/...`. When a basePath is
 * set, an already-stripped `/api/...` still matches. The query string is
 * ignored. `/apix`, pages, Next assets, and `undefined` are false.
 */
export function isCompressiblePath(url: string | undefined, basePath: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0] ?? "";
  if (isApiPath(path, "")) return true;
  return basePath.length > 0 && isApiPath(path, basePath);
}

function isApiPath(path: string, basePath: string): boolean {
  const prefix = basePath.length > 1 && basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const root = `${prefix}/api`;
  return path === root || path.startsWith(`${root}/`);
}

function attachResponseCompression(req: IncomingMessage, res: ServerResponse, basePath: string): void {
  const stamped = res as StampedResponse;
  if (stamped.__dashboardGzip || res.headersSent) return;
  if (req.method === "HEAD" || req.headers.range) return;
  if (!isCompressiblePath(req.url, basePath)) return;
  const encoding = chooseContentEncoding(acceptEncodingHeader(req));
  stamped.__dashboardGzip = true;
  if (!encoding) {
    const origSetHeader = res.setHeader.bind(res);
    res.setHeader = function setHeaderWithVary(name: string, value: number | string | readonly string[]) {
      if (name.toLowerCase() === "vary") {
        return origSetHeader(name, appendAcceptEncodingVary(headerString(value)));
      }
      const result = origSetHeader(name, value);
      if (name.toLowerCase() === "content-type" && isCompressibleContentType(headerString(value))) {
        origSetHeader("Vary", appendAcceptEncodingVary(headerString(res.getHeader("vary")) || undefined));
      }
      return result;
    } as typeof res.setHeader;
    return;
  }

  const chunks: Buffer[] = [];
  let skipping = false;
  let ended = false;
  const origWrite = res.write.bind(res);
  const origEnd = res.end.bind(res);
  const origFlush = res.flushHeaders.bind(res);
  const origWriteHead = res.writeHead.bind(res);

  function restore(): void {
    res.write = origWrite;
    res.end = origEnd;
    res.flushHeaders = origFlush;
    res.writeHead = origWriteHead;
  }

  function writeChunk(chunk: unknown, encodingName?: BufferEncoding, cb?: () => void): boolean {
    const buf = toBuffer(chunk, encodingName ?? "utf8");
    if (skipping) return cb ? origWrite(buf, cb) : origWrite(buf);
    if (chunks.length === 0 && shouldPassthrough(res)) {
      skipping = true;
      restore();
      if (!res.headersSent) origFlush();
      return cb ? origWrite(buf, cb) : origWrite(buf);
    }
    chunks.push(buf);
    cb?.();
    return true;
  }

  res.flushHeaders = function flushHeadersDelayed() {
    if (skipping || res.headersSent) origFlush();
  };

  res.writeHead = function writeHeadDelayed(statusCode: number, reason?: string | OutgoingHttpHeaders, maybeHeaders?: OutgoingHttpHeaders) {
    if (skipping || res.headersSent) {
      if (typeof reason === "string") return origWriteHead(statusCode, reason, maybeHeaders);
      return origWriteHead(statusCode, reason);
    }
    res.statusCode = statusCode;
    if (typeof reason === "string") {
      res.statusMessage = reason;
      if (maybeHeaders) applyHeaders(res, maybeHeaders);
    } else if (reason) {
      applyHeaders(res, reason);
    }
    return res;
  } as typeof res.writeHead;

  res.write = function writeDelayed(chunk: unknown, encodingOrCb?: BufferEncoding | (() => void), cb?: () => void) {
    if (ended) return true;
    if (typeof encodingOrCb === "function") return writeChunk(chunk, undefined, encodingOrCb);
    return writeChunk(chunk, encodingOrCb, cb);
  } as typeof res.write;

  res.end = function endDelayed(chunk?: unknown, encodingOrCb?: BufferEncoding | (() => void), cb?: () => void) {
    if (ended) return res;
    ended = true;
    let callback: (() => void) | undefined;
    let enc: BufferEncoding | undefined;
    if (typeof chunk === "function") {
      callback = chunk as () => void;
      chunk = undefined;
    } else if (typeof encodingOrCb === "function") {
      callback = encodingOrCb;
    } else {
      enc = encodingOrCb;
      if (typeof cb === "function") callback = cb;
    }
    if (chunk !== undefined && chunk !== null) writeChunk(chunk, enc);
    if (skipping) return callback ? origEnd(callback) : origEnd();

    const body = chunks.length === 0 ? Buffer.alloc(0) : Buffer.concat(chunks);
    const passthrough =
      shouldPassthrough(res) ||
      body.length < THRESHOLD ||
      (body.length >= 2 && body[0] === 0x1f && body[1] === 0x8b);
    restore();
    const send = (payload: Buffer) => (callback ? origEnd(payload, callback) : origEnd(payload));
    if (passthrough || !isCompressibleContentType(headerString(res.getHeader("content-type")))) {
      return send(body);
    }
    const compressed = compressBody(body, encoding);
    if (compressed.length >= body.length) return send(body);
    res.removeHeader("content-length");
    res.setHeader("Content-Encoding", encoding);
    res.setHeader("Content-Length", compressed.length);
    res.setHeader("Vary", appendAcceptEncodingVary(headerString(res.getHeader("vary")) || undefined));
    return send(compressed);
  } as typeof res.end;
}

export function installResponseCompression(options?: { basePath?: string }): () => void {
  const basePath =
    options?.basePath ?? (process.env.NEXT_BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || "");
  const proto = http.Server.prototype as StampedServer;
  if (proto.__dashboardGzip) return () => undefined;
  const original = proto.emit;
  function emitWithCompression(this: http.Server, event: string | symbol, ...args: unknown[]): boolean {
    if (event === "request") {
      const req = args[0];
      const res = args[1];
      if (isIncomingMessage(req) && isServerResponse(res)) {
        attachResponseCompression(req, res, basePath);
      }
    }
    return original.apply(this, [event, ...args] as Parameters<typeof original>);
  }
  proto.emit = emitWithCompression as typeof proto.emit;
  proto.__dashboardGzip = true;
  return () => {
    proto.emit = original;
    delete proto.__dashboardGzip;
  };
}

function isIncomingMessage(value: unknown): value is IncomingMessage {
  return typeof value === "object" && value !== null && "headers" in value && "method" in value;
}

function isServerResponse(value: unknown): value is ServerResponse {
  return typeof value === "object" && value !== null && "writeHead" in value && "end" in value && "setHeader" in value;
}
