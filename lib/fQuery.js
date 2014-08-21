/*jshint node: true */
'use strict';


var FQuery = function () {},
	fQuery = module.exports = function (arg, options) {

		return new FQuery().select(arg, options);
	};


fQuery.chalk = require('chalk');
fQuery.Q = require('q');
fQuery._ = require('lodash');
fQuery.Blob = require('./Blob');
fQuery.Event = require('./Event');
fQuery.Selector = require('./Selector');


fQuery.fn = fQuery.prototype = FQuery.prototype = {};
fQuery.fn.constructor = fQuery;


fQuery.plugin = function (plugin) {

	try {
		if (fQuery._.isString(plugin)) {
			plugin = require(plugin);
		}

		if (!fQuery._.isFunction(plugin)) {
			throw 'unsupported format: ' + plugin;
		}

		plugin(fQuery);
	} catch (err) {
		fQuery.Event.fail({method: 'plugin', message: err.toString()});
	}

	return this;
};


// Load Plugins
// ------------
new fQuery.Selector({files: true, dirs: true, uniq: true, onlyStats: true})
		// .paths(__dirname + ': core/*')
		// .paths(__dirname + ': core/*, builtins/*')
		.paths(__dirname + ': core/*, builtins/*, plugins/*')
		.forEach(function (path) { fQuery.plugin(path); });
