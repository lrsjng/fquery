/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
	_ = require('underscore'),

	fQuery = require('../../lib/fquery/fQuery');


describe('fQuery.fn.then()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.then));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.then.length, 1);
	});
});


describe('fQuery.fn.isPending()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.isPending));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.isPending.length, 1);
	});

	it('false for new object', function () {

		var $x = fQuery();
		assert.strictEqual($x.isPending(), false);

		$x = fQuery('test/assets/*');
		assert.strictEqual($x.isPending(), false);
	});

	it('true after call for then', function () {

		var $x = fQuery().then();
		assert.strictEqual($x.isPending(), true);
	});

	it('true inside then', function (done) {

		var $x = fQuery().then(function () {

				assert.strictEqual($x.isPending(), true);
				done();
			});
	});

	it('false after then is done', function (done) {

		var $x = fQuery().then(function () {

				setTimeout(afterThen, 0);
			}),
			afterThen = function () {

				assert.strictEqual($x.isPending(), false);
				done();
			};
	});

	it('correct on complete circuit', function (done) {

		var $x = fQuery(),
			afterThen = function () {

				assert.strictEqual($x.isPending(), false);
				done();
			};

		assert.strictEqual($x.isPending(), false);

		$x.then(function () {

			assert.strictEqual($x.isPending(), true);
			setTimeout(afterThen, 0);
			assert.strictEqual($x.isPending(), true);
		});

		assert.strictEqual($x.isPending(), true);
	});
});
