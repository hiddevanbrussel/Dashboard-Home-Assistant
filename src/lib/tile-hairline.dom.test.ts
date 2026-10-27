import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import postcss from "postcss";
import sharp from "sharp";
import tailwindcss from "tailwindcss";
import WebSocket from "ws";
import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config";
import { TILE_HAIRLINE_DARK } from "./tile-hairline";

const CHROME = [
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find((path): path is string => typeof path === "string" && existsSync(path));

const HAIR = TILE_HAIRLINE_DARK;

function tile(id: string, radius: string, box: string, extra = ""): string {
  return `<div id="${id}" data-card="${id}" class="card-plot-in card-plot-played fixed z-30 ${radius} ${HAIR}" style="${box}${extra}">
    <div data-fill class="absolute inset-0 z-10 rounded-[inherit] bg-[#88aaff]"></div>
    <button type="button" data-kebab="${id}" class="tile-kebab-hit absolute right-4 top-4 z-20 rounded-lg p-1.5">
      <svg class="h-4 w-4" viewBox="0 0 24 24"></svg>
    </button>
    <button type="button" data-handle="${id}" data-no-drag aria-label="resize" class="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 items-center justify-center">+</button>
  </div>`;
}

const FIXTURE = `<!doctype html>
<html data-dashboard-edit>
<head><meta charset="utf-8"></head>
<body style="margin:0;background:#112233">
  ${tile("team", "rounded-[1.35rem]", "left:16px;top:16px;width:300px;height:180px")}
  ${tile("trash", "rounded-[1.35rem]", "left:340px;top:16px;width:300px;height:180px", ";contain:layout paint")}
  ${tile("weather", "rounded-[1.75rem]", "left:680px;top:16px;width:300px;height:180px")}
  <div id="weather-edit" data-card="weather-edit" class="card-plot-in card-plot-played fixed z-30 rounded-[1.75rem] rounded-t-none" style="left:16px;top:220px;width:300px;height:180px">
    <div data-shape class="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] ${HAIR}">
      <div data-fill class="relative z-10 h-full w-full bg-[#88aaff]"></div>
      <button type="button" data-kebab="weather-edit" class="tile-kebab-hit absolute right-4 top-4 z-20 rounded-lg p-1.5">
        <svg class="h-4 w-4" viewBox="0 0 24 24"></svg>
      </button>
    </div>
    <button type="button" data-handle="weather-edit" data-no-drag aria-label="resize" class="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 items-center justify-center">+</button>
  </div>
  <div id="nuts" data-card="nuts" class="card-plot-in card-plot-played fixed z-30 rounded-2xl ${HAIR}" style="left:340px;top:220px;width:300px;height:180px">
    <div data-fill class="absolute inset-0 z-10 rounded-[inherit] bg-[#88aaff]"></div>
    <button type="button" id="nuts-kebab" data-kebab="nuts" data-no-drag class="tile-kebab-hit absolute right-4 top-4 z-20 rounded-lg p-1">
      <svg class="h-4 w-4" viewBox="0 0 24 24"></svg>
    </button>
    <button type="button" data-handle="nuts" data-no-drag aria-label="resize" class="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 items-center justify-center">+</button>
  </div>
  <div id="nuts-menu" hidden>menu</div>
  <div id="climate" data-card="climate" class="card-plot-in card-plot-played fixed z-30 rounded-2xl ${HAIR}" style="left:680px;top:220px;width:300px;height:240px">
    <div class="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#88aaff]">
      <div class="flex shrink-0 items-start justify-between gap-3 px-4 pt-3">
        <h2>Klimaat</h2>
        <div class="flex shrink-0 items-center gap-1 pt-0.5">
          <button type="button" class="inline-flex items-center rounded-full px-1 py-0.5">power</button>
          <button type="button" data-kebab="climate" class="tile-kebab-hit z-10 rounded-lg p-1">
            <svg class="h-4 w-4" viewBox="0 0 24 24"></svg>
          </button>
        </div>
      </div>
      <div data-fill class="relative min-h-0 flex-1"></div>
    </div>
    <button type="button" data-handle="climate" data-no-drag aria-label="resize" class="absolute -bottom-0.5 -right-0.5 z-30 flex h-6 w-6 items-center justify-center">+</button>
  </div>
  <script>
    const nuts = document.getElementById("nuts");
    nuts.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-no-drag]")) return;
      nuts.dataset.dragging = "1";
    });
    document.getElementById("nuts-kebab").addEventListener("click", () => {
      document.getElementById("nuts-menu").hidden = false;
    });
  </script>
</body>
</html>`;

const PROBE = `(() => {
  const name = (node) => {
    if (!node || node === document.documentElement || node === document.body) return "outside";
    const kebab = node.closest("[data-kebab]");
    if (kebab) return "kebab:" + kebab.getAttribute("data-kebab");
    const handle = node.closest("[data-handle]");
    if (handle) return "handle:" + handle.getAttribute("data-handle");
    const card = node.closest("[data-card]");
    if (!card) return "outside";
    if (node === card) return "outer:" + card.id;
    return "child:" + card.id;
  };
  const point = (x, y) => name(document.elementFromPoint(x, y));
  return [...document.querySelectorAll("[data-card]")].map((card) => {
    const shape = card.querySelector("[data-shape]") || card;
    const rect = card.getBoundingClientRect();
    const radius = parseFloat(getComputedStyle(shape).borderTopLeftRadius) || 0;
    const after = getComputedStyle(shape, "::after");
    const outerAfter = getComputedStyle(card, "::after");
    const kebab = card.querySelector("[data-kebab]");
    const kr = kebab.getBoundingClientRect();
    const kcx = kr.left + kr.width / 2;
    const kcy = kr.top + kr.height / 2;
    const handle = card.querySelector("[data-handle]");
    const hr = handle.getBoundingClientRect();
    const fill = card.querySelector("[data-fill]");
    const fr = fill ? fill.getBoundingClientRect() : null;
    const inside = Math.min(rect.width, rect.height, Math.max(radius * 0.55, 12));
    return {
      id: card.id,
      radius: getComputedStyle(shape).borderRadius,
      outerRadius: getComputedStyle(card).borderRadius,
      afterRadius: after.borderRadius,
      afterShadow: after.boxShadow,
      outerAfterShadow: outerAfter.boxShadow,
      afterPe: after.pointerEvents,
      afterZ: after.zIndex,
      afterPos: after.position,
      afterInset: [after.top, after.right, after.bottom, after.left],
      rect: { x: rect.left, y: rect.top, w: rect.width, h: rect.height },
      kebab: { x: kcx, y: kcy },
      kebabZ: getComputedStyle(kebab).zIndex,
      siblingCoversDown: !!(fr && kcx >= fr.left && kcx <= fr.right && kcy + 22 >= fr.top && kcy + 22 <= fr.bottom),
      hits: {
        top: point(rect.left + rect.width / 2, rect.top + 1),
        right: point(rect.right - 1, rect.top + rect.height / 2),
        bottom: point(rect.left + rect.width / 2, rect.bottom - 1),
        left: point(rect.left + 1, rect.top + rect.height / 2),
        corner: point(rect.left + inside, rect.top + inside),
        kebabL: point(kcx - 22, kcy),
        kebabR: point(kcx + 22, kcy),
        kebabU: point(kcx, kcy - 22),
        kebabD: point(kcx, kcy + 22),
        handle: point(hr.left + hr.width / 2, hr.top + hr.height / 2),
      },
    };
  });
})()`;

type CardReport = {
  id: string;
  radius: string;
  outerRadius: string;
  afterRadius: string;
  afterShadow: string;
  outerAfterShadow: string;
  afterPe: string;
  afterZ: string;
  afterPos: string;
  afterInset: string[];
  rect: { x: number; y: number; w: number; h: number };
  kebab: { x: number; y: number };
  kebabZ: string;
  siblingCoversDown: boolean;
  hits: Record<string, string>;
};

class Cdp {
  private next = 1;
  private pending = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  private listeners = new Map<string, Array<(params: unknown) => void>>();

  constructor(private ws: WebSocket) {
    ws.on("message", (data) => {
      const msg = JSON.parse(String(data)) as {
        id?: number;
        method?: string;
        params?: unknown;
        result?: unknown;
        error?: unknown;
      };
      if (msg.method) {
        for (const listener of this.listeners.get(msg.method) ?? []) listener(msg.params);
      }
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

  once(method: string): Promise<void> {
    return new Promise((resolve) => {
      const listener = () => {
        const list = this.listeners.get(method) ?? [];
        this.listeners.set(
          method,
          list.filter((item) => item !== listener)
        );
        resolve();
      };
      const list = this.listeners.get(method) ?? [];
      list.push(listener);
      this.listeners.set(method, list);
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

function assertCards(cards: CardReport[], theme: "light" | "dark") {
  expect(cards.map((card) => card.id)).toEqual(["team", "trash", "weather", "weather-edit", "nuts", "climate"]);
  for (const card of cards) {
    expect(card.afterPe, card.id).toBe("none");
    expect(card.afterZ, card.id).toBe("20");
    expect(card.afterPos, card.id).toBe("absolute");
    expect(card.afterInset, card.id).toEqual(["0px", "0px", "0px", "0px"]);
    expect(card.afterRadius, card.id).toBe(card.radius);
    if (theme === "light") {
      expect(card.afterShadow, card.id).toBe("none");
    } else {
      expect(card.afterShadow, card.id).toContain("inset");
      expect(card.afterShadow, card.id).toContain("1px");
      expect(card.afterShadow, card.id).toContain("0.08");
    }
    for (const edge of ["top", "right", "bottom", "left", "corner"] as const) {
      expect(card.hits[edge], `${card.id} ${edge}`).toBe(`child:${card.id}`);
    }
    for (const dir of ["kebabL", "kebabR", "kebabU", "kebabD"] as const) {
      expect(card.hits[dir], `${card.id} ${dir}`).toBe(`kebab:${card.id}`);
    }
    expect(card.hits.handle, card.id).toBe(`handle:${card.id}`);
  }
  const weatherEdit = cards.find((card) => card.id === "weather-edit");
  expect(weatherEdit?.outerRadius).toBe("0px 0px 28px 28px");
  expect(weatherEdit?.afterRadius).toBe("28px");
  expect(weatherEdit?.outerAfterShadow).toBe("none");
  const climate = cards.find((card) => card.id === "climate");
  expect(climate?.kebabZ).toBe("10");
  expect(climate?.siblingCoversDown, "a sibling covers the climate ⋮ below its center").toBe(true);
  for (const dir of ["kebabL", "kebabR", "kebabU", "kebabD"] as const) {
    expect(climate?.hits[dir], `climate ${dir}`).toBe("kebab:climate");
  }
  expect(climate?.hits.handle, "climate scale handle").toBe("handle:climate");
}

describe.skipIf(!CHROME)("dark tile hairline", () => {
  it("follows the visible radius and leaves taps on the card, ⋮ and handle", async () => {
    const css = await compileCss();
    const html = FIXTURE.replace("</head>", `<style>${css}</style><style>html,body{background:#112233}</style></head>`);
    const profile = await mkdtemp(join(tmpdir(), "tile-hairline-"));
    const file = join(profile, "index.html");
    await writeFile(file, html);
    const stderr = { text: "" };
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
    const port = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`chrome did not expose DevTools: ${stderr.text.slice(0, 400)}`)), 8000);
      const onData = (chunk: Buffer) => {
        stderr.text += String(chunk);
        const match = stderr.text.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
        if (!match) return;
        clearTimeout(timer);
        chrome.stderr?.off("data", onData);
        resolve(match[1]);
      };
      chrome.stderr?.on("data", onData);
    });
    const version = (await fetch(`http://127.0.0.1:${port}/json/version`).then((response) => response.json())) as {
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
      const loaded = cdp.once("Page.loadEventFired");
      await send("Page.navigate", { url: `file://${file}` });
      const readyState = (await send("Runtime.evaluate", {
        expression: "document.readyState",
        returnByValue: true,
      })) as { result?: { value?: string } };
      if (readyState.result?.value !== "complete") await loaded;
      await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });

      const readCards = async () => {
        const evaluated = (await send("Runtime.evaluate", {
          expression: PROBE,
          returnByValue: true,
        })) as { result?: { value?: CardReport[] }; exceptionDetails?: unknown };
        if (evaluated.exceptionDetails) throw new Error(JSON.stringify(evaluated.exceptionDetails));
        return evaluated.result?.value ?? [];
      };

      const light = await readCards();
      assertCards(light, "light");
      const lightEdge = await pixel(send, midTop(light, "team"));
      expect(near(lightEdge, [136, 170, 255], 8), `light edge ${lightEdge}`).toBe(true);

      await send("Runtime.evaluate", { expression: "document.documentElement.classList.add('dark')" });
      const dark = await readCards();
      assertCards(dark, "dark");
      const darkEdge = await pixel(send, midTop(dark, "team"));
      const trashEdge = await pixel(send, midTop(dark, "trash"));
      expect(darkEdge[0], `dark edge ${darkEdge}`).toBeGreaterThan(142);
      expect(trashEdge[0], `trash edge ${trashEdge}`).toBeGreaterThan(142);
      const edit = dark.find((card) => card.id === "weather-edit")!;
      const corner = await pixel(send, { x: edit.rect.x + 2, y: edit.rect.y });
      const editTop = await pixel(send, midTop(dark, "weather-edit"));
      expect(corner[0], `edit corner ${corner}`).toBeLessThan(28);
      expect(corner[1], `edit corner ${corner}`).toBeLessThan(45);
      expect(editTop[0], `edit top ${editTop}`).toBeGreaterThan(142);

      await click(send, light.find((card) => card.id === "nuts")!.kebab.x - 48, light.find((card) => card.id === "nuts")!.kebab.y);
      const dragged = (await send("Runtime.evaluate", {
        expression: "({ dragging: document.getElementById('nuts').dataset.dragging || '', menu: document.getElementById('nuts-menu').hidden })",
        returnByValue: true,
      })) as { result?: { value?: { dragging: string; menu: boolean } } };
      expect(dragged.result?.value).toEqual({ dragging: "1", menu: true });

      await send("Runtime.evaluate", { expression: "document.getElementById('nuts').dataset.dragging = ''" });
      const nuts = dark.find((card) => card.id === "nuts")!;
      await click(send, nuts.kebab.x, nuts.kebab.y);
      const opened = (await send("Runtime.evaluate", {
        expression: "({ dragging: document.getElementById('nuts').dataset.dragging || '', menu: document.getElementById('nuts-menu').hidden })",
        returnByValue: true,
      })) as { result?: { value?: { dragging: string; menu: boolean } } };
      expect(opened.result?.value).toEqual({ dragging: "", menu: false });
    } finally {
      ws.close();
      stopChrome(chrome);
      await rm(profile, { recursive: true, force: true }).catch(() => {});
    }
  }, 30000);
});

function midTop(cards: CardReport[], id: string): { x: number; y: number } {
  const card = cards.find((item) => item.id === id)!;
  return { x: card.rect.x + card.rect.w / 2, y: card.rect.y };
}

async function pixel(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
  at: { x: number; y: number }
): Promise<number[]> {
  const shot = (await send("Page.captureScreenshot", {
    format: "png",
    clip: { x: at.x, y: at.y, width: 1, height: 1, scale: 1 },
  })) as { data: string };
  const { data, info } = await sharp(Buffer.from(shot.data, "base64")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const index = (Math.floor(info.height / 2) * info.width + Math.floor(info.width / 2)) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

function near(pixel: number[], expected: number[], tolerance: number): boolean {
  return expected.every((channel, index) => Math.abs(pixel[index] - channel) <= tolerance);
}

async function click(
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>,
  x: number,
  y: number
) {
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
}
