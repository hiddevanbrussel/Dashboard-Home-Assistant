import { describe, expect, it } from "vitest";
import { clearLoginFailures, loginAllowed, recordLoginFailure, resetLoginRateLimit } from "./login-rate-limit";

describe("login rate limit", () => {
  it("locks a key after five failures and clears on success", () => {
    resetLoginRateLimit();
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) recordLoginFailure("tablet", now);
    const blocked = loginAllowed("tablet", now + 1000);
    expect(blocked.ok).toBe(false);
    clearLoginFailures("tablet");
    expect(loginAllowed("tablet", now + 1000)).toEqual({ ok: true });
  });
});
