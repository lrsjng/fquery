/*jshint node: true */
'use strict';


var _ = require('underscore'),
	chalk = require('chalk');


module.exports = function (fQuery) {


	fQuery.fn.toString = function (lines, len) {

		var s = chalk.cyan('fQuery with ' + this.length + ' blobs    stack: [' + _.pluck(this._stack, 'length') + ']    ' + (this._promise && this._promise.isPending() ? '*' : '') + '\n');

		_.each(this, function (blob, idx) {

			s += blob.toString(lines, len, idx);
		});

		return s;
	};


	// used by node console to format values
	fQuery.fn.inspect = function () {

		return this.toString();
	};
};
