/**
 * Server-only encryption for sensitive data (e.g. Home Assistant tokens).
 * Uses AES-256-GCM. Never log or send decrypted tokens to the client.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 16;
const AUTH_TAG_LEN = 16;
const SALT_LEN = 32;

function getKey(secret: string): Buffer {
  const salt = process.env.APP_SECRET_SALT ?? "ha-dashboard-salt-v1";
  return scryptSync(secret, salt, KEY_LEN);
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
  return decipher.update(ciphertext) + decipher.final("utf8");
}
