import { prisma } from "./prisma";
import { decrypt, encrypt } from "./encrypt";

export const INTEGRATION_KINDS = ["immich", "music-assistant", "pexels", "valetudo"] as const;
export type IntegrationKind = (typeof INTEGRATION_KINDS)[number];

export type IntegrationPayload = {
  baseUrl?: string;
  apiKey?: string;
  token?: string;
  username?: string;
  password?: string;
};

export function isIntegrationKind(value: string): value is IntegrationKind {
  return (INTEGRATION_KINDS as readonly string[]).includes(value);
}

export async function readIntegration(kind: IntegrationKind): Promise<IntegrationPayload | null> {
  const row = await prisma.integrationCredential.findUnique({ where: { kind } });
  if (!row) return null;
  try {
    const parsed = JSON.parse(decrypt(row.encrypted)) as IntegrationPayload;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeIntegration(kind: IntegrationKind, patch: IntegrationPayload): Promise<void> {
  const current = (await readIntegration(kind)) ?? {};
  const next: IntegrationPayload = { ...current };
  for (const key of ["baseUrl", "apiKey", "token", "username", "password"] as const) {
    if (key in patch) next[key] = patch[key];
  }
  await prisma.integrationCredential.upsert({
    where: { kind },
    create: { kind, encrypted: encrypt(JSON.stringify(next)) },
    update: { encrypted: encrypt(JSON.stringify(next)) },
  });
}

export function credentialFlags(payload: IntegrationPayload | null): {
  serverSecretConfigured: boolean;
  serverUrlConfigured: boolean;
  serverUrl: string | null;
} {
  const secret = payload?.apiKey || payload?.token || payload?.password || "";
  const baseUrl = payload?.baseUrl?.trim() || "";
  return {
    serverSecretConfigured: secret.trim().length > 0,
    serverUrlConfigured: baseUrl.length > 0,
    serverUrl: baseUrl || null,
  };
}
