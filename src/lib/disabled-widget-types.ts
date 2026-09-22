/**
 * Widget types temporarily hidden from the add-tile picker.
 * Existing cards of these types still render. Remove a type from this set to re-enable it.
 */
export const TEMPORARILY_DISABLED_WIDGET_TYPES = new Set<string>([
  "power_usage_card",
  "device_consumption_card",
  "pill_card",
  "solar_card",
  "sensor_card",
  "vacuum_card",
  "alarm_card",
  "nuts_card",
  "card_group",
]);

export function isWidgetTypeTemporarilyDisabled(type: string): boolean {
  return TEMPORARILY_DISABLED_WIDGET_TYPES.has(type);
}
