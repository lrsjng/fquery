/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	Args = require('./Args'),
	color = require('./color');



var ErrorObject = module.exports = function (method, message, fquery, blob, err) {

	this.method = method;
	this.message = message;
	this.fquery = fquery;
	this.blob = blob;
	this.err = err;
};

ErrorObject.prototype.toString = function () {

	var s = '';

	s += color('redL', '\n☹  '+ this.method + ': ' + this.message + '\n\n');

	if (this.blob) {
		s += this.blob.toString();
	} else if (this.fquery) {
		s += this.fquery.toString(0);
	}
	if (this.err) {
		s += color('redL', util.inspect(this.err)) + '\n';
	}

	return s;
};

ErrorObject.error = function (method, message, fquery, blob, err) {

	throw new ErrorObject(method, message, fquery, blob, err);
};
