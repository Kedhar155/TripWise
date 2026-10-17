import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/api.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { failure, ApiError, body } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const privateText = 'upstream URL contains a private credential';
const response = failure(new Error(privateText));
assert.equal(response.status, 500);
assert.ok(!(await response.text()).includes(privateText));
for (const status of [400, 404, 409, 500]) {
  const response = failure(new ApiError(status, 'TEST_ERROR', 'Safe message'));
  assert.equal(response.status, status);
  assert.deepEqual(await response.json(), { error: { code: 'TEST_ERROR', message: 'Safe message' } });
}
const request = new Request('http://localhost', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({place_id:'abc'})});
assert.deepEqual(await body(request), {place_id:'abc'});
console.log('PASS: 400/404/409/500 error responses, unexpected-error redaction, JSON body handling');
