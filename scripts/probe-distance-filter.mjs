import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
async function geo(path, params) {
  const url = new URL(path, 'https://api.geoapify.com');
  url.search = new URLSearchParams({ ...params, apiKey: process.env.GEOAPIFY_API_KEY });
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  return { status: response.status, data: await response.json() };
}
const { data } = await geo('/v1/geocode/search', { text: 'Paris', type: 'city', format: 'json', limit: '1' });
const p = data.results[0];
for (const filter of [`place:${p.place_id}`, `place:${p.place_id}|circle:${p.lon},${p.lat},1000`]) {
  const result = await geo('/v2/places', { categories: 'tourism,leisure.park,entertainment.museum', filter, bias: `proximity:${p.lon},${p.lat}`, limit: '100' });
  console.log(JSON.stringify({ filterType: filter.includes('|') ? 'city and circle' : 'city', status: result.status, count: result.data.features?.length, maxDistance: Math.max(...(result.data.features ?? []).map(f => f.properties.distance ?? 0)) }));
}
