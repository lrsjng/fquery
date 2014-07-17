/*jshint node: true */
'use strict';


var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.not = function (arg) {

		var blobs = [],
			paths = {};

		_.each(fQuery(arg), function (blob) {

			paths[blob.source] = true;
		});

		_.each(this, function (blob) {

			if (!paths[blob.source]) {
				blobs.push(blob);
			}
		});

		return this.push(blobs);
	};

	fQuery.fn.thenNot = function (arg) {

		return this.then(function () {

			return this.not(arg);
		});
	};
};
