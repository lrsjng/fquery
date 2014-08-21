/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

    fQuery.fn.toString = function (lines, len) {

        var strStack = '[' + this._stack.map(function (a) { return a.length; }) + ']',
            strPending = fQuery.chalk.grey(this._promise && this._promise.isPending() ? '(pending...)' : ''),
            strFQuery = fQuery.chalk.cyan('fQuery ' + strStack + ' ' + strPending + '\n');

        return strFQuery + this.map(function (blob, idx) { return blob.toString(lines, len, idx); }).join('');
    };

    // used by node console to format values
    fQuery.fn.inspect = function () {

        return this.toString();
    };
};
