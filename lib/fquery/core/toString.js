/*jshint node: true */
'use strict';


var _ = require('underscore'),
	chalk = require('chalk');


module.exports = function (fQuery) {


	fQuery.fn.toString = function (lines, len) {

		var strStack = '[' + _.pluck(this._stack, 'length') + ']',
			strPending = chalk.grey(this._promise && this._promise.isPending() ? '(pending...)' : ''),
			strFQuery = chalk.cyan('fQuery ' + strStack + ' ' + strPending + '\n'),
			s = strFQuery;

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
