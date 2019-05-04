const chalk = require('chalk');

module.exports = fQuery => {
    fQuery.fn.toString = function fn1(lines, len) {
        const str_stack = '[' + this._stack.map(a => a.length) + ']';
        const str_pending = chalk.grey(this._promise && this._promise.isPending() ? '(pending...)' : '');
        const str_title = chalk.cyan('fQuery ' + str_stack + ' ' + str_pending + '\n');

        return str_title + this.map((blob, idx) => blob.toString(lines, len, idx)).join('');
    };

    // used by node console to format values
    fQuery.fn.inspect = function fn1() {
        return this.toString();
    };
};
