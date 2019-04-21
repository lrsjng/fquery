function FQuery() {}

function fQuery(arg, options) {
    return new FQuery().select(arg, options);
}
module.exports = fQuery;


fQuery._ = require('lodash');
fQuery.Blob = require('./util/Blob');
fQuery.Selector = require('./util/Selector');
fQuery.report = require('./util/report');
fQuery.version = require('../package.json').version;


fQuery.fn = fQuery.prototype = FQuery.prototype = {};
fQuery.fn.constructor = fQuery;


fQuery.plugin = fn => {
    try {
        if (typeof fn === 'string') {
            fn = require(fn);
        }

        if (typeof fn !== 'function') {
            throw new Error(`unsupported format: ${fn}`);
        }

        fn(fQuery);
    } catch (e) {
        fQuery.report({
            type: 'err',
            method: 'plugin',
            message: e.message,
            err: e
        });
    }

    return fQuery;
};


// Load Plugins
// ------------
new fQuery.Selector({files: true, dirs: true, uniq: true, onlyStats: true})
    .paths(`${__dirname}: core/*, builtins/*`)
    .forEach(path => fQuery.plugin(path));
