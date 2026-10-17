import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile('src/lib/visitor.ts', 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { getVisitorId } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const storage = new Map();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
} });
const first = getVisitorId();
assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
assert.equal(getVisitorId(), first, 'Repeated visits keep the same ID');
storage.clear();
assert.notEqual(getVisitorId(), first, 'A separate browser storage gets a new ID');
storage.set('tripwise.visitor-id', 'invalid');
assert.notEqual(getVisitorId(), 'invalid', 'Invalid stored IDs are repaired');
Object.defineProperty(globalThis, 'localStorage', { get() { throw new Error('Blocked'); } });
assert.throws(getVisitorId, /Allow browser storage/, 'Blocked storage explains the recovery');
console.log('PASS: visitor UUID, persistence, separate storage, malformed ID recovery, and blocked storage feedback.');
