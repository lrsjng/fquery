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


fQuery.plugin = function main(plugin) {
    try {
        if (fQuery._.isString(plugin)) {
            plugin = require(plugin);
        }

        if (!fQuery._.isFunction(plugin)) {
            throw new Error('unsupported format: ' + plugin);
        }

        plugin(fQuery);
    } catch (e) {
        fQuery.report({
            type: 'err',
            method: 'plugin',
            message: e.message,
            err: e
        });
    }

    return this;
};


// Load Plugins
// ------------
new fQuery.Selector({files: true, dirs: true, uniq: true, onlyStats: true})
    .paths(`${__dirname}: core/*, builtins/*`)
    .forEach(path => fQuery.plugin(path));
