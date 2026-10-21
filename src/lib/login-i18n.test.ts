import { describe, expect, it } from "vitest";
import { getTranslations } from "./i18n";

const LOGIN_KEYS = [
  "login.title",
  "login.hint",
  "login.username",
  "login.password",
  "login.submit",
  "login.pending",
  "login.showPassword",
  "login.hidePassword",
  "login.error",
  "login.rateLimited",
  "login.sessionExpired",
  "login.genericError",
] as const;

describe("login copy", () => {
  it("provides every login string in Dutch and English", () => {
    const en = getTranslations("en");
    const nl = getTranslations("nl");
    for (const key of LOGIN_KEYS) {
      expect(en[key], key).toBeTruthy();
      expect(nl[key], key).toBeTruthy();
      expect(en[key]).not.toBe(key);
      expect(nl[key]).not.toBe(key);
    }
    expect(nl["login.title"]).toBe("Dashboard ontgrendelen");
    expect(nl["login.hint"]).toBe(
      "Voer het wachtwoord in om dit dashboard op deze tablet te gebruiken."
    );
    expect(en["login.hint"]).toBe("Enter the password to use this dashboard on this tablet.");
    expect(en["login.hint"]).not.toContain("DASHBOARD_PASSWORD");
    expect(nl["login.hint"]).not.toContain("DASHBOARD_PASSWORD");
  });
});
