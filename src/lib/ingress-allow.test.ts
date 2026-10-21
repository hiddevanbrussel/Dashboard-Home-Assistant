import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const proxy = require("../../homeassistant-addon/rootfs/ingress-proxy.js") as {
  isAllowed: (ip: string) => boolean;
  clientIp: (req: { socket: { remoteAddress?: string } }) => string;
  SUPERVISOR_INGRESS_IP: string;
};

describe("ingress proxy allowlist", () => {
  it("allows the supervisor ingress address and loopback only", () => {
    expect(proxy.SUPERVISOR_INGRESS_IP).toBe("172.30.32.2");
    expect(proxy.isAllowed("172.30.32.2")).toBe(true);
    expect(proxy.isAllowed("127.0.0.1")).toBe(true);
    expect(proxy.isAllowed("::1")).toBe(true);
    expect(proxy.isAllowed("172.30.32.1")).toBe(false);
    expect(proxy.isAllowed("172.17.0.2")).toBe(false);
    expect(proxy.isAllowed("10.0.0.5")).toBe(false);
    expect(proxy.isAllowed("192.168.1.20")).toBe(false);
    expect(proxy.isAllowed("8.8.8.8")).toBe(false);
    expect(proxy.isAllowed("")).toBe(false);
  });

  it("normalizes IPv4-mapped addresses before the allowlist", () => {
    const supervisor = proxy.clientIp({ socket: { remoteAddress: "::ffff:172.30.32.2" } });
    expect(supervisor).toBe("172.30.32.2");
    expect(proxy.isAllowed(supervisor)).toBe(true);
    const lan = proxy.clientIp({ socket: { remoteAddress: "::ffff:192.168.1.50" } });
    expect(proxy.isAllowed(lan)).toBe(false);
  });

  it("does not treat a wide private range or INGRESS_ALLOW_ALL as authorized", () => {
    const previous = process.env.INGRESS_ALLOW_ALL;
    process.env.INGRESS_ALLOW_ALL = "1";
    try {
      expect(proxy.isAllowed("10.1.1.1")).toBe(false);
      expect(proxy.isAllowed("172.16.0.5")).toBe(false);
      expect(proxy.isAllowed("192.168.0.2")).toBe(false);
    } finally {
      if (previous === undefined) delete process.env.INGRESS_ALLOW_ALL;
      else process.env.INGRESS_ALLOW_ALL = previous;
    }
  });
});
