import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file);
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
  const compiled = { exports: {} };
  const localRequire = id => {
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const base = id.startsWith('@/') ? resolve('src', id.slice(2)) : resolve(dirname(file), id);
    return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, compiled, compiled.exports);
  cache.set(file, compiled.exports);
  return compiled.exports;
}
const {dayKeyboardCoordinates}=load('src/components/trip-drag.tsx');
const targets=[{id:'day-unplanned'},{id:'day-1'},{id:'day-2'}];
const rects=new Map(targets.map((t,i)=>[t.id,{left:0,top:i*200,width:400,height:100}]));
const context={droppableContainers:{getEnabled:()=>targets},droppableRects:rects,active:{data:{current:{day:null}}},collisionRect:{left:0,top:0,width:400,height:100},over:null};
let prevented=0;
const key=code=>({code,preventDefault(){prevented++;}});
assert.deepEqual(dayKeyboardCoordinates(key('ArrowDown'),{context,currentCoordinates:{x:0,y:0}}),{x:0,y:200});
assert.equal(dayKeyboardCoordinates(key('ArrowUp'),{context,currentCoordinates:{x:0,y:0}}),undefined);
context.over={id:'day-1'}; context.collisionRect.top=200;
assert.deepEqual(dayKeyboardCoordinates(key('ArrowUp'),{context,currentCoordinates:{x:0,y:200}}),{x:0,y:0});
assert.deepEqual(dayKeyboardCoordinates(key('ArrowRight'),{context,currentCoordinates:{x:0,y:200}}),{x:0,y:400});
context.over={id:'day-2'};
assert.equal(dayKeyboardCoordinates(key('ArrowDown'),{context,currentCoordinates:{x:0,y:400}}),undefined);
assert.equal(dayKeyboardCoordinates(key('Tab'),{context,currentCoordinates:{x:0,y:400}}),undefined);
assert.equal(prevented,5);
console.log('PASS: keyboard jumps whole day sections, source-day fallback, reverse navigation, boundary clamps and unrelated keys');
