const _ = require('lodash');
const {test, assert} = require('scar');

const slice = obj => {
    return Array.prototype.slice.call(obj); // eslint-disable-line
};

const fQuery = require('../../lib/fQuery');


test('fQuery.fn.push() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.push));
});

test('fQuery.fn.push() expectes 1 parameter', () => {
    assert.equal(fQuery.fn.push.length, 1);
});

test('fQuery.fn.push() works with no parameter', () => {
    fQuery().push();
    fQuery().push(undefined);
    fQuery().push(null);
});

test('fQuery.fn.push() returns this, is chainable', () => {
    const x = fQuery();
    const y = x.push();
    const z = y.push();
    assert.equal(x, y);
    assert.equal(y, z);
});

test('fQuery.fn.push() initial empty selection', () => {
    const x = fQuery();
    assert.deepEqual(x._stack, [[]]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.push() empty push', () => {
    const x = fQuery().push();
    assert.deepEqual(x._stack, [[], []]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.push() multi empty push', () => {
    const x = fQuery().push().push();
    assert.deepEqual(x._stack, [[], [], []]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.push() non blob value push', () => {
    const v = {};
    const x = fQuery().push(v);
    assert.deepEqual(x._stack, [[], []]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.push() non blobs array push', () => {
    const v = [{}, 1, true, null, undefined, 'text'];
    const x = fQuery().push(v);
    assert.deepEqual(x._stack, [[], []]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.push() blob value push', () => {
    const b = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const x = fQuery().push(b);
    assert.deepEqual(x._stack, [[b], []]);
    assert.deepEqual(slice(x), [b]);
    assert.equal(x.length, 1);
});

test('fQuery.fn.push() blob array push', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]);
    assert.deepEqual(x._stack, [[b1, b2, b3], []]);
    assert.deepEqual(slice(x), [b1, b2, b3]);
    assert.equal(x.length, 3);
});

test('fQuery.fn.push() mixed array push', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, 1, b2, true, b3, null]);
    assert.deepEqual(x._stack, [[b1, b2, b3], []]);
    assert.deepEqual(slice(x), [b1, b2, b3]);
    assert.equal(x.length, 3);
});

test('fQuery.fn.push() multi blob array push', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]).push([b1]).push(b3);
    assert.deepEqual(x._stack, [[b3], [b1], [b1, b2, b3], []]);
    assert.deepEqual(slice(x), [b3]);
    assert.equal(x.length, 1);
});


test('fQuery.fn.pop() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.pop));
});

test('fQuery.fn.pop() expectes 0 parameters', () => {
    assert.equal(fQuery.fn.pop.length, 0);
});

test('fQuery.fn.pop() works with parameter', () => {
    fQuery().pop();
    fQuery().pop(undefined);
    fQuery().pop(null);
});

test('fQuery.fn.pop() returns this, is chainable', () => {
    const x = fQuery();
    const y = x.pop();
    const z = y.pop();
    assert.equal(x, y);
    assert.equal(y, z);
});

test('fQuery.fn.pop() pop', () => {
    const x = fQuery().pop();
    assert.deepEqual(x._stack, [[]]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.pop() multi pop 1', () => {
    const x = fQuery().pop().pop();
    assert.deepEqual(x._stack, [[]]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.pop() multi pop 2', () => {
    const x = fQuery().pop().pop().pop();
    assert.deepEqual(x._stack, [[]]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});

test('fQuery.fn.pop() multi pop 3', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]).push([b3, b1]).push([b1]);

    x.pop();
    assert.deepEqual(x._stack, [[b3, b1], [b1, b2, b3], []]);
    assert.deepEqual(slice(x), [b3, b1]);
    assert.equal(x.length, 2);

    x.pop();
    assert.deepEqual(x._stack, [[b1, b2, b3], []]);
    assert.deepEqual(slice(x), [b1, b2, b3]);
    assert.equal(x.length, 3);

    x.pop();
    assert.deepEqual(x._stack, [[]]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);

    x.pop();
    assert.deepEqual(x._stack, [[]]);
    assert.deepEqual(slice(x), []);
    assert.equal(x.length, 0);
});


test('fQuery.fn.get() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.get));
});

