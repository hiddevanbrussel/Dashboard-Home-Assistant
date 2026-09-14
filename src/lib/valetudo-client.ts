"use client";

type ValetudoRequest = {
  baseUrl: string;
  username?: string;
  password?: string;
  method?: "GET" | "PUT";
  path: string;
  payload?: unknown;
};

export async function valetudoRequest<T = unknown>(req: ValetudoRequest): Promise<T> {
  const res = await fetch("/api/valetudo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok || (data && typeof data === "object" && "error" in data && data.error)) {
    throw new Error(
      typeof data?.error === "string" ? data.error : `Valetudo request failed (${res.status})`
    );
  }
  return data as T;
}
