import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());
const targets = [
 ['Supabase itinerary', `${process.env.SUPABASE_URL}/rest/v1/itinerary?select=id&limit=0`, { apikey: process.env.SUPABASE_SECRET_KEY, Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}` }],
 ['Geoapify city lookup', `https://api.geoapify.com/v1/geocode/search?text=Chennai&type=city&format=json&limit=1&apiKey=${encodeURIComponent(process.env.GEOAPIFY_API_KEY)}`, {}]
];
for (const [label, url, headers] of targets) {
 try {
  const res = await fetch(url, {headers, signal: AbortSignal.timeout(15000)});
  const data = await res.json();
  console.log(JSON.stringify({service:label,status:res.status,code:data.code ?? null,results:data.results?.length ?? null}));
 } catch { console.log(JSON.stringify({service:label,error:'Connection failed; credentials and request URL withheld.'})); }
}

