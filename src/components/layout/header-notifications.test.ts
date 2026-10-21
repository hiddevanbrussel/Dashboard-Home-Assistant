import { spawn, type ChildProcess } from "node:child_process";
import { createRequire } from "node:module";
import { createServer, type Server } from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import WebSocket from "ws";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getTranslations } from "@/lib/i18n";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

describe("notification dismiss copy", () => {
  it("adds a per-item label and keeps the toast label", () => {
    const en = getTranslations("en");
    const nl = getTranslations("nl");
    expect(en["notifications.dismissItem"]).toBe("Dismiss notification: {title}");
    expect(nl["notifications.dismissItem"]).toBe("Melding verwijderen: {title}");
    expect(en["notifications.dismiss"]).toBe("Dismiss notification");
    expect(nl["notifications.dismiss"]).toBe("Melding sluiten");

    const toasts = fs.readFileSync(
      path.join(root, "src/components/notifications/notification-toasts.tsx"),
      "utf8"
    );
    expect(toasts).toContain('t("notifications.dismiss")');
    expect(toasts).not.toContain("notifications.dismissItem");
  });
});

type Box = { left: number; top: number; right: number; bottom: number; width: number; height: number };

type HitZoneReport = {
  error?: string;
  labels: string[];
  buttons: Box[];
  visibleButtons: Box[];
  panel: Box;
  panelClass: string;
  backdropFilter: string;
  headerClientHeight: number;
  headerHeight: number;
  clear: Box & { text: string; className: string };
  dismissClass: string;
  iconBox: Box;
  iconsHidden: boolean;
  titleOnlyGap: number | null;
  scrollTop: number;
  hits: { label: string; points: number; misses: number; sample: string; hasMessage: boolean }[];
};

type CdpResult = { result?: { value?: unknown } };

const APP_ITEMS = [
  {
    id: "app-1",
    entityId: "vacuum.living",
    title: "Stofzuiger klaar",
    message: "De woonkamer is gezogen.",
    icon: "RobotVacuum",
  },
  {
    id: "app-2",
    entityId: "binary_sensor.hall",
    title: "Alleen titel",
    message: "",
    icon: null,
  },
  {
    id: "app-3",
    entityId: "binary_sensor.door",
    title: "Tweede titel",
    message: "",
    icon: null,
  },
] as const;

const HA_ITEMS = [
  { title: "Voordeur open", message: "De voordeur staat al tien minuten open." },
  { title: "De wasmachine is klaar", message: "De was kan uit de machine." },
  { title: "Beweging in de tuin", message: "Er is beweging gedetecteerd bij de schutting." },
  { title: "Rookmelder testrit", message: "De keukenrookmelder heeft een testrit gedaan." },
  { title: "Batterij laag", message: "De deurbel heeft nog 15% batterij." },
  { title: "Vaatwasser klaar", message: "Het programma is afgerond." },
  { title: "Raam open", message: "Het slaapkamerraam staat open." },
] as const;

function chromeBinary(): string {
  const candidates = [
    process.env.CHROME_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/local/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter((value): value is string => Boolean(value));
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`No Chrome binary found. Set CHROME_PATH. Looked in ${candidates.join(", ")}`);
}

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") resolve(address.port);
      else reject(new Error("Could not bind the hit-zone fixture server"));
    });
  });
}

