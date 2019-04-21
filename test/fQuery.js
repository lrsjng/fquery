const _ = require('lodash');
const {test, assert} = require('scar');

const fQuery = require('../lib/fQuery');

test('fQuery is function', () => {
    assert.ok(_.isFunction(fQuery));
});

test('fQuery() instance of fQuery', () => {
    assert.ok(fQuery() instanceof fQuery);
});

test('fQuery expectes 2 parameters', () => {
    assert.equal(fQuery.length, 2);
});

test('fQuery._ is lodash', () => {
    assert.equal(fQuery._, require('lodash'));
});

test('fQuery.Blob is Blob', () => {
    assert.equal(fQuery.Blob, require('../lib/util/Blob'));
});

test('fQuery.Selector is Selector', () => {
    assert.equal(fQuery.Selector, require('../lib/util/Selector'));
});

test('fQuery.fn is object', () => {
    assert.ok(_.isObject(fQuery.fn));
});

test('fQuery.fn is prototype of fQuery', () => {
    assert.equal(fQuery.fn, fQuery.prototype);
});

test('fQuery.fn.constructor is set to fQuery', () => {
    assert.equal(fQuery.fn.constructor, fQuery);
});

test('fQuery.plugin is function', () => {
    assert.ok(_.isFunction(fQuery.plugin));
});

test('fQuery.plugin expectes 1 parameter', () => {
    assert.equal(fQuery.plugin.length, 1);
});
