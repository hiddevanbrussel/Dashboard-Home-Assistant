import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { encrypt, decrypt } from "./encrypt";

const TEST_SECRET = "your-32-byte-secret-for-encryption-change-in-production";

describe("encrypt", () => {
  const originalEnv = process.env.APP_SECRET;

  beforeEach(() => {
    process.env.APP_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    process.env.APP_SECRET = originalEnv;
  });

  it("roundtrip: encrypt then decrypt returns original", () => {
    const plain = "my-long-lived-access-token-12345";
    const encrypted = encrypt(plain);
    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toBe(plain);
    expect(encrypted).toMatch(/^[0-9a-f]+$/i);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plain);
  });

  it("decrypt with wrong secret fails", () => {
    const plain = "secret-token";
    const encrypted = encrypt(plain);
    expect(() => decrypt(encrypted, "wrong-secret-key-32-bytes-long!!!")).toThrow();
  });

  it("encrypt without APP_SECRET throws", () => {
    delete process.env.APP_SECRET;
    expect(() => encrypt("x")).toThrow("APP_SECRET");
  });

  it("decrypt with invalid payload throws", () => {
    expect(() => decrypt("short")).toThrow("Invalid encrypted payload");
    expect(() => decrypt("not-hex!!!")).toThrow();
  });
});
