/*jshint node: true */
'use strict';

var _ = require('underscore'),
	Selector = require('./Selector'),

	fquerySelector = new Selector({files: true, dirs: false, uniq: true, onlyStats: false}),
	pluginSelector = new Selector({files: true, dirs: true, uniq: true, onlyStats: true}),
	pluginPaths = __dirname + ': core/*, builtins/*, ../plugins/*',

	FQuery = function () {},
	fQuery = module.exports = function () {

		var fquery = new FQuery();
		fquery.push_instant(fquerySelector.blobs.apply(fquerySelector, arguments));
		return fquery;
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


// load plugins
// ------------
pluginSelector
	.paths(pluginPaths)
	.forEach(function (path) {
		fQuery.plugin(path);
	});
