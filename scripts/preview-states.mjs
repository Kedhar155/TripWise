// Local-only visual QA proxy. No requests reach Supabase or Geoapify.
// Run: node scripts/preview-states.mjs (production preview on port 3006).
// Set a scenario: Set-Content .next/qa-state.txt error
// Scenarios: ready, loading, empty, error, duplicate, save-error, mutation-error, missing.
// Optional: PREVIEW_UPSTREAM_PORT and PREVIEW_PORT select isolated local ports.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
const place = { id: 'qa-place', name: 'Chennai Heritage Museum and Cultural Gardens', address: 'A very long address near the waterfront, Chennai, Tamil Nadu, India', category: 'entertainment.museum', latitude: 13.08, longitude: 80.27, distance: 1250 };
const item = { ...place, id: '11111111-1111-4111-8111-111111111111', place_id: place.id, created_at: '2026-10-17T00:00:00Z' };
http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    const mode = (await readFile('.next/qa-state.txt', 'utf8').catch(() => 'ready')).trim();
    if (mode === 'loading') await new Promise(resolve => setTimeout(resolve, 2500));
    const mutation = req.method !== 'GET';
    let status = 200;
    let data = req.url.startsWith('/api/places?') ? { city: { name: 'Chennai, India' }, places: mode === 'empty' ? [] : [place] } : req.url.startsWith('/api/places/') ? { place } : { items: ['empty', 'duplicate', 'save-error'].includes(mode) ? [] : [item] };
    if (mode === 'error' || (mode === 'mutation-error' && mutation) || (mode === 'save-error' && mutation)) { status = 500; data = { error: { message: 'The service is temporarily unavailable. Please try again.' } }; }
    if (mode === 'missing') { status = 404; data = { error: { message: 'This place could not be found. Return to Explore to choose another place.' } }; }
    if (mode === 'duplicate' && req.method === 'POST') { status = 409; data = { error: { message: 'Already in your trip.' } }; }
    res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(data)); return;
  }
  const upstream = http.request({ hostname: '127.0.0.1', port: Number(process.env.PREVIEW_UPSTREAM_PORT ?? 3006), path: req.url, method: req.method, headers: req.headers }, response => { res.writeHead(response.statusCode, response.headers); response.pipe(res); });
  upstream.on('error', () => { res.writeHead(502); res.end('Start the production preview on port 3006.'); });
  req.pipe(upstream);
}).listen(Number(process.env.PREVIEW_PORT ?? 3007), '127.0.0.1', () => console.log(`Local state preview: http://127.0.0.1:${process.env.PREVIEW_PORT ?? 3007}`));
