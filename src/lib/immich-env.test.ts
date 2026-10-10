import { describe, expect, it } from "vitest";
import { readImmichEnvConfig, resolveImmichApiKey, resolveImmichBaseUrl } from "./immich-env";

describe("resolveImmichApiKey", () => {
  it("prefers the env/Docker key over a browser body key", () => {
    expect(
      resolveImmichApiKey({ envKey: " env-key ", bodyKey: "browser-key" })
    ).toEqual({ apiKey: "env-key", source: "env" });
  });

  it("uses the browser body when no env key is set", () => {
    expect(resolveImmichApiKey({ envKey: "", bodyKey: " browser " })).toEqual({
      apiKey: "browser",
      source: "body",
    });
  });

  it("returns null when neither key is set", () => {
    expect(resolveImmichApiKey({ envKey: "  ", bodyKey: null })).toEqual({
      apiKey: "",
      source: null,
    });
  });
});

describe("resolveImmichBaseUrl", () => {
  it("prefers IMMICH_URL over the client body URL", () => {
    expect(
      resolveImmichBaseUrl({
        envUrl: "192.168.1.50",
        bodyUrl: "http://browser.local:2283",
      })
    ).toEqual({ baseUrl: "http://192.168.1.50:2283", source: "env" });
  });

  it("falls back to a safe body URL", () => {
    expect(
      resolveImmichBaseUrl({
        envUrl: "",
        bodyUrl: "https://photos.lan:2283/",
      })
    ).toEqual({ baseUrl: "https://photos.lan:2283", source: "body" });
  });

  it("rejects credentials in the URL", () => {
    expect(
      resolveImmichBaseUrl({
        envUrl: "http://user:pass@photos.lan:2283",
        bodyUrl: null,
      })
    ).toEqual({ baseUrl: "", source: null });
  });
});

describe("readImmichEnvConfig", () => {
  it("reports configured env key and URL without exposing the key", () => {
    expect(
      readImmichEnvConfig({
        IMMICH_API_KEY: "secret",
        IMMICH_URL: "http://immich.lan:2283",
      })
    ).toEqual({
      envKeyConfigured: true,
      envUrlConfigured: true,
      envUrl: "http://immich.lan:2283",
    });
  });

  it("reports nothing when env is empty", () => {
    expect(readImmichEnvConfig({})).toEqual({
      envKeyConfigured: false,
      envUrlConfigured: false,
      envUrl: null,
    });
  });
});
