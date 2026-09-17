import { NextResponse } from "next/server";
import { getHaConnection } from "@/lib/db";
import { callServiceWithResponse, getEntities } from "@/lib/ha/rest";
import { parseForecastList, parseWeatherForecastPayload, type WeatherForecastKind } from "@/lib/ha-weather-forecast";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const entityId = url.searchParams.get("entity_id")?.trim() ?? "";
  const typeParam = url.searchParams.get("type") === "hourly" ? "hourly" : "daily";
  const kind: WeatherForecastKind = typeParam;
  if (!entityId) {
    return NextResponse.json({ error: "entity_id required" }, { status: 400 });
  }

  const config = await getHaConnection();
  if (!config) {
    return NextResponse.json({ error: "No HA connection" }, { status: 400 });
  }

  const result = await callServiceWithResponse(config, "weather", "get_forecasts", {
    entity_id: entityId,
    type: kind,
  });
  if (result.ok) {
    const forecast = parseWeatherForecastPayload(result.data, entityId);
    if (forecast.length > 0) {
      return NextResponse.json({ forecast });
    }
  }

  try {
    const entities = await getEntities(config);
    const entity = entities.find((item) => item.entity_id === entityId);
    const fallback = parseForecastList(entity?.attributes?.forecast);
    return NextResponse.json({ forecast: fallback });
  } catch {
    return NextResponse.json({ forecast: [] });
  }
}
