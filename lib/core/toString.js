const chalk = require('chalk');

module.exports = function fn(fQuery) {
    fQuery.fn.toString = function fn1(lines, len) {
        const strStack = '[' + this._stack.map(a => a.length) + ']';
        const strPending = chalk.grey(this._promise && this._promise.isPending() ? '(pending...)' : '');
        const strFQuery = chalk.cyan('fQuery ' + strStack + ' ' + strPending + '\n');

        return strFQuery + this.map((blob, idx) => blob.toString(lines, len, idx)).join('');
    };

    // used by node console to format values
    fQuery.fn.inspect = function fn1() {
        return this.toString();
    };
};
