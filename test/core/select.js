/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
    _ = require('lodash'),
    path = require('path'),

    slice = function (obj) {

        return Array.prototype.slice.call(obj);
    },

    fQuery = require('../../lib/fQuery');


describe('fQuery.fn.select()', function () {

    it('is function', function () {

        assert.ok(_.isFunction(fQuery.fn.select));
    });

    it('expectes 2 parameter', function () {

        assert.strictEqual(fQuery.fn.select.length, 2);
    });

    it('works with no parameter', function () {

        fQuery().select();
        fQuery().select(undefined);
        fQuery().select(null);
    });

    it('returns this, is chainable', function () {

        var x = fQuery();
        var y = x.select();
        var z = y.select();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('empty select 1', function () {

        var x = fQuery();
        assert.deepEqual(x._stack, [[]]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('empty select 2', function () {

        var x = fQuery().select();
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('empty select 3', function () {

        var x = fQuery().select().select();
        assert.deepEqual(x._stack, [[], [], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('non blob select', function () {

        var v = {};
        var x = fQuery().select(v);
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('non blob array select', function () {

        var v = [{}, 1, true, null, undefined, 'text'];
        var x = fQuery().select(v);
        assert.deepEqual(x._stack, [[], []]);
        assert.deepEqual(slice(x), []);
        assert.strictEqual(x.length, 0);
    });

    it('blob select', function () {

        var b = fQuery.Blob.fromPath('test/assets/files-abc/a');
        var x = fQuery().select(b);
        assert.deepEqual(x._stack, [[b], []]);
        assert.deepEqual(slice(x), [b]);
        assert.strictEqual(x.length, 1);
    });

    it('blob array select', function () {

        var b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        var b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        var b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        var x = fQuery().select([b1, b2, b3]);
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);
    });

    it('mixed array select', function () {

        var b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        var b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        var b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        var x = fQuery().select([b1, 1, b2, true, b3, null]);
        assert.deepEqual(x._stack, [[b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b1, b2, b3]);
        assert.strictEqual(x.length, 3);
    });

    it('multi blob array select', function () {

        var b1 = fQuery.Blob.fromPath('test/assets/files-abc/a');
        var b2 = fQuery.Blob.fromPath('test/assets/files-abc/b');
        var b3 = fQuery.Blob.fromPath('test/assets/files-abc/c');
        var x = fQuery().select([b1, b2, b3]).select([b1]).select(b3);
        assert.deepEqual(x._stack, [[b3], [b1], [b1, b2, b3], []]);
        assert.deepEqual(slice(x), [b3]);
        assert.strictEqual(x.length, 1);
    });

    it('string select', function () {

        var x = fQuery().select('test/assets/files-abc/a');
        var sources = _.pluck(x, 'source');
        var expected = [path.resolve('test/assets/files-abc/a')];
        assert.deepEqual(sources, expected);
    });

    it('string select glob', function () {

        var x = fQuery().select('test/assets/files-abc/*');
        var sources = _.pluck(x, 'source');
        var expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b'), path.resolve('test/assets/files-abc/c')];
        assert.deepEqual(sources, expected);
    });

    it('string select multi', function () {

        var x = fQuery().select('test/assets/files-abc/a, test/assets/files-abc/b');
        var sources = _.pluck(x, 'source');
        var expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b')];
        assert.deepEqual(sources, expected);
    });

    it('string select prefix', function () {

        var x = fQuery().select('test/assets/files-abc: a, b');
        var sources = _.pluck(x, 'source');
        var expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b')];
        assert.deepEqual(sources, expected);
    });

    it('only one prefix pro group allowed', function () {

        assert.throws(
            function () {
                fQuery().select('test/assets/files-abc: a, test: b');
            },
            fQuery.Event
        );
    });

    it('string select groups', function () {

        var x = fQuery().select('test/assets/files-abc: a; test/assets: files-abc/b');
        var sources = _.pluck(x, 'source');
        var expected = [path.resolve('test/assets/files-abc/a'), path.resolve('test/assets/files-abc/b')];
        assert.deepEqual(sources, expected);
    });
});
