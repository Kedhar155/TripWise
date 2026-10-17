import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3020';
const cases = [
  ['Chennai', 'all'], ['Chennai', 'museums'], ['Chennai', 'museums,parks'],
  ['Paris', 'sights'], ['Paris', 'restaurants'], ['Paris', 'entertainment'], ['Paris', 'shopping'],
  ['Tokyo', 'shopping'], ['Tokyo', 'accommodation'], ['Tokyo', 'other'],
  ['Dubai', 'beaches'], ['Dubai', 'parks,restaurants'], ['Dubai', 'all'],
];
const keys = ['sights', 'museums', 'parks', 'restaurants', 'beaches', 'entertainment', 'shopping', 'accommodation', 'other'];
const results = [];
for (const [city, category] of cases) {
  const response = await fetch(`${base}/api/places?${new URLSearchParams({ city, category, sort: 'name' })}`, { signal: AbortSignal.timeout(35000) });
  const data = await response.json();
  assert.equal(response.status, 200, `${city}/${category}: ${data.error?.code}`);
  const selected = category === 'all' ? keys : category.split(',');
  for (const place of data.places) assert.ok(selected.includes(place.category), `${place.category} outside ${category}`);
  assert.ok(data.places.every((p, i, a) => i === 0 || a[i - 1].name.localeCompare(p.name, 'en') <= 0));
  assert.equal(new Set(data.places.map(p => p.id)).size, data.places.length);
  // At least one known well-populated search ensures these aren't vacuous checks.
  if (category === 'museums' || (city === 'Paris' && category === 'shopping') || category === 'accommodation') assert.ok(data.places.length > 0);
  const groups = Object.fromEntries(keys.map(key => [key, data.places.filter(p => p.category === key).length]).filter(([, count]) => count));
  results.push({ city, category, count: data.places.length, groups });
  console.log(`PASS ${city} / ${category}: ${data.places.length} places; ${JSON.stringify(groups)}`);
}
await writeFile('docs/search-rework/category-search-tests.json', JSON.stringify({ testedAt: new Date().toISOString(), results }, null, 2) + '\n');
