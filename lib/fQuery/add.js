/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.add = function (arg) {

		return this.then(function () {

			var blobs = [],
				paths = {};

			this.each_instant(function (blob) {

				blobs.push(blob);
				paths[blob.source] = true;
			});

			fQuery(arg).each_instant(function (blob) {

				if (!paths[blob.source]) {
					blobs.push(blob);
				}
			});

			this.push_instant(blobs);
		});
	};
};
