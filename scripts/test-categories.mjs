import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file);
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
  const compiled = { exports: {} };
  const localRequire = id => {
    if (id === 'server-only') return {};
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const base = id.startsWith('@/') ? resolve('src', id.slice(2)) : resolve(dirname(file), id);
    return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, compiled, compiled.exports);
  cache.set(file, compiled.exports);
  return compiled.exports;
}
const { categories, categoryEntries, getCategoryKey, getCategoryStyle, geoapifyCategories } = load('src/lib/categories.ts');
const { query, searchPlaces } = load('src/lib/geoapify.ts');
const { CategoryBadge } = load('src/components/category-badge.tsx');
const { renderToStaticMarkup } = require('react-dom/server');
for (const [key, entry] of categoryEntries) {
  assert.equal(getCategoryKey(key), key);
  for (const prefix of entry.geoapify) assert.equal(getCategoryKey([prefix, prefix + '.example']), key);
  const html = renderToStaticMarkup(CategoryBadge({ category: key }));
  assert.ok(html.includes(entry.label));
  assert.ok(html.includes(`color:${entry.color}`));
  assert.equal(getCategoryStyle(key).icon, entry.icon);
}
for (const [tags, expected] of [
  [['entertainment', 'entertainment.museum', 'tourism'], 'museums'],
  [['tourism', 'entertainment.culture.gallery'], 'museums'],
  [['tourism.attraction', 'natural', 'beach'], 'beaches'],
  [['catering', 'catering.cafe', 'commercial'], 'restaurants'],
  [['leisure', 'leisure.park', 'tourism'], 'parks'],
  [['building', 'wheelchair.yes', 'unknown.new'], 'other'],
  [[], 'other'], [['tourismish'], 'other'], [['natural.beach'], 'beaches'],
]) {
  assert.equal(getCategoryKey(tags), expected);
  assert.equal(getCategoryKey([...tags].reverse()), expected, 'Tag order cannot affect classification');
}
const samples = JSON.parse(readFileSync('docs/search-rework/category-samples.json', 'utf8'));
for (const sample of samples.samples) for (const example of sample.examples) {
  assert.ok(Object.hasOwn(categories, getCategoryKey(example.categories)));
}
for (const category of ['', 'bad', 'museums,', 'all,parks', 'parks,invalid', '__proto__']) {
  assert.throws(() => query(new URLSearchParams({ city: 'Paris', category })), error => error.status === 400);
}
assert.deepEqual(query(new URLSearchParams('city=Paris&category=parks&category=museums')).selected, ['parks', 'museums']);
assert.deepEqual(query(new URLSearchParams('city=Paris&category=parks,parks')).selected, ['parks']);
assert.deepEqual(query(new URLSearchParams('city=Paris&category=attractions,cafes')).selected, ['sights', 'restaurants']);
assert.equal(query(new URLSearchParams('city=Paris')).selected.length, 9);
assert.equal(geoapifyCategories(['museums', 'entertainment']).split(',').includes('entertainment.museum'), false);

// Check the upstream request and overlap filtering independently of live data.
const previousFetch = globalThis.fetch;
const previousKey = process.env.GEOAPIFY_API_KEY;
process.env.GEOAPIFY_API_KEY = 'test-placeholder';
const calls = [];
globalThis.fetch = async url => {
  calls.push(new URL(url));
  return Response.json(url.pathname.includes('geocode') ? { results: [{ place_id: 'city', lat: 1, lon: 2 }] } : {
    features: [
      { properties: { place_id: 'museum', lat: 1, lon: 2, categories: ['entertainment', 'entertainment.museum'] } },
      { properties: { place_id: 'cinema', lat: 1, lon: 2, categories: ['entertainment', 'entertainment.cinema'] } },
      { properties: { place_id: 'park', lat: 1, lon: 2, categories: ['leisure', 'leisure.park'] } },
      { properties: { place_id: 'unknown', lat: 1, lon: 2 } },
    ],
  });
};
try {
  const result = await searchPlaces(new URLSearchParams('city=Paris&category=entertainment,parks'));
  assert.deepEqual(result.places.map(place => place.category).sort(), ['entertainment', 'parks']);
  assert.equal(calls[1].searchParams.get('categories'), geoapifyCategories(['entertainment', 'parks']));
  const fallback = await searchPlaces(new URLSearchParams('city=Paris&category=other'));
  assert.deepEqual(fallback.places.map(place => place.category), ['other']);
} finally {
  globalThis.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.GEOAPIFY_API_KEY;
  else process.env.GEOAPIFY_API_KEY = previousKey;
}
console.log('PASS: nine shared groups, real sample mapping, icons/labels/colors, overlapping tags, order independence, fallback, multi-selection validation, legacy URLs, selected upstream prefixes, and server overlap filtering.');
