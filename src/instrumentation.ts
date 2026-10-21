export async function register() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  const { assertRuntimeSecrets } = await import("./lib/check-secrets.mjs");
  assertRuntimeSecrets();
}
