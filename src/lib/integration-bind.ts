export type BoundTarget = {
  baseUrl: string;
  secret: string;
};

export type BindInput = {
  envUrl?: string | null;
  envSecret?: string | null;
  storedUrl?: string | null;
  storedSecret?: string | null;
  bodyUrl?: string | null;
  bodySecret?: string | null;
};

function clean(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

/**
 * Never attach an environment or stored secret to a caller-chosen host.
 * A caller-supplied secret may only be sent to the caller-supplied URL.
 */
export function bindSecretToUrl(input: BindInput): { ok: true; target: BoundTarget } | { ok: false; error: string } {
  const envUrl = clean(input.envUrl);
  const envSecret = clean(input.envSecret);
  const storedUrl = clean(input.storedUrl);
  const storedSecret = clean(input.storedSecret);
  const bodyUrl = clean(input.bodyUrl);
  const bodySecret = clean(input.bodySecret);

  if (envSecret) {
    const baseUrl = envUrl || storedUrl;
    if (!baseUrl) {
      return { ok: false, error: "Set the server URL together with the server secret." };
    }
    return { ok: true, target: { baseUrl, secret: envSecret } };
  }

  if (envUrl) {
    const secret = storedSecret || bodySecret;
    if (!secret) return { ok: false, error: "Missing credentials." };
    return { ok: true, target: { baseUrl: envUrl, secret } };
  }

  if (storedSecret && storedUrl && (!bodyUrl || sameOrigin(bodyUrl, storedUrl))) {
    return { ok: true, target: { baseUrl: storedUrl, secret: storedSecret } };
  }

  if (bodyUrl && bodySecret) {
    return { ok: true, target: { baseUrl: bodyUrl, secret: bodySecret } };
  }

  if (storedSecret && storedUrl) {
    return { ok: true, target: { baseUrl: storedUrl, secret: storedSecret } };
  }

  return { ok: false, error: "Missing credentials." };
}
