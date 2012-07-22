/*jshint node: true, strict: false */

var util = require('util'),
	_ = require('underscore'),
	color = require('./color'),


	formatError = function (error) {

		var s = '';

		s += color('redL', '\n☹  '+ error.method + ': ' + error.message + '\n\n');

		if (error.blob) {
			s += error.blob.toString();
		} else if (error.fquery) {
			s += error.fquery.toString(0);
		}
		if (error.err) {
			s += color('red', util.inspect(error.err)) + '\n';
		}

		return s;
	};


module.exports = {
	formatError: formatError
};
