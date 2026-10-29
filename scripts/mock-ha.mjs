/**
 * Dev-only Home Assistant stand-in.
 *   PORT=8210 FIXTURE_SET=full|no-solar|no-battery|no-prefs|fixed-tariff|dynamic node scripts/mock-ha.mjs
 * Does not log the access token.
 */
import { spawn } from "node:child_process";
import { register } from "node:module";
import { pathToFileURL } from "node:url";

const quiet = "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON";
if (!process.execArgv.includes(quiet)) {
  const child = spawn(process.execPath, [quiet, ...process.execArgv, process.argv[1], ...process.argv.slice(2)], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code ?? 1));
} else {
  await start();
}

async function start() {

const hook = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    try {
      return await nextResolve(specifier, context);
    } catch {
      return nextResolve(specifier + ".ts", context);
    }
  }
  return nextResolve(specifier, context);
}
`;

register(`data:text/javascript,${encodeURIComponent(hook)}`, { parentURL: pathToFileURL(process.cwd() + "/") });

const { listenMockHaFromEnv } = await import("../src/lib/ha/mock-ha.ts");
await listenMockHaFromEnv();
}
