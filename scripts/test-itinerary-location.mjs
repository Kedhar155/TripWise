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
    if (id === '@/lib/geoapify') return {getPlace: async () => {detailCalls++; return place;}};
    if (id === '@/lib/supabase') return {database:()=>({from:()=>db}),databaseError:()=>{}};
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const base = id.startsWith('@/') ? resolve('src', id.slice(2)) : resolve(dirname(file), id);
    return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  }, compiled, compiled.exports);
  cache.set(file, compiled.exports);
  return compiled.exports;
}
let detailCalls=0;
let inserted;
let place={name:'Museum',address:'Address',category:'museums',latitude:1,longitude:2,city:'Chennai',state:'Tamil Nadu',country:'India'};
const db={insert(value){inserted=value;return this;},select(){return this;},single(){return {data:{id:'saved',...inserted},error:null};},eq(){return this;},order(){return {data:[{id:'old',city:null,state:null,country:null}],error:null};}};
const {POST,GET}=load('src/app/api/itinerary/route.ts');
const headers={'content-type':'application/json','x-visitor-id':'11111111-1111-4111-8111-111111111111'};
const post=body=>POST(new Request('http://localhost/api/itinerary',{method:'POST',headers,body:JSON.stringify({place_id:'museum',...body})}));
for(const field of ['city','state','country']) for(const invalid of [12,true,{},[], 'x'.repeat(121),'bad\ntext','bad\u007ftext']) {
 const r=await post({[field]:invalid}); assert.equal(r.status,400); assert.equal((await r.json()).error.code,'INVALID_LOCATION');
}
assert.equal(detailCalls,0,'Reject invalid locations before spending upstream credits');
let r=await post({city:'Other',state:'Other',country:'Other'}); assert.equal(r.status,201);
assert.equal(inserted.city,'Chennai'); assert.equal(inserted.state,'Tamil Nadu'); assert.equal(inserted.country,'India');
place={...place,city:null,state:null,country:null};
r=await post({city:'  Chennai  ',state:'Tamil   Nadu',country:'India'}); assert.equal(r.status,201);
assert.equal(inserted.city,'Chennai'); assert.equal(inserted.state,'Tamil Nadu');
await post({}); assert.equal(inserted.city,null); assert.equal(inserted.state,null); assert.equal(inserted.country,null);
await post({city:'  ',state:null,country:null}); assert.equal(inserted.city,null);
r=await GET(new Request('http://localhost/api/itinerary',{headers})); assert.equal(r.status,200); assert.equal((await r.json()).items[0].city,null);
console.log('PASS: POST optional location type/length/control validation, null/blank handling, pre-fetch rejection, server metadata precedence, fallback text normalization, legacy GET nulls');
