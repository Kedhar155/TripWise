import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun } from "lucide-react";

export type Weather = {
  temperature: number;
  code: number;
  isDay: boolean;
  days: { date: string; high: number; low: number }[];
};

export function hasCoordinates(latitude: unknown, longitude: unknown): boolean {
  return typeof latitude === "number" && Number.isFinite(latitude) && Math.abs(latitude) <= 90
    && typeof longitude === "number" && Number.isFinite(longitude) && Math.abs(longitude) <= 180;
}

// WMO codes documented at https://open-meteo.com/en/docs#weathervariables
export function weatherCondition(code: number, isDay = true) {
  if (code === 0) return { label: isDay ? "Clear sky" : "Clear night", icon: isDay ? Sun : Moon };
  if (code === 1) return { label: "Mainly clear", icon: isDay ? Sun : Moon };
  if (code === 2) return { label: "Partly cloudy", icon: CloudSun };
  if (code === 3) return { label: "Overcast", icon: Cloud };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: CloudFog };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: CloudDrizzle };
  if ([61, 63, 65, 66, 67].includes(code)) return { label: "Rain", icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: CloudSnow };
  if ([80, 81, 82].includes(code)) return { label: "Rain showers", icon: CloudRain };
  if ([95, 96, 97, 99].includes(code)) return { label: "Thunderstorms", icon: CloudLightning };
  return { label: "Conditions unavailable", icon: Cloud };
}

export function parseWeather(value: unknown): Weather {
  const data = value as { current?: { temperature_2m?: unknown; weather_code?: unknown; is_day?: unknown }; daily?: { time?: unknown[]; temperature_2m_max?: unknown[]; temperature_2m_min?: unknown[] } } | null;
  const current = data?.current;
  const daily = data?.daily;
  const number = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);
  if (!number(current?.temperature_2m) || !number(current?.weather_code)
    || !Array.isArray(daily?.time) || !Array.isArray(daily?.temperature_2m_max) || !Array.isArray(daily?.temperature_2m_min)) {
    throw new Error("Incomplete weather response");
  }
  // Open-Meteo starts daily forecasts today in the destination's timezone.
  const days = daily.time.slice(1, 4).map((date, index) => {
    const high = daily.temperature_2m_max![index + 1];
    const low = daily.temperature_2m_min![index + 1];
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || !number(high) || !number(low) || high < low) {
      throw new Error("Incomplete daily forecast");
    }
    return { date, high, low };
  });
  if (days.length !== 3) throw new Error("Incomplete daily forecast");
  return { temperature: current.temperature_2m, code: current.weather_code, isDay: current.is_day !== 0, days };
}

export async function loadWeather(latitude: number, longitude: number, signal: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude),
    current: "temperature_2m,weather_code,is_day",
    daily: "temperature_2m_max,temperature_2m_min",
    temperature_unit: "celsius", timezone: "auto", forecast_days: "4",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
  });
  if (!response.ok) throw new Error("Weather service unavailable");
  return parseWeather(await response.json());
}
