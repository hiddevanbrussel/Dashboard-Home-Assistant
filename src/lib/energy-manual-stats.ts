/**
 * Client-safe query for a manual energy install.
 * Power sensors are not energy statistics, so only a real sensor id is sent.
 */

const STATISTIC_ID = /^sensor\.[a-z0-9_]+$/;

export type ManualStatisticRole = "import" | "export" | "solar" | "battery_in" | "battery_out";

export function manualStatisticQuery(input: {
  solarId?: string;
  importId?: string;
  exportId?: string;
  batteryInId?: string;
  batteryOutId?: string;
}): string {
  const parts: string[] = [];
  const add = (role: ManualStatisticRole, id: string | undefined) => {
    const value = id?.trim() ?? "";
    if (STATISTIC_ID.test(value)) parts.push(`${role}:${value}`);
  };
  add("solar", input.solarId);
  add("import", input.importId);
  add("export", input.exportId);
  add("battery_in", input.batteryInId);
  add("battery_out", input.batteryOutId);
  return parts.join(",");
}
