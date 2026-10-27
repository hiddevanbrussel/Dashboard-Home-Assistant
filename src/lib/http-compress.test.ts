import http from "node:http";
import type { AddressInfo } from "node:net";
import { brotliDecompressSync, gunzipSync, gzipSync } from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { installResponseCompression, isCompressibleContentType, isCompressiblePath } from "./http-compress";

const JSON_BODY = Buffer.from(JSON.stringify({ pad: "x".repeat(4000) }));
const PAGE_BODY = Buffer.from(`<!doctype html><html><body>${"a".repeat(4096)}</body></html>`);
const RSC_BODY = Buffer.from("x".repeat(4096));
const STREAM_BODY = Buffer.from(`data: ${"y".repeat(4096)}\n\n`);
const DASHBOARD_BODY = Buffer.from(JSON.stringify({ pad: "z".repeat(4000) }));
const uninstall = installResponseCompression({ basePath: "" });

let releasePageTail: (() => void) | null = null;
let pageTail: Promise<void> | null = null;
let pageEndCalled = false;

function armPageTail(): void {
  pageEndCalled = false;
  pageTail = new Promise<void>((resolve) => {
    releasePageTail = resolve;
  });
}

function disarmPageTail(): void {
  releasePageTail?.();
  releasePageTail = null;
  pageTail = null;
}

type Received = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
};

function listen(): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer((req, res) => {
    const url = (req.url || "/").split("?")[0] ?? "/";
    if (url.startsWith("/api/json") || url.startsWith("/__ha_ingress__/api/json")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Vary", "rsc");
      res.flushHeaders();
      res.write(JSON_BODY.subarray(0, 1000));
      res.write(JSON_BODY.subarray(1000));
      res.end();
      return;
    }
    if (url.startsWith("/api/small")) {
      res.setHeader("Content-Type", "application/json");
      res.end("[]");
      return;
    }
    if (url.startsWith("/api/png")) {
      res.setHeader("Content-Type", "image/png");
      res.end(Buffer.alloc(5000, 7));
      return;
    }
    if (url.startsWith("/api/encoded")) {
      const gz = gzipSync(Buffer.from("y".repeat(3000)));
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Encoding", "gzip");
      res.flushHeaders();
      res.end(gz);
      return;
    }
    if (url.startsWith("/page")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Vary", "rsc");
      const mid = Math.floor(PAGE_BODY.length / 2);
      res.write(PAGE_BODY.subarray(0, mid));
      const wait = pageTail;
      if (!wait) {
        res.write(PAGE_BODY.subarray(mid));
        res.end();
        return;
      }
      void wait.then(() => {
        res.write(PAGE_BODY.subarray(mid));
        pageEndCalled = true;
        res.end();
      });
      return;
    }
    if (url.startsWith("/api/rsc")) {
      res.setHeader("Content-Type", "text/x-component");
      res.end(RSC_BODY);
      return;
    }
    if (url.startsWith("/api/stream")) {
      res.setHeader("Content-Type", "text/event-stream");
      res.end(STREAM_BODY);
      return;
    }
    if (url.startsWith("/dashboards/")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Vary", "rsc");
      res.write(DASHBOARD_BODY.subarray(0, 1000));
      res.write(DASHBOARD_BODY.subarray(1000));
      res.end();
      return;
    }
    res.statusCode = 404;
    res.end();
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address() as AddressInfo;
      resolve({ server, port: addr.port });
    });
  });
}

function get(port: number, path: string, acceptEncoding: string): Promise<Received> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        headers: { "accept-encoding": acceptEncoding },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

describe("isCompressiblePath", () => {
  it("matches /api and strips the query string", () => {
    expect(isCompressiblePath("/api", "")).toBe(true);
    expect(isCompressiblePath("/api/ha/state?x=1", "")).toBe(true);
  });

  it("rejects pages, assets, lookalikes, and undefined", () => {
    expect(isCompressiblePath("/apix", "")).toBe(false);
    expect(isCompressiblePath("/", "")).toBe(false);
    expect(isCompressiblePath("/dashboards/abc", "")).toBe(false);
    expect(isCompressiblePath("/_next/static/x.js", "")).toBe(false);
    expect(isCompressiblePath(undefined, "")).toBe(false);
  });

  it("matches the ingress basePath and a prefix the proxy already stripped", () => {
    const basePath = "/__ha_ingress__";
    expect(isCompressiblePath("/__ha_ingress__/api/ha/state", basePath)).toBe(true);
    expect(isCompressiblePath("/__ha_ingress__/api", basePath)).toBe(true);
    expect(isCompressiblePath("/api/ha/state?x=1", basePath)).toBe(true);
    expect(isCompressiblePath("/api", basePath)).toBe(true);
    expect(isCompressiblePath("/__ha_ingress__/dashboards", basePath)).toBe(false);
    expect(isCompressiblePath("/__ha_ingress__/apix", basePath)).toBe(false);
    expect(isCompressiblePath("/", basePath)).toBe(false);
    expect(isCompressiblePath(undefined, basePath)).toBe(false);
  });
});

