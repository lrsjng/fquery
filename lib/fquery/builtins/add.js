/*jshint node: true */
'use strict';


var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.add = function (arg) {

		var blobs = [],
			paths = {};

		_.each(this, function (blob) {

			blobs.push(blob);
			paths[blob.source] = true;
		});

		_.each(fQuery(arg), function (blob) {

			if (!paths[blob.source]) {
				blobs.push(blob);
			}
		});

		return this.push(blobs);
	};

	fQuery.fn.thenAdd = function (arg) {

		return this.then(function () {

			return this.add(arg);
		});
	};
};
