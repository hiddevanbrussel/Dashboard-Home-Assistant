import { describe, expect, it } from "vitest";
import {
  readMusicAssistantEnvConfig,
  resolveMusicAssistantBaseUrl,
  resolveMusicAssistantToken,
} from "./music-assistant-env";

describe("resolveMusicAssistantToken", () => {
  it("prefers the env/Docker token over a browser body token", () => {
    expect(
      resolveMusicAssistantToken({ envToken: " env-token ", bodyToken: "browser-token" })
    ).toEqual({ token: "env-token", source: "env" });
  });

  it("uses the browser body when no env token is set", () => {
    expect(resolveMusicAssistantToken({ envToken: "", bodyToken: " browser " })).toEqual({
      token: "browser",
      source: "body",
    });
  });

  it("returns null when neither token is set", () => {
    expect(resolveMusicAssistantToken({ envToken: "  ", bodyToken: null })).toEqual({
      token: "",
      source: null,
    });
  });
});

describe("resolveMusicAssistantBaseUrl", () => {
  it("prefers MUSIC_ASSISTANT_URL over the client body URL", () => {
    expect(
      resolveMusicAssistantBaseUrl({
        envUrl: "192.168.1.80",
        bodyUrl: "http://browser.local:8095",
      })
    ).toEqual({ baseUrl: "http://192.168.1.80:8095", source: "env" });
  });

  it("falls back to a safe body URL", () => {
    expect(
      resolveMusicAssistantBaseUrl({
        envUrl: "",
        bodyUrl: "https://ma.lan:8095/",
      })
    ).toEqual({ baseUrl: "https://ma.lan:8095", source: "body" });
  });

  it("rejects credentials in the URL", () => {
    expect(
      resolveMusicAssistantBaseUrl({
        envUrl: "http://user:pass@ma.lan:8095",
        bodyUrl: null,
      })
    ).toEqual({ baseUrl: "", source: null });
  });
});

describe("readMusicAssistantEnvConfig", () => {
  it("reports configured env token and URL without exposing the token", () => {
    expect(
      readMusicAssistantEnvConfig({
        MUSIC_ASSISTANT_TOKEN: "secret",
        MUSIC_ASSISTANT_URL: "http://ma.lan:8095",
      })
    ).toEqual({
      envTokenConfigured: true,
      envUrlConfigured: true,
      envUrl: "http://ma.lan:8095",
    });
  });

  it("reports nothing when env is empty", () => {
    expect(readMusicAssistantEnvConfig({})).toEqual({
      envTokenConfigured: false,
      envUrlConfigured: false,
      envUrl: null,
    });
  });
});
