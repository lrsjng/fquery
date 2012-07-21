/*jshint node: true, strict: false */

var _ = require('underscore');


module.exports = function (fQuery) {

	return {

		eq: function (idx) {

			return this.pushStack(this[idx]);
		},

		first: function () {

			return this.eq(0);
		},

		last: function () {

			return this.eq(this.length - 1);
		},

		not: function (arg) {

			var list = [],
				paths = {};

			_.each(fQuery(arg), function (blob) {

				paths[blob.source] = true;
			});

			_.each(this, function (blob) {

				if (!paths[blob.source]) {
					list.push(blob);
				}
			});

			return this.pushStack(list);
		},

		// actually not a filter, but related to `not`
		add: function (arg) {

			var list = [],
				paths = {};

			_.each(this, function (blob) {

				list.push(blob);
				paths[blob.source] = true;
			});

			_.each(fQuery(arg), function (blob) {

				if (!paths[blob.source]) {
					list.push(blob);
				}
			});

			return this.pushStack(list);
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
