import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function compile(source, resolve = require) {
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(resolve, compiled, compiled.exports);
  return compiled.exports;
}
const weather = compile(await readFile('src/lib/weather.ts', 'utf8'));
const { WeatherBox } = compile(await readFile('src/components/weather-box.tsx', 'utf8'), id => id === '@/lib/weather' ? weather : require(id));
for (const [lat, lon] of [[undefined, 10], [10, null], [NaN, 10], [91, 0], [0, 181], ['10', 10]]) {
  assert.equal(weather.hasCoordinates(lat, lon), false);
  assert.equal(WeatherBox({ latitude: lat, longitude: lon }), null);
}
assert.equal(weather.hasCoordinates(0, 0), true);
assert.ok(WeatherBox({ latitude: 0, longitude: 0 }));
const fixture = () => ({
  current: { temperature_2m: 0, weather_code: 0, is_day: 0 },
  daily: { time: ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'], temperature_2m_max: [20, 21, 22, 23], temperature_2m_min: [10, 11, 12, 13] },
});
const parsed = weather.parseWeather(fixture());
assert.equal(parsed.temperature, 0);
assert.equal(parsed.isDay, false);
assert.deepEqual(parsed.days.map(day => day.date), ['2026-10-18', '2026-10-19', '2026-10-20']);
assert.deepEqual(parsed.days[0], { date: '2026-10-18', high: 21, low: 11 });
for (const value of [null, {}, { current: {} }, { ...fixture(), daily: { time: [] } }]) assert.throws(() => weather.parseWeather(value));
for (const field of ['temperature_2m_max', 'temperature_2m_min']) {
  const bad = fixture(); bad.daily[field][1] = null;
  assert.throws(() => weather.parseWeather(bad), 'Missing temperatures must not become zero');
}
const codes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 97, 99];
for (const code of codes) assert.notEqual(weather.weatherCondition(code).label, 'Conditions unavailable');
assert.equal(weather.weatherCondition(0, false).label, 'Clear night');
assert.equal(weather.weatherCondition(999).label, 'Conditions unavailable');

// Render each panel state without a network or browser dependency.
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
let renderState = { kind: 'loading' };
const panel = compile(await readFile('src/components/weather-box.tsx', 'utf8'), id => {
  if (id === '@/lib/weather') return weather;
  if (id === 'react') return { ...React, useEffect: () => {}, useState: initial => [typeof initial === 'number' ? 0 : renderState, () => {}] };
  return require(id);
});
const render = () => renderToStaticMarkup(panel.WeatherBox({ latitude: 13.08, longitude: 80.27 }));
assert.match(render(), /Loading weather/);
renderState = { kind: 'error' };
assert.match(render(), /Weather is taking a break/);
assert.match(render(), /Retry weather/);
assert.match(render(), /Weather data by Open-Meteo.com/);
renderState = { kind: 'ready', weather: parsed };
assert.equal((render().match(/<li /g) ?? []).length, 3);
assert.match(render(), /0°C/);
assert.match(render(), /Clear night/);
assert.match(render(), /2026-10-18/);

const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (url, options) => {
    const request = new URL(url);
    assert.equal(request.origin, 'https://api.open-meteo.com');
    assert.equal(request.searchParams.get('latitude'), '13.08');
    assert.equal(request.searchParams.get('longitude'), '80.27');
    assert.equal(request.searchParams.get('timezone'), 'auto');
    assert.equal(request.searchParams.get('forecast_days'), '4');
    assert.equal(request.searchParams.get('temperature_unit'), 'celsius');
    assert.ok(options.signal);
    return Response.json(fixture());
  };
  const controller = new AbortController();
  assert.deepEqual(await weather.loadWeather(13.08, 80.27, controller.signal), parsed);
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(weather.loadWeather(0, 0, controller.signal));
  globalThis.fetch = async () => new Response('invalid json');
  await assert.rejects(weather.loadWeather(0, 0, controller.signal));
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  await assert.rejects(weather.loadWeather(0, 0, controller.signal));
  globalThis.fetch = async (_, options) => { options.signal.throwIfAborted(); };
  controller.abort();
  await assert.rejects(weather.loadWeather(0, 0, controller.signal));
} finally { globalThis.fetch = originalFetch; }
console.log('PASS: hidden weather for absent/invalid coordinates, zero coordinates/temperatures, next-three-day parsing, missing data, WMO icons, destination timezone, request parameters, HTTP/JSON/network errors, and cancellation.');
