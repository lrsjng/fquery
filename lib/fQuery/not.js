/*jshint node: true */
'use strict';


module.exports = function (fQuery) {

	fQuery.fn.not = function (arg) {

		return this.then(function () {

			var blobs = [],
				paths = {};

			fQuery(arg).each_instant(function (blob) {

				paths[blob.source] = true;
			});

			this.each_instant(function (blob) {

				if (!paths[blob.source]) {
					blobs.push(blob);
				}
			});

			this.push_instant(blobs);
		});
	};
};
