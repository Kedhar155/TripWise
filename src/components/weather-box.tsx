"use client";

import { useEffect, useState } from "react";
import { hasCoordinates, loadWeather, weatherCondition, type Weather } from "@/lib/weather";

export function WeatherBox({ latitude, longitude }: { latitude?: number | null; longitude?: number | null }) {
  if (!hasCoordinates(latitude, longitude)) return null;
  return <WeatherForecast key={`${latitude},${longitude}`} latitude={latitude!} longitude={longitude!} />;
}

function WeatherForecast({ latitude, longitude }: { latitude: number; longitude: number }) {
  const [state, setState] = useState<{ kind: "loading" } | { kind: "error" } | { kind: "ready"; weather: Weather }>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    loadWeather(latitude, longitude, controller.signal)
      .then(weather => { if (!controller.signal.aborted) setState({ kind: "ready", weather }); })
      .catch(() => { if (!controller.signal.aborted) setState({ kind: "error" }); });
    return () => controller.abort();
  }, [latitude, longitude, attempt]);

  const condition = state.kind === "ready" ? weatherCondition(state.weather.code, state.weather.isDay) : null;
  const Icon = condition?.icon;
  return <section aria-label="Destination weather" className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/40 p-5 sm:p-6">
    <h2 className="text-lg font-semibold text-teal-900">Weather at your destination</h2>
    {state.kind === "loading" ? <div role="status" className="mt-4">
      <span className="sr-only">Loading weather…</span>
      <div aria-hidden="true" className="space-y-3"><div className="skeleton h-8 w-32" /><div className="skeleton h-16 w-full" /></div>
    </div> : state.kind === "error" ? <div className="mt-3 text-sm leading-6 text-slate-600">
      <p role="status">Weather is taking a break. Please try again in a moment.</p>
      <button className="retry" onClick={() => { setState({ kind: "loading" }); setAttempt(value => value + 1); }}>Retry weather</button>
    </div> : <>
      <div className="mt-4 flex items-center gap-3 text-teal-800">
        {Icon && <Icon size={32} className="shrink-0" aria-hidden="true" />}
        <div><p className="text-3xl font-semibold">{Math.round(state.weather.temperature)}°C</p><p className="mt-1 text-sm">{condition?.label} · Now</p></div>
      </div>
      <h3 className="mt-5 text-sm font-semibold">Next 3 days</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {state.weather.days.map(day => <li key={day.date} className="rounded-xl border border-teal-100 bg-white p-3 text-sm">
          <time dateTime={day.date} className="font-semibold">{new Date(`${day.date}T12:00:00Z`).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}</time>
          <p className="mt-2 text-slate-600">High <span className="font-semibold text-teal-800">{Math.round(day.high)}°C</span></p>
          <p className="mt-1 text-slate-600">Low {Math.round(day.low)}°C</p>
        </li>)}
      </ul>
    </>}
    <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-xs text-teal-800 underline">Weather data by Open-Meteo.com</a>
  </section>;
}
