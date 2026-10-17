import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3003';
const visitor = randomUUID();
const other = randomUUID();
let saved;
let savedOther;
const results = [];
let completed = false;
async function call(path, options = {}, expected = 200) {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(35000) });
  const data = await response.json();
  const summary = data.error ? `${data.error.code}: ${data.error.message}`
    : data.places ? `${data.places.length} places; first: ${data.places[0]?.name ?? 'none'}`
    : data.items ? `${data.items.length} saved items`
    : data.item ? `Saved: ${data.item.name}`
    : data.place ? `Details: ${data.place.name}` : `Removed test item: ${data.deleted}`;
  const command = [`curl.exe -s -i -X ${options.method ?? 'GET'} "${base}${path}"`];
  for (const [name, value] of Object.entries(options.headers ?? {})) command.push(`-H '${name}: ${value}'`);
  if (options.body) command.push(`--data-raw '${options.body}'`);
  results.push({ path, method: options.method ?? 'GET', expected, actual: response.status, summary, command: command.join(' ') });
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
  await call('/api/itinerary/not-a-uuid', { method: 'DELETE', headers: headers() }, 400);
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
  completed = true;
} finally {
  // Only remove records created by this test run, never user itineraries or files.
  if (saved) await call('/api/itinerary/' + saved.id, { method: 'DELETE', headers: headers() });
  if (savedOther) await call('/api/itinerary/' + savedOther.id, { method: 'DELETE', headers: headers(other) });
  const escape = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
  const report = [
    '# TripWise — API test evidence', '',
    `Run: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })} IST.`,
    `Server: ${base}. Overall integration assertions: ${completed ? 'PASS' : 'FAILED / incomplete'}.`, '',
    'These are real HTTP requests against the server above, using Geoapify and the Supabase database. Only newly generated test visitors and their temporary records are used. No credentials are included.', '',
    '## Repeat the checks', '',
    'In one PowerShell window inside the project, run `npm run start -- --hostname 127.0.0.1 --port 3003` after a successful build, unless the preview is already running. In another window:', '',
    '```powershell', 'node scripts/test-api.mjs', 'node scripts/test-errors.mjs', '```', '',
    'The first command regenerates this report with fresh visitor and item IDs. The second checks 400/404/409/500 error formatting and private-error redaction in isolation; it does not deliberately break the live services.', '',
    '## Recorded HTTP results', '',
    '| # | Request | Expected | Actual | Result | Response summary |',
    '| --- | --- | --- | --- | --- | --- |',
    ...results.map((r, i) => `| ${i + 1} | ${r.method} ${r.path} | ${r.expected} | ${r.actual} | ${r.expected === r.actual ? 'PASS' : 'FAIL'} | ${escape(r.summary)} |`), '',
    'Additional assertions: nonempty Chennai museum search; name and distance order; stable detail ID; saved item present in a new GET request; duplicate rejected; second visitor initially empty; same place allowed for separate visitors; another visitor cannot remove the first visitor\'s item; empty list after removal; no-store on every response.', '',
    '## Exact requests from this run', '',
    'These PowerShell curl commands record the actual inputs, including disposable test IDs. Deleted row IDs cannot be replayed as successful deletions; rerun the script to repeat the complete sequence with fresh IDs.', '',
    ...results.flatMap((r, i) => [`### ${i + 1}. ${r.method} — HTTP ${r.actual}`, '', '```powershell', r.command, '```', '', `Result: ${r.summary}`, '']),
  ].join('\n');
  const reportPath = process.env.TEST_REPORT_PATH ?? 'API_TESTS.md';
  await writeFile(resolve(process.cwd(), reportPath), report);
  console.log(`Saved ${reportPath}: ${results.length} HTTP checks; integration ${completed ? 'PASS' : 'incomplete'}`);
}
