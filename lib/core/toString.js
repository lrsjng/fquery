/*jshint node: true */
'use strict';


var chalk = require('chalk');


module.exports = function (fQuery) {

    fQuery.fn.toString = function (lines, len) {

        var strStack = '[' + this._stack.map(function (a) { return a.length; }) + ']';
        var strPending = chalk.grey(this._promise && this._promise.isPending() ? '(pending...)' : '');
        var strFQuery = chalk.cyan('fQuery ' + strStack + ' ' + strPending + '\n');

        return strFQuery + this.map(function (blob, idx) { return blob.toString(lines, len, idx); }).join('');
    };

    // used by node console to format values
    fQuery.fn.inspect = function () {

        return this.toString();
    };
};
