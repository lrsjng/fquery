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

			_.each(this, function (blob) {

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

			_.each(this, function (blob) {

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

			this.each(function () {

				if (!blobs[0] || blobs[0].timestamp.valueOf() > this.timestamp.valueOf()) {
					blobs = [this];
				} else if (blobs[0].timestamp.valueOf() === this.timestamp.valueOf()) {
					blobs.push(this);
				}
			});

			return this.pushStack(blobs);
		},

		newest: function () {

			var blobs = [];

			this.each(function () {

				if (!blobs[0] || blobs[0].timestamp.valueOf() < this.timestamp.valueOf()) {
					blobs = [this];
				} else if (blobs[0].timestamp.valueOf() === this.timestamp.valueOf()) {
					blobs.push(this);
				}
			});

			return this.pushStack(blobs);
		}
	};
};
