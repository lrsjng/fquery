/*jshint node: true */
'use strict';

var _ = require('underscore'),

	escapeRegExp = function (str) {

		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},

	createFn = function (fn, re, to) {

		return extendFn(function (blob) {

			return fn(blob).replace(re, to);
		});
	},

	replace = function (re, to) {

		if (!_.isRegExp(re)) {
			re = new RegExp(escapeRegExp(re), 'g');
		}

		return createFn(this, re, to);
	},

	prefix = function (prefix, to) {

		return createFn(this, new RegExp('^' + escapeRegExp(prefix)), to);
	},

	suffix = function (suffix, to) {

		return createFn(this, new RegExp(escapeRegExp(suffix) + '$'), to);
	},

	extendFn = function (fn) {

		_.extend(fn, {
			replace: replace,
			r: replace,
			prefix: prefix,
			p: prefix,
			suffix: suffix,
			s: suffix
		});

		return fn;
	},

	map = function (blob) {

		return blob && _.isString(blob.source) && blob.source || _.isString(blob) && blob || '';
	};


extendFn(map);


module.exports = function (fQuery) {

	fQuery.map = map;
};
