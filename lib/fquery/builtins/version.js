/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.version = function (arg) {

		var semver = require('semver'),
			pkg = require('../../../package.json');

		return arg === undefined ? pkg.version : semver.satisfies(pkg.version, arg);
	};
};
