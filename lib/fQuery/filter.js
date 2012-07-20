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

			// TODO
			return this;
		},

		newest: function () {

			// TODO
			return this;
		}
	});
};
