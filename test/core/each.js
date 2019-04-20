const _ = require('lodash');
const assert = require('assert');
const q = require('q');

const fQuery = require('../../lib/fQuery');

/* globals describe it */


describe('fQuery.fn.asyncEach()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.asyncEach));
    });

    it('expectes 1 parameter', () => {
        assert.strictEqual(fQuery.fn.asyncEach.length, 1);
    });

    it('works with no parameter', () => {
        fQuery().asyncEach();
        fQuery().asyncEach(undefined);
        fQuery().asyncEach(null);
    });

    it('returns a Q promise', () => {
        const p = fQuery().asyncEach();
        assert.ok(q.isPromise(p));
    });

    it('iterates correctly 1', () => {
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

    it('iterates correctly 2', () => {
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
            assert.strictEqual(this, x); // eslint-disable-line
            list.push([blob, idx]);
        });

        assert.deepEqual(list, expected);

        promise.then(() => {
            assert.deepEqual(list, expected);
        });

        assert.deepEqual(list, expected);
    });

    it('iterates correctly 3', done => {
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
            assert.strictEqual(this, x); // eslint-disable-line
            setTimeout(() => {
                list.push([blob, idx]);
                d();
            }, 0);
        });

        assert.deepEqual(list, []);

        promise.then(() => {
            assert.deepEqual(list, expected);
            done();
        });

        assert.deepEqual(list, []);
    });
});
