import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';
const require = createRequire(import.meta.url), cache = new Map();
function load(file) {
  file = resolve(file); if (cache.has(file)) return cache.get(file);
  const compiled = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  new Function('require', 'module', 'exports', outputText)(id => {
    if (id === 'server-only') return {};
    if (!id.startsWith('.')) return require(id);
    const base = resolve(dirname(file), id); return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  }, compiled, compiled.exports);
  cache.set(file, compiled.exports); return compiled.exports;
}
const { sortPlaces, availableSorts, detailsCount, groupPlaces } = load('src/lib/place-sorting.ts');
const { query, searchPlaces, searchPlaceNames } = load('src/lib/geoapify.ts');
const p = (id, name, category, distance, extra = {}) => ({ id, name, category, distance, address: id, latitude: 0, longitude: 0, ...extra });
const places = [p('z', 'Zulu', 'sights', 1000), p('a', 'Alpha', 'parks', 0, { phone: '123' }), p('b', 'Beta', 'museums', 999, { website: 'https://example.com', phone: '123', openingHours: 'Mo-Fr' }), p('c', 'Beta', 'museums', 1000, { website: 'https://example.com' })];
const original = structuredClone(places);
const ids = sort => sortPlaces(places, sort).map(p => p.id);
assert.deepEqual(ids('relevance'), ['z', 'a', 'b', 'c']);
assert.deepEqual(ids('distance'), ['a', 'b', 'c', 'z']);
assert.deepEqual(ids('distance-desc'), ['c', 'z', 'b', 'a']);
assert.deepEqual(ids('name'), ['a', 'b', 'c', 'z']);
assert.deepEqual(ids('name-desc'), ['z', 'b', 'c', 'a']);
assert.deepEqual(ids('details'), ['b', 'a', 'c', 'z']);
assert.deepEqual(ids('category'), ['b', 'c', 'a', 'z']);
assert.deepEqual(places, original, 'Sort must not destroy original provider order');
assert.equal(detailsCount({ website: ' ', phone: '', openingHours: undefined }), 0);
assert.deepEqual(availableSorts(places).map(o => o.value), ['relevance','distance','distance-desc','name','name-desc','category','details']);
const worldwide = places.map(place => ({ ...place, distance: undefined, phone: undefined, website: undefined, openingHours: undefined }));
assert.deepEqual(availableSorts(worldwide).map(o => o.value), ['relevance','name','name-desc','category']);
assert.deepEqual(availableSorts([]).map(o => o.value), ['relevance']);
assert.deepEqual(availableSorts([places[0]]).map(o => o.value), ['relevance']);
assert.ok(!availableSorts([...places, { ...places[0], distance: NaN }]).some(o => o.value.startsWith('distance')));
assert.equal(sortPlaces([...places, { ...places[0], id:'missing', distance:undefined }], 'distance-desc').at(-1).id, 'missing');
assert.deepEqual(groupPlaces(sortPlaces(places, 'category')).map(g => [g.category, g.places.length]), [['museums',2],['parks',1],['sights',1]]);
for (const within of ['0','-1','2','5.0','100','', 'NaN']) assert.throws(() => query(new URLSearchParams({ city:'Paris', within })), e => e.status === 400);
for (const within of ['1','5','10','25']) assert.equal(query(new URLSearchParams({ city:'Paris', within })).within, Number(within));
assert.equal(query(new URLSearchParams('city=Paris')).sort, 'relevance');
const previousFetch = globalThis.fetch, previousKey = process.env.GEOAPIFY_API_KEY;
process.env.GEOAPIFY_API_KEY = 'test-placeholder';
let requestedFilter;
globalThis.fetch = async url => {
  if (url.pathname.includes('geocode')) return Response.json({ results:[{ place_id:'city', lat:0,lon:0 }] });
  requestedFilter = url.searchParams.get('filter');
  return Response.json({ features:[0,0.0089,0.0091,0.045].map((lat,i) => ({properties:{ place_id:String(i),name:String(i),lat,lon:0,categories:['tourism'] }})) });
};
try {
  const within = await searchPlaces(new URLSearchParams('city=Paris&within=1'));
  assert.deepEqual(within.places.map(p=>p.id), ['0','1']);
  assert.match(requestedFilter, /place:city\|circle:0,0,1000/);
  assert.equal(within.meta.within,1);
  assert.equal((await searchPlaces(new URLSearchParams('city=Paris&within=5'))).places.length,3);
  assert.equal((await searchPlaces(new URLSearchParams('city=Paris'))).places.length,4);
  assert.ok(!requestedFilter.includes('circle'), 'Cleared distance filter must remove the upstream circle');
  await assert.rejects(searchPlaceNames(new URLSearchParams('name=Park&within=5')), e=>e.status===400);
  await assert.rejects(searchPlaceNames(new URLSearchParams('name=Park&sort=distance-desc')), e=>e.status===400);
} finally { globalThis.fetch = previousFetch; if(previousKey===undefined) delete process.env.GEOAPIFY_API_KEY; else process.env.GEOAPIFY_API_KEY=previousKey; }
console.log('PASS: all seven orderings, stable ties, source immutability, zero/missing distances, contact-detail scoring, conditional options, grouped counts, strict radius validation/boundaries, cleared radius, and worldwide distance rejection.');
