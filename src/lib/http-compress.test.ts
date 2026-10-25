import http from "node:http";
import type { AddressInfo } from "node:net";
import { brotliDecompressSync, gunzipSync, gzipSync } from "node:zlib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { installResponseCompression } from "./http-compress";

const JSON_BODY = Buffer.from(JSON.stringify({ pad: "x".repeat(4000) }));
const uninstall = installResponseCompression();

type Received = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
};

function listen(): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer((req, res) => {
    const url = req.url || "/";
    if (url.startsWith("/json")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Vary", "rsc");
      res.flushHeaders();
      res.write(JSON_BODY.subarray(0, 1000));
      res.write(JSON_BODY.subarray(1000));
      res.end();
      return;
    }
    if (url.startsWith("/small")) {
      res.setHeader("Content-Type", "application/json");
      res.end("[]");
      return;
    }
    if (url.startsWith("/png")) {
      res.setHeader("Content-Type", "image/png");
      res.end(Buffer.alloc(5000, 7));
      return;
    }
    if (url.startsWith("/encoded")) {
      const gz = gzipSync(Buffer.from("y".repeat(3000)));
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Encoding", "gzip");
      res.flushHeaders();
      res.end(gz);
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

describe("response compression", () => {
  let server: http.Server;
  let port = 0;

  beforeAll(async () => {
    const started = await listen();
    server = started.server;
    port = started.port;
  });

  afterAll(async () => {
    uninstall();
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("gzips a chunked JSON body and keeps Vary", async () => {
    const res = await get(port, "/json", "gzip, deflate, br");
    expect(res.status).toBe(200);
    expect(res.headers["content-encoding"]).toBe("gzip");
    expect(String(res.headers.vary).toLowerCase()).toContain("accept-encoding");
    expect(String(res.headers.vary)).toContain("rsc");
    expect(res.body.length).toBeLessThan(JSON_BODY.length);
    expect(gunzipSync(res.body).equals(JSON_BODY)).toBe(true);
  });

  it("prefers gzip over brotli when both are equally accepted", async () => {
    const res = await get(port, "/json", "br, gzip");
    expect(res.headers["content-encoding"]).toBe("gzip");
    expect(gunzipSync(res.body).equals(JSON_BODY)).toBe(true);
  });

  it("uses brotli when the client does not accept gzip", async () => {
    const res = await get(port, "/json", "br");
    expect(res.headers["content-encoding"]).toBe("br");
    expect(brotliDecompressSync(res.body).equals(JSON_BODY)).toBe(true);
  });

  it("leaves identity, small JSON, images, and already encoded bodies alone", async () => {
    const identity = await get(port, "/json", "identity");
    expect(identity.headers["content-encoding"]).toBeUndefined();
    expect(identity.body.equals(JSON_BODY)).toBe(true);
    expect(String(identity.headers.vary).toLowerCase()).toContain("accept-encoding");

    const small = await get(port, "/small", "gzip");
    expect(small.headers["content-encoding"]).toBeUndefined();
    expect(small.body.toString("utf8")).toBe("[]");

    const png = await get(port, "/png", "gzip");
    expect(png.headers["content-encoding"]).toBeUndefined();
    expect(png.body.length).toBe(5000);

    const encoded = await get(port, "/encoded", "gzip");
    expect(encoded.headers["content-encoding"]).toBe("gzip");
    expect(gunzipSync(encoded.body).toString("utf8")).toBe("y".repeat(3000));
  });
});
