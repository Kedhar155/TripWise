// Local-only trip location scenarios. No fixture request reaches Supabase or Geoapify.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
const row=(n,city,state,country)=>({id:`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`,place_id:`qa-${n}`,visitor_id:'00000000-0000-4000-8000-000000000000',name:`Test place ${n}`,address:'Fixture address',category:'museums',latitude:0,longitude:0,day:null,created_at:'2026-10-18T00:00:00Z',city,state,country});
let mode=''; let items=[];
http.createServer(async(req,res)=>{
 const next=(await readFile('.next/location-qa-state.txt','utf8').catch(()=>'mixed')).trim();
 if(next!==mode){ mode=next; items=mode==='legacy'?[row(1,null,null,null)]:mode==='long'?Array.from({length:40},(_,i)=>row(i+1,'City with a long name '+i,'State with a long name '+i,i%2?'India':'United States')):[row(1,'Chennai','Tamil Nadu','India'),row(2,'Chennai','Tamil Nadu','India'),row(3,'Chennai','Tamil Nadu','India'),row(4,'Madurai','Tamil Nadu','India'),row(5,'Bengaluru','Karnataka','India'),row(6,'Springfield','Illinois','United States'),row(7,null,null,null)]; }
 if(req.url.startsWith('/api/itinerary')){
  let result={items};
  if(req.method==='PATCH'){
   let body=''; for await(const chunk of req) body+=chunk;
   const id=req.url.split('/').at(-1); const input=JSON.parse(body);
   items=items.map(i=>i.id===id?{...i,day:input.day}:i); result={item:items.find(i=>i.id===id)};
  }
  if(req.method==='DELETE'){const id=req.url.split('/').at(-1);items=items.filter(i=>i.id!==id);result={deleted:id};}
  res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(result));return;
 }
 const upstream=http.request({hostname:'127.0.0.1',port:3029,path:req.url,method:req.method,headers:req.headers},r=>{res.writeHead(r.statusCode,r.headers);r.pipe(res);});
 upstream.on('error',()=>{res.writeHead(502);res.end('Start local preview on 3029');});req.pipe(upstream);
}).listen(3030,'127.0.0.1',()=>console.log('Trip summary fixture: http://127.0.0.1:3030/trip'));