describe("isCompressibleContentType", () => {
  it("rejects HTML and RSC so those bodies are never buffered", () => {
    expect(isCompressibleContentType("text/html")).toBe(false);
    expect(isCompressibleContentType("text/html; charset=utf-8")).toBe(false);
    expect(isCompressibleContentType("text/x-component")).toBe(false);
    expect(isCompressibleContentType("text/event-stream")).toBe(false);
    expect(isCompressibleContentType("application/json")).toBe(true);
  });
});

describe("response compression", () => {
  let server: http.Server;
  let port = 0;

  beforeAll(async () => {
    const started = await listen();
    server = started.server;
    port = started.port;
  });

  afterAll(async () => {
    disarmPageTail();
    uninstall();
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("gzips a chunked JSON body and keeps Vary", async () => {
    const res = await get(port, "/api/json", "gzip, deflate, br");
    expect(res.status).toBe(200);
    expect(res.headers["content-encoding"]).toBe("gzip");
    expect(String(res.headers.vary).toLowerCase()).toContain("accept-encoding");
    expect(String(res.headers.vary)).toContain("rsc");
    expect(res.body.length).toBeLessThan(JSON_BODY.length);
    expect(gunzipSync(res.body).equals(JSON_BODY)).toBe(true);
  });

  it("prefers gzip over brotli when both are equally accepted", async () => {
    const res = await get(port, "/api/json", "br, gzip");
    expect(res.headers["content-encoding"]).toBe("gzip");
    expect(gunzipSync(res.body).equals(JSON_BODY)).toBe(true);
  });

  it("uses brotli when the client does not accept gzip", async () => {
    const res = await get(port, "/api/json", "br");
    expect(res.headers["content-encoding"]).toBe("br");
    expect(brotliDecompressSync(res.body).equals(JSON_BODY)).toBe(true);
  });

  it("leaves identity, small JSON, images, and already encoded bodies alone", async () => {
    const identity = await get(port, "/api/json", "identity");
    expect(identity.headers["content-encoding"]).toBeUndefined();
    expect(identity.body.equals(JSON_BODY)).toBe(true);
    expect(String(identity.headers.vary).toLowerCase()).toContain("accept-encoding");

    const small = await get(port, "/api/small", "gzip");
    expect(small.headers["content-encoding"]).toBeUndefined();
    expect(small.body.toString("utf8")).toBe("[]");

    const png = await get(port, "/api/png", "gzip");
    expect(png.headers["content-encoding"]).toBeUndefined();
    expect(png.body.length).toBe(5000);

    const encoded = await get(port, "/api/encoded", "gzip");
    expect(encoded.headers["content-encoding"]).toBe("gzip");
    expect(gunzipSync(encoded.body).toString("utf8")).toBe("y".repeat(3000));
  });

  it("does not compress an HTML page and leaves Vary untouched", async () => {
    const res = await get(port, "/page", "gzip");
    expect(res.headers["content-encoding"]).toBeUndefined();
    expect(res.headers.vary).toBe("rsc");
    expect(res.body.equals(PAGE_BODY)).toBe(true);
  });

  it("delivers the first HTML chunk before the server calls end", async () => {
    armPageTail();
    let sawChunk = false;
    let firstChunkBeforeEnd = false;
    try {
      const res = await new Promise<Received>((resolve, reject) => {
        const req = http.request(
          {
            hostname: "127.0.0.1",
            port,
            path: "/page",
            headers: { "accept-encoding": "gzip" },
          },
          (response) => {
            const chunks: Buffer[] = [];
            response.on("data", (chunk) => {
              if (!sawChunk) {
                sawChunk = true;
                firstChunkBeforeEnd = !pageEndCalled;
                releasePageTail?.();
              }
              chunks.push(Buffer.from(chunk));
            });
            response.on("end", () => {
              resolve({
                status: response.statusCode || 0,
                headers: response.headers,
                body: Buffer.concat(chunks),
              });
            });
          }
        );
        req.setTimeout(2000, () => {
          req.destroy(new Error("timed out waiting for the first HTML chunk"));
        });
        req.on("error", reject);
        req.end();
      });
      expect(sawChunk).toBe(true);
      expect(firstChunkBeforeEnd).toBe(true);
      expect(pageEndCalled).toBe(true);
      expect(res.headers["content-encoding"]).toBeUndefined();
      expect(res.body.equals(PAGE_BODY)).toBe(true);
    } finally {
      disarmPageTail();
    }
  });

  it("does not compress RSC or event-stream bodies", async () => {
    const rsc = await get(port, "/api/rsc", "gzip");
    expect(rsc.headers["content-encoding"]).toBeUndefined();
    expect(rsc.body.equals(RSC_BODY)).toBe(true);

    const stream = await get(port, "/api/stream", "gzip");
    expect(stream.headers["content-encoding"]).toBeUndefined();
    expect(stream.body.equals(STREAM_BODY)).toBe(true);
  });

  it("does not compress a dashboard document even when the type is JSON", async () => {
    const res = await get(port, "/dashboards/abc", "gzip");
    expect(res.headers["content-encoding"]).toBeUndefined();
    expect(res.headers.vary).toBe("rsc");
    expect(res.body.equals(DASHBOARD_BODY)).toBe(true);
  });
});

describe("installResponseCompression basePath", () => {
  const previousBase = process.env.NEXT_BASE_PATH;
  const previousPublic = process.env.NEXT_PUBLIC_BASE_PATH;

  function restoreEnv(): void {
    if (previousBase === undefined) delete process.env.NEXT_BASE_PATH;
    else process.env.NEXT_BASE_PATH = previousBase;
    if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = previousPublic;
  }

  async function withServer(run: (port: number) => Promise<void>): Promise<void> {
    const started = await listen();
    try {
      await run(started.port);
    } finally {
      await new Promise<void>((resolve, reject) => {
        started.server.close((err) => (err ? reject(err) : resolve()));
      });
    }
  }

  afterAll(() => {
    restoreEnv();
  });

  it("reads NEXT_BASE_PATH when options are omitted", async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    process.env.NEXT_BASE_PATH = "/__ha_ingress__";
    const remove = installResponseCompression();
    try {
      await withServer(async (port) => {
        const res = await get(port, "/__ha_ingress__/api/json", "gzip");
        expect(res.headers["content-encoding"]).toBe("gzip");
        expect(gunzipSync(res.body).equals(JSON_BODY)).toBe(true);
        const page = await get(port, "/dashboards/abc", "gzip");
        expect(page.headers["content-encoding"]).toBeUndefined();
        expect(page.body.equals(DASHBOARD_BODY)).toBe(true);
      });
    } finally {
      remove();
      restoreEnv();
    }
  });

  it("falls back to NEXT_PUBLIC_BASE_PATH", async () => {
    delete process.env.NEXT_BASE_PATH;
    process.env.NEXT_PUBLIC_BASE_PATH = "/__ha_ingress__";
    const remove = installResponseCompression();
    try {
      await withServer(async (port) => {
        const res = await get(port, "/__ha_ingress__/api/json", "gzip");
        expect(res.headers["content-encoding"]).toBe("gzip");
        expect(gunzipSync(res.body).equals(JSON_BODY)).toBe(true);
      });
    } finally {
      remove();
      restoreEnv();
    }
  });

  it("uses an injected basePath instead of the environment", async () => {
    process.env.NEXT_BASE_PATH = "/__ha_ingress__";
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    const remove = installResponseCompression({ basePath: "" });
    try {
      await withServer(async (port) => {
        const prefixed = await get(port, "/__ha_ingress__/api/json", "gzip");
        expect(prefixed.headers["content-encoding"]).toBeUndefined();
        expect(prefixed.body.equals(JSON_BODY)).toBe(true);
        const api = await get(port, "/api/json", "gzip");
        expect(api.headers["content-encoding"]).toBe("gzip");
        expect(gunzipSync(api.body).equals(JSON_BODY)).toBe(true);
      });
    } finally {
      remove();
      restoreEnv();
    }
  });
});
