const BLOCKED_DOMAINS = new Set([
  "shell_command",
  "command_line",
  "rest_command",
  "python_script",
  "hassio",
  "sql",
]);

const IDENT = /^[a-z0-9_]+$/;

export function assertHaServiceCall(
  domain: string,
  service: string
): { ok: true } | { ok: false; error: string } {
  if (!IDENT.test(domain) || !IDENT.test(service)) {
    return { ok: false, error: "Invalid service name." };
  }
  if (BLOCKED_DOMAINS.has(domain)) {
    return { ok: false, error: "That Home Assistant service is blocked." };
  }
  return { ok: true };
}

export function isCameraEntityId(entityId: string): boolean {
  return /^camera\.[a-z0-9_]+$/.test(entityId);
}

export function isEntityId(entityId: string): boolean {
  return /^[a-z0-9_]+\.[a-z0-9_]+$/.test(entityId);
}