async function waitForJson(port: number): Promise<void> {
  const deadline = Date.now() + 15_000;
  let last = "not started";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
      last = `HTTP ${response.status}`;
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Chrome DevTools did not open: ${last}`);
}

class Cdp {
  private nextId = 0;
  private pending = new Map<number, { resolve: (value: CdpResult) => void; reject: (error: Error) => void }>();
  readonly logs: string[] = [];

  private constructor(private readonly ws: WebSocket) {}

  static async connect(url: string): Promise<Cdp> {
    const ws = new WebSocket(url);
    await new Promise<void>((resolve, reject) => {
      ws.once("open", () => resolve());
      ws.once("error", reject);
    });
    const cdp = new Cdp(ws);
    ws.on("message", (raw) => {
      const message = JSON.parse(raw.toString()) as {
        id?: number;
        error?: { message?: string };
        result?: CdpResult;
        method?: string;
        params?: { exceptionDetails?: { text?: string }; args?: { value?: unknown; description?: string }[] };
      };
      if (message.id && cdp.pending.has(message.id)) {
        const waiter = cdp.pending.get(message.id)!;
        cdp.pending.delete(message.id);
        if (message.error) waiter.reject(new Error(message.error.message || "CDP error"));
        else waiter.resolve(message.result ?? {});
        return;
      }
      if (message.method === "Runtime.exceptionThrown") {
        cdp.logs.push(message.params?.exceptionDetails?.text || "exception");
      }
      if (message.method === "Runtime.consoleAPICalled") {
        const text = (message.params?.args ?? [])
          .map((arg) => arg.value ?? arg.description ?? "")
          .join(" ");
        cdp.logs.push(text);
      }
    });
    return cdp;
  }

  send(method: string, params: Record<string, unknown> = {}): Promise<CdpResult> {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate<T>(expression: string): Promise<T> {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return result.result?.value as T;
  }

  close(): void {
    this.ws.close();
  }
}

describe("notification dismiss hit zones", () => {
  let server: Server;
  let chrome: ChildProcess;
  let cdp: Cdp;
  let work: string;
  const port = 9400 + Math.floor(Math.random() * 500);

  beforeAll(async () => {
    work = fs.mkdtempSync(path.join(os.tmpdir(), "bell-hit-"));
    const entry = path.join(work, "entry.tsx");
    const mock = path.join(work, "ha-notifications.ts");
    const haPayload = HA_ITEMS.map((item, index) => ({
      notification_id: `ha-${index}`,
      title: item.title,
      message: item.message,
      created_at: "2026-10-21T18:40:00.000Z",
    }));
    const appPayload = APP_ITEMS.map((item, index) => ({
      id: item.id,
      ruleId: "rule",
      entityId: item.entityId,
      title: item.title,
      message: item.message,
      icon: item.icon,
      createdAt: index + 1,
      toastVisible: false,
      dismissed: false,
    }));
    fs.writeFileSync(
      mock,
      `const notifications = ${JSON.stringify(haPayload)};
export function useHaPersistentNotifications() {
  return { notifications, dismiss: async () => {} };
}
`
    );
    fs.writeFileSync(
      entry,
      `import { createRoot } from "react-dom/client";
import { HeaderNotifications } from ${JSON.stringify(path.join(root, "src/components/layout/header-notifications.tsx"))};
import { useAppNotificationsStore } from "@/stores/app-notifications-store";
import { useLanguageStore } from "@/stores/language-store";
import { useThemeStore } from "@/stores/theme-store";

useLanguageStore.setState({ language: "nl" });
useAppNotificationsStore.setState({ items: ${JSON.stringify(appPayload)} });

window.__setBellLanguage = (language) => {
  useLanguageStore.getState().setLanguage(language);
};
window.__setBellTheme = (resolved) => {
  useThemeStore.setState({ resolved });
  document.documentElement.classList.toggle("dark", resolved === "dark");
};

createRoot(document.getElementById("root")).render(
  <div style={{ position: "relative", width: 40, height: 40, marginTop: 280, marginLeft: 24 }}>
    <HeaderNotifications placement="sidebar" />
  </div>
);
`
    );

    const esbuild = require("esbuild") as typeof import("esbuild");
    await esbuild.build({
      absWorkingDir: root,
      entryPoints: [entry],
      bundle: true,
      format: "iife",
      platform: "browser",
      target: "es2022",
      outfile: path.join(work, "bundle.js"),
      jsx: "automatic",
      nodePaths: [path.join(root, "node_modules")],
      alias: { "@": path.join(root, "src") },
      define: {
        "process.env.NODE_ENV": '"test"',
        "process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE": '"nl"',
      },
      plugins: [
        {
          name: "mock-ha-notifications",
          setup(build) {
            build.onResolve({ filter: /use-ha-notifications$/ }, () => ({ path: mock }));
          },
        },
      ],
    });

    const postcss = require("postcss") as (
      plugins: unknown[]
    ) => { process: (css: string, opts: { from: string }) => Promise<{ css: string }> };
    const tailwindcss = require("tailwindcss") as (config: unknown) => unknown;
    const input = fs.readFileSync(path.join(root, "src/app/globals.css"), "utf8");
    const compiled = await postcss([
      tailwindcss({
        config: path.join(root, "tailwind.config.ts"),
      }),
    ]).process(input, { from: path.join(root, "src/app/globals.css") });
    fs.writeFileSync(path.join(work, "bell.css"), compiled.css);
    fs.writeFileSync(
      path.join(work, "index.html"),
      `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="/bell.css" />
  <style>html, body { margin: 0; background: #f4f3f8; }</style>
</head>
<body>
  <div id="root"></div>
  <script>
    localStorage.setItem("dashboard-language", JSON.stringify({ state: { language: "nl" }, version: 0 }));
    window.addEventListener("error", (event) => { window.__bootError = String(event.message); });
  </script>
  <script src="/bundle.js"></script>
</body>
</html>`
    );

    const files: Record<string, string> = {
      "/": "index.html",
      "/index.html": "index.html",
      "/bell.css": "bell.css",
      "/bundle.js": "bundle.js",
    };
    server = createServer((request, response) => {
      const file = files[request.url?.split("?")[0] || "/"];
      if (!file) {
        response.writeHead(404);
        response.end();
        return;
      }
      const body = fs.readFileSync(path.join(work, file));
      const type = file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "text/javascript" : "text/html";
      response.writeHead(200, { "content-type": type, "cache-control": "no-store" });
      response.end(body);
    });
    const httpPort = await listen(server);

    const userData = path.join(work, "chrome");
    chrome = spawn(
      chromeBinary(),
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${userData}`,
        "--window-size=1280,800",
        "about:blank",
      ],
      { stdio: "ignore", detached: true }
    );
    await waitForJson(port);
    const targets = (await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())) as {
      type: string;
      webSocketDebuggerUrl: string;
    }[];
    const page = targets.find((target) => target.type === "page");
    if (!page) throw new Error("Chrome opened no page target");
    cdp = await Cdp.connect(page.webSocketDebuggerUrl);
    await cdp.send("Runtime.enable");
    await cdp.send("Page.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send("Page.navigate", { url: `http://127.0.0.1:${httpPort}/` });
    const ready = await cdp.evaluate<string>(`new Promise((resolve) => {
      const deadline = Date.now() + 8000;
      const tick = () => {
        if (document.querySelector("button[aria-expanded]")) resolve("ok");
        else if (window.__bootError) resolve(String(window.__bootError));
        else if (Date.now() > deadline) resolve("timed out waiting for the bell");
        else requestAnimationFrame(tick);
      };
      tick();
    })`);
    if (ready !== "ok") {
      throw new Error(`Bell fixture did not render: ${ready}\n${cdp.logs.join("\n")}`);
    }
  }, 60_000);

  afterAll(async () => {
    cdp?.close();
    if (chrome?.pid) {
      try {
        process.kill(-chrome.pid, "SIGKILL");
      } catch {
        chrome.kill("SIGKILL");
      }
    }
    await new Promise<void>((resolve) => server?.close(() => resolve()));
    if (work) fs.rmSync(work, { recursive: true, force: true });
  });

  async function measure(scrollTop: number | null): Promise<HitZoneReport> {
    return cdp.evaluate<HitZoneReport>(`(${measureInPage.toString()})(${JSON.stringify(scrollTop)})`);
  }

  it("names each dismiss control and keeps a 44px zone inside the panel", async () => {
    const nl = await measure(null);
    expect(nl.error, cdp.logs.join("\n")).toBeUndefined();
    expect(nl.labels).toEqual(
      [...APP_ITEMS, ...HA_ITEMS].map((item) => `Melding verwijderen: ${item.title}`)
    );
    expect(nl.iconsHidden).toBe(true);
    expect(nl.panelClass).toContain("ml-3.5");
    expect(nl.panelClass).not.toContain("ml-2 ");
    expect(nl.panelClass).toContain("dark:bg-[#1b1a21]");
    expect(nl.panelClass).toContain("dark:shadow-[0_16px_40px_rgba(0,0,0,0.55)]");
    expect(nl.panelClass).toContain("backdrop-blur-xl");
    expect(nl.panelClass.includes("dark:backdrop-blur")).toBe(false);
    expect(nl.backdropFilter).toContain("blur");
    expect(nl.panelClass).toContain("bg-white");
    expect(nl.panelClass).toContain("dark:border-white/10");
    expect(nl.dismissClass).toContain("relative");
    expect(nl.dismissClass).toContain("z-[1]");
    expect(nl.dismissClass).toContain("h-11");
    expect(nl.dismissClass).toContain("w-11");
    expect(nl.dismissClass).toContain("focus-visible:ring-[#4700B5]");
    expect(nl.dismissClass).toContain("dark:focus-visible:ring-[#8357be]");
    expect(nl.clear.className).toContain("h-11");
    expect(nl.clear.className).toContain("focus-visible:ring-[#4700B5]");
    expect(nl.clear.className).toContain("dark:focus-visible:ring-[#8357be]");
    expect(nl.clear.text).toBe("Alles wissen");
    expect(nl.clear.height).toBeGreaterThanOrEqual(44);
    expect(nl.clear.width).toBeGreaterThanOrEqual(44);
    expect(nl.headerClientHeight).toBeGreaterThanOrEqual(44);
    expect(nl.headerClientHeight).toBeLessThanOrEqual(45);
    expect(nl.iconBox.width).toBeGreaterThanOrEqual(24);
    expect(nl.iconBox.height).toBeGreaterThanOrEqual(24);
    expect(nl.iconBox.width).toBeLessThanOrEqual(24.5);
    expect(nl.iconBox.height).toBeLessThanOrEqual(24.5);

    for (const button of nl.buttons) {
      expect(button.width).toBeGreaterThanOrEqual(44);
      expect(button.height).toBeGreaterThanOrEqual(44);
      expect(button.left).toBeGreaterThanOrEqual(nl.panel.left - 0.5);
      expect(button.right).toBeLessThanOrEqual(nl.panel.right + 0.5);
    }
    expect(nl.visibleButtons.length).toBeGreaterThan(0);
    for (const button of nl.visibleButtons) {
      expect(button.top).toBeGreaterThanOrEqual(nl.panel.top - 0.5);
      expect(button.bottom).toBeLessThanOrEqual(nl.panel.bottom + 0.5);
      expect(button.left).toBeGreaterThanOrEqual(nl.panel.left - 0.5);
      expect(button.right).toBeLessThanOrEqual(nl.panel.right + 0.5);
    }
    expect(nl.clear.top).toBeGreaterThanOrEqual(nl.panel.top - 0.5);
    expect(nl.clear.bottom).toBeLessThanOrEqual(nl.panel.bottom + 0.5);
    expect(nl.clear.right).toBeLessThanOrEqual(nl.panel.right + 0.5);
    expect(nl.titleOnlyGap).not.toBeNull();
    expect(nl.titleOnlyGap!).toBeGreaterThanOrEqual(8);
    expect(nl.hits.some((hit) => hit.hasMessage)).toBe(true);
    expect(nl.hits.some((hit) => !hit.hasMessage)).toBe(true);
    for (const hit of nl.hits) {
      expect(hit.points, hit.label).toBeGreaterThanOrEqual(44 * 44);
      expect(hit.misses, `${hit.label} ${hit.sample}`).toBe(0);
    }

    const scrolled = await measure(175);
    expect(scrolled.error).toBeUndefined();
    expect(scrolled.scrollTop).toBe(175);
    for (const button of scrolled.buttons) {
      expect(button.width).toBeGreaterThanOrEqual(44);
      expect(button.height).toBeGreaterThanOrEqual(44);
      expect(button.left).toBeGreaterThanOrEqual(scrolled.panel.left - 0.5);
      expect(button.right).toBeLessThanOrEqual(scrolled.panel.right + 0.5);
    }
    expect(scrolled.visibleButtons.length).toBeGreaterThan(0);
    for (const button of scrolled.visibleButtons) {
      expect(button.top).toBeGreaterThanOrEqual(scrolled.panel.top - 0.5);
      expect(button.bottom).toBeLessThanOrEqual(scrolled.panel.bottom + 0.5);
    }

    await cdp.evaluate<void>(`window.__setBellTheme("dark")`);
    const dark = await measure(null);
    expect(dark.panelClass.includes("backdrop-blur")).toBe(false);
    expect(dark.backdropFilter === "none" || dark.backdropFilter === "").toBe(true);
    expect(dark.panelClass).toContain("dark:bg-[#1b1a21]");
    await cdp.evaluate<void>(`window.__setBellTheme("light")`);

    await cdp.evaluate<void>(`window.__setBellLanguage("en")`);
    const en = await measure(null);
    expect(en.labels[0]).toBe("Dismiss notification: Stofzuiger klaar");
    expect(en.labels).toContain("Dismiss notification: Voordeur open");
    expect(en.clear.text).toBe("Clear all");
  }, 30_000);
});

