// Read public HTML/scripts in memory; never write or print credential values.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

process.loadEnvFile('.env.local');
const base = process.env.TEST_BASE_URL ?? 'https://tripwise-lime.vercel.app';
const secrets = ['GEOAPIFY_API_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_URL'].map(name => {
  assert.ok(process.env[name], `Missing local ${name}; cannot confirm browser scan`);
  return process.env[name];
});
let responses = 0;
async function read(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(35000) });
  assert.equal(response.status, 200, 'Public site asset request failed');
  const body = await response.text();
  assert.ok(!secrets.some(value => body.includes(value) || body.includes(encodeURIComponent(value))), 'Credential found in public response; content withheld');
  assert.ok(!/sb_secret_[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/.test(body), 'Credential pattern found; content withheld');
  responses += 1;
  return body;
}
const search = JSON.parse(await read('/api/places/search?name=Eiffel%20Tower'));
assert.ok(search.places.length, 'Expected a real place for the Details page scan');
const scripts = new Set();
for (const path of ['/', '/trip', `/places/${encodeURIComponent(search.places[0].id)}`]) {
  const html = await read(path);
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), base);
    assert.equal(url.origin, new URL(base).origin, 'Unexpected external script');
    scripts.add(url.href);
  }
}
for (const script of scripts) await read(script);
const report = { testedAt: new Date().toISOString(), base, pages: 3, scriptFiles: scripts.size, responses, result: 'PASS', valuesPrintedOrSaved: false };
await writeFile(process.env.TEST_REPORT_PATH ?? 'docs/search-rework/live-browser-secret-scan.json', JSON.stringify(report, null, 2) + '\n');
console.log(`PASS: ${responses} public responses, including three pages and ${scripts.size} browser scripts; saved credential values and patterns absent.`);
