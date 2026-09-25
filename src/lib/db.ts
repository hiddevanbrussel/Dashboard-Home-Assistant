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
    try {
      const token = decrypt(conn.encryptedToken);
      return { baseUrl: conn.baseUrl, token };
    } catch {
      // fall through to addon
    }
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
