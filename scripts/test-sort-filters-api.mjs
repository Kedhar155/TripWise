import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';
const require = createRequire(import.meta.url), modules = new Map();
function load(file) {
  file = resolve(file); if(modules.has(file)) return modules.get(file);
  const compiled = {exports:{}};
  const {outputText} = ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}});
  new Function('require','module','exports',outputText)(id=>{if(!id.startsWith('.')) return require(id);const path=resolve(dirname(file),id);return load(['.ts','.tsx'].map(ext=>path+ext).find(existsSync));},compiled,compiled.exports);
  modules.set(file,compiled.exports);return compiled.exports;
}
const {sortPlaces, availableSorts, detailsCount, groupPlaces} = load('src/lib/place-sorting.ts');
const {getCategoryStyle} = load('src/lib/categories.ts');
const base=process.env.TEST_BASE_URL??'http://127.0.0.1:3023';
const evidence=[];
let requests=0, orderChecks=0;
async function call(path, expected=200) {
  const r=await fetch(base+path,{signal:AbortSignal.timeout(45000)}), data=await r.json();requests++;
  assert.equal(r.status,expected,`${path}: ${data.error?.code}`);return data;
}
function verify(places, sort) {
  const sorted=sortPlaces(places,sort);
  assert.equal(sorted.length,places.length);
  assert.deepEqual([...sorted.map(p=>p.id)].sort(),[...places.map(p=>p.id)].sort(),'Sorting cannot remove a match');
  for(let i=1;i<sorted.length;i++) {
    const a=sorted[i-1], b=sorted[i];
    if(sort==='distance') assert.ok(a.distance<=b.distance);
    if(sort==='distance-desc') assert.ok(a.distance>=b.distance);
    if(sort==='name') assert.ok(a.name.localeCompare(b.name,'en')<=0);
    if(sort==='name-desc') assert.ok(a.name.localeCompare(b.name,'en')>=0);
    if(sort==='details') assert.ok(detailsCount(a)>=detailsCount(b));
    if(sort==='category') assert.ok(getCategoryStyle(a.category).label.localeCompare(getCategoryStyle(b.category).label,'en')<=0);
  }
  if(sort==='relevance') assert.deepEqual(sorted,places);
  if(sort==='category') assert.equal(groupPlaces(sorted).reduce((sum,g)=>sum+g.places.length,0),places.length);
  orderChecks++;return sorted;
}
let contactSample;
for(const city of ['Chennai','Paris']) for(const category of ['all','museums','parks,restaurants']) {
  let previous=0;
  for(const within of [1,5,10,25,null]) {
    const params=new URLSearchParams({city,category,sort:'relevance',...(within===null?{}:{within:String(within)})});
    const data=await call('/api/places?'+params), places=data.places;
    assert.equal(data.meta.count,places.length);
    assert.equal(data.meta.within,within);
    assert.equal(new Set(places.map(p=>p.id)).size,places.length);
    if(within!==null) assert.ok(places.every(p=>p.distance<=within*1000));
    if(category!=='all') assert.ok(places.every(p=>category.split(',').includes(p.category)));
    assert.ok(places.length>=previous,`${city}/${category}: increasing distance unexpectedly lost results`); previous=places.length;
    const options=availableSorts(places);
    for(const option of options) verify(places,option.value);
    if(options.some(o=>o.value==='details')) contactSample={city,category,within,places};
    evidence.push({city,category,within,count:places.length,withDetails:places.filter(p=>detailsCount(p)>0).length,availableSorts:options.map(o=>o.value)});
    console.log(`PASS ${city}/${category}/${within??'any'} km: ${places.length} results; ${options.length} sorts`);
  }
}
assert.ok(contactSample,'Real list data must contain contact details to justify Most details');
for(const name of ['Central Park','Eiffel Tower','Museum']) for(const category of ['all','parks','museums,parks']) {
  const data=await call('/api/places/search?'+new URLSearchParams({name,category})), options=availableSorts(data.places);
  assert.ok(!options.some(o=>o.value.startsWith('distance')),'Worldwide searches cannot offer a distance sort');
  if(!data.places.some(p=>detailsCount(p)>0)) assert.ok(!options.some(o=>o.value==='details'));
  for(const option of options) verify(data.places,option.value);
  evidence.push({name,category,count:data.places.length,availableSorts:options.map(o=>o.value)});
}
// Check each exposed server ordering against the same real search response.
const params=new URLSearchParams({city:contactSample.city,category:contactSample.category,...(contactSample.within===null?{}:{within:String(contactSample.within)})});
for(const option of availableSorts(contactSample.places)) {
  params.set('sort',option.value); const data=await call('/api/places?'+params);
  assert.deepEqual(data.places.map(p=>p.id),verify(contactSample.places,option.value).map(p=>p.id));
}
const names=await call('/api/places/search?name=Central%20Park');
for(const option of availableSorts(names.places)) {
  const data=await call('/api/places/search?'+new URLSearchParams({name:'Central Park',sort:option.value}));
  assert.deepEqual(data.places.map(p=>p.id),verify(names.places,option.value).map(p=>p.id));
}
for(const path of ['/api/places?city=Paris&within=0','/api/places?city=Paris&within=2','/api/places?city=Paris&within=5.0','/api/places/search?name=Park&within=5','/api/places/search?name=Park&sort=distance-desc']) await call(path,400);
await writeFile(process.env.TEST_REPORT_PATH ?? 'docs/search-rework/change-3-sort-filter-tests.json',JSON.stringify({testedAt:new Date().toISOString(),requests,orderChecks,evidence},null,2)+'\n');
console.log(`PASS: ${requests} real API requests; ${orderChecks} independent ordering/grouping checks; default, radius, categories, clears, conditional options, and validation.`);
