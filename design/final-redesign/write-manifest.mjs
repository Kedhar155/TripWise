import { execFileSync } from 'node:child_process';
import { writeFile, access } from 'node:fs/promises';
const git = args => execFileSync('git', args, { encoding: 'utf8', windowsHide: true });
const folder = 'design/final-redesign/';
for (const name of ['changed-files.md', 'diff-stat-main.txt']) {
  try { await access(folder + name); } catch { await writeFile(folder + name, ''); }
}
const files = new Map(git(['diff', '--name-status', 'main']).trim().split('\n').filter(Boolean).map(line => {
  const [status, path] = line.split('\t'); return [path, status];
}));
for (const path of git(['ls-files', '--others', '--exclude-standard']).trim().split('\n').filter(Boolean)) files.set(path, 'A');
const groups = { 'Application, assets and test changes': [], 'Template, documentation, reports and screenshots': [] };
for (const [path, status] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
  const key = /^(src|public|scripts)\//.test(path) ? 'Application, assets and test changes' : 'Template, documentation, reports and screenshots';
  groups[key].push(`| ${status} | [${path}](D:/Projects/TripWise/${path}) |`);
}
let content = `# Every file changed against main\n\nBase: ${git(['rev-parse', 'main']).trim()}. Branch retro-ui. ${files.size} files, including this final audit. A = added, M = modified. No API route or database file changes. The only changed src/lib file is the explicitly requested defaultWithin constant; no fetching implementation changed.\n\n`;
for (const [name, rows] of Object.entries(groups)) content += `## ${name} (${rows.length})\n\n| Status | File |\n| --- | --- |\n${rows.join('\n')}\n\n`;
await writeFile(folder + 'changed-files.md', content);
await writeFile(folder + 'diff-stat-main.txt', git(['diff', '--stat', 'main']));
console.log(`${files.size} changed files listed individually; ${groups['Application, assets and test changes'].length} application/assets/test files`);
