import { bindSecretToUrl } from "./integration-bind";
import { readIntegration } from "./integration-credentials";
import { resolveImmichBaseUrl } from "./immich-env";
import { resolveMusicAssistantBaseUrl } from "./music-assistant-env";
import { isAllowedHaBaseUrl } from "./ssrf-policy";

export async function boundMusicAssistant(body?: { baseUrl?: string | null; token?: string | null }) {
  const envUrl = resolveMusicAssistantBaseUrl({
    envUrl: process.env.MUSIC_ASSISTANT_URL,
    bodyUrl: null,
  }).baseUrl;
  const stored = await readIntegration("music-assistant");
  const bound = bindSecretToUrl({
    envUrl,
    envSecret: process.env.MUSIC_ASSISTANT_TOKEN,
    storedUrl: stored?.baseUrl,
    storedSecret: stored?.token,
    bodyUrl: body?.baseUrl,
    bodySecret: body?.token,
  });
  if (!bound.ok) return bound;
  if (!isAllowedHaBaseUrl(bound.target.baseUrl)) {
    return { ok: false as const, error: "Music Assistant URL is not allowed." };
  }
  return bound;
}

export async function boundImmich(body?: { baseUrl?: string | null; apiKey?: string | null }) {
  const envUrl = resolveImmichBaseUrl({ envUrl: process.env.IMMICH_URL, bodyUrl: null }).baseUrl;
  const stored = await readIntegration("immich");
  const bound = bindSecretToUrl({
    envUrl,
    envSecret: process.env.IMMICH_API_KEY,
    storedUrl: stored?.baseUrl,
    storedSecret: stored?.apiKey,
    bodyUrl: body?.baseUrl,
    bodySecret: body?.apiKey,
  });
  if (!bound.ok) return bound;
  if (!isAllowedHaBaseUrl(bound.target.baseUrl)) {
    return { ok: false as const, error: "Immich URL is not allowed." };
  }
  return bound;
}

export async function boundValetudo(body?: {
  baseUrl?: string | null;
  username?: string | null;
  password?: string | null;
}) {
  const stored = await readIntegration("valetudo");
  const bound = bindSecretToUrl({
    storedUrl: stored?.baseUrl,
    storedSecret: stored?.password,
    bodyUrl: body?.baseUrl,
    bodySecret: body?.password,
  });
  if (!bound.ok) {
    const baseUrl = (body?.baseUrl || stored?.baseUrl || "").trim();
    if (baseUrl && isAllowedHaBaseUrl(baseUrl)) {
      return {
        ok: true as const,
        target: { baseUrl, secret: body?.password?.trim() || "" },
        username: body?.username || stored?.username || "",
      };
    }
    return { ...bound, username: "" };
  }
  if (!isAllowedHaBaseUrl(bound.target.baseUrl)) {
    return { ok: false as const, error: "Valetudo URL is not allowed.", username: "" };
  }
  const usedStored = Boolean(stored?.password) && bound.target.secret === stored?.password;
  const username = usedStored ? stored?.username || "" : body?.username || "";
  return { ok: true as const, target: bound.target, username };
}
