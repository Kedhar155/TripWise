import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
async function geo(path, params) {
  const url = new URL(path, 'https://api.geoapify.com');
  url.search = new URLSearchParams({ ...params, apiKey: process.env.GEOAPIFY_API_KEY });
  const r = await fetch(url); if (!r.ok) throw new Error(`Status ${r.status}`); return r.json();
}
for (const [country, text] of [['in','Che'],['fr','Par'],['jp','Tok']]) {
  const p = (await geo('/v1/geocode/autocomplete', { text, type: 'city', filter: `countrycode:${country}`, lang: 'en', format: 'json', limit: '6' })).results[0];
  const d = (await geo('/v2/place-details', { id: p.place_id, features: 'details' })).features[0]?.properties;
  console.log(JSON.stringify({ country, suggestion: { name:p.city ?? p.name, label:p.formatted, id:p.place_id }, detail: { id:d.place_id, country:d.country_code, categories:d.categories, name:d.name, type:d.result_type, lat:d.lat,lon:d.lon } }));
}
