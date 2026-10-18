import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const cache = new Map();
const calls = { pointer: 0, touch: 0, keyboard: 0, node: null, activator: null };
const dnd = {
  useDraggable: ({ disabled, attributes }) => ({
    attributes: { role: attributes.role, tabIndex: 0, 'aria-disabled': disabled },
    listeners: disabled ? undefined : {
      onPointerDown: () => calls.pointer++, onTouchStart: () => calls.touch++, onKeyDown: () => calls.keyboard++,
    },
    setNodeRef: node => { calls.node = node; },
    setActivatorNodeRef: node => { calls.activator = node; }, isDragging: false,
  }),
};
function load(file) {
  file = resolve(file);
  if (cache.has(file)) return cache.get(file);
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } });
  const compiled = { exports: {} };
  const localRequire = id => {
    if (id === '@dnd-kit/core') return dnd;
    if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
    const base = id.startsWith('@/') ? resolve('src', id.slice(2)) : resolve(dirname(file), id);
    return load(['.ts', '.tsx'].map(ext => base + ext).find(existsSync));
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, compiled, compiled.exports);
  cache.set(file, compiled.exports);
  return compiled.exports;
}
const { TripPlace } = load('src/components/trip-drag.tsx');
const props = { item: { id: 'test-item', place_id: 'place', name: 'Test place', category: 'parks', day: null },
  index: 0, dayCount: 2, busy: false, controlsBusy: false, moving: null, removing: null,
  onMove: () => {}, onRemove: () => {} };
const card = TripPlace(props);
const plain = { closest: () => null };
const control = { closest: () => ({}) };
card.props.ref(plain);
assert.equal(calls.node, plain);
assert.equal(calls.activator, plain);
assert.equal(card.props.role, 'group');
assert.equal(card.props.tabIndex, 0);
assert.equal(card.props.id, 'drag-test-item');
card.props.onPointerDown({ target: plain, pointerType: 'mouse' });
card.props.onPointerDown({ target: plain, pointerType: 'pen' });
card.props.onPointerDown({ target: plain, pointerType: 'touch' });
card.props.onPointerDown({ target: control, pointerType: 'mouse' });
assert.equal(calls.pointer, 2, 'mouse/pen drag from the card, never controls or touch pointers');
card.props.onTouchStart({ target: plain });
card.props.onTouchStart({ target: control });
assert.equal(calls.touch, 1, 'touch uses its delayed sensor and excludes controls');
card.props.onKeyDown({ target: plain, currentTarget: plain });
card.props.onKeyDown({ target: control, currentTarget: plain });
assert.equal(calls.keyboard, 1, 'nested links/controls keep their keyboard actions');
const [main, controls] = card.props.children;
const title = main.props.children[1];
assert.equal(title.type, 'h3');
assert.equal(title.props.children[0].props.children, '01');
assert.equal(title.props.children[1].props.children, 'Test place');
assert.equal(title.props.children[1].props.draggable, false, 'browser link drag cannot compete with the card');
assert.equal(controls.props.children[1].type, 'select');
assert.equal(controls.props.children[2].type, 'button');
const busy = TripPlace({ ...props, busy: true });
busy.props.onPointerDown({ target: plain, pointerType: 'mouse' });
busy.props.onTouchStart({ target: plain });
busy.props.onKeyDown({ target: plain, currentTarget: plain });
assert.deepEqual([calls.pointer, calls.touch, calls.keyboard], [2, 1, 1], 'busy cards cannot start a drag');
console.log('PASS: whole-card refs, mouse/pen/touch/keyboard guards, independent controls, number/title alignment and disabled state');
