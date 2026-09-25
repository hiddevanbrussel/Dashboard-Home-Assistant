#!/usr/bin/env node
/**
 * Smoke test: Node ingress proxy buffers + rewrites without truncating RSC-like
 * payloads (regression for createFromReadableStream "Connection closed").
 * Also guards HA bare-token 404: rewrite must never emit `/api/hassio_ingress/<token>`
 * without a trailing slash.
 */
"use strict";

const http = require("http");
const path = require("path");
const { rewriteText, shouldRewrite, upstreamPath, PLACEHOLDER } = require(
  path.join(__dirname, "..", "homeassistant-addon/rootfs/ingress-proxy.js")
);

const INGRESS = "/api/hassio_ingress/testhash";
const UPSTREAM_PORT = 13001;
const PROXY_PORT = 18099;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Unit checks
assert(upstreamPath("/") === PLACEHOLDER + "/", "root path (trailing slash)");
assert(upstreamPath("/?_rsc=1") === PLACEHOLDER + "/?_rsc=1", "rsc query");
assert(upstreamPath("/music") === PLACEHOLDER + "/music", "page path");
assert(upstreamPath("/music?x=1") === PLACEHOLDER + "/music?x=1", "page + query");
assert(shouldRewrite("text/x-component"), "rsc content-type");
assert(shouldRewrite("text/html; charset=utf-8"), "html");
assert(!shouldRewrite("image/png"), "png skip");

const sample =
  `href="${PLACEHOLDER}/_next/static/x.js"\n` +
  `self.__next_f.push([1,"${PLACEHOLDER}/music"])\n` +
  `home="${PLACEHOLDER}"\n` +
  `\\u002F__ha_ingress__\\u002Ffoo\n` +
  `bare=\\u002F__ha_ingress__`;
const rewritten = rewriteText(sample, INGRESS);
assert(!rewritten.includes("__ha_ingress__"), "placeholder gone");
assert(rewritten.includes(`${INGRESS}/_next/static/x.js`), "href rewritten");
assert(rewritten.includes(`home="${INGRESS}/"`), "bare root gets trailing slash");
assert(!rewritten.includes(`"${INGRESS}"`), "no bare token without slash");
assert(rewritten.includes("\\u002Fapi\\u002Fhassio_ingress\\u002Ftesthash\\u002Ffoo"), "unicode path");
assert(rewritten.includes("bare=\\u002Fapi\\u002Fhassio_ingress\\u002Ftesthash\\u002F"), "unicode bare root");

const rscBody =
  '0:["$","div",null,{"children":"ok"}]\n' +
  `1:I{"id":"${PLACEHOLDER}/_next/static/chunks/1255.js","chunks":[]}\n` +
  "2:T" +
  "x".repeat(50000); // large flight chunk

let upstreamHits = 0;
const upstream = http.createServer((req, res) => {
  upstreamHits++;
  assert(req.url.startsWith(PLACEHOLDER), `upstream got ${req.url}`);
  // Simulate chunked transfer that nginx sub_filter used to corrupt
  res.writeHead(200, {
    "Content-Type": "text/x-component",
    "Transfer-Encoding": "chunked",
  });
  const mid = Math.floor(rscBody.length / 2);
  const full = rscBody;
  res.write(full.slice(0, mid));
  setTimeout(() => {
    res.write(full.slice(mid));
    res.end();
  }, 20);
});

process.env.INGRESS_UPSTREAM_PORT = String(UPSTREAM_PORT);
process.env.INGRESS_PORT = String(PROXY_PORT);
process.env.INGRESS_ALLOW_ALL = "1";

upstream.listen(UPSTREAM_PORT, "127.0.0.1", () => {
  const { spawn } = require("child_process");
  const child = spawn(
    process.execPath,
    [path.join(__dirname, "..", "homeassistant-addon/rootfs/ingress-proxy.js")],
    {
      env: {
        ...process.env,
        INGRESS_UPSTREAM_PORT: String(UPSTREAM_PORT),
        INGRESS_PORT: String(PROXY_PORT),
        INGRESS_ALLOW_ALL: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let started = false;
  const onReady = () => {
    if (started) return;
    started = true;
    http
      .get(
        {
          hostname: "127.0.0.1",
          port: PROXY_PORT,
          path: "/?_rsc=abc",
          headers: { "X-Ingress-Path": INGRESS },
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const body = Buffer.concat(chunks).toString("utf8");
            const cl = Number(res.headers["content-length"] || 0);
            try {
              assert(res.statusCode === 200, `status ${res.statusCode}`);
              assert(cl === Buffer.byteLength(body), "content-length matches body");
              assert(!body.includes("__ha_ingress__"), "no leftover placeholder");
              assert(body.includes(`${INGRESS}/_next/static/chunks/1255.js`), "path rewritten");
              assert(body.length === rewriteText(rscBody, INGRESS).length, "full body preserved");
              assert(upstreamHits === 1, "one upstream hit");
              console.log("ingress-proxy smoke OK");
              cleanup(0);
            } catch (e) {
              console.error(e);
              cleanup(1);
            }
          });
        }
      )
      .on("error", (e) => {
        console.error(e);
        cleanup(1);
      });
  };

  child.stdout.on("data", (d) => {
    if (String(d).includes("[ingress-proxy]")) onReady();
  });
  child.stderr.on("data", (d) => process.stderr.write(d));
  child.on("exit", (code) => {
    if (!started) {
      console.error("proxy exited early", code);
      cleanup(1);
    }
  });

  setTimeout(() => {
    if (!started) {
      console.error("proxy did not start");
      cleanup(1);
    }
  }, 5000);

  function cleanup(code) {
    child.kill();
    upstream.close(() => process.exit(code));
  }
});
