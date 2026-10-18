import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const mode = process.argv[2] ?? 'unit';
if (!['unit', 'api'].includes(mode)) throw new Error('Use unit or api');
const folder = `design/final/${mode}`;
await mkdir(folder, { recursive: true });
const suites = mode === 'api' ? [
  ['general', 'test-api.mjs', 'md'], ['state', 'test-state-search-api.mjs', 'json'],
  ['sort', 'test-sort-filters-api.mjs', 'json'], ['name', 'test-search-api.mjs', 'md'],
  ['category', 'test-category-search.mjs', 'json'], ['location', 'test-itinerary-location-api.mjs', 'json'],
] : ['categories', 'place-sorting', 'search', 'state-search', 'explore-session', 'trip-summary',
  'trip-drag', 'itinerary-location', 'weather', 'visitor', 'client-errors', 'errors'].map(name => [name, `test-${name}.mjs`, 'txt']);
const results = [];
for (const [name, script, extension] of suites) {
  const report = `${folder}/${name}.${extension}`;
  let output = '';
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`scripts/${script}`], { env: { ...process.env, TEST_REPORT_PATH: report }, windowsHide: true });
    child.stdout.on('data', chunk => { output += chunk.toString(); });
    child.stderr.on('data', chunk => { output += chunk.toString(); });
    child.on('error', reject);
    child.on('exit', resolve);
  });
  await writeFile(`${folder}/${name}.log.txt`, output);
  results.push({ suite: name, status: code === 0 ? 'PASS' : 'FAIL', report: mode === 'api' ? report : `${folder}/${name}.log.txt` });
  await writeFile(`${folder}/summary.json`, JSON.stringify({ base: mode === 'api' ? process.env.TEST_BASE_URL : undefined, results }, null, 2) + '\n');
  console.log(`${code === 0 ? 'PASS' : 'FAIL'}: ${name}`);
  if (code !== 0) { console.log(output); process.exit(1); }
}
