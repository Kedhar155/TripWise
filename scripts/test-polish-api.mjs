// Sequential suites avoid bursts against the free provider tier. Each suite cleans its disposable visitor.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.env.TEST_BASE_URL??'http://127.0.0.1:3033';
const folder='docs/polish/final';
await mkdir(folder,{recursive:true});
const suites=[['general','test-api.mjs','md'],['state','test-state-search-api.mjs','json'],['sort','test-sort-filters-api.mjs','json'],['name','test-search-api.mjs','md'],['category','test-category-search.mjs','json'],['location','test-itinerary-location-api.mjs','json']];
const results=[];
for(const [name,script,ext] of suites){
 const report=`${folder}/${name}-api-tests.${ext}`;
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,[`scripts/${script}`],{env:{...process.env,TEST_BASE_URL:base,TEST_REPORT_PATH:report},stdio:'inherit',windowsHide:true});
  child.on('error',reject);child.on('exit',resolve);
 });
 results.push({suite:name,status:code===0?'PASS':'FAIL',report});
 await writeFile(`${folder}/api-summary.json`,JSON.stringify({base,results},null,2)+'\n');
 if(code!==0) process.exit(1);
}
console.log('PASS: all six final API suites');
