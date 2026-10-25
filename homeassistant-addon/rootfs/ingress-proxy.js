#!/usr/bin/env node
/**
 * HA Ingress reverse proxy for the Next.js addon image.
 *
 * Buffers each upstream response and rewrites the build-time basePath
 * placeholder `/__ha_ingress__` to the request's `X-Ingress-Path`.
 *
 * Critical for App Router: React Flight (`text/x-component` and `__next_f`
 * payloads) uses length-prefixed `T` rows. Naïve string replace expands paths
 * without updating those lengths → client `createFromReadableStream` hits
 * "Connection closed." Flight bodies are rewritten length-aware.
 *
 * Compression: upstream is always fetched with Accept-Encoding: identity so
 * the body stays plain text for the rewrite. After rewriting, the proxy
 * gzips (or brotli, when the client prefers it) and sets Content-Encoding
 * plus Vary: Accept-Encoding. The standalone Next server compresses direct
 * :3000 traffic itself and is asked for identity here, so the body is
 * compressed exactly once.
 */
"use strict";

const http = require("http");
const zlib = require("zlib");

const COMPRESS_THRESHOLD = 1024;

// Line-buffer logs in Docker (non-TTY); otherwise Open Web UI traffic looks silent.
if (process.stdout._handle && typeof process.stdout._handle.setBlocking === "function") {
  try {
    process.stdout._handle.setBlocking(true);
  } catch (_) {
    /* ignore */
  }
}

const PLACEHOLDER = "/__ha_ingress__";
const UPSTREAM_HOST = "127.0.0.1";
const UPSTREAM_PORT = Number(process.env.INGRESS_UPSTREAM_PORT || 3001);
const LISTEN_PORT = Number(process.env.INGRESS_PORT || 8099);
const UPSTREAM_ORIGIN = `http://${UPSTREAM_HOST}:${UPSTREAM_PORT}`;
/** Home Assistant Supervisor, the only ingress client on HassOS. */
const SUPERVISOR_INGRESS_IP = "172.30.32.2";

/** Flight tags that use `id:TAG{hexLen},{bytes}` (see react-server-dom client). */
const LENGTH_PREFIXED_TAGS = new Set(
  Buffer.from("TAOoUSsLlGgMmV", "ascii")
);

function clientIp(req) {
  const raw = req.socket.remoteAddress || "";
  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
}

function isAllowed(ip) {
  if (ip === "127.0.0.1" || ip === "::1") return true;
  if (ip === SUPERVISOR_INGRESS_IP) return true;
  return false;
}

function shouldRewrite(contentType) {
  if (!contentType) return false;
  const t = contentType.toLowerCase();
  return (
    t.includes("text/") ||
    t.includes("javascript") ||
    t.includes("json") ||
    t.includes("x-component") ||
    t.includes("xml")
  );
}

function isHtml(contentType) {
  return (contentType || "").toLowerCase().includes("text/html");
}

function isFlight(contentType) {
  const t = (contentType || "").toLowerCase();
  return t.includes("text/x-component") || t.includes("text/x-script");
}

/**
 * Rewrite placeholder → ingress path, then catch absolute app paths that would
 * otherwise resolve against HA Core (`/api/pwa-icon`, `/manifest.json`, …).
 *
 * Critical: Next.js `basePath` must NOT gain a trailing slash. Rewriting
 * `/__ha_ingress__` → `/api/hassio_ingress/TOK/` breaks the client router (404).
 * Only exact root href/src get a trailing slash (HA route requires it).
 *
 * Do NOT use this alone on Flight bodies — use rewriteFlightText/Buffer.
 */
