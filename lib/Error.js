/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	Args = require('./Args'),
	color = require('./color');



var ErrorObject = module.exports = function (msg, err) {

	this.msg = msg || 'no message';
	this.err = err;
};

ErrorObject.prototype.toString = function () {

	return color('redL', '[ERROR] ' + this.msg + (this.err ? '\n' + util.inspect(this.err) : ''));
};

ErrorObject.error = function (msg, err) {

	if (arguments.length > 2) {
		err = Array.prototype.slice.call(arguments, 1);
	}

	throw new ErrorObject(msg, err);
};
