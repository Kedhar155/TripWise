import nextEnv from '@next/env';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
nextEnv.loadEnvConfig(process.cwd());
const secrets = [process.env.GEOAPIFY_API_KEY, process.env.SUPABASE_SECRET_KEY].filter(Boolean);
let checked = 0;
async function scan(dir) {
 for (const entry of await readdir(dir, {withFileTypes:true})) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) { await scan(file); continue; }
  if (!/\.(ts|tsx|js|mjs|json|md|sql|css)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  checked++;
  if (secrets.some(secret => text.includes(secret))) throw new Error('Private credential found; content withheld.');
 }
}
for (const dir of ['src','scripts','docs','supabase','.next/static']) await scan(dir);
console.log(`PASS: no saved secret values in ${checked} source, documentation, test, and browser-bundle files.`);