async function measureInPage(scrollTop: number | null): Promise<HitZoneReport> {
  const bell = document.querySelector<HTMLButtonElement>("button[aria-expanded]");
  if (!bell) return fail("missing bell");
  if (bell.getAttribute("aria-expanded") !== "true") bell.click();
  const deadline = Date.now() + 3000;
  let panel: HTMLElement | null = null;
  while (Date.now() < deadline) {
    panel = document.querySelector<HTMLElement>("div.z-\\[100\\]");
    if (panel && !panel.classList.contains("invisible")) break;
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  }
  if (!panel || panel.classList.contains("invisible")) return fail("panel did not open");
  const scroller = panel.querySelector<HTMLElement>(".overflow-y-auto");
  if (!scroller) return fail("missing scroller");
  if (scrollTop != null) scroller.scrollTop = scrollTop;
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

  const box = (element: Element): Box => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  };
  const dismiss = [...panel.querySelectorAll<HTMLButtonElement>("button[aria-label]")];
  const header = panel.querySelector("h3")?.parentElement;
  const clearButton = header?.querySelector("button");
  if (!header || !clearButton || dismiss.length === 0) return fail("missing dismiss controls");
  const panelBox = box(panel);
  const visibleButtons = dismiss
    .filter((button) => {
      const row = button.closest("li");
      if (!row) return false;
      const rowBox = row.getBoundingClientRect();
      return rowBox.top >= panelBox.top - 0.5 && rowBox.bottom <= panelBox.bottom + 0.5;
    })
    .map(box);
  const alleen = dismiss.find((button) => button.getAttribute("aria-label")?.endsWith("Alleen titel"));
  const tweede = dismiss.find((button) => button.getAttribute("aria-label")?.endsWith("Tweede titel"));
  const titleOnlyGap =
    alleen && tweede ? tweede.getBoundingClientRect().top - alleen.getBoundingClientRect().bottom : null;
  const icon = dismiss[0]?.querySelector("span");
  if (!icon) return fail("missing icon chip");

  return {
    labels: dismiss.map((button) => button.getAttribute("aria-label") || ""),
    buttons: dismiss.map(box),
    visibleButtons,
    panel: panelBox,
    panelClass: panel.className,
    backdropFilter: getComputedStyle(panel).backdropFilter,
    headerClientHeight: header.clientHeight,
    headerHeight: header.getBoundingClientRect().height,
    clear: { ...box(clearButton), text: clearButton.textContent?.trim() || "", className: clearButton.className },
    dismissClass: dismiss[0]?.className || "",
    iconBox: box(icon),
    iconsHidden: dismiss.every((button) => button.querySelector("svg")?.getAttribute("aria-hidden") === "true"),
    titleOnlyGap,
    scrollTop: scroller.scrollTop,
    hits: dismiss.flatMap((button) => {
      const rect = button.getBoundingClientRect();
      const fullyVisible =
        rect.top >= panelBox.top - 0.5 &&
        rect.bottom <= panelBox.bottom + 0.5 &&
        rect.left >= 0 &&
        rect.top >= 0 &&
        rect.right <= window.innerWidth &&
        rect.bottom <= window.innerHeight;
      if (!fullyVisible) return [];
      const row = button.closest("li");
      const hasMessage = Boolean(row?.querySelector("p.break-words"));
      let points = 0;
      let misses = 0;
      const samples: string[] = [];
      for (let y = rect.top + 0.5; y < rect.bottom; y += 1) {
        for (let x = rect.left + 0.5; x < rect.right; x += 1) {
          points += 1;
          const hit = document.elementFromPoint(x, y);
          if (!hit || (hit !== button && !button.contains(hit))) {
            misses += 1;
            if (samples.length < 12) {
              samples.push(
                `${(x - rect.left).toFixed(1)},${(y - rect.top).toFixed(1)} -> ${hit ? `${hit.tagName}.${String(hit.className).slice(0, 60)}` : "null"}`
              );
            }
          }
        }
      }
      const sample = samples.join(" | ");
      return [{ label: button.getAttribute("aria-label") || "", points, misses, sample, hasMessage }];
    }),
  };

  function fail(error: string): HitZoneReport {
    return {
      error,
      labels: [],
      buttons: [],
      visibleButtons: [],
      panel: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
      panelClass: "",
      backdropFilter: "",
      headerClientHeight: 0,
      headerHeight: 0,
      clear: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, text: "", className: "" },
      dismissClass: "",
      iconBox: { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
      iconsHidden: false,
      titleOnlyGap: null,
      scrollTop: 0,
      hits: [],
    };
  }
}
