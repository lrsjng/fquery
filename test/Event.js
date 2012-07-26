/*jshint node: true, strict: false */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
	_ = require('underscore'),

	Event = require('../lib/Event');


describe('Event (constructor)', function () {

	it('is function', function () {

		assert.ok(_.isFunction(Event));
	});

	it('has 0 own property', function () {

		assert.strictEqual(_.size(Event), 0);
	});

	it('sets arguments correct', function () {

		var type = {},
			method = {},
			message = {},
			fquery = {},
			blob = {},
			file = {},
			line = {},
			column = {},
			data = {},
			event = new Event({
				type: type,
				method: method,
				message: message,
				fquery: fquery,
				blob: blob,
				file: file,
				line: line,
				column: column,
				data: data,
				notset: {}
			});

		assert.strictEqual({} !== {}, true);
		assert.strictEqual(_.size(event), 9);
		assert.strictEqual(event.type, type);
		assert.strictEqual(event.method, method);
		assert.strictEqual(event.message, message);
		assert.strictEqual(event.fquery, fquery);
		assert.strictEqual(event.blob, blob);
		assert.strictEqual(event.file, file);
		assert.strictEqual(event.line, line);
		assert.strictEqual(event.column, column);
		assert.strictEqual(event.data, data);
		assert.strictEqual(event.notset, undefined);
	});

	describe('#ok', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.ok));
		});

		it('raises no error', function () {

			Event.ok();
		});
	});

	describe('#fail', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.fail));
		});

		it('raises no error', function () {

			Event.fail();
		});
	});

	describe('#info', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.info));
		});

		it('raises no error', function () {

			Event.info();
		});
	});

	describe('#warning', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.warning));
		});

		it('raises no error', function () {

			Event.warning();
		});
	});

	describe('#error', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.error));
		});

		it('raises error of type Event', function () {

			assert.throws(function () { Event.error(); }, function (err) {

				return err instanceof Event;
			});
		});
	});
});


describe('event (instance)', function () {

	var method, message, fquery, blob, file, line, column, data, event;

	beforeEach(function () {

		method = {};
		message = {};
		fquery = {};
		blob = {};
		file = {};
		line = {};
		column = {};
		data = {};
		event = new Event({
			method: method,
			message: message,
			fquery: fquery,
			blob: blob,
			file: file,
			line: line,
			column: column,
			data: data,
			notset: {}
		});
	});

	it('is object', function () {

		assert.ok(_.isObject(event));
	});

	describe('#toString', function () {

		it('#is function', function () {

			assert.ok(_.isFunction(event.toString));
		});

		it('returns string', function () {

			assert.ok(_.isString(event.toString()));
		});
	});
});