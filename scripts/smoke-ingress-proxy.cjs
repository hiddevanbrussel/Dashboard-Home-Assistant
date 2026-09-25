#!/usr/bin/env node
/**
 * Smoke test: ingress proxy rewrite + buffered RSC body + Flight length prefixes.
 */
"use strict";

const http = require("http");
const path = require("path");
const {
  rewriteText,
  rewritePathsInText,
  rewriteFlightText,
  rewriteHtmlDocument,
  shouldRewrite,
  upstreamPath,
  PLACEHOLDER,
} = require(path.join(__dirname, "..", "homeassistant-addon/rootfs/ingress-proxy.js"));

const INGRESS = "/api/hassio_ingress/testhash";
const UPSTREAM_PORT = 13001;
const PROXY_PORT = 18099;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(upstreamPath("/") === PLACEHOLDER, "root path (no trailing slash)");
assert(upstreamPath("/?_rsc=1") === PLACEHOLDER + "?_rsc=1", "rsc query");
assert(upstreamPath("/music") === PLACEHOLDER + "/music", "page path");
assert(shouldRewrite("text/x-component"), "rsc content-type");

// Next basePath constant must stay WITHOUT trailing slash
const baseConst = rewriteText(`var base="${PLACEHOLDER}";`, INGRESS);
assert(baseConst === `var base="${INGRESS}";`, `basePath const: ${baseConst}`);
const routerP = rewriteText(`"p":"${PLACEHOLDER}"`, INGRESS);
assert(routerP === `"p":"${INGRESS}"`, `router p: ${routerP}`);

// Asset paths keep a single slash
const asset = rewriteText(`r.p="${PLACEHOLDER}/_next/"`, INGRESS);
assert(asset === `r.p="${INGRESS}/_next/"`, `asset prefix: ${asset}`);

// Exact root href needs trailing slash for HA route matcher
const rootHref = rewriteText(`href="${PLACEHOLDER}"`, INGRESS);
assert(rootHref === `href="${INGRESS}/"`, `root href: ${rootHref}`);

const sample =
  `href="${PLACEHOLDER}/_next/static/x.js"\n` +
  `self.__next_f.push([1,"${PLACEHOLDER}/music"])\n` +
  `\\u002F__ha_ingress__\\u002Ffoo`;
const rewritten = rewriteText(sample, INGRESS);
assert(!rewritten.includes("__ha_ingress__"), "placeholder gone");
assert(rewritten.includes(`${INGRESS}/_next/static/x.js`), "href rewritten");
assert(rewritten.includes("\\u002Fapi\\u002Fhassio_ingress\\u002Ftesthash\\u002Ffoo"), "unicode path");

const stray = rewriteText(
  `href="/manifest.json" src="/api/pwa-icon?size=192" href="/_next/static/x.js" src="/uploads/a.webp" poster="/default-screensaver.png"`,
  INGRESS
);
assert(stray.includes(`href="${INGRESS}/manifest.json"`), "manifest prefixed");
assert(stray.includes(`src="${INGRESS}/api/pwa-icon?size=192"`), "pwa icon prefixed");
assert(stray.includes(`src="${INGRESS}/uploads/a.webp"`), "uploads prefixed");
assert(stray.includes(`poster="${INGRESS}/default-screensaver.png"`), "poster prefixed");
assert(!stray.includes(`href="/manifest.json"`), "no stray manifest");

const cssUrl = rewriteText(
  `background:url(/uploads/a.png);background-image:url("/energy-overview-house.webp")`,
  INGRESS
);
assert(cssUrl.includes(`url(${INGRESS}/uploads/a.png)`), "css url uploads");
assert(cssUrl.includes(`url("${INGRESS}/energy-overview-house.webp")`), "css url static image");
assert(!cssUrl.includes("url(/uploads/"), "no bare css upload url");

// Flight T-row: path expansion must update hex byte-length or clients get Connection closed.
const inner = `Hello ${PLACEHOLDER}/page and more`;
const tRow = `2:T${Buffer.byteLength(inner, "utf8").toString(16)},${inner}\n`;
const flightOut = rewriteFlightText(tRow, INGRESS);
assert(!flightOut.includes("__ha_ingress__"), "flight placeholder gone");
assert(flightOut.includes(`${INGRESS}/page`), "flight path rewritten");
const m = /^2:T([0-9a-f]+),/.exec(flightOut);
assert(m, `flight T header: ${flightOut.slice(0, 40)}`);
const declared = parseInt(m[1], 16);
const payload = flightOut.slice(m[0].length).replace(/\n$/, "");
assert(
  declared === Buffer.byteLength(payload, "utf8"),
  `T length ${declared} !== actual ${Buffer.byteLength(payload, "utf8")}`
);

// Naïve rewrite (broken) would leave stale length — prove we fixed it vs rewritePathsInText alone
const naive = rewritePathsInText(tRow, INGRESS);
const naiveM = /^2:T([0-9a-f]+),/.exec(naive);
const naiveDeclared = parseInt(naiveM[1], 16);
const naivePayload = naive.slice(naiveM[0].length).replace(/\n$/, "");
assert(
  naiveDeclared !== Buffer.byteLength(naivePayload, "utf8"),
  "sanity: naïve rewrite breaks T length"
);

// HTML-embedded __next_f push with a T row
const pushPayload = `0:{"b":"x"}\n2:T${Buffer.byteLength(inner, "utf8").toString(16)},${inner}\n`;
const html = `<html><script>self.__next_f.push([1,${JSON.stringify(pushPayload)}])</script><img src="/uploads/a.png"></html>`;
const htmlOut = rewriteHtmlDocument(html, INGRESS);
assert(htmlOut.includes(`src="${INGRESS}/uploads/a.png"`), "html img prefixed");
assert(!htmlOut.includes("__ha_ingress__"), "html flight placeholder gone");
const pushMatch = /self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)/.exec(htmlOut);
assert(pushMatch, "push still present");
const decoded = JSON.parse(pushMatch[1]);
const tm = /^2:T([0-9a-f]+),/m.exec(decoded.split("\n")[1] || "");
assert(tm, `embedded T row: ${decoded}`);
const embDecl = parseInt(tm[1], 16);
const embLine = decoded.split("\n")[1];
const embPayload = embLine.slice(tm[0].length);
assert(
  embDecl === Buffer.byteLength(embPayload, "utf8"),
  `embedded T length ${embDecl} !== ${Buffer.byteLength(embPayload, "utf8")}`
);

const rscBody =
  '0:["$","div",null,{"children":"ok"}]\n' +
  `1:I{"id":"${PLACEHOLDER}/_next/static/chunks/1255.js","chunks":[]}\n` +
  (() => {
    const text = "x".repeat(1000);
    return `2:T${Buffer.byteLength(text, "utf8").toString(16)},${text}\n`;
  })();

let upstreamHits = 0;
const upstream = http.createServer((req, res) => {
  upstreamHits++;
  assert(req.url.startsWith(PLACEHOLDER), `upstream got ${req.url}`);
  res.writeHead(200, {
    "Content-Type": "text/x-component",
    "Transfer-Encoding": "chunked",
  });
  const mid = Math.floor(rscBody.length / 2);
  res.write(rscBody.slice(0, mid));
  setTimeout(() => {
    res.write(rscBody.slice(mid));
    res.end();
  }, 20);
});

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
            try {
              assert(res.statusCode === 200, `status ${res.statusCode}`);
              assert(!body.includes("__ha_ingress__"), "no leftover placeholder");
              assert(body.includes(`${INGRESS}/_next/static/chunks/1255.js`), "path rewritten");
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
