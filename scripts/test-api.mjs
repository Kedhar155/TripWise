import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3003';
const visitor = randomUUID();
const other = randomUUID();
let saved;
let savedOther;
async function call(path, options = {}, expected = 200) {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(35000) });
  const data = await response.json();
  assert.equal(response.status, expected, `${options.method ?? 'GET'} ${path}: expected ${expected}, received ${response.status} (${data.error?.code ?? ''})`);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  return data;
}
const headers = (id = visitor) => ({ 'x-visitor-id': id, 'content-type': 'application/json' });
const post = (place_id, id = visitor) => ({ method: 'POST', headers: headers(id), body: JSON.stringify({ place_id }) });
try {
  for (const path of ['/api/places', '/api/places?city=a', '/api/places?city=Chennai&category=invalid', '/api/places?city=Chennai&sort=invalid', '/api/places/bad%21']) await call(path, {}, 400);
  await call('/api/itinerary', {}, 400);
  await call('/api/itinerary', { headers: headers('invalid') }, 400);
  await call('/api/itinerary', { method: 'POST', headers: headers(), body: '{broken' }, 400);
  await call('/api/itinerary', { method: 'POST', headers: headers(), body: '[]' }, 400);
  await call('/api/itinerary', { method: 'POST', headers: headers(), body: JSON.stringify({place_id:'x'.repeat(5000)}) }, 400);
  await call('/api/itinerary', post('bad!'), 400);
  console.log('PASS: request validation and private no-store responses');
  const empty = await call('/api/itinerary', { headers: headers() });
  assert.deepEqual(empty.items, []);
  const found = await call('/api/places?city=Chennai&category=museums&sort=distance');
  assert.ok(found.places.length > 0, 'Chennai should return museums');
  assert.ok(found.places.every((p,i,a) => i === 0 || a[i-1].distance <= p.distance));
  const alphabetical = await call('/api/places?city=Chennai&category=museums&sort=name');
  assert.ok(alphabetical.places.every((p,i,a) => i === 0 || a[i-1].name.localeCompare(p.name,'en') <= 0));
  await call('/api/places?city=zzzxxyyqqqnonexistentcity', {}, 404);
  await call('/api/places/0000', {}, 404);
  console.log('PASS: live Geoapify search, name/distance sorting, and missing city');
  const placeId = found.places[0].id;
  const detail = await call('/api/places/' + encodeURIComponent(placeId));
  assert.equal(detail.place.id, placeId);
  saved = (await call('/api/itinerary', post(placeId), 201)).item;
  await call('/api/itinerary', post(placeId), 409);
  const reload = await call('/api/itinerary', { headers: headers() });
  assert.ok(reload.items.some(item => item.id === saved.id));
  assert.deepEqual((await call('/api/itinerary', { headers: headers(other) })).items, []);
  await call('/api/itinerary/' + saved.id, { method: 'DELETE', headers: headers(other) }, 404);
  savedOther = (await call('/api/itinerary', post(placeId, other), 201)).item;
  assert.notEqual(saved.id, savedOther.id);
  console.log('PASS: details, database persistence, duplicate 409, and visitor isolation');
  await call('/api/itinerary/' + saved.id, { method: 'DELETE', headers: headers() });
  await call('/api/itinerary/' + saved.id, { method: 'DELETE', headers: headers() }, 404);
  saved = undefined;
  assert.deepEqual((await call('/api/itinerary', { headers: headers() })).items, []);
  console.log('PASS: remove and missing item 404');
} finally {
  // Only remove records created by this test run, never user itineraries or files.
  if (saved) await call('/api/itinerary/' + saved.id, { method: 'DELETE', headers: headers() });
  if (savedOther) await call('/api/itinerary/' + savedOther.id, { method: 'DELETE', headers: headers(other) });
}
