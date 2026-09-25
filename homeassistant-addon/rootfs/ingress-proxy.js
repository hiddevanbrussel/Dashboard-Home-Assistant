#!/usr/bin/env node
/**
 * HA Ingress reverse proxy for the Next.js addon image.
 *
 * Buffers each upstream response and rewrites the build-time basePath
 * placeholder `/__ha_ingress__` to the request's `X-Ingress-Path`.
 *
 * Also prefixes stray absolute `/api/...`, `/_next/...`, and `/manifest.json`
 * paths so they do not escape the iframe and hit Home Assistant Core (404).
 */
"use strict";

const http = require("http");

const PLACEHOLDER = "/__ha_ingress__";
const UPSTREAM_HOST = "127.0.0.1";
const UPSTREAM_PORT = Number(process.env.INGRESS_UPSTREAM_PORT || 3001);
const LISTEN_PORT = Number(process.env.INGRESS_PORT || 8099);
const UPSTREAM_ORIGIN = `http://${UPSTREAM_HOST}:${UPSTREAM_PORT}`;

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

/**
 * Rewrite placeholder → ingress path, then catch absolute app paths that would
 * otherwise resolve against HA Core (`/api/pwa-icon`, `/manifest.json`, …).
 */
function rewriteText(text, ingressPath) {
  if (!ingressPath) return text;
  const root = ingressPath.endsWith("/") ? ingressPath : ingressPath + "/";
  const prefix = ingressPath.replace(/\/+$/, "");
  let out = text;

  if (out.includes("__ha_ingress__")) {
    out = out.split(PLACEHOLDER + "/").join(root);
    out = out.split(PLACEHOLDER).join(root);

    const phUni = "\\u002F__ha_ingress__";
    const rootUni = root.replace(/\//g, "\\u002F");
    out = out.split(phUni + "\\u002F").join(rootUni);
    out = out.split(phUni).join(rootUni);

    const phPct = "%2F__ha_ingress__";
    const rootPct = root.replace(/\//g, "%2F");
    out = out.split(phPct + "%2F").join(rootPct);
    out = out.split(phPct).join(rootPct);
  }

  // href="/api/..." or src="/_next/..." or "/manifest.json" not already under ingress
  out = out.replace(
    /\b(href|src|content)=["'](\/(?!api\/hassio_ingress\/)(?:api\/|_next\/|manifest\.json)[^"']*)["']/gi,
    (_, attr, path) => `${attr}="${prefix}${path}"`
  );

  return out;
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
    loc = rewriteText(loc, ingressPath);
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
          body = Buffer.from(rewriteText(body.toString("utf8"), ingressPath), "utf8");
        }

        const outHeaders = stripHopByHop(proxyRes.headers);
        if (outHeaders.location) {
          outHeaders.location = rewriteLocation(String(outHeaders.location), ingressPath);
        }
        if (outHeaders["set-cookie"] && ingressPath) {
          const cookies = Array.isArray(outHeaders["set-cookie"])
            ? outHeaders["set-cookie"]
            : [outHeaders["set-cookie"]];
          outHeaders["set-cookie"] = cookies.map((c) => rewriteText(String(c), ingressPath));
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
  rewriteLocation,
  shouldRewrite,
  upstreamPath,
  PLACEHOLDER,
};
