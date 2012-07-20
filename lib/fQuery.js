/*jshint node: true, strict: false */

var _ = require('underscore'),

	error = require('./Error'),
	Blob = require('./Blob'),
	Stack = require('./Stack'),
	findPaths = require('./Selector');



var fQuery = module.exports = function (arg) {

	if (arg instanceof Stack) {
		return arg;
	}

	if (arg instanceof Blob) {
		return new Stack([arg]);
	}

	if (_.isString(arg)) {
		var blobs = _.compact(_.map(findPaths(arg), function (path) {

			return Blob.select(path);
		}));

		return new Stack(blobs);
	}

	return new Stack();
};

// make it extendable
fQuery.fn = Stack.prototype;

fQuery.fn.extend = function (obj) {

	_.extend(fQuery.fn, obj);
};

// static methods
fQuery.error = error;
fQuery.paths = findPaths;
fQuery.plugin = function (name) {

	var plugin = require(name);

	if (_.isFunction(plugin)) {
		plugin(fQuery);
	}
};



fQuery.plugin('../plugins/core');

fQuery.plugin('../plugins/fs');
fQuery.plugin('../plugins/content');
fQuery.plugin('../plugins/modified');

fQuery.plugin('../plugins/includify');
fQuery.plugin('../plugins/uglifyjs');
fQuery.plugin('../plugins/less');
fQuery.plugin('../plugins/cssmin');
fQuery.plugin('../plugins/jshint');
