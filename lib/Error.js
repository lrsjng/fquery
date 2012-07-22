/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	Args = require('./Args'),
	fmt = require('./format/error');



var ErrorObject = module.exports = function (method, message, fquery, blob, err) {

	this.method = method;
	this.message = message;
	this.fquery = fquery;
	this.blob = blob;
	this.err = err;
};

ErrorObject.prototype.toString = function () {

	return fmt.formatError(this);
};

ErrorObject.error = function (method, message, fquery, blob, err) {

	throw new ErrorObject(method, message, fquery, blob, err);
};
