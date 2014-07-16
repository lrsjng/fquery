/*jshint node: true */
'use strict';


var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.add = function (arg) {

		return this.edit(function () {

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

			return blobs;
		});
	};
};
