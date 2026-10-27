import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import WebSocket from "ws";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config";

const CHROME = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((path): path is string => typeof path === "string" && existsSync(path));

/** Landscape edit chrome: two header pills plus one tile with a scale handle. */
const FIXTURE = `<!doctype html>
<html data-dashboard-edit>
<head><meta charset="utf-8"></head>
<body>
  <div data-app-chrome class="header-chrome-glass fixed inset-x-0 top-0 z-[70]">
    <div data-app-header class="relative flex shrink-0 items-center gap-3 px-4 py-3 sm:px-6">
      <span class="text-sm font-bold tabular-nums">12:34</span>
      <button type="button" class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" aria-label="voice">v</button>
      <div class="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3">
        <div data-header-stat-pills class="flex h-0 shrink-0 items-center gap-3">
          <div data-header-statpill-id="p1" class="flex h-11 shrink-0 items-center">
            <div class="animate-edit-wiggle">
              <div class="relative inline-flex pr-4 text-base">
                <div class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-xl">
                  <span class="h-3.5 w-3.5 shrink-0"></span>
                  <span class="flex flex-col items-start gap-0.5">
                    <span data-pill-label="p1" class="text-xs font-bold tabular-nums leading-none">21°</span>
                    <span class="text-[9px] font-medium leading-none">Buiten</span>
                  </span>
                </div>
                <button type="button" data-kebab="p1" aria-label="options" class="tile-kebab-hit absolute -right-1.5 -top-1.5 z-10 rounded-full bg-white/90 p-1 text-gray-500 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:text-gray-300 dark:ring-white/10">
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>
                </button>
              </div>
            </div>
          </div>
          <div data-header-statpill-id="p2" class="portrait:hidden flex h-11 shrink-0 items-center">
            <div class="animate-edit-wiggle">
              <div class="relative inline-flex pr-4 text-base">
                <div class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-xl">
                  <span class="h-3.5 w-3.5 shrink-0"></span>
                  <span class="flex flex-col items-start gap-0.5">
                    <span data-pill-label="p2" class="text-xs font-bold tabular-nums leading-none">40%</span>
                    <span class="text-[9px] font-medium leading-none">Vocht</span>
                  </span>
                </div>
                <button type="button" data-kebab="p2" aria-label="options" class="tile-kebab-hit absolute -right-1.5 -top-1.5 z-10 rounded-full bg-white/90 p-1 text-gray-500 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:text-gray-300 dark:ring-white/10">
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" aria-label="add" class="inline-flex h-11 items-center rounded-xl px-[18px] text-[15px] font-semibold">Add</button>
      </div>
    </div>
  </div>
  <div class="fixed z-30" style="left:80px;top:180px;width:280px;height:190px">
    <div class="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.75rem]">
      <div class="relative flex h-full min-h-[140px] w-full flex-col overflow-hidden rounded-[1.75rem] bg-white text-base">
        <div class="relative z-10 flex h-full min-h-0 flex-col px-5 pb-3.5 pt-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1"><p class="truncate text-[1.2rem] font-semibold">Weer</p></div>
            <button type="button" data-kebab="tile" aria-label="options" class="tile-kebab-hit shrink-0 rounded-lg p-1.5">
              <svg class="h-5 w-5" viewBox="0 0 24 24"></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <button type="button" data-handle aria-label="resize" class="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 items-center justify-center">+</button>
  </div>
</body>
</html>`;

const PROBE = `(() => {
  const name = (hit) => {
    if (!hit) return null;
    const kebab = hit.closest("[data-kebab]");
    if (kebab) return kebab.getAttribute("data-kebab");
    const handle = hit.closest("[data-handle]");
    if (handle) return "resize";
    return hit.getAttribute("aria-label") || hit.getAttribute("data-pill-label") || hit.tagName;
  };
  const around = (el) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const after = getComputedStyle(el, "::after");
    const pad = parseFloat(after.paddingTop) || 0;
    const radius = (parseFloat(after.height) + pad * 2) / 2;
    const dirs = { left: [-22, 0], right: [22, 0], up: [0, -22], down: [0, 22] };
    const hits = {};
    for (const [key, [dx, dy]] of Object.entries(dirs)) {
      const x = cx + dx;
      const y = cy + dy;
      hits[key] = { y, x, hit: name(document.elementFromPoint(x, y)) };
    }
    const edge = name(document.elementFromPoint(cx, 0.5));
    return { cx, cy, radius, hits, edge };
  };
  const out = {};
  for (const el of document.querySelectorAll("[data-kebab]")) out[el.getAttribute("data-kebab")] = around(el);
  const handle = document.querySelector("[data-handle]");
  const hr = handle.getBoundingClientRect();
  out.handle = name(document.elementFromPoint(hr.left + hr.width / 2, hr.top + hr.height / 2));
  const label = document.querySelector("[data-pill-label=p1]");
  const lr = label.getBoundingClientRect();
  out.p1Label = name(document.elementFromPoint(lr.left + 2, lr.top + lr.height / 2));
  out.p2Visible = getComputedStyle(document.querySelector("[data-kebab=p2]")).display !== "none";
  return out;
})()`;

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

