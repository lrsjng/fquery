/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	Args = require('./Args');


var errorArgs = new Args({
	code: _.isNumber,
	msg: _.isString,
	err: _.isObject
}, {
	code: 0,
	msg: 'no message'
});


var ErrorObject = module.exports = function () {

	var args = errorArgs.parse(arguments);

	this.code = args.code;
	this.msg = args.msg;
	this.err = args.err;
};

ErrorObject.prototype.toString = function () {

	return 'Error: ' + this.msg + (this.err ? '  ' + util.inspect(this.err) : '');
};

ErrorObject.error = function (code, msg, err) {

	throw new ErrorObject(code, msg, err);
};
