/*jshint node: true */
'use strict';


function FQuery() {}

function fQuery(arg, options) {

    return new FQuery().select(arg, options);
}
module.exports = fQuery;


fQuery.chalk = require('chalk');
fQuery._ = require('lodash');
fQuery.Q = require('q');
fQuery.Blob = require('./util/Blob');
fQuery.Selector = require('./util/Selector');
fQuery.report = require('./util/report');

// support deprecated interface
fQuery.Event = {
    error: function (arg) {
        arg.type = 'err';
        fQuery.report(arg);
    },
    fail: function (arg) {
        arg.type = 'fail';
        fQuery.report(arg);
    },
    info: function (arg) {
        arg.type = 'info';
        fQuery.report(arg);
    },
    ok: function (arg) {
        arg.type = 'okay';
        fQuery.report(arg);
    },
    success: function (arg) {
        arg.type = 'okay';
        fQuery.report(arg);
    },
    warning: function (arg) {
        arg.type = 'warn';
        fQuery.report(arg);
    }
};


fQuery.fn = fQuery.prototype = FQuery.prototype = {};
fQuery.fn.constructor = fQuery;


fQuery.plugin = function (plugin) {

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
        .paths(__dirname + ': core/*, builtins/*')
        .forEach(function (path) { fQuery.plugin(path); });
