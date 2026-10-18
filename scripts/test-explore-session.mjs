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
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
  const compiled = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(id => {
    if (id === 'server-only') return {};
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const base = id.startsWith('@/') ? resolve('src', id.slice(2)) : resolve(dirname(file), id);
    return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  }, compiled, compiled.exports);
  cache.set(file, compiled.exports);
  return compiled.exports;
}
const { readExploreSession, saveExploreSession, defaultExploreSession, searchUrl, exploreSessionKey } = load('src/lib/explore-session.ts');
let raw = null;
globalThis.sessionStorage = { getItem: () => raw, setItem: (key, value) => { assert.equal(key, exploreSessionKey); raw = value; } };
assert.equal(readExploreSession().search, null);
raw = '{broken'; assert.equal(readExploreSession().mode, 'location');
const saved = { ...defaultExploreSession(), mode: 'name', nameDraft: 'Eiffel Tower', location: { countryText: 'India', country: 'in', cityText: 'Chennai, Tamil Nadu, India', city: { id: 'city-id', name: 'Chennai', label: 'Chennai, Tamil Nadu, India', country: 'in' } }, selected: ['culture', 'nature'], sort: 'name-desc', within: 10, scrollY: 1678, search: { kind: 'name', name: 'Eiffel Tower' }, results: { query: 'Eiffel Tower', places: [] } };
// Use actual catalog IDs to exercise validation too.
const { categories } = load('src/lib/categories.ts');
saved.selected = Object.keys(categories).slice(0, 2);
const { sortOptions } = load('src/lib/place-sorting.ts');
saved.sort = sortOptions.find(option => option.value !== 'relevance').value;
saved.resultsKey = searchUrl(saved.search, saved.selected.join(','), null);
saveExploreSession(saved); assert.deepEqual(readExploreSession(), saved);
// Simulate a fresh document: reload the module with no in-memory snapshot.
cache.delete(resolve('src/lib/explore-session.ts'));
const fresh = load('src/lib/explore-session.ts');
assert.deepEqual(fresh.readExploreSession(), saved);
raw = JSON.stringify({ ...saved, results: { places: 'broken' } });
assert.equal(fresh.readExploreSession().results, null);
assert.deepEqual(fresh.readExploreSession().selected, saved.selected);
raw = JSON.stringify({ ...saved, selected: ['invalid'] });
assert.equal(fresh.readExploreSession().search, null);
raw = JSON.stringify({ ...saved, version: 999 });
assert.equal(fresh.readExploreSession().search, null);
raw = JSON.stringify({ ...saved, scrollY: -1 });
assert.equal(fresh.readExploreSession().scrollY, 0);
assert.notEqual(searchUrl({ kind: 'location', value: { country: 'in', city: 'Chennai', cityId: 'id' } }, 'culture', 5), searchUrl({ kind: 'location', value: { country: 'in', city: 'Chennai', cityId: 'id' } }, 'culture', 10));
assert.equal(searchUrl(saved.search, 'all', 5), searchUrl(saved.search, 'all', null));
globalThis.sessionStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('full'); } };
fresh.saveExploreSession(saved); assert.deepEqual(fresh.readExploreSession(), saved);
console.log('PASS: session round trip, fresh-document restoration, drafts/region/tab/filters/sort/radius/results/scroll, invalid cache/settings, request identity, blocked/full storage fallback');
