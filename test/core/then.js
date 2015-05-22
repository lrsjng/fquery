'use strict';

var _ = require('lodash');
var assert = require('assert');

var fQuery = require('../../lib/fQuery');


describe('fQuery.fn.then()', function () {

    it('is function', function () {

        assert.ok(_.isFunction(fQuery.fn.then));
    });

    it('expectes 1 parameter', function () {

        assert.strictEqual(fQuery.fn.then.length, 1);
    });

    it('works with no parameter', function () {

        fQuery().then();
    });

    it('returns this, is chainable', function () {

        var x = fQuery();
        var y = x.then();
        var z = y.then();
        assert.strictEqual(x, y);
        assert.strictEqual(y, z);
    });

    it('then calls are in order', function () {

        var list = [0];

        fQuery()
            .then(function () {

                list.push(1);
                assert.deepEqual(list, [0, 1]);
            })
            .then(function () {

                list.push(2);
                assert.deepEqual(list, [0, 1, 2]);
            })
            .then(function () {

                list.push(3);
                assert.deepEqual(list, [0, 1, 2, 3]);
            });

        setTimeout(function () {

            assert.deepEqual(list, [0, 1, 2, 3]);
        }, 0);

        assert.deepEqual(list, [0]);
    });
});


describe('fQuery.fn.isPending()', function () {

    it('is function', function () {

        assert.ok(_.isFunction(fQuery.fn.isPending));
    });

    it('expectes no parameters', function () {

        assert.strictEqual(fQuery.fn.isPending.length, 0);
    });

    it('false for new object', function () {

        var x = fQuery();
        assert.strictEqual(x.isPending(), false);

        x = fQuery('test/assets/files-abc/*');
        assert.strictEqual(x.isPending(), false);
    });

    it('true after call for then', function () {

        var x = fQuery().then();
        assert.strictEqual(x.isPending(), true);
    });

    it('true inside then', function (done) {

        var x = fQuery().then(function () {

            assert.strictEqual(x.isPending(), true);
            done();
        });
    });

    it('false after then is done', function (done) {

        var x = fQuery().then(function () {

            setTimeout(afterThen, 0);
        });
        var afterThen = function () {

            assert.strictEqual(x.isPending(), false);
            done();
        };
    });

    it('correct in all phases', function (done) {

        var x = fQuery();
        var afterThen = function () {

            assert.strictEqual(x.isPending(), false);
            done();
        };

        assert.strictEqual(x.isPending(), false);

        x.then(function () {

            assert.strictEqual(x.isPending(), true);
            setTimeout(afterThen, 0);
            assert.strictEqual(x.isPending(), true);
        });

        assert.strictEqual(x.isPending(), true);
    });
});
