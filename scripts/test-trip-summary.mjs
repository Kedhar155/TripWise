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
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const base = id.startsWith('@/') ? resolve('src', id.slice(2)) : resolve(dirname(file), id);
    return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, compiled, compiled.exports);
  cache.set(file, compiled.exports);
  return compiled.exports;
}
const { summarizeTrip } = load('src/lib/trip-summary.ts');
const { TripSummary } = load('src/components/trip-summary.tsx');
const { getCategoryStyle, categoryStyles } = load('src/lib/category-style.ts');
const { renderToStaticMarkup } = require('react-dom/server');
const items = [
  { id: 'a', category: 'catering.restaurant.italian', day: 1 },
  { id: 'b', category: 'restaurants', day: 1 },
  { id: 'c', category: 'entertainment.museum', day: 14 },
  { id: 'd', category: 'museums', day: null },
  { id: 'e', category: 'leisure.park', day: null },
  { id: 'f', category: 'tourism.sights', day: 14 },
  { id: 'g', category: 'natural.beach', day: null },
  { id: 'h', category: 'catering.cafe', day: null },
  { id: 'i', category: 'building', day: null },
];
const before = structuredClone(items);
const summary = summarizeTrip(items);
assert.deepEqual({ total: summary.total, plannedDays: summary.plannedDays, unplanned: summary.unplanned }, { total: 9, plannedDays: 2, unplanned: 5 });
assert.ok(summary.categories.some(group => group.label === '3 restaurants and cafes'));
assert.ok(summary.categories.some(group => group.label === '2 museums and cultural places'));
assert.ok(summary.categories.some(group => group.label === '1 park or nature spot'));
assert.ok(summary.categories.some(group => group.label === '1 beach'));
assert.ok(summary.categories.some(group => group.label === '1 sight'));
assert.ok(summary.categories.some(group => group.label === '1 other place'));
assert.equal(summary.categories.reduce((sum, group) => sum + group.count, 0), items.length);
assert.deepEqual(items, before, 'Summary must not change loaded items');
const moved = items.map(item => item.id === 'e' ? { ...item, day: 2 } : item);
assert.equal(summarizeTrip(moved).plannedDays, 3);
assert.equal(summarizeTrip(moved).unplanned, 4);
const removed = items.filter(item => item.id !== 'a');
assert.equal(summarizeTrip(removed).total, 8);
assert.ok(summarizeTrip(removed).categories.some(group => group.label === '2 restaurants and cafes'));
const cleared = items.map(item => ({ ...item, day: null }));
assert.equal(summarizeTrip(cleared).plannedDays, 0);
assert.equal(summarizeTrip(cleared).unplanned, 9);
assert.equal(summarizeTrip([{ category: 'park', day: 15 }]).unplanned, 1);
assert.deepEqual(summarizeTrip([]), { total: 0, plannedDays: 0, unplanned: 0, categories: [] });
assert.equal(TripSummary({ items: [] }), null);
const html = renderToStaticMarkup(TripSummary({ items }));
assert.match(html, /Trip summary/);
assert.match(html, /Total places/);
assert.match(html, /Days planned/);
assert.match(html, /Unplanned places/);
assert.match(html, /3 restaurants and cafes/);
assert.match(html, /lucide-utensils/);
assert.match(html, /lucide-tree-pine/);
for (const style of summary.categories.map(group => getCategoryStyle(group.category))) {
  assert.ok(html.includes(`color:${style.color}`));
  assert.ok(html.includes(`background-color:${style.backgroundColor}`));
}
assert.equal(getCategoryStyle('catering.restaurant.italian'), categoryStyles.restaurants);
assert.equal(getCategoryStyle('leisure.park'), categoryStyles.parks);
console.log('PASS: totals, distinct occupied days, Unplanned count, grouped categories, singular/plural labels, shared icons/colors, move/remove recalculation, source immutability, empty-trip hiding, and summary rendering.');
