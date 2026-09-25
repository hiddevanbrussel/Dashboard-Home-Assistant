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
 */
"use strict";

const http = require("http");

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

/** Flight tags that use `id:TAG{hexLen},{bytes}` (see react-server-dom client). */
const LENGTH_PREFIXED_TAGS = new Set(
  Buffer.from("TAOoUSsLlGgMmV", "ascii")
);

function clientIp(req) {
  const raw = req.socket.remoteAddress || "";
  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
}

function isAllowed(ip) {
  if (process.env.INGRESS_ALLOW_ALL === "1") return true;
  if (ip === "127.0.0.1" || ip === "::1") return true;
  // Supervisor ingress + common Docker / HA OS nets
  if (ip.startsWith("172.")) return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
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
    // 1) Paths under the placeholder
    out = out.split(PLACEHOLDER + "/").join(withSlash);

    // 2) Exact root document links — HA matches only /{token}/… (needs slash)
    out = out.replace(
      /\b(href|src)=["']\/__ha_ingress__["']/gi,
      (_, attr) => `${attr}="${withSlash}"`
    );

    // 3) Bare placeholder left = Next basePath / router prefix (no trailing slash)
    out = out.split(PLACEHOLDER).join(prefix);

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
 * HTML documents embed Flight inside `self.__next_f.push([1,"…"])`.
 * Rewrite those payloads length-aware; rewrite the surrounding markup normally.
 */
function rewriteHtmlDocument(html, ingressPath) {
  if (!ingressPath) return html;

  const re = /self\.__next_f\.push\(\[(\d+),\s*"((?:\\.|[^"\\])*)"\s*\]\)/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    out += rewritePathsInText(html.slice(last, m.index), ingressPath);
    const kind = Number(m[1]);
    const escaped = m[2];
    if (kind === 1) {
      const raw = unescapeJsString(escaped);
      const rewritten = rewriteFlightText(raw, ingressPath);
      out += `self.__next_f.push([1,${JSON.stringify(rewritten)}])`;
    } else if (kind === 3) {
      const b64 = unescapeJsString(escaped);
      try {
        const decoded = Buffer.from(b64, "base64");
        const rewritten = rewriteFlightBuffer(decoded, ingressPath);
        out += `self.__next_f.push([3,${JSON.stringify(rewritten.toString("base64"))}])`;
      } catch {
        out += m[0];
      }
    } else {
      // 0 = bootstrap init, 2 = form state — leave alone
      out += m[0];
    }
    last = m.index + m[0].length;
  }
  out += rewritePathsInText(html.slice(last), ingressPath);
  return out;
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

function forwardRequestHeaders(req) {
  const headers = stripHopByHop(req.headers);
  // Always target Next by upstream host — public Host confuses some builds.
  headers.host = `${UPSTREAM_HOST}:${UPSTREAM_PORT}`;
  headers["accept-encoding"] = "identity";
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

        const outHeaders = stripHopByHop(proxyRes.headers);
        if (outHeaders.location) {
          outHeaders.location = rewriteLocation(String(outHeaders.location), ingressPath);
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
        outHeaders["content-length"] = String(Buffer.byteLength(body));

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
  server.listen(LISTEN_PORT, "0.0.0.0", () => {
    console.log(
      `[ingress-proxy] :${LISTEN_PORT} → ${UPSTREAM_HOST}:${UPSTREAM_PORT} (rewrite ${PLACEHOLDER})`
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
  shouldRewrite,
  upstreamPath,
  PLACEHOLDER,
};
