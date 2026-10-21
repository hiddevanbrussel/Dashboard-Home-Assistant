/**
 * Startup rules for APP_SECRET and DASHBOARD_PASSWORD.
 * Plain JS so the Node 20 container can run it before the server starts.
 */

export const WEAK_SECRETS = new Set([
  "your-32-byte-secret-for-encryption-change-in-production",
  "dev-secret-change-in-production-32b",
  "replace-with-openssl-rand-hex-32",
  "replace-with-a-long-passphrase",
  "change-this-to-a-random-32-char-secret",
  "changeme",
  "change-me",
  "password",
  "secret",
  "dashboard",
]);

/**
 * @param {string | undefined | null} value
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateAppSecret(value) {
  const secret = (value ?? "").trim();
  if (secret.length < 32) {
    return { ok: false, error: "APP_SECRET must be at least 32 characters. Generate one with: openssl rand -hex 32" };
  }
  if (WEAK_SECRETS.has(secret)) {
    return { ok: false, error: "APP_SECRET is a public placeholder. Generate a new one with: openssl rand -hex 32" };
  }
  if (new Set(secret).size < 8) {
    return { ok: false, error: "APP_SECRET is too repetitive. Generate one with: openssl rand -hex 32" };
  }
  return { ok: true };
}

/**
 * @param {string | undefined | null} value
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateDashboardPassword(value) {
  const password = (value ?? "").trim();
  if (password.length < 12) {
    return { ok: false, error: "DASHBOARD_PASSWORD must be at least 12 characters." };
  }
  if (WEAK_SECRETS.has(password) || WEAK_SECRETS.has(password.toLowerCase())) {
    return { ok: false, error: "DASHBOARD_PASSWORD is too easy to guess." };
  }
  return { ok: true };
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @param {string[]} [argv]
 */
export function shouldEnforceRuntimeSecrets(env = process.env, argv = process.argv) {
  if (env.NEXT_PHASE === "phase-production-build") return false;
  if (argv.some((arg) => arg === "build" || arg.endsWith("/build"))) return false;
  return true;
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateRuntimeSecrets(env = process.env) {
  const secret = validateAppSecret(env.APP_SECRET);
  if (!secret.ok) return secret;
  const password = validateDashboardPassword(env.DASHBOARD_PASSWORD);
  if (!password.ok) return password;
  if ((env.APP_SECRET ?? "").trim() === (env.DASHBOARD_PASSWORD ?? "").trim()) {
    return { ok: false, error: "DASHBOARD_PASSWORD must be different from APP_SECRET." };
  }
  return { ok: true };
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @param {string[]} [argv]
 */
export function assertRuntimeSecrets(env = process.env, argv = process.argv) {
  if (!shouldEnforceRuntimeSecrets(env, argv)) return;
  const result = validateRuntimeSecrets(env);
  if (!result.ok) {
    console.error(`[startup] ${result.error}`);
    throw new Error(result.error);
  }
}

const isDirect = process.argv[1] && process.argv[1].endsWith("check-secrets.mjs");
if (isDirect) {
  try {
    assertRuntimeSecrets();
  } catch {
    process.exit(1);
  }
}
