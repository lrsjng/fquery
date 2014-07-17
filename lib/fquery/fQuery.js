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


fQuery.fn.clone = function () {

	return fQuery(this.get().map(function (blob) { return blob.clone(); }));
};


fQuery.fn.then = function (fn) {

	var q = require('q');
	var org = this,
		clone = this.clone();

	clone._promise = (this._promise || q()).then(function () {

		if (!fn.length) {
			return q(fn.call(clone));
		}

		var deferred = q.defer();
		fn.call(clone, deferred.resolve, deferred.reject);
		return deferred.promise;
	});

	return clone;
};


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
