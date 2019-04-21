const {test, assert} = require('scar');

const fQuery = require('../../lib/fQuery');


test('fQuery.map() is function', () => {
    assert.equal(typeof fQuery.map, 'function');
});

test('fQuery.map() has the right members', () => {
    assert.equal(typeof fQuery.map.replace, 'function');
    assert.equal(typeof fQuery.map.prefix, 'function');
    assert.equal(typeof fQuery.map.suffix, 'function');
    assert.equal(fQuery.map.r, fQuery.map.replace);
    assert.equal(fQuery.map.p, fQuery.map.prefix);
    assert.equal(fQuery.map.s, fQuery.map.suffix);
});

test('fQuery.map() returns string', () => {
    assert.equal(typeof fQuery.map(), 'string');
    assert.equal(fQuery.map(), '');
});

test('fQuery.map() returns correct string', () => {
    assert.equal(fQuery.map(''), '');
    assert.equal(fQuery.map('a'), 'a');
    assert.equal(fQuery.map({source: 'a'}), 'a');
});

test('fQuery.map.replace() works', () => {
    const fn = fQuery.map.replace('a', 'x');
    assert.equal(typeof fn, 'function');
    assert.equal(typeof fn.replace, 'function');
    assert.equal(typeof fn.prefix, 'function');
    assert.equal(typeof fn.suffix, 'function');
    assert.equal(fn.r, fn.replace);
    assert.equal(fn.p, fn.prefix);
    assert.equal(fn.s, fn.suffix);
    assert.equal(fQuery.map.replace, fn.replace);
    assert.equal(fQuery.map.prefix, fn.prefix);
    assert.equal(fQuery.map.suffix, fn.suffix);
    assert.equal(fn(''), '');
    assert.equal(fn('a'), 'x');
    assert.equal(fn('babab'), 'bxbxb');
    assert.equal(fn({source: 'babab'}), 'bxbxb');
});

test('fQuery.map.prefix() works', () => {
    const fn = fQuery.map.prefix('ba', 'x');
    assert.equal(typeof fn, 'function');
    assert.equal(typeof fn.replace, 'function');
    assert.equal(typeof fn.prefix, 'function');
    assert.equal(typeof fn.suffix, 'function');
    assert.equal(fn.r, fn.replace);
    assert.equal(fn.p, fn.prefix);
    assert.equal(fn.s, fn.suffix);
    assert.equal(fQuery.map.replace, fn.replace);
    assert.equal(fQuery.map.prefix, fn.prefix);
    assert.equal(fQuery.map.suffix, fn.suffix);
    assert.equal(fn(''), '');
    assert.equal(fn('a'), 'a');
    assert.equal(fn('ba'), 'x');
    assert.equal(fn('babab'), 'xbab');
    assert.equal(fn({source: 'babab'}), 'xbab');
});

test('fQuery.map.suffix() works', () => {
    const fn = fQuery.map.suffix('ab', 'x');
    assert.equal(typeof fn, 'function');
    assert.equal(typeof fn.replace, 'function');
    assert.equal(typeof fn.prefix, 'function');
    assert.equal(typeof fn.suffix, 'function');
    assert.equal(fn.r, fn.replace);
    assert.equal(fn.p, fn.prefix);
    assert.equal(fn.s, fn.suffix);
    assert.equal(fQuery.map.replace, fn.replace);
    assert.equal(fQuery.map.prefix, fn.prefix);
    assert.equal(fQuery.map.suffix, fn.suffix);
    assert.equal(fn(''), '');
    assert.equal(fn('a'), 'a');
    assert.equal(fn('ab'), 'x');
    assert.equal(fn('babab'), 'babx');
    assert.equal(fn({source: 'babab'}), 'babx');
});
