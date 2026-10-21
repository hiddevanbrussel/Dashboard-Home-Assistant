import { describe, expect, it } from "vitest";
import {
  shouldEnforceRuntimeSecrets,
  validateAppSecret,
  validateDashboardPassword,
  validateRuntimeSecrets,
} from "./check-secrets.mjs";

const STRONG_SECRET = "k7Qx-9mP2vL4nR8wT6yH3cF5bN1aZ0eD";
const STRONG_PASSWORD = "tablet-passphrase-19";

describe("validateAppSecret", () => {
  it("rejects missing, short, repetitive, and published placeholder secrets", () => {
    expect(validateAppSecret("").ok).toBe(false);
    expect(validateAppSecret("short-secret").ok).toBe(false);
    expect(validateAppSecret("x".repeat(40)).ok).toBe(false);
    expect(validateAppSecret("dev-secret-change-in-production-32b").ok).toBe(false);
    expect(validateAppSecret("your-32-byte-secret-for-encryption-change-in-production").ok).toBe(false);
  });

  it("accepts a long mixed secret", () => {
    expect(validateAppSecret(STRONG_SECRET)).toEqual({ ok: true });
  });
});

describe("validateDashboardPassword", () => {
  it("rejects short and placeholder passwords", () => {
    expect(validateDashboardPassword("short").ok).toBe(false);
    expect(validateDashboardPassword("replace-with-a-long-passphrase").ok).toBe(false);
  });

  it("accepts a passphrase", () => {
    expect(validateDashboardPassword(STRONG_PASSWORD)).toEqual({ ok: true });
  });
});

describe("validateRuntimeSecrets", () => {
  it("rejects a password that matches the encryption secret", () => {
    const result = validateRuntimeSecrets({
      APP_SECRET: STRONG_SECRET,
      DASHBOARD_PASSWORD: STRONG_SECRET,
    } as unknown as NodeJS.ProcessEnv);
    expect(result.ok).toBe(false);
  });

  it("accepts a distinct pair", () => {
    expect(
      validateRuntimeSecrets({
        APP_SECRET: STRONG_SECRET,
        DASHBOARD_PASSWORD: STRONG_PASSWORD,
      } as unknown as NodeJS.ProcessEnv)
    ).toEqual({ ok: true });
  });
});

describe("shouldEnforceRuntimeSecrets", () => {
  it("skips production builds", () => {
    expect(shouldEnforceRuntimeSecrets({ NEXT_PHASE: "phase-production-build" } as unknown as NodeJS.ProcessEnv, ["node"])).toBe(
      false
    );
    expect(shouldEnforceRuntimeSecrets({} as unknown as NodeJS.ProcessEnv, ["node", "next", "build"])).toBe(false);
    expect(shouldEnforceRuntimeSecrets({} as unknown as NodeJS.ProcessEnv, ["node", "server.js"])).toBe(true);
  });
});
