"use client";

type ImmichRequest = {
  baseUrl: string;
  apiKey: string;
  method?: "GET" | "POST";
  path: string;
  payload?: unknown;
};

export async function immichRequest<T = unknown>(req: ImmichRequest): Promise<T> {
  const res = await fetch("/api/immich", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok || (data && typeof data === "object" && "error" in data && data.error)) {
    throw new Error(
      typeof data?.error === "string" ? data.error : `Immich request failed (${res.status})`
    );
  }
  return data as T;
}
