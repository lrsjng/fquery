/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	fmt = require('./format/event'),

	types = {

		OK: {
			color: 'green',
			icon: '☺',
			lines: -3
		},

		FAIL: {
			color: 'red',
			icon: '☹',
			lines: 0
		},

		INFO: {
			color: 'white',
			icon: '😶',
			lines: -2
		},

		WARNING: {
			color: 'yellow',
			icon: '😐',
			lines: 0
		},

		ERROR: {
			color: 'red',
			icon: '☹',
			lines: 10
		}
	};



var Event = module.exports = function (arg) {

	if (_.isArray(arg)) {

		return _.map(arg, function (a) {

			return new Event(a);
		});
	}

	this.type = arg.type || Event.INFO;
	this.method = arg.method || 'unknown method';
	this.message = arg.message || 'no message';
	this.fquery = arg.fquery;
	this.blob = arg.blob;
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
		event.type = type;

		if (event.type === types.ERROR) {
			throw event;
		}

		process.stdout.write(event.toString());
	};
});
