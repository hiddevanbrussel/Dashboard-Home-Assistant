/**
 * Server-only: get HA connection config from DB (decrypted),
 * with Supervisor fallback when running as a Home Assistant app.
 */

import { prisma } from "./prisma";
import { decrypt, encrypt } from "./encrypt";
import {
  getAddonHaConfig,
  isHaAddon,
  isSupervisorBaseUrl,
  type AddonHaConfig,
} from "./ha/addon";
import { resolveOAuthAccessToken, tryParseOAuthBundle } from "./ha/oauth-token";

export type HaConfigFromDb = { baseUrl: string; token: string };

let seedPromise: Promise<void> | null = null;

/**
 * Persist supervisor credentials once so Settings / onboarding see a connection.
 * Runtime API calls still prefer the live SUPERVISOR_TOKEN (see getHaConnection).
 */
async function seedAddonConnection(addon: AddonHaConfig): Promise<void> {
  if (!process.env.APP_SECRET || process.env.APP_SECRET.length < 16) return;
  const existing = await prisma.connection.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (existing && isSupervisorBaseUrl(existing.baseUrl)) return;
  if (existing) return; // user configured a custom URL — leave it
  await prisma.connection.create({
    data: {
      baseUrl: addon.baseUrl,
      encryptedToken: encrypt(addon.token),
    },
  });
}

function ensureAddonSeeded(addon: AddonHaConfig): void {
  if (!isHaAddon()) return;
  if (!seedPromise) {
    seedPromise = seedAddonConnection(addon).catch((err) => {
      console.error("[ha] failed to seed supervisor connection:", err);
      seedPromise = null;
    });
  }
}

async function resolveStoredToken(
  connectionId: string,
  baseUrl: string,
  encryptedToken: string
): Promise<string | null> {
  let raw: string;
  try {
    raw = decrypt(encryptedToken);
  } catch {
    return null;
  }

  if (!tryParseOAuthBundle(raw)) {
    return raw;
  }

  try {
    const resolved = await resolveOAuthAccessToken({ haBaseUrl: baseUrl, encoded: raw });
    if (!resolved) return null;
    if (resolved.encodedToPersist && process.env.APP_SECRET && process.env.APP_SECRET.length >= 16) {
      await prisma.connection
        .update({
          where: { id: connectionId },
          data: { encryptedToken: encrypt(resolved.encodedToPersist) },
        })
        .catch((err) => {
          console.error("[ha] failed to persist refreshed oauth token:", err);
        });
    }
    return resolved.accessToken;
  } catch (err) {
    console.error("[ha] oauth token refresh failed:", err);
    return null;
  }
}

export async function getHaConnection(connectionId?: string): Promise<HaConfigFromDb | null> {
  const addon = getAddonHaConfig();
  if (addon) ensureAddonSeeded(addon);

  const conn = connectionId
    ? await prisma.connection.findUnique({ where: { id: connectionId } })
    : await prisma.connection.findFirst({ orderBy: { createdAt: "desc" } });

  if (conn) {
    // Stored supervisor URL → always use the live Supervisor token (it can rotate).
    if (addon && isSupervisorBaseUrl(conn.baseUrl)) {
      return { baseUrl: addon.baseUrl, token: addon.token };
    }
    const token = await resolveStoredToken(conn.id, conn.baseUrl, conn.encryptedToken);
    if (token) return { baseUrl: conn.baseUrl, token };
  }

  // No usable DB row: auto-link via Supervisor when available
  if (addon) return { baseUrl: addon.baseUrl, token: addon.token };
  return null;
}

/** Public status for UI (never includes the token). */
export async function getHaConnectionStatus(): Promise<{
  baseUrl: string | null;
  source: "supervisor" | "manual" | null;
  addon: boolean;
}> {
  const addon = isHaAddon() && getAddonHaConfig() != null;
  const conn = await getHaConnection();
  if (!conn) {
    return { baseUrl: null, source: null, addon };
  }
  const source = isSupervisorBaseUrl(conn.baseUrl) ? "supervisor" : "manual";
  return {
    baseUrl: source === "supervisor" ? conn.baseUrl : conn.baseUrl,
    source,
    addon: isHaAddon(),
  };
}
