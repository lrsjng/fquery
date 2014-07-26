/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
	_ = require('underscore'),

	fQuery = require('../lib/fQuery'),
	Blob = require('../lib/Blob'),
	Event = require('../lib/Event'),
	Selector = require('../lib/Selector');


describe('fQuery (factory)', function () {

	it('is function', function () {

		assert.ok(_.isFunction(fQuery));
	});

	it('expectes 2 parameters', function () {

		assert.strictEqual(fQuery.length, 2);
	});


	describe('.Blob', function () {

		it('is Blob', function () {

			assert.strictEqual(fQuery.Blob, Blob);
		});
	});


	describe('.Event', function () {

		it('is Event', function () {

			assert.strictEqual(fQuery.Event, Event);
		});
	});


	describe('.Selector', function () {

		it('is Selector', function () {

			assert.strictEqual(fQuery.Selector, Selector);
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
