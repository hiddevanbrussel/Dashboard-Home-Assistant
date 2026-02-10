import { describe, it, expect } from "vitest";
import { validateConnectionInput, connectionPayloadSchema } from "./validation";

describe("validateConnectionInput", () => {
  it("accepts valid base URL and token", () => {
    const res = validateConnectionInput({
      baseUrl: "http://homeassistant.local:8123",
      token: "abc123longtoken",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.baseUrl).toBe("http://homeassistant.local:8123");
      expect(res.data.token).toBe("abc123longtoken");
    }
  });

  it("rejects invalid URL and returns error without leaking token", () => {
    const token = "super-secret-token-never-leak";
    const res = validateConnectionInput({
      baseUrl: "not-a-url",
      token,
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).not.toContain(token);
      expect(res.error).toBeTruthy();
    }
  });

  it("rejects empty token without including token in message", () => {
    const res = validateConnectionInput({
      baseUrl: "https://ha.example.com",
      token: "",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).not.toContain("token");
      expect(res.error.length).toBeLessThan(100);
    }
  });

  it("rejects invalid URL scheme", () => {
    const res = validateConnectionInput({
      baseUrl: "ftp://host",
      token: "x",
    });
    expect(res.success).toBe(false);
  });
});

describe("connectionPayloadSchema", () => {
  it("accepts https URL", () => {
    const res = connectionPayloadSchema.safeParse({
      baseUrl: "https://ha.example.com:8123",
      token: "t",
    });
    expect(res.success).toBe(true);
  });
});
