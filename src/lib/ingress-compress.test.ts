import { createRequire } from "node:module";
import { brotliDecompressSync, gunzipSync, gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { gzipProxiedBody, rewriteBody } = require("../../homeassistant-addon/rootfs/ingress-proxy.js") as {
  gzipProxiedBody: (
    body: Buffer,
    headers: Record<string, string | string[] | undefined>,
    acceptEncoding: string | string[] | undefined
  ) => { body: Buffer; headers: Record<string, string | number | string[] | undefined>; encoded: string | null };
  rewriteBody: (body: Buffer, contentType: string, ingressPath: string) => Buffer;
};

const INGRESS = "/api/hassio_ingress/x";

function jsonBody(value: unknown): Buffer {
  const text = JSON.stringify(value);
  return Buffer.from(text.length >= 1200 ? text : text + " ".repeat(1200));
}

describe("ingress proxy compression", () => {
  it("gzips rewritten JSON and sets Vary and Content-Encoding", () => {
    const raw = jsonBody({ path: "/__ha_ingress__/api/ha/state" });
    const rewritten = rewriteBody(raw, "application/json", INGRESS);
    const prepared = gzipProxiedBody(rewritten, { "content-type": "application/json", vary: "rsc" }, "gzip");
    expect(prepared.encoded).toBe("gzip");
    expect(prepared.headers["content-encoding"]).toBe("gzip");
    expect(String(prepared.headers.vary).toLowerCase()).toContain("accept-encoding");
    expect(String(prepared.headers.vary)).toContain("rsc");
    expect(prepared.body.length).toBeLessThan(rewritten.length);
    const text = gunzipSync(prepared.body).toString("utf8");
    expect(text).toContain(`${INGRESS}/api/ha/state`);
    expect(text).not.toContain("__ha_ingress__");
  });

  it("does not encode when the client asks for identity", () => {
    const body = jsonBody({ ok: true });
    const prepared = gzipProxiedBody(body, { "content-type": "application/json" }, "identity");
    expect(prepared.encoded).toBeNull();
    expect(prepared.headers["content-encoding"]).toBeUndefined();
    expect(prepared.body.equals(body)).toBe(true);
    expect(String(prepared.headers.vary).toLowerCase()).toContain("accept-encoding");
  });

  it("does not compress an already encoded body a second time", () => {
    const raw = gzipSync(Buffer.from("z".repeat(2000)));
    const prepared = gzipProxiedBody(
      raw,
      { "content-type": "application/json", "content-encoding": "gzip" },
      "gzip"
    );
    expect(prepared.encoded).toBeNull();
    expect(prepared.headers["content-encoding"]).toBe("gzip");
    expect(prepared.body.equals(raw)).toBe(true);
    expect(gunzipSync(prepared.body).toString("utf8")).toBe("z".repeat(2000));
  });

  it("uses brotli only when gzip is not accepted", () => {
    const body = jsonBody({ ok: true });
    const prepared = gzipProxiedBody(body, { "content-type": "application/json" }, "br");
    expect(prepared.encoded).toBe("br");
    expect(brotliDecompressSync(prepared.body).equals(body)).toBe(true);
    const both = gzipProxiedBody(body, { "content-type": "application/json" }, "br;q=1, gzip;q=1");
    expect(both.encoded).toBe("gzip");
  });
});
