/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
	_ = require('underscore'),
	q = require('q'),

	fQuery = require('../../lib/fQuery');


describe('fQuery.fn.asyncEach()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.asyncEach));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.asyncEach.length, 1);
	});

	it('works with no parameter', function () {

		fQuery().asyncEach();
		fQuery().asyncEach(undefined);
		fQuery().asyncEach(null);
	});

	it('returns a Q promise', function () {

		var p = fQuery().asyncEach();
		assert.ok(q.isPromise(p));
	});

	it('iterates correctly 1', function () {

		var x = fQuery();
		var list = [];
		var promise = x.asyncEach(function (blob, idx) {

				list.push([blob, idx]);
			});

		assert.deepEqual(list, []);

		promise.then(function () {

			assert.deepEqual(list, []);
		});

		assert.deepEqual(list, []);
	});

	it('iterates correctly 2', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery([b1, b2, b3]);
		var list = [];
		var expected = [
			[b1, 0],
			[b2, 1],
			[b3, 2]
		];
		var promise = x.asyncEach(function (blob, idx) {

				assert.strictEqual(this, x);
				list.push([blob, idx]);
			});

		assert.deepEqual(list, expected);

		promise.then(function () {

			assert.deepEqual(list, expected);
		});

		assert.deepEqual(list, expected);
	});

	it('iterates correctly 3', function (done) {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery([b1, b2, b3]);
		var list = [];
		var expected = [
			[b1, 0],
			[b2, 1],
			[b3, 2]
		];
		var promise = x.asyncEach(function (blob, idx, d) {

				assert.strictEqual(this, x);
				setTimeout(function () {

					list.push([blob, idx]);
					d();
				}, 0);
			});

		assert.deepEqual(list, []);

		promise.then(function () {

			assert.deepEqual(list, expected);
			done();
		});

		assert.deepEqual(list, []);
	});
});
