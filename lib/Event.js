/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	fmt = require('./format/event'),

	types = {

		OK: {
			color: 'green',
			icon: '😎',
			lines: -2
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
			icon: '😵',
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
	this.method = arg.method;
	this.message = arg.message;
	this.fquery = arg.fquery;
	this.blob = arg.blob;
	this.line = arg.line;
	this.column = arg.column;
	this.data = arg.data;
};


Event.prototype.toString = function () {

	return fmt.format(this);
};




var arrayToObj = function (array) {

	return _.isObject(array[0]) ? array[0] : {
		type: Event.INFO,
		method: array[0],
		message: array[1],
		fquery: array[2],
		blob: array[3],
		line: array[4],
		column: array[5],
		data: array[6]
	};
};

_.each(types, function (type, name) {

	Event[name.toLowerCase()] = function () {

		var obj = arrayToObj(Array.prototype.slice.call(arguments)),
			event = new Event(obj);

		event.type = type;

		if (event.type === types.ERROR) {
			throw event;
		} else {
			process.stdout.write(event.toString());
		}
	};
});
