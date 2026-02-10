/**
 * Server-only: get HA connection config from DB (decrypted).
 */

import { prisma } from "./prisma";
import { decrypt } from "./encrypt";

export type HaConfigFromDb = { baseUrl: string; token: string };

export async function getHaConnection(connectionId?: string): Promise<HaConfigFromDb | null> {
  const conn = connectionId
    ? await prisma.connection.findUnique({ where: { id: connectionId } })
    : await prisma.connection.findFirst({ orderBy: { createdAt: "desc" } });
  if (!conn) return null;
  try {
    const token = decrypt(conn.encryptedToken);
    return { baseUrl: conn.baseUrl, token };
  } catch {
    return null;
  }
}
