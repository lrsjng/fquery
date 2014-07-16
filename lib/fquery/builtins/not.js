/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.not = function (arg) {

		return this.edit(function (done) {

			var blobs = [],
				paths = {};

			fQuery(arg)
				.each(function (blob) {

					paths[blob.source] = true;
				})
				.select(this)
				.each(function (blob) {

					if (!paths[blob.source]) {
						blobs.push(blob);
					}
				})
				.then(function () {

					done(blobs);
				});
		});
	};
};
