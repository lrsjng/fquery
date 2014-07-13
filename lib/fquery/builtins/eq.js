/*jshint node: true */
'use strict';


var _ = require('underscore');


module.exports = function (fQuery) {

	fQuery.fn.get = function (idx) {

		if (!_.isNumber(idx)) {
			return Array.prototype.slice.call(this);
		}

		return idx < 0 ? this[this.length + idx] : this[idx];
	};

	fQuery.fn.eq = function (idx) {

		return this.then(function () {

			this.push_instant(this.get(idx));
		});
	};

	fQuery.fn.first = function () {

		return this.eq(0);
	};

	fQuery.fn.last = function () {

		return this.eq(-1);
	};
};
