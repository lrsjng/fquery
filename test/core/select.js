const _ = require('lodash');
const assert = require('assert');
const path = require('path');

/* globals describe it */

const slice = obj => {
    return Array.prototype.slice.call(obj); // eslint-disable-line
};

const fQuery = require('../../lib/fQuery');


describe('fQuery.fn.select()', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery.fn.select));
    });

    it('expectes 2 parameter', () => {
        assert.strictEqual(fQuery.fn.select.length, 2);
    });

    it('works with no parameter', () => {
        fQuery().select();
        fQuery().select(undefined);
        fQuery().select(null);
    });

    it('returns this, is chainable', () => {
        const x = fQuery();
        const y = x.select();
        const z = y.select();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('empty select 1', () => {
        const x = fQuery();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('empty select 2', () => {
        const x = fQuery().select();
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('empty select 3', () => {
        const x = fQuery().select().select();
        assert.deepEqual(x._stack, [[], [], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('non blob select', () => {
        const v = {};
        const x = fQuery().select(v);
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('non blob array select', () => {
        const v = [{}, 1, true, null, undefined, 'text'];
        const x = fQuery().select(v);
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('blob select', () => {
        const b = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const x = fQuery().select(b);
        assert.deepEqual(x._stack, [[b], []]);
        assert.deepEqual(slice(x), [b]);
        assert.strictEqual(x.length, 1);
    });

    it('blob array select', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().select([b1, b2, b3]);
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);
    });

    it('mixed array select', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().select([b1, 1, b2, true, b3, null]);
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);
    });

    it('multi blob array select', () => {
        const b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        const b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        const b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        const x = fQuery().select([b1, b2, b3]).select([b1]).select(b3);
        assert.deepEqual(x._stack, [[b3], [b1], [b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b3]);
        assert.strictEqual(x.length, 1);
    });

    it('string select', () => {
        const x = fQuery().select('test/assets/files-abc/a');
        const sources = _.pluck(x, 'source');
        const expected = [path.resolve('test/assets/files-abc/a')];
        assert.deepEqual(sources, expected);
    });

    it('string select glob', () => {
        const x = fQuery().select('test/assets/files-abc/*');
        const sources = _.pluck(x, 'source');
        const expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b'), path.resolve('test/assets/files-abc/c')];
        assert.deepEqual(sources, expected);
    });

    it('string select multi', () => {
        const x = fQuery().select('test/assets/files-abc/a, test/assets/files-abc/b');
        const sources = _.pluck(x, 'source');
        const expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b')];
        assert.deepEqual(sources, expected);
    });

    it('string select prefix', () => {
        const x = fQuery().select('test/assets/files-abc: a, b');
        const sources = _.pluck(x, 'source');
        const expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b')];
        assert.deepEqual(sources, expected);
    });

    it('only one prefix pro group allowed', () => {
        assert.throws(
            () => {
                fQuery().select('test/assets/files-abc: a, test: b');
            }
        );
    });

    it('string select groups', () => {
        const x = fQuery().select('test/assets/files-abc: a; test/assets: files-abc/b');
        const sources = _.pluck(x, 'source');
        const expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b')];
        assert.deepEqual(sources, expected);
    });
});
