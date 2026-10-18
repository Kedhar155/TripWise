import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const base = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3028';
const checks = [];
async function get(path, params, status = 200) {
 const r = await fetch(`${base}${path}?${new URLSearchParams(params)}`);
 const data = await r.json();
 assert.equal(r.status, status, JSON.stringify(data));
 checks.push({path, params, status, count: data.places?.length ?? data.states?.length ?? data.cities?.length});
 return data;
}
for (const [country, stateQuery, stateName, cityQuery] of [['us','Illinois','Illinois','Springfield'],['in','Tamil','Tamil Nadu','Chennai'],['de','Bayern','Bavaria','Munich']]) {
 const {states} = await get('/api/states',{country,q:stateQuery});
 console.log(country, states.map(s=>s.name));
 const state = states.find(s=>s.name===stateName) ?? states[0];
 assert.ok(state, 'state suggestions');
 const region = {country,state:state.name,stateId:state.id};
 const area = await get('/api/places',region);
 assert.ok(area.state && area.places.length && area.places.length<=100);
 assert.ok(area.places.every(p=>!('distance' in p) && 'city' in p && 'state' in p && 'country' in p));
 const filtered = await get('/api/places',{...region,category:'museums,parks',sort:'name'});
 assert.ok(filtered.places.every(p=>['museums','parks'].includes(p.category)));
 const {cities} = await get('/api/cities',{...region,q:cityQuery});
 console.log(country, cities.map(c=>c.label));
 assert.ok(cities.length);
 assert.ok(cities.every(c=>c.state===state.name && c.label.includes(state.name)));
 const city=cities[0];
 const cityOnly = await get('/api/places',{country,city:city.label,cityId:city.id});
 assert.equal(cityOnly.resolvedState,state.name);
 await get('/api/places',{...region,city:city.label,cityId:city.id});
 await get('/api/places',{...region,sort:'distance'},400);
 await get('/api/places',{...region,within:'5'},400);
 await get('/api/places',{...region,country:country==='us'?'in':'us'},400);
 if(country==='us') {
   const other = (await get('/api/cities',{country,q:'Boston'})).cities[0];
   await get('/api/places',{...region,city:other.label,cityId:other.id},400);
 }
 console.log('PASS',country);
}
await get('/api/places',{country:'us'},400);
await get('/api/states',{country:'xx',q:'Illinois'},400);
await get('/api/states',{country:'us',q:'Il'},400);
assert.deepEqual((await get('/api/states',{country:'us',q:'zzzzzzzzzzzz'})).states,[]);
writeFileSync(process.env.TEST_REPORT_PATH ?? 'docs/polish/change-5-state-api-tests.json',JSON.stringify(checks,null,2));
console.log(`PASS ${checks.length} state/city API checks`);
