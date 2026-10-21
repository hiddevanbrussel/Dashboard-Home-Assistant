import http from "node:http";
import { SOCKET_IP_HEADER, normalizeClientIp } from "./client-address";

type StampedServer = http.Server & { __dashboardSocketStamp?: boolean };

/**
 * Record the TCP peer on every incoming request before route handlers run.
 * Returns an uninstall function for tests.
 * Kept out of client-address.ts so the edge instrumentation bundle does not load node:http.
 */
export function installClientAddressGuard(): () => void {
  const proto = http.Server.prototype as StampedServer;
  if (proto.__dashboardSocketStamp) return () => undefined;
  const original = proto.emit;
  function emitWithSocketIp(this: http.Server, event: string | symbol, ...args: unknown[]): boolean {
    if (event === "request") {
      const req = args[0];
      if (isIncomingMessage(req)) {
        req.headers[SOCKET_IP_HEADER] = normalizeClientIp(req.socket?.remoteAddress);
      }
    }
    return original.apply(this, [event, ...args] as unknown as Parameters<typeof original>);
  }
  proto.emit = emitWithSocketIp as typeof proto.emit;
  proto.__dashboardSocketStamp = true;
  return () => {
    proto.emit = original;
    delete proto.__dashboardSocketStamp;
  };
}

function isIncomingMessage(value: unknown): value is http.IncomingMessage {
  return typeof value === "object" && value !== null && "headers" in value && "socket" in value;
}
