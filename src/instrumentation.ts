export async function register() {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs") return;
  // Dynamic imports: this file is also bundled for the edge runtime, which cannot load node:http.
  const { installClientAddressGuard } = await import("./lib/client-address");
  installClientAddressGuard();
  const { assertRuntimeSecrets } = await import("./lib/check-secrets.mjs");
  assertRuntimeSecrets();
}
