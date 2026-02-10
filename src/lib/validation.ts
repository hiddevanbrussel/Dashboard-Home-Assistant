import { z } from "zod";

/** Base URL for Home Assistant (http or https, optional port). */
export const baseUrlSchema = z
  .string()
  .min(1, "Base URL is required")
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must use http or https" }
  );

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
