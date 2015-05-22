'use strict';

var _ = require('lodash');
var assert = require('assert');

var fQuery = require('../lib/fQuery');


describe('fQuery (factory)', function () {

    it('is function', function () {

        assert.ok(_.isFunction(fQuery));
    });

    it('expectes 2 parameters', function () {

        assert.strictEqual(fQuery.length, 2);
    });

    describe('._', function () {

        it('is lodash', function () {

            assert.strictEqual(fQuery._, require('lodash'));
        });
    });

    describe('.Q', function () {

        it('is Q', function () {

            assert.strictEqual(fQuery.Q, require('q'));
        });
    });

    describe('.Blob', function () {

        it('is Blob', function () {

            assert.strictEqual(fQuery.Blob, require('../lib/util/Blob'));
        });
    });

    describe('.Selector', function () {

        it('is Selector', function () {

            assert.strictEqual(fQuery.Selector, require('../lib/util/Selector'));
        });
    });

    describe('.fn', function () {

        it('is object', function () {

            assert.ok(_.isObject(fQuery.fn));
        });

        it('is prototype of fQuery', function () {

            assert.strictEqual(fQuery.fn, fQuery.prototype);
        });

        it('.constructor is set to fQuery', function () {

            assert.strictEqual(fQuery.fn.constructor, fQuery);
        });
    });

    describe('.plugin', function () {

        it('is function', function () {

            assert.ok(_.isFunction(fQuery.plugin));
        });

        it('expectes 1 parameter', function () {

            assert.strictEqual(fQuery.plugin.length, 1);
        });
    });
});
