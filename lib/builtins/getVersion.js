/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.getVersion = function () {

		var pkg = require('../../package.json');
		return pkg.version;
	};
};
