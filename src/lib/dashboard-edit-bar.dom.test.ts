import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { setTimeout as delay } from "node:timers/promises";
import WebSocket from "ws";
import { describe, expect, it } from "vitest";
import { DashboardEditBar } from "@/components/dashboard-edit-bar";
import { browsePageDotTop } from "@/lib/dashboard-edit-bar";

const CHROME = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((path): path is string => typeof path === "string" && existsSync(path));

type Hit = {
  hitLabel: string | null;
  hitClass: string | null;
  handle: { x: number; y: number; w: number; h: number };
  bar: { x: number; y: number; w: number; h: number } | null;
  hitIsHandle: boolean;
  hitInBar: boolean;
  addLabel: string | null;
  addIsButton: boolean;
};

function fixtureHtml(width: number, height: number, cardLeft: number): string {
  const bar = renderToStaticMarkup(
    createElement(DashboardEditBar, {
      pageCount: 1,
      page: 0,
      editMode: true,
      onAddPage: () => {},
      onRemovePage: () => {},
      onSelectPage: () => {},
    })
  );
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  html, body { margin: 0; font-size: 16px; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .gap-2 { gap: 0.5rem; }
  .gap-1\\.5 { gap: 0.375rem; }
  .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
  .h-7 { height: 1.75rem; }
  .w-7 { width: 1.75rem; }
  .h-2 { height: 0.5rem; }
  .w-5 { width: 1.25rem; }
  .rounded-full { border-radius: 9999px; }
</style>
</head>
<body>
<div id="viewport" style="position:relative;width:${width}px;height:${height}px;overflow:hidden">
  <div style="position:absolute;left:${cardLeft}px;bottom:32px;width:420px;height:200px">
    <button id="handle" aria-label="resize" style="position:absolute;right:-2px;bottom:-2px;width:24px;height:24px;padding:0">+</button>
  </div>
  ${bar}
</div>
</body>
</html>`;
}

class Cdp {
  private next = 1;
  private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();

  constructor(private ws: WebSocket) {
    ws.on("message", (data) => {
      const msg = JSON.parse(String(data)) as { id?: number; result?: unknown; error?: unknown };
      if (!msg.id || !this.pending.has(msg.id)) return;
      const waiter = this.pending.get(msg.id)!;
      this.pending.delete(msg.id);
      if (msg.error) waiter.reject(new Error(JSON.stringify(msg.error)));
      else waiter.resolve(msg.result);
    });
  }

  send(method: string, params: Record<string, unknown> = {}, sessionId?: string): Promise<unknown> {
    const id = this.next++;
    const payload = JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }
}

async function withChrome<T>(run: (send: Cdp["send"]) => Promise<T>): Promise<T> {
  if (!CHROME) throw new Error("Chrome is not installed");
  const profile = await mkdtemp(join(tmpdir(), "edit-bar-chrome-"));
  const chrome: ChildProcess = spawn(
    CHROME,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { detached: true, stdio: ["ignore", "pipe", "pipe"] }
  );
  let stderr = "";
  chrome.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
  });
  try {
    let port = "";
    for (let i = 0; i < 50 && !port; i++) {
      const match = stderr.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (match) port = match[1];
      else await delay(100);
    }
    if (!port) throw new Error(`chrome did not expose DevTools: ${stderr.slice(0, 400)}`);
    const version = (await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json())) as {
      webSocketDebuggerUrl: string;
    };
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      ws.once("open", () => resolve());
      ws.once("error", () => reject(new Error("devtools websocket failed")));
    });
    const cdp = new Cdp(ws);
    const { targetId } = (await cdp.send("Target.createTarget", { url: "about:blank" })) as { targetId: string };
    const { sessionId } = (await cdp.send("Target.attachToTarget", { targetId, flatten: true })) as {
      sessionId: string;
    };
    const send: Cdp["send"] = (method, params) => cdp.send(method, params, sessionId);
    await send("Page.enable");
    await send("Runtime.enable");
    try {
      return await run(send);
    } finally {
      ws.close();
    }
  } finally {
    if (chrome.pid) {
      try {
        process.kill(-chrome.pid, "SIGKILL");
      } catch {
        chrome.kill("SIGKILL");
      }
    }
    await delay(150);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}

async function hitTest(width: number, height: number, cardLeft: number): Promise<Hit> {
  const dir = await mkdtemp(join(tmpdir(), "edit-bar-fixture-"));
  const file = join(dir, "index.html");
  await writeFile(file, fixtureHtml(width, height, cardLeft));
  try {
    return await withChrome(async (send) => {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await send("Page.navigate", { url: `file://${file}` });
      await delay(250);
      const result = (await send("Runtime.evaluate", {
        expression: `(() => {
          const handle = document.getElementById("handle");
          const hr = handle.getBoundingClientRect();
          const hx = hr.left + hr.width / 2;
          const hy = hr.top + hr.height / 2;
          const hit = document.elementFromPoint(hx, hy);
          const add = document.querySelector('[aria-label="Add page"]');
          const ar = add.getBoundingClientRect();
          const addHit = document.elementFromPoint(ar.left + ar.width / 2, ar.top + ar.height / 2);
          const bar = document.querySelector("[data-dashboard-pager-ui]");
          const br = bar ? bar.getBoundingClientRect() : null;
          return {
            hitLabel: hit && (hit.getAttribute("aria-label") || hit.id || hit.tagName),
            hitClass: hit && String(hit.className).slice(0, 120),
            handle: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
            bar: br && { x: br.x, y: br.y, w: br.width, h: br.height },
            hitIsHandle: hit === handle || !!(hit && handle.contains(hit)),
            hitInBar: !!(hit && hit.closest("[data-dashboard-pager-ui]")),
            addLabel: addHit && (addHit.closest("button") && addHit.closest("button").getAttribute("aria-label")),
            addIsButton: !!(addHit && add.contains(addHit)),
          };
        })()`,
        returnByValue: true,
      })) as { result?: { value?: Hit }; exceptionDetails?: unknown };
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result?.value as Hit;
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function expectHandleClearsBar(hit: Hit) {
  expect(hit, JSON.stringify(hit)).toMatchObject({
    hitInBar: false,
    hitIsHandle: true,
    addIsButton: true,
    addLabel: "Add page",
  });
}

const LAYOUT_CSS = String.raw`
  html, body { margin: 0; font-size: 16px; }
  * { box-sizing: border-box; }
  button { margin: 0; padding: 0; border: 0; background: transparent; }
  .absolute { position: absolute; }
  .relative { position: relative; }
  .bottom-5 { bottom: 1.25rem; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .gap-2 { gap: 0.5rem; }
  .gap-1\.5 { gap: 0.375rem; }
  .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
  .h-7 { height: 1.75rem; }
  .w-7 { width: 1.75rem; }
  .h-2 { height: 0.5rem; }
  .w-2 { width: 0.5rem; }
  .w-5 { width: 1.25rem; }
  .rounded-full { border-radius: 9999px; }
  .pointer-events-none { pointer-events: none; }
  .pointer-events-auto { pointer-events: auto; }
  .z-\[80\] { z-index: 80; }
`;

/** Non-edit chrome from main: `bottom-5`, cluster only as tall as the dots. */
function mainBrowseBarHtml(): string {
  return `<div data-role="main" data-dashboard-pager-ui class="pointer-events-none absolute bottom-5 z-[80] flex justify-center" style="left:5.5rem;right:0">
    <div class="pointer-events-auto flex items-center gap-2">
      <div class="flex items-center gap-1.5 px-1" role="tablist" aria-label="Pages">
        <button type="button" role="tab" aria-selected="true" aria-label="Page 1" class="h-2 w-5 rounded-full"></button>
        <button type="button" role="tab" aria-selected="false" aria-label="Page 2" class="h-2 w-2 rounded-full"></button>
      </div>
    </div>
  </div>`;
}

function browsePositionHtml(width: number, height: number): string {
  const branch = renderToStaticMarkup(
    createElement(DashboardEditBar, {
      pageCount: 2,
      page: 0,
      editMode: false,
      onSelectPage: () => {},
    })
  );
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /><style>${LAYOUT_CSS}</style></head>
<body>
  <div id="main" style="position:relative;width:${width}px;height:${height}px">${mainBrowseBarHtml()}</div>
  <div id="branch" style="position:relative;width:${width}px;height:${height}px">${branch}</div>
</body>
</html>`;
}

type DotBox = { x: number; y: number; w: number; h: number };

async function measureBrowseDots(width: number, height: number): Promise<{ main: DotBox; branch: DotBox }> {
  const dir = await mkdtemp(join(tmpdir(), "edit-bar-browse-"));
  const file = join(dir, "index.html");
  await writeFile(file, browsePositionHtml(width, height));
  try {
    return await withChrome(async (send) => {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height: height * 2,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await send("Page.navigate", { url: `file://${file}` });
      await delay(250);
      const result = (await send("Runtime.evaluate", {
        expression: `(() => {
          function box(root) {
            const host = root.getBoundingClientRect();
            const dot = root.querySelector('[aria-label="Page 1"]');
            const r = dot.getBoundingClientRect();
            return { x: r.x - host.x, y: r.y - host.y, w: r.width, h: r.height };
          }
          return { main: box(document.getElementById("main")), branch: box(document.getElementById("branch")) };
        })()`,
        returnByValue: true,
      })) as { result?: { value?: { main: DotBox; branch: DotBox } }; exceptionDetails?: unknown };
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result?.value as { main: DotBox; branch: DotBox };
    });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe.skipIf(!CHROME)("edit bar elementFromPoint", () => {
  it("returns the resize handle, not the toolbar, for a bottom tile in portrait 800x1280", async () => {
    expectHandleClearsBar(await hitTest(800, 1280, 32));
  });

  it("returns the resize handle, not the toolbar, for a bottom tile in landscape 1280x800", async () => {
    expectHandleClearsBar(await hitTest(1280, 800, 272));
  });

  it("places non-edit page dots on main's bottom-5 position in landscape and portrait", async () => {
    for (const [width, height] of [
      [1280, 800],
      [800, 1280],
    ] as const) {
      const measured = await measureBrowseDots(width, height);
      expect(measured.branch, JSON.stringify(measured)).toEqual(measured.main);
      expect(measured.branch.y).toBe(browsePageDotTop(height));
    }
  });
});
