"use client";

export function pushIntegrationCredential(body: Record<string, string>): void {
  if (typeof window === "undefined") return;
  void fetch("/api/integration-credentials", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  }).catch(() => undefined);
}
