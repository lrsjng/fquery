/*jshint node: true */
'use strict';


var _ = require('underscore'),

	FQuery = function () {},
	fQuery = module.exports = function (arg, options) {

		return new FQuery()._select(arg, options);
	};


fQuery.Blob = require('./Blob');
fQuery.Event = require('./Event');
_.extend(fQuery, fQuery.Event);


fQuery.fn = fQuery.prototype = FQuery.prototype = {};
fQuery.fn.constructor = fQuery;


fQuery.plugin = function (plugin) {

	if (_.isString(plugin)) {
		try {
			plugin = require(plugin);
		} catch (err) {
			fQuery.fail({method: 'plugin', message: err.toString()});
			return;
		}
	}

	if (_.isFunction(plugin)) {
		plugin = plugin(fQuery);
	}

	if (_.isObject(plugin)) {
		_.extend(fQuery.fn, plugin);
	} else if (plugin) {
		fQuery.fail({method: 'plugin', message: 'unsupported format: ' + plugin});
	}
};


// Load Plugins
// ------------

var Selector = require('./Selector');

new Selector({files: true, dirs: true, uniq: true, onlyStats: true})
		.paths(__dirname + ': core/*, builtins/*, ../plugins/*')
		.forEach(function (path) { fQuery.plugin(path); });
