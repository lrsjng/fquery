/*jshint node: true, strict: false */

// ErrorObject
// ===========
var ErrorObject = function (code, msg) {

	this.code = code;
	this.msg = msg;
};

ErrorObject.prototype.toString = function () {

	return 'Error ' + this.code + ': ' + this.msg;
};

ErrorObject.raise = function (code, msg) {

	throw new ErrorObject(code, msg);
};

module.exports = ErrorObject.raise;
