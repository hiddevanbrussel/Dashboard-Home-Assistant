import { z } from "zod";
import { isAllowedHaBaseUrl } from "./ssrf-policy";

/** Base URL for Home Assistant. Cleartext http is limited to the local network. */
export const baseUrlSchema = z
  .string()
  .min(1, "Base URL is required")
  .refine((url) => isAllowedHaBaseUrl(url), {
    message: "Use https, or http only for a local Home Assistant address.",
  });

/** Long-lived access token (non-empty string). */
export const tokenSchema = z.string().min(1, "Token is required");

/** Connection payload for HA (base URL + token). */
export const connectionPayloadSchema = z.object({
  baseUrl: baseUrlSchema,
  token: tokenSchema,
});

/** Entity filter for discovery (domain list). */
export const entityFilterSchema = z.object({
  domains: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export type BaseUrl = z.infer<typeof baseUrlSchema>;
export type ConnectionPayload = z.infer<typeof connectionPayloadSchema>;
export type EntityFilter = z.infer<typeof entityFilterSchema>;

/**
 * Validates connection input. Returns result; never includes token in error messages.
 */
export function validateConnectionInput(input: unknown): { success: true; data: ConnectionPayload } | { success: false; error: string } {
  const result = connectionPayloadSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };
  const first = result.error.flatten().fieldErrors;
  const msg = first.baseUrl?.[0] ?? first.token?.[0] ?? "Invalid connection data";
  return { success: false, error: msg };
}
