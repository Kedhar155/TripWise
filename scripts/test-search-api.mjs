import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3021';
const checks = [];
async function call(path, options = {}, expected = 200) {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(45000) });
  const data = await response.json();
  assert.equal(response.status, expected, `${path}: ${data.error?.code}`);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  checks.push({ method: options.method ?? 'GET', path, status: response.status, response: data });
  return data;
}
for (const path of ['/api/cities', '/api/cities?country=xx&q=Par', '/api/cities?country=fr&q=Pa', '/api/cities?country=fr&q=', '/api/places/search', '/api/places/search?name=ab', '/api/places/search?name=', '/api/places/search?name=Eiffel&sort=distance', '/api/places?city=Paris&country=xx', '/api/places?city=Pa&country=fr', '/api/places?city=Paris&cityId=city']) await call(path, {}, 400);
for (const [country, q] of [['in', 'Che'], ['fr', 'Par'], ['jp', 'Tok']]) {
  const path = '/api/cities?' + new URLSearchParams({ country, q });
  const suggestions = await call(path);
  assert.ok(suggestions.cities.length > 0);
  assert.ok(suggestions.cities.every(city => city.country === country));
  assert.deepEqual((await call(path)).cities, suggestions.cities, 'Repeat suggestions remain stable');
  const city = suggestions.cities[0];
  const found = await call('/api/places?' + new URLSearchParams({ city: city.label, country, cityId: city.id, category: 'museums,parks', sort: 'name' }));
  assert.ok(found.places.length > 0);
  assert.ok(found.places.every(place => ['museums', 'parks'].includes(place.category)));
  assert.ok(found.places.every((p, i, a) => i === 0 || a[i - 1].name.localeCompare(p.name, 'en') <= 0));
  console.log(`PASS ${country}: ${city.label}; ${found.places.length} places`);
  if (country === 'fr') await call('/api/places?' + new URLSearchParams({ city: city.label, country: 'in', cityId: city.id }), {}, 400);
}
const known = new Set(['sights', 'museums', 'parks', 'restaurants', 'beaches', 'entertainment', 'shopping', 'accommodation', 'other']);
let famous;
for (const name of ['Eiffel Tower', 'Taj Mahal', 'zzzxxyyqqqnonexistentplace', 'Eifel Tower', 'Central Park']) {
  const data = await call('/api/places/search?' + new URLSearchParams({ name }));
  assert.equal(data.query, name);
  assert.equal(data.meta.distanceFrom, null);
  assert.equal(new Set(data.places.map(place => place.id)).size, data.places.length);
  for (const place of data.places) {
    assert.ok(place.id && place.name && place.address && known.has(place.category));
    assert.ok(Number.isFinite(place.latitude) && Number.isFinite(place.longitude));
    assert.equal(place.distance, undefined);
  }
  if (name === 'zzzxxyyqqqnonexistentplace') assert.equal(data.places.length, 0);
  if (name === 'Central Park') assert.ok(data.places.length > 1);
  if (name === 'Eiffel Tower') { assert.ok(data.places.length > 0); famous = data.places.find(p => p.address.includes('Paris')); assert.ok(famous); }
  console.log(`PASS ${name}: ${data.places.length} matches`);
}
const sorted = await call('/api/places/search?name=Central%20Park&sort=name&category=parks');
assert.ok(sorted.places.every(place => place.category === 'parks'));
assert.ok(sorted.places.every((p, i, a) => i === 0 || a[i - 1].name.localeCompare(p.name, 'en') <= 0));
const detail = await call('/api/places/' + encodeURIComponent(famous.id));
assert.equal(detail.place.id, famous.id);
assert.equal(detail.place.category, famous.category);
const visitor = randomUUID();
const headers = { 'x-visitor-id': visitor, 'content-type': 'application/json' };
let row;
try {
  row = (await call('/api/itinerary', { method: 'POST', headers, body: JSON.stringify({ place_id: famous.id }) }, 201)).item;
  assert.equal(row.category, famous.category);
  assert.ok((await call('/api/itinerary', { headers })).items.some(item => item.id === row.id));
  await call('/api/itinerary/' + row.id, { method: 'DELETE', headers }); row = undefined;
  assert.deepEqual((await call('/api/itinerary', { headers })).items, []);
} finally {
  if (row) await call('/api/itinerary/' + row.id, { method: 'DELETE', headers });
}
const report = ['# Search rework: Change 2 API evidence', '', `Local preview: ${base}. Tested ${new Date().toISOString()}. ${checks.length} requests PASS.`, '', 'All requests use the local application routes. No API keys are included. Only a disposable visitor and its test row were changed.', '', ...checks.flatMap((check, index) => [`## ${index + 1}. ${check.method} ${check.path}`, '', `HTTP ${check.status}`, '', '```json', JSON.stringify(check.response, null, 2), '```', ''])].join('\n');
await writeFile(process.env.TEST_REPORT_PATH ?? 'docs/search-rework/change-2-api-tests.md', report);
const examples = checks.filter(c => c.path.startsWith('/api/cities?country=fr&q=Par') || c.path === '/api/places/search?name=Eiffel+Tower' || c.path === '/api/places/search?name=zzzxxyyqqqnonexistentplace' || c.path === '/api/places/search?name=ab').filter((c, i, a) => a.findIndex(p => p.path === c.path) === i);
const section = ['<!-- BEGIN SEARCH REWORK 2 -->', '## Search rework: country/city and worldwide place-name search', '', `Verified against ${base}: ${checks.length} real HTTP requests PASS. Full responses: [change-2-api-tests.md](docs/search-rework/change-2-api-tests.md).`, '', 'Repeat: `node scripts/test-search-api.mjs` (default local port 3021; override TEST_BASE_URL if needed).', '', '- `GET /api/cities?country=fr&q=Par`: country is a lowercase code from src/lib/countries.ts; q must be 3–120 characters. Suggestions are country-restricted, deduplicated, and cached upstream for 24 hours. Browser waits 400 ms and caches repeats for 10 minutes.', '- `GET /api/places?city=Paris&country=fr&cityId=<suggestion-id>&category=museums,parks&sort=name`: existing route extended with optional country and cityId. City IDs require a country and must resolve inside that country; old city-only requests remain supported.', '- `GET /api/places/search?name=Eiffel%20Tower`: worldwide Geocoding amenity search, no country/city required, up to 20 matches with shared Place fields and category mapping. Supports category selections and sort=relevance (default) or name. No invented city-center distances. Empty name/under three characters returns 400; no matches returns 200 with places: [].', '', ...examples.flatMap(c => [`### Example: GET ${c.path}`, '', `HTTP ${c.status}`, '', '```json', JSON.stringify(c.response, null, 2), '```', '']), '<!-- END SEARCH REWORK 2 -->'].join('\n');
const previous = await readFile('API_TESTS.md', 'utf8');
if (!process.env.TEST_REPORT_PATH) await writeFile('API_TESTS.md', previous.replace(/\n?<!-- BEGIN SEARCH REWORK 2 -->[\s\S]*?<!-- END SEARCH REWORK 2 -->\n?/g, '').trimEnd() + '\n\n' + section + '\n');
console.log(`PASS: ${checks.length} HTTP checks; saved route examples and full evidence.`);