test('fQuery.fn.get() expectes 1 parameter', () => {
    assert.equal(fQuery.fn.get.length, 1);
});

test('fQuery.fn.get() returns blob array if no parameter 1', () => {
    const x = fQuery();
    assert.deepEqual(x.get(), []);
});

test('fQuery.fn.get() returns blob array if no parameter 2', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]);
    assert.deepEqual(x.get(), [b1, b2, b3]);
});

test('fQuery.fn.get() returns correct value if int parameter', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]);

    assert.equal(x.get(-4), undefined);
    assert.equal(x.get(-3), b1);
    assert.equal(x.get(-2), b2);
    assert.equal(x.get(-1), b3);
    assert.equal(x.get(0), b1);
    assert.equal(x.get(1), b2);
    assert.equal(x.get(2), b3);
    assert.equal(x.get(3), undefined);
});

test('fQuery.fn.get() returns undefined if non int numeric parameter', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]);

    assert.equal(x.get(1.5), undefined);
});


test('fQuery.fn.each() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.each));
});

test('fQuery.fn.each() expectes 1 parameter', () => {
    assert.equal(fQuery.fn.each.length, 1);
});

test('fQuery.fn.each() works with no parameter', () => {
    fQuery().each();
    fQuery().each(undefined);
    fQuery().each(null);
});

test('fQuery.fn.each() returns this, is chainable', () => {
    const x = fQuery();
    const y = x.each();
    const z = y.each();
    assert.equal(x, y);
    assert.equal(y, z);
});

test('fQuery.fn.each() iterates correctly 1', () => {
    const x = fQuery();
    const list = [];

    x.each(function fn1(blob, idx) {
        list.push([this, blob, idx]); // eslint-disable-line
    });

    assert.deepEqual(list, []);
});

test('fQuery.fn.each() iterates correctly 2', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]);
    const list = [];

    x.each(function fn1(blob, idx) {
        list.push([this, blob, idx]); // eslint-disable-line
    });

    const expected = [
        [x, b1, 0],
        [x, b2, 1],
        [x, b3, 2]
    ];

    assert.deepEqual(list, expected);
});

test('fQuery.fn.each() iterates correctly 3', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]).push([b2]);
    const list = [];

    x.each(function fn1(blob, idx) {
        list.push([this, blob, idx]); // eslint-disable-line
    });

    const expected = [
        [x, b2, 0]
    ];

    assert.deepEqual(list, expected);
});


test('fQuery.fn.map() is function', () => {
    assert.ok(_.isFunction(fQuery.fn.map));
});

test('fQuery.fn.map() expectes 1 parameter', () => {
    assert.equal(fQuery.fn.map.length, 1);
});

test('fQuery.fn.map() works with no parameter', () => {
    fQuery().map();
    fQuery().map(undefined);
    fQuery().map(null);
});

test('fQuery.fn.map() returns array', () => {
    const x = fQuery();
    assert.ok(_.isArray(x.map()));
    assert.ok(_.isArray(x.map(undefined)));
    assert.ok(_.isArray(x.map(null)));
});

test('fQuery.fn.map() iterates correctly 1', () => {
    const x = fQuery();
    const list = [];

    const result = x.map(function fn1(blob, idx) {
        list.push([this, blob, idx]); // eslint-disable-line
        return 'v' + idx;
    });

    assert.deepEqual(list, []);
    assert.deepEqual(result, []);
});

test('fQuery.fn.map() iterates correctly 2', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]);
    const list = [];

    const result = x.map(function fn1(blob, idx) {
        list.push([this, blob, idx]); // eslint-disable-line
        return 'v' + idx;
    });

    const expected = [
        [x, b1, 0],
        [x, b2, 1],
        [x, b3, 2]
    ];

    assert.deepEqual(list, expected);
    assert.deepEqual(result, ['v0', 'v1', 'v2']);
});

test('fQuery.fn.map() iterates correctly 3', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery().push([b1, b2, b3]).push([b2]);
    const list = [];

    const result = x.map(function fn1(blob, idx) {
        list.push([this, blob, idx]); // eslint-disable-line
        return 'v' + idx;
    });

    const expected = [
        [x, b2, 0]
    ];

    assert.deepEqual(list, expected);
    assert.deepEqual(result, ['v0']);
});
