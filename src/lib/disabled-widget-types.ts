/**
 * Widget types temporarily hidden from the add-tile picker.
 * Existing cards of these types still render. Remove a type from this set to re-enable it.
 */
export const TEMPORARILY_DISABLED_WIDGET_TYPES = new Set<string>([
  "solar_card",
  "power_usage_card",
  "device_consumption_card",
  "sensor_card",
  "nuts_card",
  "card_group",
]);

export function isWidgetTypeTemporarilyDisabled(type: string): boolean {
  return TEMPORARILY_DISABLED_WIDGET_TYPES.has(type);
}
