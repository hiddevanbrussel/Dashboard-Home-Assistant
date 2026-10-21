export const WEAK_SECRETS: Set<string>;

export function validateAppSecret(
  value: string | undefined | null
): { ok: true } | { ok: false; error: string };

export function validateDashboardPassword(
  value: string | undefined | null
): { ok: true } | { ok: false; error: string };

export function shouldEnforceRuntimeSecrets(
  env?: NodeJS.ProcessEnv,
  argv?: string[]
): boolean;

export function validateRuntimeSecrets(
  env?: NodeJS.ProcessEnv
): { ok: true } | { ok: false; error: string };

export function assertRuntimeSecrets(env?: NodeJS.ProcessEnv, argv?: string[]): void;
