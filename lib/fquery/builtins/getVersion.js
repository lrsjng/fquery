/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.getVersion = function () {

		var pkg = require('../../../package.json');
		return pkg.version;
	};

	fQuery.isVersionSatisfied = function (arg) {

		var semver = require('semver');
		return semver.satisfies(fQuery.getVersion(), arg);
	};

	fQuery.ensureVersion = function (arg) {

		if (fQuery.isVersionSatisfied(arg)) {
			fQuery.Event.ok({
				method: 'ensureVersion',
				message: 'version ' + fQuery.getVersion() + ' does satisfy ' + arg
			});
		} else {
			fQuery.Event.error({
				method: 'ensureVersion',
				message: 'version ' + fQuery.getVersion() + ' does not satisfy ' + arg
			});
		}
	};
};
