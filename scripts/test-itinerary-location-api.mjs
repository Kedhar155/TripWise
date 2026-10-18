import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
nextEnv.loadEnvConfig(process.cwd(),false,{info(){},error(){}});
const base=process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3029';
const visitor=randomUUID();
const headers={'content-type':'application/json','x-visitor-id':visitor};
const owned=[]; const checks=[];
async function call(path,options={},status=200){
 const r=await fetch(base+path,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(35000)});
 const data=await r.json();
 assert.equal(r.status,status,JSON.stringify(data));
 checks.push({path,method:options.method??'GET',status}); return data;
}
try {
 for(const [city,country] of [['Chennai','in'],['Bengaluru','in'],['Springfield, Illinois','us']]){
  const {places}=await call('/api/places?'+new URLSearchParams({city,country,category:'museums'}));
  assert.ok(places.length);
  const place=(await call('/api/places/'+places[0].id)).place;
  assert.ok(place.city && place.state && place.country);
  const {item}=await call('/api/itinerary',{method:'POST',body:JSON.stringify({place_id:place.id,city:place.city,state:place.state,country:place.country})},201);
  owned.push(item.id);
  for(const key of ['city','state','country']) assert.equal(item[key],place[key]);
 }
 // A disposable pre-migration-shaped row: nullable columns are omitted deliberately.
 const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:legacy,error}=await db.from('itinerary').insert({visitor_id:visitor,place_id:'qa-legacy-'+visitor,name:'Legacy test place',address:'Legacy address',category:'other',latitude:0,longitude:0}).select().single();
 assert.ok(!error,'Legacy-shaped row insert must work'); owned.push(legacy.id);
 let {items}=await call('/api/itinerary');
 assert.equal(items.length,4);
 assert.ok(items.filter(i=>i.id!==legacy.id).every(i=>i.city&&i.state&&i.country));
 assert.equal(new Set(items.map(i=>i.country).filter(Boolean)).size,2);
 assert.equal(new Set(items.map(i=>i.state).filter(Boolean)).size,3);
 assert.ok(['city','state','country'].every(k=>items.find(i=>i.id===legacy.id)[k]===null));
 for(const field of ['city','state','country']) for(const value of [123,{},'x'.repeat(121),'bad\ntext']) await call('/api/itinerary',{method:'POST',body:JSON.stringify({place_id:'test', [field]:value})},400);
 const moved=(await call('/api/itinerary/'+owned[0],{method:'PATCH',body:JSON.stringify({day:1})})).item;
 assert.equal(moved.day,1); assert.ok(moved.city&&moved.state&&moved.country);
 const legacyMoved=(await call('/api/itinerary/'+legacy.id,{method:'PATCH',body:JSON.stringify({day:2})})).item;
 assert.equal(legacyMoved.day,2); assert.equal(legacyMoved.city,null);
 await call('/api/itinerary/'+owned[1],{method:'DELETE'}); owned.splice(1,1);
 items=(await call('/api/itinerary')).items; assert.equal(items.length,3);
 console.log('PASS: three states / two countries, POST metadata persistence, fresh GET, legacy nulls, validation, moves and removal');
} finally {
 for(const id of owned) await call('/api/itinerary/'+id,{method:'DELETE'});
 const {items}=await call('/api/itinerary'); assert.equal(items.length,0);
 await writeFile(process.env.TEST_REPORT_PATH ?? 'docs/polish/change-6-location-api-tests.json',JSON.stringify({checks,cleanup:'own random visitor empty'},null,2)+'\n');
}
