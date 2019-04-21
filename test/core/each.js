const {test, assert} = require('scar');

const fQuery = require('../../lib/fQuery');

test('fQuery.fn.asyncEach() is function', () => {
    assert.equal(typeof fQuery.fn.asyncEach, 'function');
});

test('fQuery.fn.asyncEach() expectes 1 parameter', () => {
    assert.equal(fQuery.fn.asyncEach.length, 1);
});

test('fQuery.fn.asyncEach() works with no parameter', () => {
    fQuery().asyncEach();
    fQuery().asyncEach(undefined);
    fQuery().asyncEach(null);
});

test('fQuery.fn.asyncEach() returns a promise', () => {
    const p = fQuery().asyncEach();
    assert.ok(typeof p.then === 'function');
    assert.ok(typeof p.catch === 'function');
    assert.ok(typeof p.finally === 'function');
});

test('fQuery.fn.asyncEach() iterates correctly 1', () => {
    const x = fQuery();
    const list = [];
    const promise = x.asyncEach((blob, idx) => {
        list.push([blob, idx]);
    });

    assert.deepEqual(list, []);

    promise.then(() => {
        assert.deepEqual(list, []);
    });

    assert.deepEqual(list, []);
});

test('fQuery.fn.asyncEach() iterates correctly 2', () => {
    const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
    const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
    const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
    const x = fQuery([b1, b2, b3]);
    const list = [];
    const expected = [
        [b1, 0],
        [b2, 1],
        [b3, 2]
    ];
    const promise = x.asyncEach(function fn1(blob, idx) {
        assert.equal(this, x); // eslint-disable-line
        list.push([blob, idx]);
    });

    assert.deepEqual(list, expected);

    promise.then(() => {
        assert.deepEqual(list, expected);
    });

    assert.deepEqual(list, expected);
});

test('fQuery.fn.asyncEach() iterates correctly 3', () => {
    return new Promise(resolve => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery([b1, b2, b3]);
        const list = [];
        const expected = [
            [b1, 0],
            [b2, 1],
            [b3, 2]
        ];
        const promise = x.asyncEach(function fn1(blob, idx, d) {
            assert.equal(this, x); // eslint-disable-line
            setTimeout(() => {
                list.push([blob, idx]);
                d();
            }, 0);
        });

        assert.deepEqual(list, []);

        promise.then(() => {
            assert.deepEqual(list, expected);
            resolve();
        });

        assert.deepEqual(list, []);
    });
});
