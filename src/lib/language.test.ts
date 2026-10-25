import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { languageCookie, parseLanguage, readPersistedLanguage, resolveLanguage } from "./language";

describe("resolveLanguage", () => {
  it("prefers the cookie, then the runtime default, then English", () => {
    expect(resolveLanguage("en", "nl")).toBe("en");
    expect(resolveLanguage(undefined, "nl")).toBe("nl");
    expect(resolveLanguage("fr", "NL")).toBe("nl");
    expect(resolveLanguage(null, undefined)).toBe("en");
  });

  it("only accepts nl and en", () => {
    expect(parseLanguage(" NL ")).toBe("nl");
    expect(parseLanguage("de")).toBeNull();
    expect(parseLanguage(3)).toBeNull();
  });
});

describe("language cookie", () => {
  it("is site-wide, lasts a year and is sent on top-level navigation", () => {
    expect(languageCookie("nl")).toBe("dashboard-language=nl; Path=/; Max-Age=31536000; SameSite=Lax");
  });

  it("reads the choice older versions saved in localStorage", () => {
    expect(readPersistedLanguage('{"state":{"language":"nl"},"version":0}')).toBe("nl");
    expect(readPersistedLanguage('{"state":{}}')).toBeNull();
    expect(readPersistedLanguage("not json")).toBeNull();
    expect(readPersistedLanguage(null)).toBeNull();
  });
});

describe("Dutch texts (#280)", () => {
  it("the Dutch dictionary has no English 'Entity'", async () => {
    const { getTranslations } = await import("./i18n");
    const nl = getTranslations("nl");
    expect(nl["editPanel.entity"]).toBe("Entiteit");
    expect(Object.entries(nl).filter(([, value]) => /\bEntity\b/.test(value))).toEqual([]);
  });

  it("onboarding starts without an English dashboard name, so the translated default is used", () => {
    const store = readFileSync(join(process.cwd(), "src/stores/onboarding-store.ts"), "utf8");
    expect(store).not.toContain('dashboardName: "My dashboard"');
    const steps = ["step-name", "step-ready", "step-create-dashboard", "step-done"].map((name) =>
      readFileSync(join(process.cwd(), `src/components/onboarding/${name}.tsx`), "utf8")
    );
    for (const step of steps) expect(step).not.toContain('"My dashboard"');
  });
});

describe("server and first client render use the same language (#278, #284)", () => {
  const source = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

  it("the layout sets <html lang> from the cookie or runtime default and passes it to the client", () => {
    const layout = source("src/app/layout.tsx");
    expect(layout).not.toContain('<html lang="en"');
    expect(layout).toContain("<html lang={language}");
    expect(layout).toContain("resolveLanguage(languageCookieValue, process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE)");
    expect(layout).toContain("<LanguageBootstrap language={language}");
  });

  it("the store does not read localStorage while it is created, and writes the cookie on change", () => {
    const store = source("src/stores/language-store.ts");
    expect(store).toContain("skipHydration: true");
    expect(store).toContain("document.cookie = languageCookie(language)");
    expect(store).toContain("document.documentElement.lang = language");
  });

  it("translations use the server language until the store is ready", () => {
    const hook = source("src/hooks/use-translation.ts");
    expect(hook).toContain("ready || !serverLanguage ? storeLanguage : serverLanguage");
  });
});
