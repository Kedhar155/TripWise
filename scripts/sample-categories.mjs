import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd());
const key = process.env.GEOAPIFY_API_KEY;
if (!key) throw new Error('Geoapify setting is missing');
async function geo(path, params) {
  const url = new URL(path, 'https://api.geoapify.com');
  url.search = new URLSearchParams({ ...params, apiKey: key });
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Geoapify status ${response.status}`);
  return response.json();
}
const samples = [];
for (const city of ['Chennai', 'Paris', 'Tokyo', 'Dubai']) {
  const center = (await geo('/v1/geocode/search', { text: city, type: 'city', format: 'json', limit: '1' })).results[0];
  for (const categories of ['tourism,catering.restaurant,catering.cafe,leisure.park,entertainment.museum', 'entertainment,commercial,accommodation,natural,beach', 'commercial']) {
    const data = await geo('/v2/places', { categories, filter: `place:${center.place_id}`, bias: `proximity:${center.lon},${center.lat}`, limit: '100' });
    const counts = {};
    for (const { properties: p } of data.features ?? []) for (const category of p.categories ?? []) counts[category] = (counts[category] ?? 0) + 1;
    samples.push({ city, requested: categories, count: data.features?.length ?? 0, categories: counts, examples: data.features.slice(0, 5).map(({ properties: p }) => ({ name: p.name, categories: p.categories })) });
    console.log(`${city}: ${data.features.length} places, ${Object.keys(counts).length} category tags`);
  }
}
await mkdir('docs/search-rework', { recursive: true });
await writeFile('docs/search-rework/category-samples.json', JSON.stringify({ sampledAt: new Date().toISOString(), samples }, null, 2) + '\n');
