/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.add = function (arg) {

		return this.edit(function (done) {

			var blobs = [],
				paths = {};

			this.each(function (blob) {

					blobs.push(blob);
					paths[blob.source] = true;
				})
				.select(arg)
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
