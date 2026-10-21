import { describe, expect, it } from "vitest";
import { bindSecretToUrl } from "./integration-bind";

describe("bindSecretToUrl", () => {
  it("does not send an environment secret to a caller-chosen host", () => {
    const result = bindSecretToUrl({
      envSecret: "server-secret",
      bodyUrl: "http://attacker.example",
      bodySecret: "ignored",
    });
    expect(result.ok).toBe(false);
  });

  it("keeps the environment secret on the environment URL", () => {
    expect(
      bindSecretToUrl({
        envUrl: "http://music.local:8095",
        envSecret: "server-secret",
        bodyUrl: "http://attacker.example",
        bodySecret: "other",
      })
    ).toEqual({
      ok: true,
      target: { baseUrl: "http://music.local:8095", secret: "server-secret" },
    });
  });

  it("uses a stored secret only with its stored URL", () => {
    expect(
      bindSecretToUrl({
        storedUrl: "http://photos.local:2283",
        storedSecret: "stored",
        bodyUrl: "http://elsewhere.local:2283",
        bodySecret: "body",
      })
    ).toEqual({
      ok: true,
      target: { baseUrl: "http://elsewhere.local:2283", secret: "body" },
    });
  });
});
