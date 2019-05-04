function FQuery() {}

const fQuery = (arg, options) => new FQuery().select(arg, options);
module.exports = fQuery;


fQuery.Blob = require('./util/Blob');
fQuery.Selector = require('./util/Selector');
fQuery.report = require('./util/report');
fQuery.version = require('../package.json').version;


// fQuery.fn = fQuery.prototype = FQuery.prototype = {};
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
    } catch (err) {
        fQuery.report({type: 'err', method: 'plugin', message: err.message, err});
    }
};


new fQuery.Selector({files: true, dirs: true, uniq: true, onlyStats: true})
    .paths(`${__dirname}: core/*, builtins/*`)
    .forEach(path => fQuery.plugin(path));
