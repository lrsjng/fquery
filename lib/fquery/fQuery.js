/*jshint node: true */
'use strict';


var FQuery = function () {},
	fQuery = module.exports = function (arg, options) {

		return new FQuery().select(arg, options);
	};


fQuery.Blob = require('./Blob');
fQuery.Event = require('./Event');
fQuery.Selector = require('./Selector');


fQuery.fn = fQuery.prototype = FQuery.prototype = {};
fQuery.fn.constructor = fQuery;


fQuery.plugin = function (plugin) {

	var _ = require('underscore');

	if (_.isString(plugin)) {
		try {
			plugin = require(plugin);
		} catch (err) {
			fQuery.Event.fail({method: 'plugin', message: err.toString()});
			return;
		}
	}

	if (_.isFunction(plugin)) {
		plugin = plugin(fQuery);
	}

	if (_.isObject(plugin)) {
		_.extend(fQuery.fn, plugin);
	} else if (plugin) {
		fQuery.Event.fail({method: 'plugin', message: 'unsupported format: ' + plugin});
	}
};


// Load Plugins
// ------------
new fQuery.Selector({files: true, dirs: true, uniq: true, onlyStats: true})
		.paths(__dirname + ': core/*, builtins/*, ../plugins/*')
		.forEach(function (path) { fQuery.plugin(path); });
