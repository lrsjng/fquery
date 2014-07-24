/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
	_ = require('underscore'),

	slice = function (obj) {

		return Array.prototype.slice.call(obj);
	},

	fQuery = require('../../../lib/fquery/fQuery');


describe('fQuery.fn.push()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.push));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.push.length, 1);
	});

	it('works with no parameter', function () {

		fQuery().push();
		fQuery().push(undefined);
		fQuery().push(null);
	});

	it('returns this, is chainable', function () {

		var x = fQuery();
		var y = x.push();
		var z = y.push();
		assert.strictEqual(x, y);
		assert.strictEqual(y, z);
	});

	it('initial empty selection', function () {

		var x = fQuery();
		assert.deepEqual(x._stack, [[]]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('empty push', function () {

		var x = fQuery().push();
		assert.deepEqual(x._stack, [[], []]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('multi empty push', function () {

		var x = fQuery().push().push();
		assert.deepEqual(x._stack, [[], [], []]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('non blob value push', function () {

		var v = {};
		var x = fQuery().push(v);
		assert.deepEqual(x._stack, [[], []]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('non blobs array push', function () {

		var v = [{}, 1, true, null, undefined, 'text'];
		var x = fQuery().push(v);
		assert.deepEqual(x._stack, [[], []]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('blob value push', function () {

		var b = fQuery.Blob.select('test/assets/files-abc/a');
		var x = fQuery().push(b);
		assert.deepEqual(x._stack, [[b], []]);
		assert.deepEqual(slice(x), [b]);
		assert.strictEqual(x.length, 1);
	});

	it('blob array push', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]);
		assert.deepEqual(x._stack, [[b1, b2, b3], []]);
		assert.deepEqual(slice(x), [b1, b2, b3]);
		assert.strictEqual(x.length, 3);
	});

	it('mixed array push', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, 1, b2, true, b3, null]);
		assert.deepEqual(x._stack, [[b1, b2, b3], []]);
		assert.deepEqual(slice(x), [b1, b2, b3]);
		assert.strictEqual(x.length, 3);
	});

	it('multi blob array push', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]).push([b1]).push(b3);
		assert.deepEqual(x._stack, [[b3], [b1], [b1, b2, b3], []]);
		assert.deepEqual(slice(x), [b3]);
		assert.strictEqual(x.length, 1);
	});
});



describe('fQuery.fn.pop()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.pop));
	});

	it('expectes 0 parameters', function () {

		assert.strictEqual(fQuery.fn.pop.length, 0);
	});

	it('works with parameter', function () {

		fQuery().pop();
		fQuery().pop(undefined);
		fQuery().pop(null);
	});

	it('returns this, is chainable', function () {

		var x = fQuery();
		var y = x.pop();
		var z = y.pop();
		assert.strictEqual(x, y);
		assert.strictEqual(y, z);
	});

	it('pop', function () {

		var x = fQuery().pop();
		assert.deepEqual(x._stack, [[]]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('multi pop 1', function () {

		var x = fQuery().pop().pop();
		assert.deepEqual(x._stack, [[]]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('multi pop 2', function () {

		var x = fQuery().pop().pop().pop();
		assert.deepEqual(x._stack, [[]]);
		assert.deepEqual(slice(x), []);
		assert.strictEqual(x.length, 0);
	});

	it('multi pop 3', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]).push([b3, b1]).push([b1]);

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


describe('fQuery.fn.get()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.get));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.get.length, 1);
	});

	it('returns blob array if no parameter 1', function () {

		var x = fQuery();
		assert.deepEqual(x.get(), []);
	});

	it('returns blob array if no parameter 2', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]);
		assert.deepEqual(x.get(), [b1, b2, b3]);
	});

	it('returns correct value if int parameter', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]);

		assert.strictEqual(x.get(-4), undefined);
		assert.strictEqual(x.get(-3), b1);
		assert.strictEqual(x.get(-2), b2);
		assert.strictEqual(x.get(-1), b3);
		assert.strictEqual(x.get(0), b1);
		assert.strictEqual(x.get(1), b2);
		assert.strictEqual(x.get(2), b3);
		assert.strictEqual(x.get(3), undefined);
	});

	it('returns undefined if non int numeric parameter', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]);

		assert.strictEqual(x.get(1.5), undefined);
	});
});


describe('fQuery.fn.each()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.each));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.each.length, 1);
	});

	it('works with no parameter', function () {

		fQuery().each();
		fQuery().each(undefined);
		fQuery().each(null);
	});

	it('returns this, is chainable', function () {

		var x = fQuery();
		var y = x.each();
		var z = y.each();
		assert.strictEqual(x, y);
		assert.strictEqual(y, z);
	});

	it('iterates correctly 1', function () {

		var x = fQuery();
		var list = [];

		x.each(function (blob, idx) {

			list.push([this, blob, idx]);
		});

		assert.deepEqual(list, []);
	});

	it('iterates correctly 2', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]);
		var list = [];

		x.each(function (blob, idx) {

			list.push([this, blob, idx]);
		});

		var expected = [
			[x, b1, 0],
			[x, b2, 1],
			[x, b3, 2]
		];

		assert.deepEqual(list, expected);
	});

	it('iterates correctly 3', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]).push([b2]);
		var list = [];

		x.each(function (blob, idx) {

			list.push([this, blob, idx]);
		});

		var expected = [
			[x, b2, 0]
		];

		assert.deepEqual(list, expected);
	});
});


describe('fQuery.fn.map()', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery.fn.map));
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(fQuery.fn.map.length, 1);
	});

	it('works with no parameter', function () {

		fQuery().map();
		fQuery().map(undefined);
		fQuery().map(null);
	});

	it('returns array', function () {

		var x = fQuery();
		assert.ok(_.isArray(x.map()));
		assert.ok(_.isArray(x.map(undefined)));
		assert.ok(_.isArray(x.map(null)));
	});

	it('iterates correctly 1', function () {

		var x = fQuery();
		var list = [];

		var result = x.map(function (blob, idx) {

			list.push([this, blob, idx]);
			return 'v' + idx;
		});

		assert.deepEqual(list, []);
		assert.deepEqual(result, []);
	});

	it('iterates correctly 2', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]);
		var list = [];

		var result = x.map(function (blob, idx) {

			list.push([this, blob, idx]);
			return 'v' + idx;
		});

		var expected = [
			[x, b1, 0],
			[x, b2, 1],
			[x, b3, 2]
		];

		assert.deepEqual(list, expected);
		assert.deepEqual(result, ['v0', 'v1', 'v2']);
	});

	it('iterates correctly 3', function () {

		var b1 = fQuery.Blob.select('test/assets/files-abc/a');
		var b2 = fQuery.Blob.select('test/assets/files-abc/b');
		var b3 = fQuery.Blob.select('test/assets/files-abc/c');
		var x = fQuery().push([b1, b2, b3]).push([b2]);
		var list = [];

		var result = x.map(function (blob, idx) {

			list.push([this, blob, idx]);
			return 'v' + idx;
		});

		var expected = [
			[x, b2, 0]
		];

		assert.deepEqual(list, expected);
		assert.deepEqual(result, ['v0']);
	});
});
