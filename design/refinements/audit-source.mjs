import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import nextEnv from '@next/env';

const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true });
const clean = s => s.replace(/\r/g, '').trimEnd();
const original = p => clean(git(['show', `main:${p}`]));
const current = async p => clean(await readFile(p, 'utf8'));
const protectedPaths = ['src/app/api', 'src/lib', 'supabase', 'scripts', 'package.json', 'package-lock.json',
  'src/components/trip-drag.tsx', 'src/components/weather-box.tsx', 'src/components/location-search.tsx',
  'src/components/search-combobox.tsx', 'src/components/category-filter.tsx', 'src/components/ui/sonner.tsx'];
const protectedChanges = git(['diff', '--name-only', 'main', '--', ...protectedPaths]).trim();
assert.equal(protectedChanges, '', 'Protected API/database/data/drag files must not change');

function expressions(source) {
  const tree = ts.createSourceFile('component.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const calls = [], handlers = [];
  function visit(node) {
    if (ts.isCallExpression(node)) calls.push(node.getText(tree));
    if (ts.isJsxAttribute(node) && /^on[A-Z]/.test(node.name.getText(tree))) handlers.push(node.getText(tree));
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return { calls, handlers };
}
const audited = [];
for (const file of ['explore', 'destination', 'trip', 'navigation', 'category-badge', 'trip-summary']) {
  const p = `src/components/${file}.tsx`;
  let after = await current(p);
  if (file === 'trip-summary') after = after.replace(/<span className="trip-city-stamp">(.+)<\/span>/, '$1');
  const before = expressions(original(p)), now = expressions(after);
  assert.ok(JSON.stringify(before) === JSON.stringify(now), `Call/handler expressions changed in ${p}`);
  audited.push({ file: p, calls: now.calls.length, eventHandlers: now.handlers.length, status: 'PASS' });
}
for (const file of ['destination', 'trip']) {
  const p = `src/components/${file}.tsx`;
  const before = original(p), after = await current(p);
  const marker = file === 'destination' ? '  return <div className' : '  return <section className';
  assert.equal(after.slice(0, after.indexOf(marker)), before.slice(0, before.indexOf(marker)), `${file} state/effects/mutations changed`);
}

const template = await current('design/tripwise_retro_airline_template.html');
const art = await current('src/components/background-art.tsx');
let renderedSource = art.slice(art.indexOf('<svg className="art compass"'), art.lastIndexOf('\n  </div>;'));
for (const [jsx, html] of Object.entries({ className: 'class', fillOpacity: 'fill-opacity', strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width', strokeLinecap: 'stroke-linecap', strokeLinejoin: 'stroke-linejoin',
  strokeDasharray: 'stroke-dasharray', fontFamily: 'font-family', textAnchor: 'text-anchor', fontSize: 'font-size', vectorEffect: 'vector-effect' })) {
  renderedSource = renderedSource.replaceAll(`${jsx}=`, `${html}=`);
}
for (const id of ['cp', 'ic']) {
  renderedSource = renderedSource.replaceAll('id={`${id}-' + id + '`}', `id="${id}"`)
    .replaceAll('href={`#${id}-' + id + '`}', `href="#${id}"`);
}
renderedSource = renderedSource.replace(/style=\{\{ left: "(\d+)%", top: "(\d+)%" \}\}/g, 'style="left:$1%;top:$2%"');
const normalizeMarkup = s => s.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
const templateArt = template.slice(template.indexOf('<!-- Compass rose -->'), template.indexOf('<!-- Page content -->'));
assert.ok(normalizeMarkup(renderedSource) === normalizeMarkup(templateArt), 'SVG/style/coordinate markup differs from template');
const css = await current('src/app/background-art.css');
const marker = '/* ---------- Background artwork';
const originalRules = template.slice(template.indexOf(marker), template.indexOf('/* ---------- Content')).trim();
const copiedRules = css.slice(css.indexOf(marker), css.indexOf('@media (max-width: 600px)')).replaceAll('.retro-art ', '').trim();
assert.equal(copiedRules, originalRules, 'Artwork CSS geometry/keyframes/timing differs from template');
const mobile = css.slice(css.indexOf('@media (max-width: 600px)')).replaceAll('.retro-art ', '').replace(/\s+/g, '');
assert.ok(mobile.includes('.compass{--cw:240px;--cx:88%;--cy:22%;}') && mobile.includes('.coords{display:none;}'));

nextEnv.loadEnvConfig(process.cwd());
const secrets = Object.entries(process.env).filter(([name, value]) => /^(GEOAPIFY_|SUPABASE_|VERCEL_)/.test(name) && /KEY|SECRET|TOKEN|PASSWORD/.test(name) && value?.length >= 12).map(([, value]) => Buffer.from(value));
assert.ok(process.env.GEOAPIFY_API_KEY && process.env.SUPABASE_SECRET_KEY, 'Local keys unavailable; scan cannot be confirmed');
const files = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
let scanned = 0;
for (const file of files) {
  assert.ok(!/(^|\/)\.env(?:\.[^/]*)?$/.test(file) || /(^|\/)\.env\.example$/.test(file), 'Private environment filename is included');
  const content = await readFile(file);
  assert.ok(!secrets.some(secret => content.includes(secret)), 'Saved credential found; contents withheld');
  assert.ok(!/sb_secret_[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/.test(content.toString('utf8')), 'Credential pattern found; contents withheld');
  scanned++;
}
const report = { base: git(['rev-parse', 'main']).trim(), protectedChanges: [], componentExpressions: audited,
  artwork: { completeSvgMarkup: 'PASS (React spelling/unique IDs normalized)', completeCssRulesAndKeyframes: 'PASS', mobilePlacement: 'PASS' },
  secretScan: { files: scanned, savedKeys: 'absent', credentialPatterns: 'absent', privateEnvironmentFiles: 'absent' } };
await writeFile('design/refinements/source-audit.json', JSON.stringify(report, null, 2) + '\n');
console.log(`PASS: protected source unchanged; component call/handler expressions unchanged; complete template artwork matches; ${scanned} repository/evidence files free of saved keys/private env files`);
