/*jshint node: true */
'use strict';

var _ = require('underscore'),
	fmt = require('./format/event'),

	types = {
		ERROR: {color: 'red', icon: '☹', lines: 10},
		FAIL: {color: 'red', icon: '☹', lines: -3},
		INFO: {color: 'cyan', icon: '😶', lines: -3},
		OK: {color: 'green', icon: '☺', lines: -3},
		SUCCESS: {color: 'green', icon: '☺', lines: -3},
		WARNING: {color: 'yellow', icon: '😐', lines: -3}
	};



var Event = module.exports = function (arg) {

	arg = arg || {};

	if (_.isArray(arg)) {
		return _.map(arg, function (a) { return new Event(a); });
	}

	this.type = arg.type || types.INFO;
	this.method = arg.method || 'unknown method';
	this.message = arg.message || 'no message';
	this.fquery = arg.fquery;
	this.blob = arg.blob;
	this.file = arg.file;
	this.line = arg.line;
	this.column = arg.column;
	this.data = arg.data;
};


Event.prototype.toString = function () {

	return fmt.format(this);
};


_.each(types, function (type, name) {

	Event[name.toLowerCase()] = function (arg) {

		var event = new Event(arg);
		if (_.isArray(event)) {
			_.each(event, function (e) { e.type = type; });
		} else {
			event.type = type;
		}

		if (type === types.ERROR) {
			throw event;
		}

		process.stdout.write(event.toString());

		return event;
	};
});
