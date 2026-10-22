import { randomBytes } from "node:crypto";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { clearEncryptionCache, decrypt, encrypt, encryptionCacheStats, resetEncryptionCacheStats } from "./encrypt";

const TEST_SECRET = "your-32-byte-secret-for-encryption-change-in-production";

describe("encrypt", () => {
  const originalEnv = process.env.APP_SECRET;

  beforeEach(() => {
    process.env.APP_SECRET = TEST_SECRET;
    clearEncryptionCache();
    resetEncryptionCacheStats();
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

  it("serves a cache hit without deriving the key again", () => {
    const plain = randomBytes(16).toString("hex");
    const ciphertext = encrypt(plain);
    expect(decrypt(ciphertext)).toBe(plain);
    const afterMiss = encryptionCacheStats();
    expect(decrypt(ciphertext)).toBe(plain);
    const afterHit = encryptionCacheStats();
    expect(afterHit.payloadHits).toBe(afterMiss.payloadHits + 1);
    expect(afterHit.keyDerivations).toBe(afterMiss.keyDerivations);
    expect(afterHit.keyDerivations).toBe(1);
  });

  it("drops the cached plaintext when the token changes", () => {
    const previous = randomBytes(16).toString("hex");
    const next = randomBytes(16).toString("hex");
    const previousCiphertext = encrypt(previous);
    expect(decrypt(previousCiphertext)).toBe(previous);
    expect(decrypt(previousCiphertext)).toBe(previous);
    clearEncryptionCache();
    resetEncryptionCacheStats();
    const nextCiphertext = encrypt(next);
    expect(nextCiphertext).not.toBe(previousCiphertext);
    expect(next).not.toBe(previous);
    expect(decrypt(nextCiphertext)).toBe(next);
    expect(encryptionCacheStats().payloadHits).toBe(0);
    expect(encryptionCacheStats().payloadMisses).toBe(1);
    expect(decrypt(previousCiphertext)).toBe(previous);
  });

  it("decrypts a different ciphertext to its own plaintext", () => {
    const first = randomBytes(16).toString("hex");
    const second = randomBytes(16).toString("hex");
    const firstCiphertext = encrypt(first);
    const secondCiphertext = encrypt(second);
    expect(firstCiphertext).not.toBe(secondCiphertext);
    expect(decrypt(firstCiphertext)).toBe(first);
    const hits = encryptionCacheStats().payloadHits;
    expect(decrypt(secondCiphertext)).toBe(second);
    expect(second).not.toBe(first);
    expect(encryptionCacheStats().payloadHits).toBe(hits);
    expect(decrypt(firstCiphertext)).toBe(first);
    expect(encryptionCacheStats().payloadHits).toBe(hits + 1);
  });

  it("does not reuse a cached plaintext under a different secret", () => {
    const plain = randomBytes(16).toString("hex");
    const ciphertext = encrypt(plain);
    expect(decrypt(ciphertext)).toBe(plain);
    expect(() => decrypt(ciphertext, "other-app-secret-at-least-32-chars")).toThrow();
  });
});