function rewritePathsInText(text, ingressPath) {
  if (!ingressPath) return text;
  const prefix = ingressPath.replace(/\/+$/, "");
  const withSlash = prefix + "/";
  let out = text;

  if (out.includes("__ha_ingress__")) {
    // Regex literals escape the placeholder slash (`/^\/__ha_ingress__(?=\/|$)/`).
    // Replacing the bare `/__ha_ingress__` substring inside that escape injects
    // raw slashes (`/^\/api/hassio_ingress/<token>(?=\/|$)/`) and the client
    // throws "Invalid regular expression flags". Rewrite the escaped form
    // first, with every slash escaped, so the output stays a valid regex and
    // a valid JS string (`\/` in a string is just `/`).
    const phEsc = "\\/__ha_ingress__";
    const prefixEsc = prefix.replace(/\//g, "\\/");
    out = out.split(phEsc).join(prefixEsc);

    // 1) Paths under the placeholder
    out = out.split(PLACEHOLDER + "/").join(withSlash);

    // 2) Exact root document links — HA matches only /{token}/… (needs slash)
    out = out.replace(
      /\b(href|src)=["']\/__ha_ingress__["']/gi,
      (_, attr) => `${attr}="${withSlash}"`
    );

    // 3) Bare placeholder left = Next basePath / router prefix (no trailing slash)
    out = out.split(PLACEHOLDER).join(prefix);

    // `\u002F` and `%2F` already encode every slash in the replacement.
    // A raw `/` here would terminate a regex literal the same way as above.
    const phUni = "\\u002F__ha_ingress__";
    const prefixUni = prefix.replace(/\//g, "\\u002F");
    const withSlashUni = prefixUni + "\\u002F";
    out = out.split(phUni + "\\u002F").join(withSlashUni);
    out = out.split(phUni).join(prefixUni);

    const phPct = "%2F__ha_ingress__";
    const prefixPct = prefix.replace(/\//g, "%2F");
    const withSlashPct = prefixPct + "%2F";
    out = out.split(phPct + "%2F").join(withSlashPct);
    out = out.split(phPct).join(prefixPct);
  }

  // Absolute app paths that would otherwise resolve on HA Core (404).
  const appPath =
    "\\/(?!api\\/hassio_ingress\\/)(?:api\\/|_next\\/|uploads\\/|wake-word\\/|manifest\\.webmanifest|manifest\\.json|[a-zA-Z0-9._-]+\\.(?:png|jpe?g|webp|gif|svg|onnx))[^\"')\\s]*";
  out = out.replace(
    new RegExp(`\\b(href|src|content|poster)=["'](${appPath})["']`, "gi"),
    (_, attr, path) => `${attr}="${prefix}${path}"`
  );
  out = out.replace(
    new RegExp(`url\\(\\s*(['"]?)(${appPath})\\1\\s*\\)`, "gi"),
    (_, quote, path) => `url(${quote}${prefix}${path}${quote})`
  );

  return out;
}

/** @deprecated Use rewritePathsInText — kept as alias for smoke tests / callers. */
function rewriteText(text, ingressPath) {
  return rewritePathsInText(text, ingressPath);
}

/**
 * Rewrite a React Flight byte stream, updating length prefixes on `T` (text) rows
 * after path expansion. Binary length-prefixed rows are left unchanged.
 */
function rewriteFlightBuffer(input, ingressPath) {
  if (!ingressPath || !Buffer.isBuffer(input) || input.length === 0) return input;

  const parts = [];
  let i = 0;

  while (i < input.length) {
    const idStart = i;
    while (i < input.length && input[i] !== 0x3a /* : */) i++;
    if (i >= input.length) {
      parts.push(input.subarray(idStart));
      break;
    }
    const idBuf = input.subarray(idStart, i);
    i++; // skip :

    if (i >= input.length) {
      parts.push(input.subarray(idStart));
      break;
    }

    const tag = input[i];
    if (LENGTH_PREFIXED_TAGS.has(tag)) {
      i++; // consume tag
      let byteLen = 0;
      while (i < input.length && input[i] !== 0x2c /* , */) {
        const c = input[i];
        // hex digit
        if (c >= 48 && c <= 57) byteLen = (byteLen << 4) | (c - 48);
        else if (c >= 97 && c <= 102) byteLen = (byteLen << 4) | (c - 87);
        else if (c >= 65 && c <= 70) byteLen = (byteLen << 4) | (c - 55);
        else break;
        i++;
      }
      if (i < input.length && input[i] === 0x2c) i++; // skip comma
      else {
        // Malformed — copy remainder raw
        parts.push(input.subarray(idStart));
        break;
      }

      const payload = input.subarray(i, Math.min(i + byteLen, input.length));
      i += payload.length;

      if (tag === 0x54 /* T */ && payload.length === byteLen) {
        const rewritten = rewritePathsInText(payload.toString("utf8"), ingressPath);
        const newPayload = Buffer.from(rewritten, "utf8");
        parts.push(
          idBuf,
          Buffer.from(`:T${newPayload.length.toString(16)},`, "ascii"),
          newPayload
        );
      } else {
        // Binary / incomplete — pass through unchanged
        parts.push(input.subarray(idStart, i));
      }
    } else {
      // Newline-delimited row (JSON / module refs / …)
      const nl = input.indexOf(0x0a, i);
      const lineEnd = nl === -1 ? input.length : nl;
      const line = input.subarray(idStart, lineEnd).toString("utf8");
      const rewritten = rewritePathsInText(line, ingressPath);
      parts.push(Buffer.from(rewritten, "utf8"));
      if (nl !== -1) {
        parts.push(Buffer.from([0x0a]));
        i = nl + 1;
      } else {
        i = lineEnd;
      }
    }
  }

  return Buffer.concat(parts);
}

function rewriteFlightText(text, ingressPath) {
  return rewriteFlightBuffer(Buffer.from(text, "utf8"), ingressPath).toString("utf8");
}

function unescapeJsString(escaped) {
  try {
    return JSON.parse(`"${escaped}"`);
  } catch {
    return escaped
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

/**
 * Find `self.__next_f.push(...)` calls (not the bootstrap `||[]).push` form).
 * Returns { start, end, kind, payload } where payload is a string (kind 1/2) or Buffer (kind 3).
 */
function findNextFPushes(html) {
  const out = [];
  const needle = "self.__next_f.push(";
  let idx = 0;
  while (idx < html.length) {
    const start = html.indexOf(needle, idx);
    if (start === -1) break;
    // Skip bootstrap form: (self.__next_f=self.__next_f||[]).push(
    if (start >= 2 && html.slice(start - 2, start) === "].") {
      idx = start + needle.length;
      continue;
    }
    const argStart = start + needle.length;
    let depth = 0;
    let inStr = false;
    let esc = false;
    let end = -1;
    for (let j = argStart; j < html.length; j++) {
      const c = html[j];
      if (inStr) {
        if (esc) {
          esc = false;
          continue;
        }
        if (c === "\\") {
          esc = true;
          continue;
        }
        if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') {
        inStr = true;
        continue;
      }
      if (c === "[") depth++;
      else if (c === "]") {
        depth--;
        if (depth === 0) {
          end = j + 1;
          break;
        }
      }
    }
    if (end === -1) break;
    const arg = html.slice(argStart, end);
    try {
      const parsed = JSON.parse(arg);
      const kind = Number(parsed[0]);
      if (kind === 1 || kind === 2) {
        out.push({ start, end, kind, payload: String(parsed[1] ?? "") });
      } else if (kind === 3) {
        out.push({
          start,
          end,
          kind,
          payload: Buffer.from(String(parsed[1] ?? ""), "base64"),
        });
      } else {
        out.push({ start, end, kind, payload: null });
      }
    } catch {
      /* skip malformed */
    }
    idx = end;
  }
  return out;
}

/**
 * HTML documents embed Flight inside split `self.__next_f.push([1,"…"])` chunks.
 * Next often splits a length-prefixed `T` row across pushes (header in one, body in the
 * next). Rewrite the concatenated Flight stream, then emit a single push.
 */
function rewriteHtmlDocument(html, ingressPath) {
  if (!ingressPath) return html;

  const pushes = findNextFPushes(html);
  const dataPushes = pushes.filter((p) => p.kind === 1 || p.kind === 3);

  if (dataPushes.length === 0) {
    return rewritePathsInText(html, ingressPath);
  }

  // Concatenate in document order (string chunks as UTF-8, binary as raw bytes).
  const parts = dataPushes.map((p) =>
    p.kind === 1 ? Buffer.from(p.payload, "utf8") : p.payload
  );
  const combined = Buffer.concat(parts);
  const rewrittenBuf = rewriteFlightBuffer(combined, ingressPath);

  // Expand span to surrounding <script>...</script> tags when present.
  let spanStart = dataPushes[0].start;
  let spanEnd = dataPushes[dataPushes.length - 1].end;
  const openIdx = html.lastIndexOf("<script", spanStart);
  const closeIdx = html.indexOf("</script>", spanEnd);
  if (openIdx !== -1 && closeIdx !== -1 && openIdx < spanStart && closeIdx >= spanEnd) {
    // Only expand if every data push sits in its own script tag within this region
    // and there is no non-flight content we must keep between first open and last close.
    spanStart = openIdx;
    spanEnd = closeIdx + "</script>".length;
  }

  let replacement;
  try {
    const asText = rewrittenBuf.toString("utf8");
    // Round-trip check: valid UTF-8 without replacement characters from binary.
    if (Buffer.from(asText, "utf8").equals(rewrittenBuf)) {
      replacement = `<script>self.__next_f.push(${JSON.stringify([1, asText])})</script>`;
    } else {
      replacement = `<script>self.__next_f.push(${JSON.stringify([
        3,
        rewrittenBuf.toString("base64"),
      ])})</script>`;
    }
  } catch {
    replacement = `<script>self.__next_f.push(${JSON.stringify([
      3,
      rewrittenBuf.toString("base64"),
    ])})</script>`;
  }

  const before = rewritePathsInText(html.slice(0, spanStart), ingressPath);
  const after = rewritePathsInText(html.slice(spanEnd), ingressPath);
  return before + replacement + after;
}


function rewriteBody(body, contentType, ingressPath) {
  if (!ingressPath) return body;
  if (isFlight(contentType)) {
    return rewriteFlightBuffer(body, ingressPath);
  }
  if (isHtml(contentType)) {
    return Buffer.from(rewriteHtmlDocument(body.toString("utf8"), ingressPath), "utf8");
  }
  return Buffer.from(rewritePathsInText(body.toString("utf8"), ingressPath), "utf8");
}

/**
 * Map HA-stripped ingress URL onto Next.js basePath.
 * Root is `/__ha_ingress__` (no trailing slash) to avoid Next 308 loops.
 */
function upstreamPath(url) {
  const u = url || "/";
  const q = u.indexOf("?");
  const path = q === -1 ? u : u.slice(0, q);
  const query = q === -1 ? "" : u.slice(q);
  if (path === "/" || path === "") return PLACEHOLDER + query;
  if (path === PLACEHOLDER || path.startsWith(PLACEHOLDER + "/")) {
    return path + query;
  }
  return PLACEHOLDER + path + query;
}

/**
 * Rewrite a `Link` response header (font preload and friends).
 * Next emits `</__ha_ingress__/_next/static/media/….woff2>; rel=preload`.
 * Node joins duplicate Link headers with ", "; arrays are handled too.
 */
function rewriteLinkHeader(link, ingressPath) {
  if (!ingressPath || link == null) return link;
  if (Array.isArray(link)) {
    return link.map((value) => rewritePathsInText(String(value), ingressPath));
  }
  return rewritePathsInText(String(link), ingressPath);
}

/** Make Location relative and rewrite placeholder; never leak upstream origin. */
function rewriteLocation(location, ingressPath) {
  let loc = String(location);
  if (loc.startsWith(UPSTREAM_ORIGIN)) {
    loc = loc.slice(UPSTREAM_ORIGIN.length) || "/";
  }
  if (ingressPath) {
    loc = rewritePathsInText(loc, ingressPath);
  }
  return loc;
}

function stripHopByHop(headers) {
  const out = { ...headers };
  for (const h of [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "content-length",
    "content-encoding",
  ]) {
    delete out[h];
  }
  return out;
}

function encodingQuality(acceptEncoding, name) {
  if (!acceptEncoding) return 0;
  let star = 0;
  let specific = null;
  for (const part of String(acceptEncoding).split(",")) {
    const pieces = part
      .trim()
      .split(";")
      .map((piece) => piece.trim())
      .filter((piece) => piece.length > 0);
    if (pieces.length === 0) continue;
    const enc = pieces[0].toLowerCase();
    let q = 1;
    for (let i = 1; i < pieces.length; i++) {
      const param = pieces[i];
      if (!param.toLowerCase().startsWith("q=")) continue;
      const parsed = Number(param.slice(2));
      q = Number.isFinite(parsed) ? parsed : 0;
    }
    if (enc === name) specific = q;
    else if (enc === "*") star = q;
  }
  return specific === null ? star : specific;
}

/** Gzip wins ties. Brotli only when the client prefers it or rejects gzip. */
function chooseContentEncoding(acceptEncoding) {
  const gzip = encodingQuality(acceptEncoding, "gzip");
  const br = encodingQuality(acceptEncoding, "br");
  if (gzip > 0 && gzip >= br) return "gzip";
  if (br > 0) return "br";
  return null;
}

function isCompressibleContentType(contentType) {
  if (!contentType) return false;
  const ct = String(contentType).toLowerCase().split(";")[0].trim();
  if (!ct || ct === "text/event-stream" || ct.startsWith("multipart/")) return false;
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

function headerValue(headers, name) {
  const want = name.toLowerCase();
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === want) return headers[key];
  }
  return undefined;
}

function appendAcceptEncodingVary(current) {
  if (current == null || current === "") return "Accept-Encoding";
  const text = Array.isArray(current) ? current.join(", ") : String(current);
  if (text.trim() === "*") return "*";
  const parts = text.split(",").map((part) => part.trim().toLowerCase());
  if (parts.includes("accept-encoding")) return text;
  return `${text}, Accept-Encoding`;
}

/**
 * Compress a rewritten upstream body. `headers` must already be stripped of
 * hop-by-hop fields (including any upstream content-encoding). Returns a new
 * header set with Content-Length, and Content-Encoding + Vary when encoded.
 */
function gzipProxiedBody(body, headers, acceptEncoding) {
  const out = { ...headers };
  const encoding = chooseContentEncoding(
    Array.isArray(acceptEncoding) ? acceptEncoding.join(", ") : acceptEncoding
  );
  const type = headerValue(out, "content-type");
  const existing = String(headerValue(out, "content-encoding") || "")
    .trim()
    .toLowerCase();
  const cacheControl = String(headerValue(out, "cache-control") || "");
  const noTransform = /(?:^|,)\s*no-transform\s*(?:,|$)/i.test(cacheControl);
  const gzipMagic = body.length >= 2 && body[0] === 0x1f && body[1] === 0x8b;
  const canEncode =
    Boolean(encoding) &&
    isCompressibleContentType(type) &&
    !noTransform &&
    !gzipMagic &&
    (!existing || existing === "identity") &&
    body.length >= COMPRESS_THRESHOLD;

  if (canEncode) {
    const compressed =
      encoding === "br"
        ? zlib.brotliCompressSync(body, {
            params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 1 },
          })
        : zlib.gzipSync(body, { level: 6 });
    if (compressed.length < body.length) {
      out["content-encoding"] = encoding;
      out.vary = appendAcceptEncodingVary(headerValue(out, "vary"));
      out["content-length"] = String(compressed.length);
      return { body: compressed, headers: out, encoded: encoding };
    }
  }

  const alreadyEncoded = Boolean(existing) && existing !== "identity";
  if (!alreadyEncoded && isCompressibleContentType(type) && body.length >= COMPRESS_THRESHOLD && !noTransform) {
    out.vary = appendAcceptEncodingVary(headerValue(out, "vary"));
  }
  if (!alreadyEncoded) delete out["content-encoding"];
  out["content-length"] = String(body.length);
  return { body, headers: out, encoded: null };
}

function forwardRequestHeaders(req) {
  const headers = stripHopByHop(req.headers);
  // Always target Next by upstream host — public Host confuses some builds.
  headers.host = `${UPSTREAM_HOST}:${UPSTREAM_PORT}`;
  // Identity so Next does not encode the body before path rewrite. The
  // proxy compresses once, after rewriting, based on the client's header.
  headers["accept-encoding"] = "identity";
  const ingressSecret = process.env.INGRESS_AUTH_SECRET || "";
  if (ingressSecret) headers["x-dashboard-ingress"] = ingressSecret;
  else delete headers["x-dashboard-ingress"];
  return headers;
}

function logAccess(ip, method, url, status, bytes, ingressPath, ms) {
  const pathHint = ingressPath || "-";
  console.log(
    `[ingress-proxy] ${ip} "${method} ${url}" ${status} ${bytes} x-ingress-path=${pathHint} ${ms}ms`
  );
}

const server = http.createServer((req, res) => {
  const started = Date.now();
  const ip = clientIp(req);
  const clientAcceptEncoding = req.headers["accept-encoding"];
  const ingressPath = (req.headers["x-ingress-path"] || "").replace(/\/+$/, "") || "";

  // Always log — if Open Web UI 404s with zero lines, HA never reached us.
  console.log(
    `[ingress-proxy] ← ${ip} ${req.method} ${req.url} x-ingress-path=${ingressPath || "-"}`
  );

  if (!isAllowed(ip)) {
    console.warn(`[ingress-proxy] 403 from ${ip}`);
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  const targetPath = upstreamPath(req.url);

  const proxyReq = http.request(
    {
      hostname: UPSTREAM_HOST,
      port: UPSTREAM_PORT,
      path: targetPath,
      method: req.method,
      headers: forwardRequestHeaders(req),
    },
    (proxyRes) => {
      const chunks = [];
      proxyRes.on("data", (c) => chunks.push(c));
      proxyRes.on("error", (err) => {
        console.error("[ingress-proxy] upstream response error:", err.message);
        if (!res.headersSent) {
          res.writeHead(502, { "Content-Type": "text/plain" });
        }
        res.end("Bad Gateway");
      });
      proxyRes.on("end", () => {
        let body = Buffer.concat(chunks);
        const ct = proxyRes.headers["content-type"] || "";
        if (shouldRewrite(ct) && ingressPath) {
          try {
            body = rewriteBody(body, ct, ingressPath);
          } catch (err) {
            console.error("[ingress-proxy] rewrite failed:", err.message);
            // Fall back to raw upstream body rather than serving corrupt Flight.
          }
        }

        let outHeaders = stripHopByHop(proxyRes.headers);
        if (outHeaders.location) {
          outHeaders.location = rewriteLocation(String(outHeaders.location), ingressPath);
        }
        if (outHeaders.link) {
          outHeaders.link = rewriteLinkHeader(outHeaders.link, ingressPath);
        }
        if (outHeaders["set-cookie"] && ingressPath) {
          const cookies = Array.isArray(outHeaders["set-cookie"])
            ? outHeaders["set-cookie"]
            : [outHeaders["set-cookie"]];
          // Scope cookies to the ingress path (Path=/ would stick on HA Core).
          outHeaders["set-cookie"] = cookies.map((c) => {
            let s = rewritePathsInText(String(c), ingressPath);
            if (/;\s*Path=/i.test(s)) {
              s = s.replace(/;\s*Path=\/?/i, `; Path=${ingressPath}/`);
            } else {
              s = `${s}; Path=${ingressPath}/`;
            }
            return s;
          });
        }
        const prepared = gzipProxiedBody(body, outHeaders, clientAcceptEncoding);
        body = prepared.body;
        outHeaders = prepared.headers;

        const status = proxyRes.statusCode || 502;
        res.writeHead(status, outHeaders);
        res.end(body);
        logAccess(ip, req.method, req.url, status, body.length, ingressPath, Date.now() - started);
      });
    }
  );

  proxyReq.on("error", (err) => {
    console.error("[ingress-proxy]", err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain" });
    }
    res.end("Bad Gateway");
    logAccess(ip, req.method, req.url, 502, 0, ingressPath, Date.now() - started);
  });

  req.pipe(proxyReq);
});

if (require.main === module) {
  // 0.0.0.0 so Supervisor can reach the container. Source IPs are filtered above.
  server.listen(LISTEN_PORT, "0.0.0.0", () => {
    console.log(
      `[ingress-proxy] :${LISTEN_PORT} → ${UPSTREAM_HOST}:${UPSTREAM_PORT} (rewrite ${PLACEHOLDER}; allow ${SUPERVISOR_INGRESS_IP} and loopback)`
    );
  });
}

module.exports = {
  rewriteText,
  rewritePathsInText,
  rewriteFlightText,
  rewriteFlightBuffer,
  rewriteHtmlDocument,
  rewriteBody,
  rewriteLocation,
  rewriteLinkHeader,
  shouldRewrite,
  upstreamPath,
  gzipProxiedBody,
  chooseContentEncoding,
  clientIp,
  isAllowed,
  SUPERVISOR_INGRESS_IP,
  PLACEHOLDER,
};
