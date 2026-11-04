const CALL_TIMEOUT_MS = 8000;

/** turn_on / turn_off for one light or one light group. Omits service_data when empty. */
export async function callHouseLight(
  entityId: string,
  service: "turn_on" | "turn_off",
  serviceData?: Record<string, unknown>
): Promise<void> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);
  const payload: Record<string, unknown> = {
    entity_id: entityId,
    domain: "light",
    service,
  };
  if (serviceData && Object.keys(serviceData).length > 0) payload.service_data = serviceData;
  try {
    const response = await fetch("/api/ha/call-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("call-service");
  } finally {
    window.clearTimeout(timer);
  }
}
