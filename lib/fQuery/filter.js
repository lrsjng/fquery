/*jshint node: true, strict: false */

var _ = require('underscore');


module.exports = function (fQuery) {

	return {

		eq: function (idx) {

			return this.pushStack(this.get(idx));
		},

		first: function () {

			return this.eq(0);
		},

		last: function () {

			return this.eq(-1);
		},

		not: function (arg) {

			var blobs = [],
				paths = {};

			_.each(fQuery(arg), function (blob) {

				paths[blob.source] = true;
			});

			this.each(function (blob) {

				if (!paths[blob.source]) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		// actually not a filter, but related to `not`
		add: function (arg) {

			var blobs = [],
				paths = {};

			this.each(function (blob) {

				blobs.push(blob);
				paths[blob.source] = true;
			});

			_.each(fQuery(arg), function (blob) {

				if (!paths[blob.source]) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		oldest: function () {

			var blobs = [];

			this.each(function (blob) {

				if (!blobs[0] || blobs[0].timestamp.valueOf() > blob.timestamp.valueOf()) {
					blobs = [blob];
				} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		},

		newest: function () {

			var blobs = [];

			this.each(function (blob) {

				if (!blobs[0] || blobs[0].timestamp.valueOf() < blob.timestamp.valueOf()) {
					blobs = [blob];
				} else if (blobs[0].timestamp.valueOf() === blob.timestamp.valueOf()) {
					blobs.push(blob);
				}
			});

			return this.pushStack(blobs);
		}
	};
};