function stopChrome(chrome: ChildProcess) {
  if (!chrome.pid) return;
  try {
    process.kill(-chrome.pid, "SIGKILL");
  } catch {
    chrome.kill("SIGKILL");
  }
}

async function compileCss(): Promise<string> {
  const source = readFileSync("src/app/globals.css", "utf8");
  const result = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: FIXTURE, extension: "html" }],
    }),
  ]).process(source, { from: join(process.cwd(), "src/app/globals.css") });
  return result.css;
}

describe.skipIf(!CHROME)("⋮ elementFromPoint at ±22px", () => {
  it("hits header pills 1 and 2 and a tile, and the scale handle wins", async () => {
    const css = await compileCss();
    const html = FIXTURE.replace(
      "</head>",
      `<style>${css}</style><style>.kebab-original::before{content:none !important}</style></head>`
    );
    const profile = await mkdtemp(join(tmpdir(), "kebab-hit-"));
    const file = join(profile, "index.html");
    await writeFile(file, html);
    const chrome: ChildProcess = spawn(
      CHROME!,
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--remote-debugging-port=0",
        `--user-data-dir=${join(profile, "prof")}`,
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
        else await delay(50);
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
      try {
        const { targetId } = (await cdp.send("Target.createTarget", { url: "about:blank" })) as { targetId: string };
        const { sessionId } = (await cdp.send("Target.attachToTarget", { targetId, flatten: true })) as {
          sessionId: string;
        };
        const send = (method: string, params: Record<string, unknown> = {}) => cdp.send(method, params, sessionId);
        await send("Page.enable");
        await send("Runtime.enable");
        await send("Emulation.setDeviceMetricsOverride", {
          width: 1280,
          height: 800,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await send("Page.navigate", { url: `file://${file}` });
        let ready = false;
        for (let i = 0; i < 40 && !ready; i++) {
          const probe = (await send("Runtime.evaluate", {
            expression:
              "!!document.querySelector('[data-kebab=\"p1\"]') && getComputedStyle(document.querySelector('[data-kebab=\"p1\"]'), '::after').width === '44px'",
            returnByValue: true,
          })) as { result?: { value?: boolean } };
          ready = probe.result?.value === true;
          if (!ready) await delay(25);
        }
        if (!ready) throw new Error("kebab hit target did not appear");
        const evaluated = (await send("Runtime.evaluate", {
          expression: PROBE,
          returnByValue: true,
        })) as { result?: { value?: Probe }; exceptionDetails?: unknown };
        if (evaluated.exceptionDetails) throw new Error(JSON.stringify(evaluated.exceptionDetails));
        const value = evaluated.result?.value;
        expect(value, JSON.stringify(value)).toBeTruthy();
        assertZone(value!);
        await send("Runtime.evaluate", {
          expression: "document.querySelector('[data-kebab=p1]').style.animation='none'",
        });
        const lightHeader = await evalString(
          send,
          "getComputedStyle(document.querySelector('.header-chrome-glass')).backgroundColor"
        );
        const lightIcon = await iconPaint(send);
        expect(lightIcon.position, "header ⋮ svg stacks above the disk").toBe("relative");
        expect(lightIcon.beforePosition).toBe("absolute");
        expect(lightIcon.svgZ).toBe("auto");
        expect(lightIcon.beforeZ).toBe("auto");
        expect(lightIcon.color).toBe("rgb(107, 114, 128)");
        expect(near(lightIcon.pixel, [107, 114, 128]), `light ⋮ center ${lightIcon.pixel}`).toBe(true);
        await send("Runtime.evaluate", { expression: "document.documentElement.classList.add('dark')" });
        const darkColor = await pollString(
          send,
          "getComputedStyle(document.querySelector('[data-kebab=p1] > svg')).color",
          "rgb(209, 213, 219)"
        );
        expect(darkColor, "dark ⋮ color").toBe("rgb(209, 213, 219)");
        const darkIcon = await iconPaint(send);
        expect(darkIcon.position).toBe("relative");
        expect(near(darkIcon.pixel, [209, 213, 219]), `dark ⋮ center ${darkIcon.pixel}`).toBe(true);
        await send("Runtime.evaluate", { expression: "document.documentElement.classList.remove('dark')" });
        const restoredHeader = await pollString(
          send,
          "getComputedStyle(document.querySelector('.header-chrome-glass')).backgroundColor",
          lightHeader
        );
        expect(restoredHeader, "header glass settled").toBe(lightHeader);
        const boxes = (await send("Runtime.evaluate", {
          expression: `(() => {
            const r = document.querySelector('[data-kebab=p1]').getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          })()`,
          returnByValue: true,
        })) as { result?: { value?: Box } };
        const live = boxes.result!.value!;
        const clip = { x: live.x, y: live.y, width: 22, height: 26 };
        const fixedPng = await shot(send, clip);
        await send("Runtime.evaluate", {
          expression: `(() => {
            const el = document.querySelector('[data-kebab=p1]');
            el.classList.add('kebab-original');
            el.style.paddingBottom = '4px';
            el.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            el.style.boxShadow = 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px';
          })()`,
        });
        const originalPng = await shot(send, clip);
        const changed = await countChangedPixels(fixedPng, originalPng);
        expect(changed, "painted ⋮ disk moved").toBe(0);
      } finally {
        ws.close();
      }
    } finally {
      stopChrome(chrome);
      await delay(50);
      await rm(profile, { recursive: true, force: true }).catch(() => {});
    }
  });
});

type Box = { x: number; y: number; w: number; h: number };

async function shot(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
  clip: { x: number; y: number; width: number; height: number }
): Promise<Buffer> {
  const result = (await send("Page.captureScreenshot", {
    format: "png",
    clip: { ...clip, scale: 1 },
  })) as { data: string };
  return Buffer.from(result.data, "base64");
}

type IconPaint = {
  position: string;
  beforePosition: string;
  svgZ: string;
  beforeZ: string;
  color: string;
  pixel: number[];
};

const ICON_PAINT = `(() => {
  const svg = document.querySelector('[data-kebab=p1] > svg');
  const r = svg.getBoundingClientRect();
  const before = getComputedStyle(svg.parentElement, '::before');
  return {
    position: getComputedStyle(svg).position,
    beforePosition: before.position,
    svgZ: getComputedStyle(svg).zIndex,
    beforeZ: before.zIndex,
    color: getComputedStyle(svg).color,
    x: r.x,
    y: r.y,
    w: r.width,
    h: r.height,
  };
})()`;

async function evalString(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
  expression: string
): Promise<string> {
  const evaluated = (await send("Runtime.evaluate", { expression, returnByValue: true })) as {
    result?: { value?: string };
  };
  return evaluated.result?.value ?? "";
}

async function pollString(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
  expression: string,
  expected: string
): Promise<string> {
  let value = "";
  for (let i = 0; i < 40 && value !== expected; i++) {
    value = await evalString(send, expression);
    if (value !== expected) await delay(25);
  }
  return value;
}

async function iconPaint(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>
): Promise<IconPaint> {
  const evaluated = (await send("Runtime.evaluate", {
    expression: ICON_PAINT,
    returnByValue: true,
  })) as { result?: { value?: IconPaint & { x: number; y: number; w: number; h: number } } };
  const box = evaluated.result!.value!;
  const png = await shot(send, { x: box.x, y: box.y, width: box.w, height: box.h });
  return {
    position: box.position,
    beforePosition: box.beforePosition,
    svgZ: box.svgZ,
    beforeZ: box.beforeZ,
    color: box.color,
    pixel: await centerPixel(png),
  };
}

function near(pixel: number[], expected: number[], tolerance = 24): boolean {
  return expected.every((channel, i) => Math.abs(pixel[i] - channel) <= tolerance);
}

async function centerPixel(png: Buffer): Promise<number[]> {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const x = Math.floor(info.width / 2);
  const y = Math.floor(info.height / 2);
  const i = (y * info.width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

async function countChangedPixels(a: Buffer, b: Buffer): Promise<number> {
  const [left, right] = await Promise.all(
    [a, b].map((png) => sharp(png).ensureAlpha().raw().toBuffer())
  );
  if (left.length !== right.length) return Math.max(left.length, right.length);
  let changed = 0;
  for (let i = 0; i < left.length; i += 4) {
    const delta =
      Math.abs(left[i] - right[i]) +
      Math.abs(left[i + 1] - right[i + 1]) +
      Math.abs(left[i + 2] - right[i + 2]) +
      Math.abs(left[i + 3] - right[i + 3]);
    if (delta > 8) changed += 1;
  }
  return changed;
}

type DirHit = { x: number; y: number; hit: string | null };
type Zone = { cx: number; cy: number; radius: number; hits: Record<string, DirHit>; edge: string | null };
type Probe = { p1: Zone; p2: Zone; tile: Zone; handle: string | null; p1Label: string | null; p2Visible: boolean };

function assertZone(value: Probe) {
  expect(value.p2Visible, "landscape shows pill 2").toBe(true);
  for (const id of ["p1", "p2", "tile"] as const) {
    const zone = value[id];
    expect(zone.radius, `${id} radius`).toBeGreaterThanOrEqual(22);
    for (const dir of ["left", "right", "up", "down"] as const) {
      expect(zone.hits[dir], `${id} ${dir}`).toMatchObject({ hit: id });
    }
  }
  expect(value.handle, "scale handle").toBe("resize");
  expect(value.p1Label, "pill face stays its own target").toBe("p1");
}
