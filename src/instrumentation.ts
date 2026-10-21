export async function register() {
  // This file is bundled for the edge runtime too. Next drops the nodejs branch
  // from that bundle, which is what keeps node:http out of the edge build.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { installClientAddressGuard } = await import("./lib/client-address-guard");
    installClientAddressGuard();
    const { assertRuntimeSecrets } = await import("./lib/check-secrets.mjs");
    assertRuntimeSecrets();
  }
}
