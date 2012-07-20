/*jshint node: true, strict: false */

var _ = require('underscore');



var ErrorObject = module.exports = function (code, msg) {

	this.code = code;
	this.msg = msg;
};

ErrorObject.prototype.toString = function () {

	return 'Error ' + this.code + ': ' + this.msg;
};

ErrorObject.error = function (code, msg) {

	if (_.isString(code)) {
		msg = code;
		code = 0;
	}

	throw new ErrorObject(code, msg);
};
