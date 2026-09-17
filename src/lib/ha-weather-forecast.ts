export type WeatherForecastKind = "hourly" | "daily";

export type WeatherForecastItem = {
  datetime: string;
  condition: string;
  temperature: number | null;
  templow: number | null;
  precipitationProbability: number | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function parseNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function parseForecastItem(raw: unknown): WeatherForecastItem | null {
  const item = asRecord(raw);
  if (!item) return null;
  const datetime =
    typeof item.datetime === "string"
      ? item.datetime
      : typeof item.dt === "string"
        ? item.dt
        : "";
  if (!datetime) return null;
  const condition = typeof item.condition === "string" ? item.condition : "";
  return {
    datetime,
    condition,
    temperature: parseNumber(item.temperature ?? item.temp),
    templow: parseNumber(item.templow ?? item.temp_low ?? item.temperature_low),
    precipitationProbability: parseNumber(
      item.precipitation_probability ?? item.precipitationProbability ?? item.precip_probability
    ),
  };
}

export function parseForecastList(raw: unknown): WeatherForecastItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    const parsed = parseForecastItem(item);
    return parsed ? [parsed] : [];
  });
}

/** Home Assistant `weather.get_forecasts` response, plus the older `attributes.forecast` array. */
export function parseWeatherForecastPayload(data: unknown, entityId: string): WeatherForecastItem[] {
  const root = asRecord(data);
  if (!root) return parseForecastList(data);

  const serviceResponse = asRecord(root.service_response) ?? asRecord(root.response) ?? root;
  const entity = asRecord(serviceResponse?.[entityId]) ?? asRecord(serviceResponse?.forecast);
  if (entity?.forecast) return parseForecastList(entity.forecast);
  if (Array.isArray(serviceResponse?.forecast)) return parseForecastList(serviceResponse.forecast);
  if (Array.isArray(root.forecast)) return parseForecastList(root.forecast);
  return [];
}

export function formatForecastHour(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(date);
}

export function formatForecastWeekday(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
}

export function isForecastToday(iso: string): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
