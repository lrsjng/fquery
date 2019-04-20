const _ = require('lodash');
const assert = require('assert');

const fQuery = require('../lib/fQuery');

/* globals describe it */


describe('fQuery (factory)', () => {
    it('is function', () => {
        assert.ok(_.isFunction(fQuery));
    });

    it('expectes 2 parameters', () => {
        assert.strictEqual(fQuery.length, 2);
    });

    describe('._', () => {
        it('is lodash', () => {
            assert.strictEqual(fQuery._, require('lodash'));
        });
    });

    describe('.Q', () => {
        it('is Q', () => {
            assert.strictEqual(fQuery.Q, require('q'));
        });
    });

    describe('.Blob', () => {
        it('is Blob', () => {
            assert.strictEqual(fQuery.Blob, require('../lib/util/Blob'));
        });
    });

    describe('.Selector', () => {
        it('is Selector', () => {
            assert.strictEqual(fQuery.Selector, require('../lib/util/Selector'));
        });
    });

    describe('.fn', () => {
        it('is object', () => {
            assert.ok(_.isObject(fQuery.fn));
        });

        it('is prototype of fQuery', () => {
            assert.strictEqual(fQuery.fn, fQuery.prototype);
        });

        it('.constructor is set to fQuery', () => {
            assert.strictEqual(fQuery.fn.constructor, fQuery);
        });
    });

    describe('.plugin', () => {
        it('is function', () => {
            assert.ok(_.isFunction(fQuery.plugin));
        });

        it('expectes 1 parameter', () => {
            assert.strictEqual(fQuery.plugin.length, 1);
        });
    });
});
