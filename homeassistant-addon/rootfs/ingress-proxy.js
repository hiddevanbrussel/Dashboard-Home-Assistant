#!/usr/bin/env node
/**
 * HA Ingress reverse proxy for the Next.js addon image.
 *
 * Buffers each upstream response and rewrites the build-time basePath
 * placeholder `/__ha_ingress__` to the request's `X-Ingress-Path`.
 *
 * nginx `sub_filter` breaks Next.js App Router RSC streaming
 * (browser: createFromReadableStream → "Connection closed").
 */
"use strict";

const http = require("http");

const PLACEHOLDER = "/__ha_ingress__";
const UPSTREAM_HOST = "127.0.0.1";
const UPSTREAM_PORT = Number(process.env.INGRESS_UPSTREAM_PORT || 3001);
const LISTEN_PORT = Number(process.env.INGRESS_PORT || 8099);

function clientIp(req) {
  const raw = req.socket.remoteAddress || "";
  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
}

function isAllowed(ip) {
  if (process.env.INGRESS_ALLOW_ALL === "1") return true;
  if (ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("172.30.32.") || ip.startsWith("172.30.33.")) return true;
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

function rewriteText(text, ingressPath) {
  if (!ingressPath || !text.includes("__ha_ingress__")) return text;
  let out = text.split(PLACEHOLDER).join(ingressPath);
  // Flight / JSON sometimes escape slashes
  const ingressUnicode = ingressPath.replace(/\//g, "\\u002F");
  out = out.split("\\u002F__ha_ingress__").join(ingressUnicode);
  const ingressPct = ingressPath.replace(/\//g, "%2F");
  out = out.split("%2F__ha_ingress__").join(ingressPct);
  return out;
}

function upstreamPath(url) {
  const u = url || "/";
  if (u === "/" || u === "") return PLACEHOLDER + "/";
  return PLACEHOLDER + u;
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
  headers.host = `${UPSTREAM_HOST}:${UPSTREAM_PORT}`;
  // Force identity so we can safely rewrite text bodies.
  headers["accept-encoding"] = "identity";
  return headers;
}

const server = http.createServer((req, res) => {
  const ip = clientIp(req);
  if (!isAllowed(ip)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  const ingressPath = (req.headers["x-ingress-path"] || "").replace(/\/+$/, "") || "";

  const proxyReq = http.request(
    {
      hostname: UPSTREAM_HOST,
      port: UPSTREAM_PORT,
      path: upstreamPath(req.url),
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
        if (outHeaders.location && ingressPath) {
          outHeaders.location = rewriteText(String(outHeaders.location), ingressPath);
        }
        if (outHeaders["set-cookie"] && ingressPath) {
          const cookies = Array.isArray(outHeaders["set-cookie"])
            ? outHeaders["set-cookie"]
            : [outHeaders["set-cookie"]];
          outHeaders["set-cookie"] = cookies.map((c) => rewriteText(String(c), ingressPath));
        }
        outHeaders["content-length"] = String(Buffer.byteLength(body));

        res.writeHead(proxyRes.statusCode || 502, outHeaders);
        res.end(body);
      });
    }
  );

  proxyReq.on("error", (err) => {
    console.error("[ingress-proxy]", err.message);
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "text/plain" });
    }
    res.end("Bad Gateway");
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
  shouldRewrite,
  upstreamPath,
  PLACEHOLDER,
};
