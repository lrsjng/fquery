/*jshint node: true */
'use strict';


var chalk = require('chalk');


module.exports = function (fQuery) {

	fQuery.fn.toString = function (lines, len) {

		var strStack = '[' + this._stack.map(function (a) { return a.length; }) + ']',
			strPending = chalk.grey(this._promise && this._promise.isPending() ? '(pending...)' : ''),
			strFQuery = chalk.cyan('fQuery ' + strStack + ' ' + strPending + '\n'),
			s = strFQuery;

		this.get().forEach(function (blob, idx) {

			s += blob.toString(lines, len, idx);
		});

		return s;
	};

	// used by node console to format values
	fQuery.fn.inspect = function () {

		return this.toString();
	};
};
