import nextEnv from '@next/env';
import { mkdir, writeFile } from 'node:fs/promises';
nextEnv.loadEnvConfig(process.cwd());
const samples = [];
for (const text of ['Eiffel Tower', 'Taj Mahal', 'zzzxxyyqqqnonexistentplace', 'Eifel Tower', 'Central Park']) {
  const url = new URL('https://api.geoapify.com/v1/geocode/search');
  url.search = new URLSearchParams({ text, type: 'amenity', bias: 'countrycode:none', lang: 'en', format: 'json', limit: '20', apiKey: process.env.GEOAPIFY_API_KEY });
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Geoapify status ${response.status}`);
  const data = await response.json();
  const results = (data.results ?? []).map(p => ({ name: p.name, address: p.formatted, category: p.category, categories: p.categories, type: p.result_type, rank: p.rank, id: p.place_id, latitude: p.lat, longitude: p.lon }));
  samples.push({ text, results });
  console.log(JSON.stringify({ text, count: results.length, first: results[0] }));
}
await mkdir('docs/search-rework', { recursive: true });
await writeFile('docs/search-rework/name-service-probe.json', JSON.stringify(samples, null, 2) + '\n');
