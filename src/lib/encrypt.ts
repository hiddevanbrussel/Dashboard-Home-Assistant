/**
 * Server-only encryption for sensitive data (e.g. Home Assistant tokens).
 * Uses AES-256-GCM. Never log or send decrypted tokens to the client.
 *
 * scryptSync is ~30ms and blocks the event loop. The derived key is cached
 * per secret+salt, and the plaintext is cached per secret+salt+ciphertext.
 * The stored hex format (iv + authTag + ciphertext) does not change.
 * A cached plaintext is only returned when that exact ciphertext is still
 * the one being decrypted with the same secret and salt.
 */

import { createCipheriv, createDecipheriv, createHash, randomBytes, scryptSync } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 16;
const AUTH_TAG_LEN = 16;
const MAX_KEYS = 8;
const MAX_PAYLOADS = 32;

const keyCache = new Map<string, Buffer>();
const payloadCache = new Map<string, string>();

let keyDerivations = 0;
let payloadHits = 0;
let payloadMisses = 0;

export type EncryptionCacheStats = {
  keyDerivations: number;
  payloadHits: number;
  payloadMisses: number;
};

/** Counts only. Never includes key material or plaintext. */
export function encryptionCacheStats(): EncryptionCacheStats {
  return { keyDerivations, payloadHits, payloadMisses };
}

export function resetEncryptionCacheStats(): void {
  keyDerivations = 0;
  payloadHits = 0;
  payloadMisses = 0;
}

/**
 * Drop cached plaintext and derived keys. Call this before encrypting a
 * replacement value (settings save, OAuth refresh, integration credentials)
 * so the following encrypt warms the key again and the old plaintext is gone.
 * Lookup is also keyed by ciphertext + secret + salt, so a cached token is
 * never returned once the DB value or the encryption secret differs.
 */
export function clearEncryptionCache(): void {
  payloadCache.clear();
  keyCache.clear();
}

function saltForSecret(): string {
  return process.env.APP_SECRET_SALT ?? "ha-dashboard-salt-v1";
}

function materialId(secret: string, salt: string): string {
  return createHash("sha256").update(secret).update("\0").update(salt).digest("hex");
}

function payloadId(material: string, hexPayload: string): string {
  return createHash("sha256").update(material).update("\0").update(hexPayload.toLowerCase()).digest("hex");
}

function remember<K, V>(map: Map<K, V>, key: K, value: V, max: number): void {
  map.delete(key);
  map.set(key, value);
  while (map.size > max) {
    const oldest = map.keys().next().value;
    if (oldest === undefined) break;
    map.delete(oldest);
  }
}

function getKey(secret: string): Buffer {
  const salt = saltForSecret();
  const id = materialId(secret, salt);
  const cached = keyCache.get(id);
  if (cached) return Buffer.from(cached);
  keyDerivations += 1;
  const key = scryptSync(secret, salt, KEY_LEN);
  remember(keyCache, id, key, MAX_KEYS);
  return Buffer.from(key);
}

function readPayloadCache(secret: string, hexPayload: string): string | undefined {
  const id = payloadId(materialId(secret, saltForSecret()), hexPayload);
  if (!payloadCache.has(id)) return undefined;
  const value = payloadCache.get(id);
  if (value === undefined) return undefined;
  payloadHits += 1;
  remember(payloadCache, id, value, MAX_PAYLOADS);
  return value;
}

function writePayloadCache(secret: string, hexPayload: string, plaintext: string): void {
  const id = payloadId(materialId(secret, saltForSecret()), hexPayload);
  remember(payloadCache, id, plaintext, MAX_PAYLOADS);
}

/**
 * Encrypts plaintext. Returns hex string: iv + authTag + ciphertext.
 */
export function encrypt(plaintext: string, secret?: string): string {
  const keySecret = secret ?? process.env.APP_SECRET;
  if (!keySecret || keySecret.length < 16) {
    throw new Error("APP_SECRET must be set and at least 16 characters");
  }
  const key = getKey(keySecret);
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("hex");
}

/**
 * Decrypts payload produced by encrypt().
 */
export function decrypt(hexPayload: string, secret?: string): string {
  const keySecret = secret ?? process.env.APP_SECRET;
  if (!keySecret || keySecret.length < 16) {
    throw new Error("APP_SECRET must be set and at least 16 characters");
  }
  const cached = readPayloadCache(keySecret, hexPayload);
  if (cached !== undefined) return cached;

  payloadMisses += 1;
  const key = getKey(keySecret);
  const buf = Buffer.from(hexPayload, "hex");
  if (buf.length < IV_LEN + AUTH_TAG_LEN) {
    throw new Error("Invalid encrypted payload");
  }
  const iv = buf.subarray(0, IV_LEN);
  const authTag = buf.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN + AUTH_TAG_LEN);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = decipher.update(ciphertext) + decipher.final("utf8");
  writePayloadCache(keySecret, hexPayload, plaintext);
  return plaintext;
}
