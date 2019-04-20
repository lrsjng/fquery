const _ = require('lodash');
const assert = require('assert');

/* globals describe it */

const slice = obj => {
    return Array.prototype.slice.call(obj); // eslint-disable-line
};

const fQuery = require('../../lib/fQuery');


describe('fQuery.fn.push()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.push));
    });

    it('expectes 1 parameter', () => {
        assert.strictEqual(fQuery.fn.push.length, 1);
    });

    it('works with no parameter', () => {
        fQuery().push();
        fQuery().push(undefined);
        fQuery().push(null);
    });

    it('returns this, is chainable', () => {
        const x = fQuery();
        const y = x.push();
        const z = y.push();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('initial empty selection', () => {
        const x = fQuery();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('empty push', () => {
        const x = fQuery().push();
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('multi empty push', () => {
        const x = fQuery().push().push();
        assert.deepEqual(x._stack, [[], [], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('non blob value push', () => {
        const v = {};
        const x = fQuery().push(v);
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('non blobs array push', () => {
        const v = [{}, 1, true, null, undefined, 'text'];
        const x = fQuery().push(v);
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('blob value push', () => {
        const b = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const x = fQuery().push(b);
        assert.deepEqual(x._stack, [[b], []]);
        assert.deepEqual(slice(x), [b]);
        assert.strictEqual(x.length, 1);
    });

    it('blob array push', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, b2, b3]);
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);
    });

    it('mixed array push', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, 1, b2, true, b3, null]);
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);
    });

    it('multi blob array push', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, b2, b3]).push([b1]).push(b3);
        assert.deepEqual(x._stack, [[b3], [b1], [b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b3]);
        assert.strictEqual(x.length, 1);
    });
});



describe('fQuery.fn.pop()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.pop));
    });

    it('expectes 0 parameters', () => {
        assert.strictEqual(fQuery.fn.pop.length, 0);
    });

    it('works with parameter', () => {
        fQuery().pop();
        fQuery().pop(undefined);
        fQuery().pop(null);
    });

    it('returns this, is chainable', () => {
        const x = fQuery();
        const y = x.pop();
        const z = y.pop();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('pop', () => {
        const x = fQuery().pop();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('multi pop 1', () => {
        const x = fQuery().pop().pop();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('multi pop 2', () => {
        const x = fQuery().pop().pop().pop();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('multi pop 3', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, b2, b3]).push([b3, b1]).push([b1]);

        x.pop();
        assert.deepEqual(x._stack, [[b3, b1], [b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b3, b1]);
        assert.strictEqual(x.length, 2);

        x.pop();
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);

        x.pop();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);

        x.pop();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });
});


describe('fQuery.fn.get()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.get));
    });

    it('expectes 1 parameter', () => {
        assert.strictEqual(fQuery.fn.get.length, 1);
    });

    it('returns blob array if no parameter 1', () => {
        const x = fQuery();
        assert.deepEqual(x.get(), []);
    });

    it('returns blob array if no parameter 2', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, b2, b3]);
        assert.deepEqual(x.get(), [b1, b2, b3]);
    });

    it('returns correct value if int parameter', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, b2, b3]);

        assert.strictEqual(x.get(-4), undefined);
        assert.strictEqual(x.get(-3), b1);
        assert.strictEqual(x.get(-2), b2);
        assert.strictEqual(x.get(-1), b3);
        assert.strictEqual(x.get(0), b1);
        assert.strictEqual(x.get(1), b2);
        assert.strictEqual(x.get(2), b3);
        assert.strictEqual(x.get(3), undefined);
    });

    it('returns undefined if non int numeric parameter', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().push([b1, b2, b3]);

        assert.strictEqual(x.get(1.5), undefined);
    });
});


describe('fQuery.fn.each()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.each));
    });

    it('expectes 1 parameter', () => {
        assert.strictEqual(fQuery.fn.each.length, 1);
    });

    it('works with no parameter', () => {
        fQuery().each();
        fQuery().each(undefined);
        fQuery().each(null);
    });

    it('returns this, is chainable', () => {
        const x = fQuery();
        const y = x.each();
        const z = y.each();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('iterates correctly 1', () => {
        const x = fQuery();
        const list = [];

        x.each(function fn1(blob, idx) {
            list.push([this, blob, idx]); // eslint-disable-line
        });

        assert.deepEqual(list, []);
    });

    it('iterates correctly 2', () => {
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

    it('iterates correctly 3', () => {
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
});


describe('fQuery.fn.map()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.map));
    });

    it('expectes 1 parameter', () => {
        assert.strictEqual(fQuery.fn.map.length, 1);
    });

    it('works with no parameter', () => {
        fQuery().map();
        fQuery().map(undefined);
        fQuery().map(null);
    });

    it('returns array', () => {
        const x = fQuery();
        assert.ok(_.isArray(x.map()));
        assert.ok(_.isArray(x.map(undefined)));
        assert.ok(_.isArray(x.map(null)));
    });

    it('iterates correctly 1', () => {
        const x = fQuery();
        const list = [];

        const result = x.map(function fn1(blob, idx) {
            list.push([this, blob, idx]); // eslint-disable-line
            return 'v' + idx;
        });

        assert.deepEqual(list, []);
        assert.deepEqual(result, []);
    });

    it('iterates correctly 2', () => {
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

    it('iterates correctly 3', () => {
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
});
