import http from "node:http";
import type { AddressInfo } from "node:net";
import { describe, expect, it } from "vitest";
import { loginAllowed, recordLoginFailure, resetLoginRateLimit } from "./login-rate-limit";
import {
  SOCKET_IP_HEADER,
  clientRateLimitKey,
  installClientAddressGuard,
  normalizeClientIp,
} from "./client-address";

function headers(init: Record<string, string>): Headers {
  return new Headers(init);
}

describe("client rate-limit address", () => {
  it("ignores forwarded headers unless the proxy is trusted", () => {
    const spoofed = headers({
      "x-real-ip": "8.8.8.8",
      "x-forwarded-for": "9.9.9.9",
      [SOCKET_IP_HEADER]: "192.168.1.20",
    });
    expect(clientRateLimitKey(spoofed, {})).toBe("192.168.1.20");
    expect(clientRateLimitKey(spoofed, { TRUST_PROXY: "0" })).toBe("192.168.1.20");
  });

  it("uses X-Real-IP for the add-on and TRUST_PROXY=1", () => {
    const tablet = headers({
      "x-real-ip": "192.168.1.40",
      "x-forwarded-for": "1.2.3.4, 192.168.1.40",
      [SOCKET_IP_HEADER]: "127.0.0.1",
    });
    expect(clientRateLimitKey(tablet, { HA_ADDON: "1" })).toBe("192.168.1.40");
    expect(clientRateLimitKey(tablet, { HA_ADDON: "true" })).toBe("192.168.1.40");
    expect(clientRateLimitKey(tablet, { TRUST_PROXY: "1" })).toBe("192.168.1.40");
  });

  it("falls back to the first forwarded hop when a trusted proxy omits X-Real-IP", () => {
    const tablet = headers({
      "x-forwarded-for": " 192.168.1.41 , 10.0.0.1",
      [SOCKET_IP_HEADER]: "127.0.0.1",
    });
    expect(clientRateLimitKey(tablet, { TRUST_PROXY: "1" })).toBe("192.168.1.41");
  });

  it("keeps a separate bucket per socket address when no proxy is trusted", () => {
    const living = clientRateLimitKey(headers({ [SOCKET_IP_HEADER]: "::ffff:192.168.1.10" }), {});
    const kitchen = clientRateLimitKey(headers({ [SOCKET_IP_HEADER]: "192.168.1.11" }), {});
    expect(living).toBe("192.168.1.10");
    expect(kitchen).toBe("192.168.1.11");
    expect(normalizeClientIp("::ffff:127.0.0.1")).toBe("127.0.0.1");

    resetLoginRateLimit();
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) recordLoginFailure(living, now);
    expect(loginAllowed(living, now).ok).toBe(false);
    expect(loginAllowed(kitchen, now)).toEqual({ ok: true });
  });

  it("does not collapse missing addresses into one local bucket", () => {
    expect(clientRateLimitKey(new Headers(), {})).toBe("unknown-peer");
    expect(clientRateLimitKey(headers({ "x-real-ip": "local" }), {})).toBe("unknown-peer");
  });

  it("overwrites a spoofed socket header with the TCP peer", async () => {
    const uninstall = installClientAddressGuard();
    const server = http.createServer((req, res) => {
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          socket: req.headers[SOCKET_IP_HEADER] ?? null,
          real: req.headers["x-real-ip"] ?? null,
        })
      );
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    try {
      const port = (server.address() as AddressInfo).port;
      const res = await fetch(`http://127.0.0.1:${port}/login`, {
        headers: {
          "x-dashboard-socket-ip": "8.8.8.8",
          "x-real-ip": "9.9.9.9",
        },
      });
      const body = (await res.json()) as { socket: string; real: string };
      expect(body.socket).toBe("127.0.0.1");
      expect(body.real).toBe("9.9.9.9");
      expect(clientRateLimitKey(headers({ [SOCKET_IP_HEADER]: body.socket, "x-real-ip": body.real }), {})).toBe(
        "127.0.0.1"
      );
    } finally {
      uninstall();
      await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    }
  });
});
