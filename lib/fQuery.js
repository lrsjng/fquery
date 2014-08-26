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
fQuery.Blob = require('./selector/Blob');
fQuery.Event = require('./Event');
fQuery.Selector = require('./selector/Selector');
fQuery.reporter = new (require('./reporter/Reporter'))();


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
        fQuery.Event.fail({method: 'plugin', message: e.toString()});
    }

    return this;
};


// Load Plugins
// ------------
new fQuery.Selector({files: true, dirs: true, uniq: true, onlyStats: true})
        .paths(__dirname + ': core/*, builtins/*')
        .forEach(function (path) { fQuery.plugin(path); });
