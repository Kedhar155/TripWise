import nextEnv from '@next/env';
import { spawnSync } from 'node:child_process';

nextEnv.loadEnvConfig(process.cwd());
const secrets = Object.entries(process.env)
  .filter(([name, value]) => /(?:KEY|TOKEN|SECRET|PASSWORD)/.test(name) && value && value.length >= 12 && /^(GEOAPIFY_|SUPABASE_|VERCEL_)/.test(name))
  .map(([, value]) => Buffer.from(value));
if (!process.env.GEOAPIFY_API_KEY || !process.env.SUPABASE_SECRET_KEY) throw new Error('Required local keys are unavailable; history scan cannot be confirmed.');

function git(args) {
  const result = spawnSync('git', args, { maxBuffer: 256 * 1024 * 1024, windowsHide: true });
  if (result.status !== 0) throw new Error('Git verification failed; output withheld.');
  return result.stdout;
}
const tracked = git(['ls-files', '-z']).toString().split('\0');
if (tracked.some(file => /(^|\/)\.env(?:\.[^/]*)?$/.test(file) && !file.endsWith('/.env.example') && file !== '.env.example')) {
  throw new Error('A private environment file is tracked; content withheld.');
}
const ignored = spawnSync('git', ['check-ignore', '--quiet', '.env.local'], { windowsHide: true });
if (ignored.status !== 0) throw new Error('.env.local must remain ignored.');

// Includes reachable history and loose/dangling objects. Parse by byte length so
// binary images cannot break the batch format. Never print object contents.
const objects = git(['cat-file', '--batch-all-objects', '--batch']);
let offset = 0;
let count = 0;
while (offset < objects.length) {
  const end = objects.indexOf(10, offset);
  if (end < 0) throw new Error('Incomplete Git object metadata.');
  const [, type, sizeText] = objects.subarray(offset, end).toString('ascii').split(' ');
  const size = Number(sizeText);
  if (!Number.isSafeInteger(size) || size < 0 || end + 1 + size >= objects.length) throw new Error('Invalid Git object metadata.');
  const content = objects.subarray(end + 1, end + 1 + size);
  if (secrets.some(secret => content.includes(secret))) throw new Error('A saved credential exists in Git objects; content withheld.');
  const text = content.toString('utf8');
  if (/sb_secret_[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/.test(text)) {
    throw new Error('A credential-shaped value exists in Git objects; content withheld.');
  }
  if (type === 'tree') {
    const files = text.matchAll(/\d{6} (\.env[^\0]*)\0/g);
    for (const [, name] of files) {
      if (name !== '.env.example') throw new Error('A private environment file exists in Git history; content withheld.');
    }
  }
  count += 1;
  offset = end + 1 + size + 1;
}
console.log(`PASS: ${count} Git objects scanned; saved keys and credential patterns absent. Private environment files absent from tracked files and history; .env.local ignored.`);
