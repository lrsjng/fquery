/*jshint node: true */
/*global describe, before, beforeEach, it */


var assert = require('assert'),
	_ = require('underscore'),

	Event = require('../lib/Event'),

	mockWrite = function (fn) {

		var written = [],
			writeMock = function () {

				written.push(Array.prototype.slice.call(arguments));
			},
			write = process.stdout.write;

		process.stdout.write = writeMock;
		fn();
		process.stdout.write = write;
		return written;
	};


describe('Event (constructor)', function () {

	it('is function', function () {

		assert.ok(_.isFunction(Event));
	});

	it('has 1 own property', function () {

		assert.strictEqual(_.size(Event), 1);
		assert.deepEqual(Object.keys(Event.prototype), ['toString']);
	});

	it('expectes 1 parameter', function () {

		assert.strictEqual(Event.length, 1);
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

	describe('.ok', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.ok));
		});

		it('raises no error and produces output', function () {

			var written = mockWrite(function () { Event.ok(); });
			assert.strictEqual(written.length, 1);
			assert.strictEqual(written[0].length, 1);
			assert.ok(/message/.test(written[0][0]));
		});
	});

	describe('.fail', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.fail));
		});

		it('raises no error and produces output', function () {

			var written = mockWrite(function () { Event.fail(); });
			assert.strictEqual(written.length, 1);
			assert.strictEqual(written[0].length, 1);
			assert.ok(/message/.test(written[0][0]));
		});
	});

	describe('.info', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.info));
		});

		it('raises no error and produces output', function () {

			var written = mockWrite(function () { Event.info(); });
			assert.strictEqual(written.length, 1);
			assert.strictEqual(written[0].length, 1);
			assert.ok(/message/.test(written[0][0]));
		});
	});

	describe('.warning', function () {

		it('is function', function () {

			assert.ok(_.isFunction(Event.warning));
		});

		it('raises no error and produces output', function () {

			var written = mockWrite(function () { Event.warning(); });
			assert.strictEqual(written.length, 1);
			assert.strictEqual(written[0].length, 1);
			assert.ok(/message/.test(written[0][0]));
		});
	});

	describe('.error', function () {

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

	describe('.toString', function () {

		it('is function', function () {

			assert.ok(_.isFunction(event.toString));
		});

		it('returns string', function () {

			assert.ok(_.isString(event.toString()));
		});
	});
});
