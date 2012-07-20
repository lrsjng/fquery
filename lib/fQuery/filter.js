/*jshint node: true, strict: false */

var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.extend({

		eq: function (idx) {

			return this.pushStack(this[idx]);
		},

		first: function () {

			return this.eq(0);
		},

		last: function () {

			return this.eq(this.length - 1);
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
	});
};
